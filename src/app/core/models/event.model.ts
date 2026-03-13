import { MediaAsset } from './user.model';
import { Post } from './post.model';

export type EventType = 'conference' | 'seminar' | 'workshop' | 'webinar' | 'forum';

export interface Event {
    id: string;
    title: string;
    slug: string;
    type: EventType;
    description: string;
    location: {
        city: string;
        country: string;
        venue: string;
        isOnline: boolean;
        onlineUrl?: string;
    };
    startDate: string;
    endDate: string;
    externalUrl?: string;
    role: 'speaker' | 'attendee' | 'organizer';
    recap: Post | null;
    coverImage: MediaAsset | null;
    status: 'upcoming' | 'ongoing' | 'past';
    likesCount: number;
    createdAt: string;
}
