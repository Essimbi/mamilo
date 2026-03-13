export interface User {
    id: string;
    name: string;
    email: string;
    bio: string;
    avatar: MediaAsset;
    role: 'admin' | 'editor';
    social: {
        linkedin?: string;
        twitter?: string;
        researchgate?: string;
    };
    createdAt: string;
}

export interface MediaAsset {
    id: string;
    url: string;
    thumbnailUrl: string;
    filename: string;
    mimeType: string;
    width: number;
    height: number;
    size: number;
    alt: string;
    caption?: string;
    uploadedAt: string;
}
export interface SiteSettings {
    siteName: string;
    siteDescription: string;
    keywords: string[];
    notifications: {
        comments: boolean;
        newsletter: boolean;
    };
}
