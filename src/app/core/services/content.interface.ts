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
    abstract getEvents(filters?: { type?: string; status?: string; limit?: number }): Observable<Event[]>;
    abstract getEventBySlug(slug: string): Observable<Event | null>;
    abstract getCategories(): Observable<Category[]>;
    abstract getCategoryBySlug(slug: string): Observable<Category | null>;
    abstract getTags(): Observable<Tag[]>;
    abstract searchContent(query: string): Observable<Post[]>;
    abstract getMedia(type?: string, search?: string): Observable<MediaAsset[]>;
    abstract getMediaById(id: string): Observable<MediaAsset>;

    // CRUD operations for Admin
    abstract createPost(post: Partial<Post>): Observable<Post>;
    abstract updatePost(id: string, post: Partial<Post>): Observable<Post>;
    abstract deletePost(id: string): Observable<boolean>;

    abstract createEvent(event: Partial<Event>): Observable<Event>;
    abstract updateEvent(id: string, event: Partial<Event>): Observable<Event>;
    abstract deleteEvent(id: string): Observable<boolean>;

    // CRUD operations for Categories
    abstract createCategory(category: Partial<Category>): Observable<Category>;
    abstract updateCategory(id: string, category: Partial<Category>): Observable<Category>;
    abstract deleteCategory(id: string): Observable<boolean>;

    // CRUD operations for Tags
    abstract createTag(tag: Partial<Tag>): Observable<Tag>;
    abstract updateTag(id: string, tag: Partial<Tag>): Observable<Tag>;
    abstract deleteTag(id: string): Observable<boolean>;

    abstract uploadMedia(file: File | any): Observable<MediaAsset>;
    abstract deleteMedia(id: string): Observable<boolean>;
    abstract updateMedia(id: string, metadata: { alt?: string, description?: string }): Observable<MediaAsset>;

    abstract getProfile(): Observable<User>;
    abstract updateProfile(user: Partial<User>): Observable<User>;

    abstract getSettings(): Observable<SiteSettings>;
    abstract updateSettings(settings: Partial<SiteSettings>): Observable<SiteSettings>;

    // Social actions
    abstract likePost(id: string): Observable<number>;
    abstract likeEvent(id: string): Observable<number>;
    abstract addComment(post_id: string, comment: any): Observable<any>;
    abstract addEventComment(event_id: string, comment: any): Observable<any>;
    
    // New Public Actions
    abstract subscribeNewsletter(email: string): Observable<any>;
    abstract sendContactMessage(data: { name: string, email: string, subject: string, message: string }): Observable<any>;
    abstract getRelatedPosts(postId: string): Observable<Post[]>;
    abstract getPostNavigation(postId: string): Observable<{ previous: Post | null, next: Post | null }>;
}
