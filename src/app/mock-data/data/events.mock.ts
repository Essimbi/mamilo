import { Event } from '../../core/models/event.model';

export const MOCK_EVENTS: Event[] = [
    {
        id: 'ev-1',
        title: 'Sommet Mondial sur l\'Éthique de l\'IA',
        slug: 'sommet-ethique-ia',
        type: 'conference',
        description: 'Une discussion sur la gouvernance mondiale des technologies émergentes.',
        location: {
            city: 'Genève',
            country: 'Suisse',
            venue: 'Palais des Nations',
            isOnline: false
        },
        startDate: '2024-05-15T09:00:00Z',
        endDate: '2024-05-17T18:00:00Z',
        role: 'speaker',
        recap: null,
        coverImage: {
            id: 'img-ev-1',
            url: 'https://images.unsplash.com/photo-1540575861501-7ad060e39fe1?auto=format&fit=crop&q=80&w=1000',
            thumbnailUrl: 'https://images.unsplash.com/photo-1540575861501-7ad060e39fe1?auto=format&fit=crop&q=80&w=200',
            filename: 'geneva-summit.jpg',
            uploadedAt: '2024-01-10T10:00:00Z',
            mimeType: 'image/jpeg',
            width: 1000,
            height: 600,
            size: 150000,
            alt: 'Conference hall'
        },
        status: 'upcoming',
        createdAt: '2024-01-10T10:00:00Z'
    },
    {
        id: 'ev-2',
        title: 'Digital Communication Workshop',
        slug: 'digital-comm-workshop',
        type: 'workshop',
        description: 'Formation intensive sur les outils de communication moderne pour les chercheurs.',
        location: {
            city: 'Paris',
            country: 'France',
            venue: 'Sorbonne Université',
            isOnline: false
        },
        startDate: '2024-04-20T10:00:00Z',
        endDate: '2024-04-21T17:00:00Z',
        role: 'organizer',
        recap: null,
        coverImage: {
            id: 'img-ev-2',
            url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1000',
            thumbnailUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=200',
            filename: 'paris-workshop.jpg',
            uploadedAt: '2024-02-01T10:00:00Z',
            mimeType: 'image/jpeg',
            width: 1000,
            height: 600,
            size: 150000,
            alt: 'Collaboration room'
        },
        status: 'upcoming',
        createdAt: '2024-02-01T10:00:00Z'
    },
    {
        id: 'ev-3',
        title: 'Webinaire : Sociologie du Web Africain',
        slug: 'webinaire-sociologie-web-africain',
        type: 'webinar',
        description: 'Analyse des usages des plateformes numériques en Afrique subsaharienne.',
        location: {
            city: 'Online',
            country: 'Global',
            venue: 'Zoom',
            isOnline: true,
            onlineUrl: 'https://zoom.us/j/123456789'
        },
        startDate: '2024-03-25T15:00:00Z',
        endDate: '2024-03-25T17:00:00Z',
        role: 'speaker',
        recap: null,
        coverImage: {
            id: 'img-ev-3',
            url: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&q=80&w=1000',
            thumbnailUrl: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&q=80&w=200',
            filename: 'webinar-africa.jpg',
            uploadedAt: '2024-03-10T10:00:00Z',
            mimeType: 'image/jpeg',
            width: 1000,
            height: 600,
            size: 150000,
            alt: 'Laptop showing webinar'
        },
        status: 'upcoming',
        createdAt: '2024-03-10T10:00:00Z'
    }
];
