import { Injectable, inject } from '@angular/core';
import { IContentService } from './content.interface';
import { GlobalStateService } from './global-state.service';
import { tap, catchError, of } from 'rxjs';
import { Post } from '../models/post.model';
import { Event } from '../models/event.model';
import { MediaAsset, User, SiteSettings } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class ContentStore {
    private contentService = inject(IContentService);
    private state = inject(GlobalStateService);

    loadAllInitialData() {
        this.state.setLoading(true);

        this.loadPosts();
        this.loadEvents();
        this.loadMedia();
        this.loadProfile();
        this.loadCategories();
        this.loadSettings();

        this.state.setLoading(false);
    }

    private loadPosts() {
        this.contentService.getPosts().pipe(
            tap(res => this.state.setPosts(res.items)),
            catchError(() => of({ items: [] }))
        ).subscribe();
    }

    private loadEvents() {
        this.contentService.getEvents().pipe(
            tap(events => this.state.setEvents(events)),
            catchError(() => of([]))
        ).subscribe();
    }

    private loadMedia() {
        this.contentService.getMedia().pipe(
            tap(media => this.state.setMedia(media)),
            catchError(() => of([]))
        ).subscribe();
    }

    private loadProfile() {
        this.contentService.getProfile().pipe(
            tap(profile => this.state.setUser(profile)),
            catchError(() => of(null as any))
        ).subscribe();
    }

    private loadCategories() {
        this.contentService.getCategories().pipe(
            tap(categories => this.state.setCategories(categories)),
            catchError(() => of([]))
        ).subscribe();
    }

    private loadSettings() {
        this.contentService.getSettings().pipe(
            tap(settings => this.state.setSettings(settings)),
            catchError(() => of(null))
        ).subscribe();
    }

    // --- Post CRUD ---
    createPost(post: Partial<Post>) {
        this.state.setLoading(true);
        return this.contentService.createPost(post).pipe(
            tap(newPost => {
                this.state.setPosts([newPost, ...this.state.posts()]);
                this.state.setLoading(false);
            }),
            catchError(err => {
                this.state.setError(err.message);
                this.state.setLoading(false);
                throw err;
            })
        );
    }

    updatePost(id: string, post: Partial<Post>) {
        this.state.setLoading(true);
        return this.contentService.updatePost(id, post).pipe(
            tap(updatedPost => {
                const currentPosts = this.state.posts();
                const index = currentPosts.findIndex(p => p.id === id);
                if (index !== -1) {
                    const newPosts = [...currentPosts];
                    newPosts[index] = updatedPost;
                    this.state.setPosts(newPosts);
                }
                this.state.setLoading(false);
            }),
            catchError(err => {
                this.state.setError(err.message);
                this.state.setLoading(false);
                throw err;
            })
        );
    }

    deletePost(id: string) {
        this.state.setLoading(true);
        return this.contentService.deletePost(id).pipe(
            tap(success => {
                if (success) {
                    this.state.setPosts(this.state.posts().filter(p => p.id !== id));
                }
                this.state.setLoading(false);
            }),
            catchError(err => {
                this.state.setError(err.message);
                this.state.setLoading(false);
                throw err;
            })
        );
    }

    // --- Event CRUD ---
    createEvent(event: Partial<Event>) {
        this.state.setLoading(true);
        return this.contentService.createEvent(event).pipe(
            tap(newEvent => {
                this.state.setEvents([newEvent, ...this.state.events()]);
                this.state.setLoading(false);
            })
        );
    }

    updateEvent(id: string, event: Partial<Event>) {
        this.state.setLoading(true);
        return this.contentService.updateEvent(id, event).pipe(
            tap(updatedEvent => {
                const current = this.state.events();
                const index = current.findIndex(e => e.id === id);
                if (index !== -1) {
                    const next = [...current];
                    next[index] = updatedEvent;
                    this.state.setEvents(next);
                }
                this.state.setLoading(false);
            })
        );
    }

    deleteEvent(id: string) {
        this.state.setLoading(true);
        return this.contentService.deleteEvent(id).pipe(
            tap(success => {
                if (success) this.state.setEvents(this.state.events().filter(e => e.id !== id));
                this.state.setLoading(false);
            })
        );
    }

    // --- Media CRUD ---
    uploadMedia(asset: Partial<MediaAsset>) {
        this.state.setLoading(true);
        return this.contentService.uploadMedia(asset).pipe(
            tap(newAsset => {
                this.state.setMedia([newAsset, ...this.state.media()]);
                this.state.setLoading(false);
            })
        );
    }

    deleteMedia(id: string) {
        this.state.setLoading(true);
        return this.contentService.deleteMedia(id).pipe(
            tap(success => {
                if (success) this.state.setMedia(this.state.media().filter(m => m.id !== id));
                this.state.setLoading(false);
            })
        );
    }

    // --- Profile ---
    updateProfile(user: Partial<User>) {
        this.state.setLoading(true);
        return this.contentService.updateProfile(user).pipe(
            tap(updated => {
                this.state.setUser(updated);
                this.state.setLoading(false);
            })
        );
    }

    // --- Settings ---
    updateSettings(settings: Partial<SiteSettings>) {
        this.state.setLoading(true);
        return this.contentService.updateSettings(settings).pipe(
            tap(updated => {
                this.state.setSettings(updated);
                this.state.setLoading(false);
            }),
            catchError(err => {
                this.state.setError(err.message);
                this.state.setLoading(false);
                throw err;
            })
        );
    }
}
