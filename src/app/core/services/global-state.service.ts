import { Injectable, signal, computed } from '@angular/core';
import { User, MediaAsset, SiteSettings } from '../models/user.model';
import { Post } from '../models/post.model';
import { Event } from '../models/event.model';
import { Category } from '../models/category.model';
import { Tag } from '../models/tag.model';

export interface GlobalState {
    user: User | null;
    settings: SiteSettings | null;
    isAuthenticated: boolean;
    posts: Post[];
    events: Event[];
    media: MediaAsset[];
    categories: Category[];
    tags: Tag[];
    isLoading: boolean;
    isAuthInitialized: boolean;
    error: string | null;
    sidebarCollapsed: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class GlobalStateService {
    private _state = signal<GlobalState>({
        user: null,
        settings: null,
        isAuthenticated: false,
        posts: [],
        events: [],
        media: [],
        categories: [],
        tags: [],
        isLoading: false,
        isAuthInitialized: false,
        error: null,
        sidebarCollapsed: false
    });

    // Selectors
    state = computed(() => this._state());
    user = computed(() => this._state().user);
    settings = computed(() => this._state().settings);
    isAuthenticated = computed(() => this._state().isAuthenticated);
    posts = computed(() => this._state().posts);
    events = computed(() => this._state().events);
    media = computed(() => this._state().media);
    categories = computed(() => this._state().categories);
    tags = computed(() => this._state().tags);
    isLoading = computed(() => this._state().isLoading);
    isAuthInitialized = computed(() => this._state().isAuthInitialized);
    error = computed(() => this._state().error);
    sidebarCollapsed = computed(() => this._state().sidebarCollapsed);

    // Actions
    setUser(user: User | null) {
        this._state.update(s => ({ ...s, user }));
    }

    setAuthenticatedUser(user: User | null) {
        this._state.update(s => ({ ...s, user, isAuthenticated: !!user }));
    }

    setSettings(settings: SiteSettings | null) {
        this._state.update(s => ({ ...s, settings }));
    }

    setPosts(posts: Post[]) {
        this._state.update(s => ({ ...s, posts }));
    }

    setEvents(events: Event[]) {
        this._state.update(s => ({ ...s, events }));
    }

    setMedia(media: MediaAsset[]) {
        this._state.update(s => ({ ...s, media }));
    }

    setCategories(categories: Category[]) {
        this._state.update(s => ({ ...s, categories }));
    }

    setTags(tags: Tag[]) {
        this._state.update(s => ({ ...s, tags }));
    }

    setLoading(isLoading: boolean) {
        this._state.update(s => ({ ...s, isLoading }));
    }

    setAuthInitialized(isAuthInitialized: boolean) {
        this._state.update(s => ({ ...s, isAuthInitialized }));
    }

    setError(error: string | null) {
        this._state.update(s => ({ ...s, error }));
    }

    toggleSidebar() {
        this._state.update(s => ({ ...s, sidebarCollapsed: !s.sidebarCollapsed }));
    }

    updateState(partial: Partial<GlobalState>) {
        this._state.update(s => ({ ...s, ...partial }));
    }
}
