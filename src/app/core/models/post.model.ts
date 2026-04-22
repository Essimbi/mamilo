import { User, MediaAsset } from './user.model';
import { Category } from './category.model';
import { Tag } from './tag.model';
import { Event } from './event.model';
import { SeoMeta } from './seo.model';

export type PostType = 'article' | 'note' | 'recap';
export type PostStatus = 'draft' | 'published' | 'scheduled' | 'archived';

export interface ContentBlock {
    type: 'paragraph' | 'heading' | 'image' | 'gallery' | 'quote';
    position: number;
    content: {
        text?: string;
        level?: number;
        url?: string;
        caption?: string;
    };
}

export interface Comment {
    id: string;
    postId: string;
    authorName: string;
    authorAvatar: string;
    content: string;
    createdAt: string;
    isApproved: boolean;
}

export interface Post {
    id: string;
    title: string;
    slug: string;
    type: PostType;
    status: PostStatus;
    excerpt: string;
    blocks: ContentBlock[];
    readingTime: number;
    likesCount: number;
    comments: Comment[];
    coverImage: MediaAsset | null;
    author: User;
    category: Category;
    categories?: Category[];
    tags: Tag[];
    event: Event | null;
    seo: SeoMeta;
    publishedAt: string | null;
    scheduledAt: string | null;
    createdAt: string;
    updatedAt: string;
}
