import { Observable } from 'rxjs';
import { Post, PostType } from '../models/post.model';
import { MediaAsset, User, SiteSettings } from '../models/user.model';
import { Event } from '../models/event.model';
import { Category } from '../models/category.model';
import { Tag } from '../models/tag.model';

export interface PostFilters {
    type?: PostType;
    category?: string;
    tag?: string;
    search?: string;
    status?: string;
}

export interface PaginationParams {
    page: number;
    limit: number;
}

export abstract class IContentService {
    abstract getPosts(filters?: PostFilters, pagination?: PaginationParams): Observable<{ items: Post[], total: number }>;
    abstract getPostBySlug(slug: string): Observable<Post | null>;
    abstract getEvents(status?: 'upcoming' | 'past'): Observable<Event[]>;
    abstract getEventBySlug(slug: string): Observable<Event | null>;
    abstract getCategories(): Observable<Category[]>;
    abstract getTags(): Observable<Tag[]>;
    abstract searchContent(query: string): Observable<Post[]>;
    abstract getMedia(): Observable<MediaAsset[]>;

    // CRUD operations for Admin
    abstract createPost(post: Partial<Post>): Observable<Post>;
    abstract updatePost(id: string, post: Partial<Post>): Observable<Post>;
    abstract deletePost(id: string): Observable<boolean>;

    abstract createEvent(event: Partial<Event>): Observable<Event>;
    abstract updateEvent(id: string, event: Partial<Event>): Observable<Event>;
    abstract deleteEvent(id: string): Observable<boolean>;

    abstract uploadMedia(asset: Partial<MediaAsset>): Observable<MediaAsset>;
    abstract deleteMedia(id: string): Observable<boolean>;

    abstract getProfile(): Observable<User>;
    abstract updateProfile(user: Partial<User>): Observable<User>;

    abstract getSettings(): Observable<SiteSettings>;
    abstract updateSettings(settings: Partial<SiteSettings>): Observable<SiteSettings>;
}
