import { Category } from '../../core/models/category.model';

export const MOCK_CATEGORIES: Category[] = [
    {
        id: 'cat-1',
        name: 'Communication Digitale',
        slug: 'communication-digitale',
        description: 'Analyse des tendances et des strategies dans l\'ecosysteme numerique.',
        color: '#1B3A6B',
        icon: 'trending-up',
        postCount: 12
    },
    {
        id: 'cat-2',
        name: 'Intelligence Artificielle',
        slug: 'intelligence-artificielle',
        description: 'Enjeux ethiques et sociotechniques de l\'IA dans nos societes.',
        color: '#2E6DA4',
        icon: 'cpu',
        postCount: 8
    },
    {
        id: 'cat-3',
        name: 'Sociologie des Médias',
        slug: 'sociologie-medias',
        description: 'Etude des comportements sociaux face aux nouveaux medias.',
        color: '#4A90C4',
        icon: 'users',
        postCount: 5
    },
    {
        id: 'cat-4',
        name: 'Pédagogie & Recherche',
        slug: 'pedagogie-recherche',
        description: 'Innovations dans l\'enseignement superieur et methodologie de recherche.',
        color: '#102A43',
        icon: 'graduation-cap',
        postCount: 6
    },
    {
        id: 'cat-5',
        name: 'Marketing & Stratégie',
        slug: 'marketing-strategie',
        description: 'Conseils et analyses pour une presence de marque efficace.',
        color: '#627D98',
        icon: 'target',
        postCount: 7
    }
];
