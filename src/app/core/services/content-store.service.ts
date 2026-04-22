import { Injectable, inject } from '@angular/core';
import { IContentService } from './content.interface';
import { GlobalStateService } from './global-state.service';
import { tap, catchError, of } from 'rxjs';
import { Post } from '../models/post.model';
import { Event } from '../models/event.model';
import { Category } from '../models/category.model';
import { Tag } from '../models/tag.model';
import { MediaAsset, User, SiteSettings } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class ContentStore {
    private contentService = inject(IContentService);
    private state = inject(GlobalStateService);

    /** Simple in-memory cache — survives SPA navigation, cleared on write */
    private cache = new Map<string, any>();

    loadAllInitialData() {
        this.state.setLoading(true);

        this.loadPosts();
        this.loadEvents();
        this.loadMedia();
        this.loadProfile();
        this.loadCategories();
        this.loadTags();
        this.loadSettings();

        this.state.setLoading(false);
    }

    private loadPosts() {
        if (this.cache.has('posts')) {
            this.state.setPosts(this.cache.get('posts'));
            return;
        }
        this.contentService.getPosts().pipe(
            tap(res => {
                this.cache.set('posts', res.items);
                this.state.setPosts(res.items);
            }),
            catchError(() => of({ items: [] }))
        ).subscribe();
    }

    loadEvents() {
        if (this.cache.has('events')) {
            this.state.setEvents(this.cache.get('events'));
            return;
        }
        this.contentService.getEvents().pipe(
            tap(events => {
                this.cache.set('events', events);
                this.state.setEvents(events);
            }),
            catchError(() => of([]))
        ).subscribe();
    }

    loadMedia() {
        if (this.cache.has('media')) {
            this.state.setMedia(this.cache.get('media'));
            return;
        }
        this.contentService.getMedia().pipe(
            tap(media => {
                this.cache.set('media', media);
                this.state.setMedia(media);
            }),
            catchError(() => of([]))
        ).subscribe();
    }

    private loadProfile() {
        if (this.cache.has('profile')) {
            this.state.setUser(this.cache.get('profile'));
            return;
        }
        this.contentService.getProfile().pipe(
            tap(profile => {
                this.cache.set('profile', profile);
                this.state.setUser(profile);
            }),
            catchError(() => of(null as any))
        ).subscribe();
    }

    private loadCategories() {
        if (this.cache.has('categories')) {
            this.state.setCategories(this.cache.get('categories'));
            return;
        }
        this.contentService.getCategories().pipe(
            tap(categories => {
                this.cache.set('categories', categories);
                this.state.setCategories(categories);
            }),
            catchError(() => of([]))
        ).subscribe();
    }

    private loadTags() {
        if (this.cache.has('tags')) {
            this.state.setTags(this.cache.get('tags'));
            return;
        }
        this.contentService.getTags().pipe(
            tap(tags => {
                this.cache.set('tags', tags);
                this.state.setTags(tags);
            }),
            catchError(() => of([]))
        ).subscribe();
    }

    private loadSettings() {
        if (this.cache.has('settings')) {
            this.state.setSettings(this.cache.get('settings'));
            return;
        }
        this.contentService.getSettings().pipe(
            tap(settings => {
                this.cache.set('settings', settings);
                this.state.setSettings(settings);
            }),
            catchError(() => of(null))
        ).subscribe();
    }

    /** Call after any write to invalidate affected cache entries */
    clearCache(...keys: string[]) {
        if (keys.length === 0) {
            this.cache.clear();
        } else {
            keys.forEach(k => this.cache.delete(k));
        }
    }

    // --- Post CRUD ---
    createPost(post: Partial<Post>) {
        this.state.setLoading(true);
        return this.contentService.createPost(post).pipe(
            tap(newPost => {
                this.clearCache('posts');
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
                this.clearCache('posts');
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
                    this.clearCache('posts');
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
                this.clearCache('events');
                this.state.setEvents([newEvent, ...this.state.events()]);
                this.state.setLoading(false);
            })
        );
    }

    updateEvent(id: string, event: Partial<Event>) {
        this.state.setLoading(true);
        return this.contentService.updateEvent(id, event).pipe(
            tap(updatedEvent => {
                this.clearCache('events');
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
                if (success) {
                    this.clearCache('events');
                    this.state.setEvents(this.state.events().filter(e => e.id !== id));
                }
                this.state.setLoading(false);
            })
        );
    }

    // --- Category CRUD ---
    createCategory(category: Partial<Category>) {
        this.state.setLoading(true);
        return this.contentService.createCategory(category).pipe(
            tap(newCat => {
                this.clearCache('categories');
                this.state.setCategories([...this.state.categories(), newCat]);
                this.state.setLoading(false);
            })
        );
    }

    updateCategory(id: string, category: Partial<Category>) {
        this.state.setLoading(true);
        return this.contentService.updateCategory(id, category).pipe(
            tap(updatedCat => {
                this.clearCache('categories');
                const current = this.state.categories();
                const index = current.findIndex(c => c.id === id);
                if (index !== -1) {
                    const next = [...current];
                    next[index] = updatedCat;
                    this.state.setCategories(next);
                }
                this.state.setLoading(false);
            })
        );
    }

    deleteCategory(id: string) {
        this.state.setLoading(true);
        return this.contentService.deleteCategory(id).pipe(
            tap(success => {
                if (success) {
                    this.clearCache('categories');
                    this.state.setCategories(this.state.categories().filter(c => c.id !== id));
                }
                this.state.setLoading(false);
            })
        );
    }

    // --- Tag CRUD ---
    createTag(tag: Partial<Tag>) {
        this.state.setLoading(true);
        return this.contentService.createTag(tag).pipe(
            tap(newTag => {
                this.clearCache('tags');
                this.state.setTags([...this.state.tags(), newTag]);
                this.state.setLoading(false);
            })
        );
    }

    updateTag(id: string, tag: Partial<Tag>) {
        this.state.setLoading(true);
        return this.contentService.updateTag(id, tag).pipe(
            tap(updatedTag => {
                this.clearCache('tags');
                const current = this.state.tags();
                const index = current.findIndex(t => t.id === id);
                if (index !== -1) {
                    const next = [...current];
                    next[index] = updatedTag;
                    this.state.setTags(next);
                }
                this.state.setLoading(false);
            })
        );
    }

    deleteTag(id: string) {
        this.state.setLoading(true);
        return this.contentService.deleteTag(id).pipe(
            tap(success => {
                if (success) {
                    this.clearCache('tags');
                    this.state.setTags(this.state.tags().filter(t => t.id !== id));
                }
                this.state.setLoading(false);
            })
        );
    }

    // --- Media CRUD ---
    uploadMedia(asset: Partial<MediaAsset>) {
        this.state.setLoading(true);
        return this.contentService.uploadMedia(asset).pipe(
            tap(newAsset => {
                this.clearCache('media');
                this.state.setMedia([newAsset, ...this.state.media()]);
                this.state.setLoading(false);
            })
        );
    }

    deleteMedia(id: string) {
        this.state.setLoading(true);
        return this.contentService.deleteMedia(id).pipe(
            tap(success => {
                if (success) {
                    this.clearCache('media');
                    this.state.setMedia(this.state.media().filter(m => m.id !== id));
                }
                this.state.setLoading(false);
            })
        );
    }

    updateMediaMetadata(id: string, metadata: { alt?: string; description?: string }) {
        this.state.setLoading(true);
        return this.contentService.updateMedia(id, metadata).pipe(
            tap((updated: MediaAsset) => {
                this.clearCache('media');
                const list = this.state.media();
                const idx = list.findIndex(m => m.id === id);
                if (idx !== -1) {
                    const newList = [...list];
                    newList[idx] = updated;
                    this.state.setMedia(newList);
                }
                this.state.setLoading(false);
            })
        );
    }

    // --- Profile ---
    updateProfile(user: Partial<User>) {
        this.state.setLoading(true);
        return this.contentService.updateProfile(user).pipe(
            tap(updated => {
                this.clearCache('profile');
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
                this.clearCache('settings');
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

    // --- Social Actions ---
    likePost(id: string) {
        return this.contentService.likePost(id).pipe(
            tap(newCount => {
                const posts = this.state.posts();
                const index = posts.findIndex(p => p.id === id);
                if (index !== -1) {
                    const newPosts = [...posts];
                    newPosts[index] = { ...newPosts[index], likesCount: newCount };
                    this.state.setPosts(newPosts);
                }
            })
        );
    }

    likeEvent(id: string) {
        return this.contentService.likeEvent(id).pipe(
            tap(newCount => {
                const events = this.state.events();
                const index = events.findIndex(e => e.id === id);
                if (index !== -1) {
                    const newEvents = [...events];
                    newEvents[index] = { ...newEvents[index], likesCount: newCount };
                    this.state.setEvents(newEvents);
                }
            })
        );
    }

    addComment(post_id: string, comment: string) {
        const author = this.state.user();
        return this.contentService.addComment(post_id, {
            content: comment,
            author_name: author?.name || 'Visiteur Académique',
            author_avatar: author?.avatar?.url || 'assets/images/mock/avatar.jpg'
        }).pipe(
            tap(newComment => {
                const posts = this.state.posts();
                const index = posts.findIndex(p => p.id === post_id);
                if (index !== -1) {
                    const newPosts = [...posts];
                    const updatedPost = { ...newPosts[index] };
                    updatedPost.comments = [...(updatedPost.comments || []), newComment];
                    newPosts[index] = updatedPost;
                    this.state.setPosts(newPosts);
                }
            })
        );
    }
}
