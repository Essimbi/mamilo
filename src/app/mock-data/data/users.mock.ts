import { User } from '../../core/models/user.model';

export const MOCK_USER: User = {
    id: 'user-1',
    name: 'Dr. Jean Dupont',
    email: 'jean.dupont@expert.com',
    bio: 'Professeur d’universite et consultant expert en communication digitale et aménagement d’espaces de travail.',
    avatar: {
        id: 'media-1',
        url: 'https://i.pravatar.cc/300?u=jean',
        thumbnailUrl: 'https://i.pravatar.cc/100?u=jean',
        filename: 'avatar-jean.jpg',
        mimeType: 'image/jpeg',
        width: 300,
        height: 300,
        size: 45000,
        alt: 'Photo de profil du Dr. Jean Dupont',
        uploadedAt: '2024-01-01T10:00:00Z'
    },
    role: 'admin',
    social: {
        linkedin: 'https://linkedin.com/in/jeandupont',
        twitter: 'https://twitter.com/jeandupont',
        researchgate: 'https://researchgate.net/profile/Jean_Dupont'
    },
    createdAt: '2023-12-01T08:00:00Z'
};
