export interface User {
    id: string;
    name: string;
    email: string;
    email_verified_at: string | null;
    role: 'admin' | 'editor';
    bio: string;
    avatar_id: string | null;
    avatar?: MediaAsset;
    social?: {
        linkedin?: string;
        twitter?: string;
        researchgate?: string;
    };
    createdAt: string;
    updatedAt?: string;
}

export interface MediaAsset {
    id: string;
    url: string;
    thumbnail_url: string;
    filename: string;
    mime_type: string;
    width: number;
    height: number;
    size: number;
    alt: string;
    caption?: string;
    uploaded_at: string;
}
export interface SiteSettings {
    site_name: string;
    site_description: string;
    contact_email: string;
    social_media: string[];
}
