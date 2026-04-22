import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { IContentService, PostFilters, PaginationParams } from './content.interface';
import { Post } from '../models/post.model';
import { Event } from '../models/event.model';
import { Category } from '../models/category.model';
import { Tag } from '../models/tag.model';
import { MediaAsset, User, SiteSettings } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class ContentHttpService extends IContentService {
    private http = inject(HttpClient);
    private readonly API_URL = '/api/v1';

    private mapPost(data: any): Post {
        if (!data) return data;
        return {
            ...data,
            coverImage: data.cover_image || data.coverImage || null,
            publishedAt: data.published_at || data.publishedAt || null,
            scheduledAt: data.scheduled_at || data.scheduledAt || null,
            createdAt: data.created_at || data.createdAt,
            updatedAt: data.updated_at || data.updatedAt,
            likesCount: data.likes_count || data.likesCount || 0,
            readingTime: data.reading_time || data.readingTime || 0,
            category: data.category || (data.categories && data.categories[0]) || null
        };
    }

    private mapEvent(data: any): Event {
        if (!data) return data;
        return {
            ...data,
            eventDate: data.event_date || data.eventDate,
            coverImage: data.cover_image || data.coverImage || null,
            gallery: (data.gallery || []).map((m: any) => this.mapMedia(m)),
            createdAt: data.created_at || data.createdAt,
            updatedAt: data.updated_at || data.updatedAt
        };
    }

    private mapUser(data: any): User {
        if (!data) return data;
        return {
            ...data,
            createdAt: data.created_at || data.createdAt,
            updatedAt: data.updated_at || data.updatedAt,
            avatar: data.avatar || null
        };
    }

    private mapMedia(data: any): MediaAsset {
        if (!data) return data;
        let mime = data.mime_type || data.mimeType || data.type || '';
        
        // Fallback: if no mime but we have filename
        if (!mime && data.filename) {
            const ext = data.filename.split('.').pop()?.toLowerCase();
            if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext)) mime = 'image/' + ext;
            else if (['mp4', 'webm', 'ogg'].includes(ext)) mime = 'video/' + ext;
            else if (['pdf', 'doc', 'docx', 'xls', 'xlsx'].includes(ext)) mime = 'application/' + ext;
        }

        return {
            ...data,
            mime_type: mime,
            alt: data.alt || data.alt_text || data.filename || '',
            thumbnail_url: data.thumbnail_url || data.thumbnail || data.url
        };
    }

    getPosts(filters?: PostFilters, pagination?: PaginationParams): Observable<{ items: Post[]; total: number }> {
        let params = new HttpParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params = params.set(key, value);
            });
        }
        // Set default limit as required by API
        params = params.set('limit', pagination?.limit?.toString() || '20');
        if (pagination) {
            params = params.set('page', pagination.page.toString());
        }

        return this.http.get<{ data: Post[]; meta?: { total: number } }>(`${this.API_URL}/articles`, { params })
            .pipe(map(res => ({ 
                items: (res.data || []).map(p => this.mapPost(p)), 
                total: res.meta?.total || res.data?.length || 0 
            })));
    }

    getPostBySlug(slug: string): Observable<Post | null> {
        return this.http.get<{ success: boolean; data: Post }>(`${this.API_URL}/articles/${slug}`)
            .pipe(map(res => this.mapPost(res.data)));
    }

    getEvents(filters?: { type?: string; status?: string; limit?: number }): Observable<Event[]> {
        let params = new HttpParams();
        if (filters?.status) params = params.set('status', filters.status);
        if (filters?.type) params = params.set('type', filters.type);
        if (filters?.limit) params = params.set('limit', filters.limit.toString());
        
        return this.http.get<{ success: boolean; data: Event[]; message: string }>(`${this.API_URL}/events`, { params })
            .pipe(map(res => (res.data || []).map(e => this.mapEvent(e))));
    }

    getEventBySlug(slug: string): Observable<Event | null> {
        return this.http.get<{ success: boolean; data: Event }>(`${this.API_URL}/events/${slug}`)
            .pipe(map(res => this.mapEvent(res.data)));
    }

    getCategories(): Observable<Category[]> {
        return this.http.get<{ success: boolean; data: Category[]; message: string }>(`${this.API_URL}/categories`)
            .pipe(map(res => res.data));
    }

    getCategoryBySlug(slug: string): Observable<Category | null> {
        return this.http.get<{ success: boolean; data: Category; message: string }>(`${this.API_URL}/categories/${slug}`)
            .pipe(map(res => res.data));
    }

    getTags(): Observable<Tag[]> {
        return this.http.get<{ success: boolean; data: Tag[]; message: string }>(`${this.API_URL}/tags`)
            .pipe(map(res => res.data));
    }

    searchContent(query: string): Observable<Post[]> {
        let params = new HttpParams().set('search', query);
        return this.http.get<Post[]>(`${this.API_URL}/search`, { params });
    }

    getMedia(type?: string, search?: string): Observable<MediaAsset[]> {
        let params = new HttpParams();
        if (type && type !== 'all') params = params.set('type', type);
        if (search) params = params.set('search', search);
        return this.http.get<any>(`${this.API_URL}/admin/media`, { params })
            .pipe(map(res => {
                const data = Array.isArray(res) ? res : (res.data || []);
                return data.map((m: any) => this.mapMedia(m));
            }));
    }

    // Category CRUD (Admin)
    createCategory(category: Partial<Category>): Observable<Category> {
        return this.http.post<{ success: boolean; data: Category; message: string }>(`${this.API_URL}/admin/categories`, category)
            .pipe(map(res => res.data));
    }

    updateCategory(id: string, category: Partial<Category>): Observable<Category> {
        return this.http.put<{ success: boolean; data: Category; message: string }>(`${this.API_URL}/admin/categories/${id}`, category)
            .pipe(map(res => res.data));
    }

    deleteCategory(id: string): Observable<boolean> {
        return this.http.delete<boolean>(`${this.API_URL}/admin/categories/${id}`).pipe(map(() => true));
    }

    // Tag CRUD (Admin)
    createTag(tag: Partial<Tag>): Observable<Tag> {
        return this.http.post<{ success: boolean; data: Tag; message: string }>(`${this.API_URL}/admin/tags`, tag)
            .pipe(map(res => res.data));
    }

    updateTag(id: string, tag: Partial<Tag>): Observable<Tag> {
        return this.http.put<{ success: boolean; data: Tag; message: string }>(`${this.API_URL}/admin/tags/${id}`, tag)
            .pipe(map(res => res.data));
    }

    deleteTag(id: string): Observable<boolean> {
        return this.http.delete<boolean>(`${this.API_URL}/admin/tags/${id}`).pipe(map(() => true));
    }

    private transformPostData(post: Partial<Post>): any {
        const payload: any = { ...post };
        if (post.coverImage) {
            payload.cover_image_id = post.coverImage.id;
            delete payload.coverImage;
        }
        if ((post as any).categories) {
            payload.category_ids = (post as any).categories.map((c: any) => c.id);
            delete payload.categories;
        } else if (post.category) {
            payload.category_ids = [post.category.id];
            delete payload.category;
        }
        if (post.tags) {
            payload.tag_ids = post.tags.map(t => t.id);
            delete payload.tags;
        }
        if (post.publishedAt) {
            payload.published_at = post.publishedAt;
            delete payload.publishedAt;
        }
        return payload;
    }

    createPost(post: Partial<Post>): Observable<Post> {
        return this.http.post<{ success: boolean; data: Post; message: string }>(`${this.API_URL}/admin/articles`, this.transformPostData(post))
            .pipe(map(res => res.data));
    }

    updatePost(id: string, post: Partial<Post>): Observable<Post> {
        return this.http.put<{ success: boolean; data: Post; message: string }>(`${this.API_URL}/admin/articles/${id}`, this.transformPostData(post))
            .pipe(map(res => res.data));
    }

    deletePost(id: string): Observable<boolean> {
        return this.http.delete<{ success: boolean; message: string }>(`${this.API_URL}/admin/articles/${id}`)
            .pipe(map(() => true));
    }

    private transformEventData(event: Partial<Event>): any {
        const payload: any = { ...event };
        if (event.eventDate) {
            payload.event_date = event.eventDate;
            delete payload.eventDate;
        }
        if (event.coverImage) {
            payload.cover_image_id = event.coverImage.id;
            delete payload.coverImage;
        }
        if (event.recapArticle) {
            payload.recap_article_id = event.recapArticle.id;
            delete payload.recapArticle;
        }
        if (event.gallery) {
            payload.gallery_ids = event.gallery.map(m => m.id);
            delete payload.gallery;
        }
        return payload;
    }

    createEvent(event: Partial<Event>): Observable<Event> {
        return this.http.post<{ success: boolean; data: Event; message: string }>(`${this.API_URL}/admin/events`, this.transformEventData(event))
            .pipe(map(res => res.data));
    }

    updateEvent(id: string, event: Partial<Event>): Observable<Event> {
        return this.http.put<{ success: boolean; data: Event; message: string }>(`${this.API_URL}/admin/events/${id}`, this.transformEventData(event))
            .pipe(map(res => res.data));
    }

    deleteEvent(id: string): Observable<boolean> {
        return this.http.delete<{ success: boolean; message: string }>(`${this.API_URL}/admin/events/${id}`)
            .pipe(map(() => true));
    }

    uploadMedia(file: File | any): Observable<MediaAsset> {
        // If it's already a MediaAsset (temp), we might need to handle it, 
        // but real backend expects multipart File
        if (file instanceof File) {
            const formData = new FormData();
            formData.append('file', file);
            return this.http.post<{ success: boolean; data: MediaAsset }>(`${this.API_URL}/admin/media/upload`, formData)
                .pipe(map(res => this.mapMedia(res.data)));
        }
        return this.http.post<{ data: MediaAsset }>(`${this.API_URL}/admin/media/upload`, file)
            .pipe(map(res => this.mapMedia(res.data)));
    }

    updateMedia(id: string, metadata: { alt?: string; description?: string }): Observable<MediaAsset> {
        return this.http.put<{ success: boolean; data: MediaAsset }>(`${this.API_URL}/admin/media/${id}`, metadata)
            .pipe(map(res => this.mapMedia(res.data)));
    }

    getMediaById(id: string): Observable<MediaAsset> {
        return this.http.get<{ success: boolean; data: MediaAsset }>(`${this.API_URL}/admin/media/${id}`)
            .pipe(map(res => this.mapMedia(res.data)));
    }

    deleteMedia(id: string): Observable<boolean> {
        return this.http.delete<any>(`${this.API_URL}/admin/media/${id}`).pipe(map(() => true));
    }

    getProfile(): Observable<User> {
        return this.http.get<{ success: boolean; data: User; message: string }>(`${this.API_URL}/profile`)
            .pipe(map(res => this.mapUser(res.data)));
    }

    updateProfile(user: Partial<User>): Observable<User> {
        return this.http.put<{ success: boolean; data: User; message: string }>(`${this.API_URL}/profile`, user)
            .pipe(map(res => this.mapUser(res.data)));
    }

    getSettings(): Observable<SiteSettings> {
        return this.http.get<{ success: boolean; data: any[]; message: string }>(`${this.API_URL}/settings`)
            .pipe(
                map(res => {
                    const settings: any = {};
                    res.data.forEach(item => {
                        if (item.key === 'social_media') {
                            try {
                                settings[item.key] = typeof item.value === 'string' ? JSON.parse(item.value) : item.value;
                            } catch (e) {
                                settings[item.key] = [];
                            }
                        } else {
                            settings[item.key] = item.value;
                        }
                    });
                    return settings as SiteSettings;
                })
            );
    }

    updateSettings(settings: Partial<SiteSettings>): Observable<SiteSettings> {
        return this.http.put<{ success: boolean; data: SiteSettings; message: string }>(`${this.API_URL}/admin/settings`, settings)
            .pipe(map(res => res.data));
    }

    likePost(id: string): Observable<number> {
        return this.http.post<{ success: boolean; data: { likesCount: number }; message: string }>(`${this.API_URL}/articles/${id}/like`, {})
            .pipe(map(res => res.data.likesCount));
    }

    likeEvent(id: string): Observable<number> {
        return this.http.post<{ success: boolean; data: { likesCount: number }; message: string }>(`${this.API_URL}/events/${id}/like`, {})
            .pipe(map(res => res.data.likesCount));
    }

    addComment(post_id: string, comment: any): Observable<any> {
        return this.http.post<{ success: boolean; data: any; message: string }>(`${this.API_URL}/articles/${post_id}/comments`, comment)
            .pipe(map(res => res.data));
    }

    addEventComment(event_id: string, comment: any): Observable<any> {
        return this.http.post<{ success: boolean; data: any; message: string }>(`${this.API_URL}/events/${event_id}/comments`, comment)
            .pipe(map(res => res.data));
    }

    subscribeNewsletter(email: string): Observable<any> {
        return this.http.post<any>(`${this.API_URL}/newsletter/subscribe`, { email });
    }

    sendContactMessage(data: { name: string; email: string; subject: string; message: string }): Observable<any> {
        return this.http.post<any>(`${this.API_URL}/contact`, data);
    }

    getRelatedPosts(postId: string): Observable<Post[]> {
        return this.http.get<{ data: any[] }>(`${this.API_URL}/articles/${postId}/related`)
            .pipe(map(res => (res.data || []).map(p => this.mapPost(p))));
    }

    getPostNavigation(postId: string): Observable<{ previous: Post | null; next: Post | null }> {
        return this.http.get<{ data: { previous: any; next: any } }>(`${this.API_URL}/articles/${postId}/navigation`)
            .pipe(map(res => ({
                previous: res.data.previous ? this.mapPost(res.data.previous) : null,
                next: res.data.next ? this.mapPost(res.data.next) : null
            })));
    }
}
