import { MediaAsset } from './user.model';
export type EventType = string;

export interface Event {
    id: string;
    title: string;
    slug: string;
    type: EventType;
    description: string;
    location: string;
    eventDate: string;
    status: string;
    likesCount: number;
    coverImage: MediaAsset | null;
    gallery?: MediaAsset[];
    recapArticle: { id: string; slug: string; title: string } | null;
    seo?: { metaTitle?: string; metaDescription?: string; ogImageId?: string };
    comments?: any[];
    createdAt: string;
}
