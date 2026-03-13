import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { IContentService, PostFilters, PaginationParams } from '../../core/services/content.interface';
import { Post } from '../../core/models/post.model';
import { Event } from '../../core/models/event.model';
import { Category } from '../../core/models/category.model';
import { Tag } from '../../core/models/tag.model';
import { MediaAsset, User, SiteSettings } from '../../core/models/user.model';
import { MOCK_CATEGORIES } from '../data/categories.mock';
import { MOCK_USER } from '../data/users.mock';
import { MOCK_POSTS } from '../data/posts.mock';
import { MOCK_EVENTS } from '../data/events.mock';
import { MOCK_TAGS } from '../data/tags.mock';

@Injectable({
    providedIn: 'root'
})
export class ContentMockService implements IContentService {
    private platformId = inject(PLATFORM_ID);
    private isBrowser = isPlatformBrowser(this.platformId);

    private readonly STORAGE_KEY = 'mamilo_blog_posts';
    private readonly EVENTS_KEY = 'mamilo_blog_events';
    private readonly MEDIA_KEY = 'mamilo_blog_media';
    private readonly PROFILE_KEY = 'mamilo_blog_profile';
    private readonly SETTINGS_KEY = 'mamilo_blog_settings';
    
    private posts: Post[] = [];
    private events: Event[] = [];
    private media: MediaAsset[] = [];
    private profile: User = MOCK_USER;

    constructor() {
        if (this.isBrowser) {
            this.posts = this.loadFromStorage(this.STORAGE_KEY) || MOCK_POSTS;
            this.events = this.loadFromStorage(this.EVENTS_KEY) || MOCK_EVENTS;
            this.media = this.loadFromStorage(this.MEDIA_KEY) || [];
            this.profile = this.loadFromStorage(this.PROFILE_KEY) || MOCK_USER;
        } else {
            this.posts = MOCK_POSTS;
            this.events = MOCK_EVENTS;
            this.media = [];
            this.profile = MOCK_USER;
        }
    }

    private loadFromStorage(key: string): any {
        if (!this.isBrowser) return null;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    private saveToStorage(key: string, data: any) {
        if (!this.isBrowser) return;
        localStorage.setItem(key, JSON.stringify(data));
    }

    getPosts(filters?: PostFilters, params?: PaginationParams): Observable<{ items: Post[], total: number }> {
        let filtered = [...this.posts];
        if (filters?.category) filtered = filtered.filter(p => p.category.id === filters.category);
        if (filters?.status) filtered = filtered.filter(p => p.status === filters.status);
        if (filters?.type) filtered = filtered.filter(p => p.type === filters.type);
        if (filters?.search) {
            const s = filters.search.toLowerCase();
            filtered = filtered.filter(p => p.title.toLowerCase().includes(s) || p.excerpt.toLowerCase().includes(s));
        }

        const total = filtered.length;
        const start = ((params?.page || 1) - 1) * (params?.limit || 10);
        const items = filtered.slice(start, start + (params?.limit || 10));

        return of({ items, total }).pipe(delay(500));
    }

    getPostBySlug(slug: string): Observable<Post | null> {
        const post = this.posts.find(p => p.slug === slug);
        return of(post || null).pipe(delay(300));
    }

    getEventBySlug(slug: string): Observable<Event | null> {
        const event = this.events.find(e => e.slug === slug);
        return of(event || null).pipe(delay(300));
    }

    searchContent(query: string): Observable<Post[]> {
        const q = query.toLowerCase();
        const posts = this.posts.filter(p => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q));
        return of(posts).pipe(delay(500));
    }

    getEvents(): Observable<Event[]> {
        return of(this.events).pipe(delay(400));
    }

    getMedia(): Observable<MediaAsset[]> {
        return of(this.media).pipe(delay(400));
    }

    getCategories(): Observable<Category[]> {
        return of(MOCK_CATEGORIES).pipe(delay(200));
    }

    getTags(): Observable<Tag[]> {
        return of(MOCK_TAGS).pipe(delay(200));
    }

    createPost(post: Partial<Post>): Observable<Post> {
        const newPost: Post = {
            id: 'post-' + Date.now(),
            title: post.title || 'Untitled',
            slug: post.slug || 'untitled',
            excerpt: post.excerpt || '',
            content: post.content || '',
            status: post.status as any || 'draft',
            type: post.type as any || 'article',
            readingTime: 5,
            coverImage: null,
            event: null,
            seo: { 
                metaTitle: '', 
                metaDescription: '', 
                ogTitle: '', 
                ogDescription: '', 
                ogImage: '', 
                keywords: [] 
            },
            publishedAt: null,
            scheduledAt: null,
            updatedAt: new Date().toISOString(),
            likesCount: 0,
            comments: [],
            category: post.category || MOCK_CATEGORIES[0],
            tags: post.tags || [],
            author: this.profile,
            createdAt: new Date().toISOString()
        };
        this.posts = [newPost, ...this.posts];
        this.saveToStorage(this.STORAGE_KEY, this.posts);
        return of(newPost).pipe(delay(600));
    }

    updatePost(id: string, postUpdate: Partial<Post>): Observable<Post> {
        const index = this.posts.findIndex(p => p.id === id);
        if (index === -1) throw new Error('Post not found');
        const updatedPost = { ...this.posts[index], ...postUpdate, updatedAt: new Date().toISOString() };
        this.posts[index] = updatedPost;
        this.saveToStorage(this.STORAGE_KEY, this.posts);
        return of(updatedPost).pipe(delay(500));
    }

    deletePost(id: string): Observable<boolean> {
        const initialLength = this.posts.length;
        this.posts = this.posts.filter(p => p.id !== id);
        this.saveToStorage(this.STORAGE_KEY, this.posts);
        return of(this.posts.length < initialLength).pipe(delay(400));
    }

    createEvent(event: Partial<Event>): Observable<Event> {
        const newEvent: Event = {
            id: 'evt-' + Date.now(),
            title: event.title || 'Untitled Event',
            slug: event.slug || 'untitled',
            type: event.type || 'conference',
            description: event.description || '',
            location: event.location || { city: '', country: '', venue: '', isOnline: false },
            startDate: event.startDate || new Date().toISOString(),
            endDate: event.endDate || new Date().toISOString(),
            role: event.role || 'speaker',
            recap: null,
            coverImage: event.coverImage || null,
            status: event.status || 'upcoming',
            likesCount: 0,
            createdAt: new Date().toISOString()
        };
        this.events = [newEvent, ...this.events];
        this.saveToStorage(this.EVENTS_KEY, this.events);
        return of(newEvent).pipe(delay(500));
    }

    updateEvent(id: string, eventUpdate: Partial<Event>): Observable<Event> {
        const index = this.events.findIndex(e => e.id === id);
        if (index === -1) throw new Error('Event not found');
        this.events[index] = { ...this.events[index], ...eventUpdate };
        this.saveToStorage(this.EVENTS_KEY, this.events);
        return of(this.events[index]).pipe(delay(400));
    }

    deleteEvent(id: string): Observable<boolean> {
        const initialLength = this.events.length;
        this.events = this.events.filter(e => e.id !== id);
        this.saveToStorage(this.EVENTS_KEY, this.events);
        return of(this.events.length < initialLength).pipe(delay(300));
    }

    uploadMedia(asset: Partial<MediaAsset>): Observable<MediaAsset> {
        const newAsset: MediaAsset = {
            id: 'img-' + Date.now(),
            url: asset.url || '',
            thumbnailUrl: asset.thumbnailUrl || asset.url || '',
            filename: asset.filename || 'upload.jpg',
            mimeType: asset.mimeType || 'image/jpeg',
            width: asset.width || 800,
            height: asset.height || 600,
            size: asset.size || 0,
            alt: asset.alt || asset.filename || '',
            uploadedAt: new Date().toISOString()
        };
        this.media = [newAsset, ...this.media];
        this.saveToStorage(this.MEDIA_KEY, this.media);
        return of(newAsset).pipe(delay(800));
    }

    deleteMedia(id: string): Observable<boolean> {
        const initialLength = this.media.length;
        this.media = this.media.filter(m => m.id !== id);
        this.saveToStorage(this.MEDIA_KEY, this.media);
        return of(this.media.length < initialLength).pipe(delay(300));
    }

    getProfile(): Observable<User> {
        return of(this.profile).pipe(delay(200));
    }

    updateProfile(userUpdate: Partial<User>): Observable<User> {
        this.profile = { ...this.profile, ...userUpdate };
        this.saveToStorage(this.PROFILE_KEY, this.profile);
        return of(this.profile).pipe(delay(400));
    }

    getSettings(): Observable<SiteSettings> {
        const saved = this.isBrowser ? localStorage.getItem(this.SETTINGS_KEY) : null;
        const settings = saved ? JSON.parse(saved) : {
            siteName: '3CM Editorial - Dr. Christian Mamilo',
            siteDescription: 'Plateforme éditoriale et académique du Dr. Christian Mamilo. Expertise en communication numérique.',
            keywords: ['communication', 'digital', 'académique', 'mamilo'],
            notifications: {
                comments: true,
                newsletter: true
            }
        };
        return of(settings).pipe(delay(500));
    }

    updateSettings(settings: Partial<SiteSettings>): Observable<SiteSettings> {
        return this.getSettings().pipe(
            map(current => {
                const updated = { ...current, ...settings };
                if (this.isBrowser) {
                    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(updated));
                }
                return updated;
            }),
            delay(500)
        );
    }

    likePost(id: string): Observable<number> {
        const index = this.posts.findIndex(p => p.id === id);
        if (index === -1) return of(0);
        
        this.posts[index].likesCount++;
        this.saveToStorage(this.STORAGE_KEY, this.posts);
        return of(this.posts[index].likesCount).pipe(delay(200));
    }

    likeEvent(id: string): Observable<number> {
        const index = this.events.findIndex(e => e.id === id);
        if (index === -1) return of(0);
        
        this.events[index].likesCount++;
        this.saveToStorage(this.EVENTS_KEY, this.events);
        return of(this.events[index].likesCount).pipe(delay(200));
    }

    addComment(postId: string, comment: any): Observable<any> {
        const index = this.posts.findIndex(p => p.id === postId);
        if (index === -1) throw new Error('Post not found');

        const newComment = {
            id: 'cmt-' + Date.now(),
            postId,
            authorName: comment.authorName || 'Anonyme',
            authorAvatar: comment.authorAvatar || 'assets/images/mock/avatar.jpg',
            content: comment.content,
            createdAt: new Date().toISOString(),
            isApproved: true // Mock auto-approve
        };

        this.posts[index].comments = [...this.posts[index].comments || [], newComment];
        this.saveToStorage(this.STORAGE_KEY, this.posts);
        return of(newComment).pipe(delay(400));
    }
}
