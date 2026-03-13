import { Post } from '../../core/models/post.model';
import { MOCK_USER } from './users.mock';
import { MOCK_CATEGORIES } from './categories.mock';
import { MOCK_TAGS } from './tags.mock';

export const MOCK_POSTS: Post[] = [
    // --- ARTICLE 1 (Vedette) ---
    {
        id: 'post-1',
        title: 'La Transformation Numérique des Institutions Académiques',
        slug: 'transformation-numerique-académique',
        type: 'article',
        status: 'published',
        excerpt: 'Comment la digitalisation redéfinit la transmission du savoir et les structures de recherche au XXIe siècle.',
        content: '<p>L\'intégration des outils numériques dans l\'enseignement supérieur ne se limite pas à la mise en ligne de cours. C\'est une mutation profonde...</p>',
        readingTime: 8,
        coverImage: {
            id: 'img-1',
            url: 'https://images.unsplash.com/photo-1523240715632-d984bb4b974c?auto=format&fit=crop&q=80&w=1000',
            thumbnailUrl: 'https://images.unsplash.com/photo-1523240715632-d984bb4b974c?auto=format&fit=crop&q=80&w=200',
            filename: 'academic-digital.jpg',
            uploadedAt: '2024-03-01T10:00:00Z',
            mimeType: 'image/jpeg',
            width: 1000,
            height: 600,
            size: 150000,
            alt: 'Campus moderne'
        },
        author: MOCK_USER,
        category: MOCK_CATEGORIES[3], // Pédagogie & Recherche
        tags: [MOCK_TAGS[0], MOCK_TAGS[1], MOCK_TAGS[5]], // digital, recherche, education
        event: null,
        seo: {
            metaTitle: 'Transformation Numérique Académique | Christian Mamilo',
            metaDescription: 'Analyse de la digitalisation de l\'enseignement supérieur.',
            ogTitle: 'Transformation Numérique Académique',
            ogDescription: 'Analyse complète.',
            ogImage: 'https://images.unsplash.com/photo-1523240715632-d984bb4b974c?auto=format&fit=crop&q=80&w=1000',
            keywords: ['éducation', 'digital']
        },
        publishedAt: '2024-03-15T10:00:00Z',
        scheduledAt: null,
        createdAt: '2024-03-15T10:00:00Z',
        updatedAt: '2024-03-15T10:00:00Z'
    },
    // --- ARTICLE 2 ---
    {
        id: 'post-2',
        title: 'Communication de Crise : Le Rôle de la Data',
        slug: 'communication-crise-data',
        type: 'article',
        status: 'published',
        excerpt: 'Exploration de l\'utilisation de l\'analyse de données en temps réel pour gérer la réputation institutionnelle.',
        content: '<p>En période de crise, chaque seconde compte. La data devient alors le meilleur allié du communicateur stratégique...</p>',
        readingTime: 12,
        coverImage: {
            id: 'img-2',
            url: 'https://images.unsplash.com/photo-1551288049-bbbda5366391?auto=format&fit=crop&q=80&w=1000',
            thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bbbda5366391?auto=format&fit=crop&q=80&w=200',
            filename: 'data-crisis.jpg',
            uploadedAt: '2024-03-12T10:00:00Z',
            mimeType: 'image/jpeg',
            width: 1000,
            height: 600,
            size: 150000,
            alt: 'Graphiques de données'
        },
        author: MOCK_USER,
        category: MOCK_CATEGORIES[0], // Communication Digitale
        tags: [MOCK_TAGS[0], MOCK_TAGS[3], MOCK_TAGS[7]], // digital, strategie, medias
        event: null,
        seo: {
            metaTitle: 'Data & Communication de Crise | Christian Mamilo',
            metaDescription: 'Comment utiliser la data pour gerer les crises.',
            ogTitle: 'Data & Communication de Crise',
            ogDescription: 'Strategie data-driven.',
            ogImage: 'https://images.unsplash.com/photo-1551288049-bbbda5366391?auto=format&fit=crop&q=80&w=1000',
            keywords: ['data', 'strategie']
        },
        publishedAt: '2024-03-12T09:00:00Z',
        scheduledAt: null,
        createdAt: '2024-03-12T09:00:00Z',
        updatedAt: '2024-03-12T09:00:00Z'
    },
    // --- NOTE 1 ---
    {
        id: 'post-3',
        title: 'Note d\'intention : L\'éthique algorithmique',
        slug: 'note-ethique-algorithmique',
        type: 'note',
        status: 'published',
        excerpt: 'Courte réflexion sur la neutralité supposée des algorithmes de recommandation sociale.',
        content: '<p>Il est urgent de déconstruire le mythe de la neutralité technique. Derrière chaque algorithme se cache un choix politique...</p>',
        readingTime: 4,
        coverImage: {
            id: 'img-3',
            url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000',
            thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=200',
            filename: 'ai-note.jpg',
            uploadedAt: '2024-03-10T10:00:00Z',
            mimeType: 'image/jpeg',
            width: 1000,
            height: 600,
            size: 150000,
            alt: 'AI Abstract'
        },
        author: MOCK_USER,
        category: MOCK_CATEGORIES[1], // Intelligence Artificielle
        tags: [MOCK_TAGS[2], MOCK_TAGS[6]], // ia, ethique
        event: null,
        seo: {
            metaTitle: 'Note Ethique Algorithmique | Christian Mamilo',
            metaDescription: 'Reflexion sur les algorithmes.',
            ogTitle: 'Note Ethique Algorithmique',
            ogDescription: 'Reflexion courte.',
            ogImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000',
            keywords: ['ethique', 'ia']
        },
        publishedAt: '2024-03-10T14:30:00Z',
        scheduledAt: null,
        createdAt: '2024-03-10T14:30:00Z',
        updatedAt: '2024-03-10T14:30:00Z'
    },
    // --- RECAP 1 ---
    {
        id: 'post-4',
        title: 'Récap : Forum de la Communication 2024',
        slug: 'recap-forum-communication-2024',
        type: 'recap',
        status: 'published',
        excerpt: 'Synthèse des trois jours de débats sur le futur du journalisme et des médias publics.',
        content: '<p>Le Forum de cette année a mis en lumière trois enjeux majeurs : le financement du service public, la lutte contre les fake news...</p>',
        readingTime: 6,
        coverImage: {
            id: 'img-4',
            url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=1000',
            thumbnailUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=200',
            filename: 'conference-recap.jpg',
            uploadedAt: '2024-03-08T10:00:00Z',
            mimeType: 'image/jpeg',
            width: 1000,
            height: 600,
            size: 150000,
            alt: 'Conference hall'
        },
        author: MOCK_USER,
        category: MOCK_CATEGORIES[2], // Sociologie des Médias
        tags: [MOCK_TAGS[7], MOCK_TAGS[4]], // medias, afrique
        event: null,
        seo: {
            metaTitle: 'Recap Forum Communication 2024 | Christian Mamilo',
            metaDescription: 'Synthese du forum.',
            ogTitle: 'Recap Forum Communication 2024',
            ogDescription: 'Points cles.',
            ogImage: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=1000',
            keywords: ['recap', 'conference']
        },
        publishedAt: '2024-03-08T18:00:00Z',
        scheduledAt: null,
        createdAt: '2024-03-08T18:00:00Z',
        updatedAt: '2024-03-08T18:00:00Z'
    },
    // --- ARTICLE 3 ---
    {
        id: 'post-5',
        title: 'L\'IA au service du Personal Branding',
        slug: 'ia-personal-branding',
        type: 'article',
        status: 'published',
        excerpt: 'Comment optimiser sa présence en ligne sans perdre son authenticité grâce à l\'intelligence artificielle.',
        content: '<p>Le personal branding n\'est plus une option pour l\'expert contemporain. L\'IA offre des outils d\'automatisation précieux...</p>',
        readingTime: 10,
        coverImage: {
            id: 'img-5',
            url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1000',
            thumbnailUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=200',
            filename: 'personal-branding.jpg',
            uploadedAt: '2024-03-05T10:00:00Z',
            mimeType: 'image/jpeg',
            width: 1000,
            height: 600,
            size: 150000,
            alt: 'Professional desk'
        },
        author: MOCK_USER,
        category: MOCK_CATEGORIES[4], // Marketing & Stratégie
        tags: [MOCK_TAGS[3], MOCK_TAGS[2], MOCK_TAGS[0]], // strategie, ia, digital
        event: null,
        seo: {
            metaTitle: 'IA & Personal Branding | Christian Mamilo',
            metaDescription: 'Maximisez votre visibilite.',
            ogTitle: 'IA & Personal Branding',
            ogDescription: 'Guide pour experts.',
            ogImage: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1000',
            keywords: ['branding', 'strategie']
        },
        publishedAt: '2024-03-05T08:00:00Z',
        scheduledAt: null,
        createdAt: '2024-03-05T08:00:00Z',
        updatedAt: '2024-03-05T08:00:00Z'
    },
    // --- NOTE 2 ---
    {
        id: 'post-6',
        title: 'Note : La fin du journalisme traditionnel ?',
        slug: 'note-fin-journalisme-traditionnel',
        type: 'note',
        status: 'published',
        excerpt: 'Reflexions sur le passage du papier au flux continu d\'information numérique.',
        content: '<p>Le journal n\'est plus un objet physique, c\'est un flux constant. Cette transition n\'est pas sans consequence sur la qualite...</p>',
        readingTime: 5,
        coverImage: {
            id: 'img-6',
            url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1000',
            thumbnailUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=200',
            filename: 'newspaper-digital.jpg',
            uploadedAt: '2024-03-02T10:00:00Z',
            mimeType: 'image/jpeg',
            width: 1000,
            height: 600,
            size: 150000,
            alt: 'Digital news'
        },
        author: MOCK_USER,
        category: MOCK_CATEGORIES[2],
        tags: [MOCK_TAGS[7], MOCK_TAGS[0]], // medias, digital
        event: null,
        seo: {
            metaTitle: 'Note Journalisme Digital | Christian Mamilo',
            metaDescription: 'Evolution du journalisme.',
            ogTitle: 'Note Journalisme Digital',
            ogDescription: 'Analyse courte.',
            ogImage: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1000',
            keywords: ['journalisme', 'digital']
        },
        publishedAt: '2024-03-02T11:00:00Z',
        scheduledAt: null,
        createdAt: '2024-03-02T11:00:00Z',
        updatedAt: '2024-03-02T11:00:00Z'
    },
    // --- ARTICLE 4 ---
    {
        id: 'post-7',
        title: 'Linguistique et Algorithmes : Un mariage complexe',
        slug: 'linguistique-algorithmes-mariage-complexe',
        type: 'article',
        status: 'published',
        excerpt: 'Comment les sciences du langage informent le développement des modèles de langage à grande échelle (LLM).',
        content: '<p>L\'analyse sémantique n\'a jamais été aussi importante qu\'à l\'heure où nous déléguons la production de texte à des machines...</p>',
        readingTime: 15,
        coverImage: {
            id: 'img-7',
            url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=1000',
            thumbnailUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=200',
            filename: 'linguistics-ia.jpg',
            uploadedAt: '2024-02-28T10:00:00Z',
            mimeType: 'image/jpeg',
            width: 1000,
            height: 600,
            size: 150000,
            alt: 'Books and tech'
        },
        author: MOCK_USER,
        category: MOCK_CATEGORIES[1],
        tags: [MOCK_TAGS[1], MOCK_TAGS[2], MOCK_TAGS[0]], // recherche, ia, digital
        event: null,
        seo: {
            metaTitle: 'Linguistique & IA | Christian Mamilo',
            metaDescription: 'Le role du langage dans l\'IA.',
            ogTitle: 'Linguistique & IA',
            ogDescription: 'Analyse academique.',
            ogImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=1000',
            keywords: ['linguistique', 'ia']
        },
        publishedAt: '2024-02-28T09:00:00Z',
        scheduledAt: null,
        createdAt: '2024-02-28T09:00:00Z',
        updatedAt: '2024-02-28T09:00:00Z'
    },
    // --- RECAP 2 ---
    {
        id: 'post-8',
        title: 'Séminaire : Stratégies de Com au Cameroun',
        slug: 'recap-seminaire-com-cameroun',
        type: 'recap',
        status: 'published',
        excerpt: 'Points clés de mon intervention sur l\'adaptation des modèles occidentaux au contexte local.',
        content: '<p>Intervenir à Douala m\'a permis de confronter mes théories à la réalité vibrante du marché camerounais...</p>',
        readingTime: 7,
        coverImage: {
            id: 'img-8',
            url: 'https://images.unsplash.com/photo-1528605248644-14dd04cb11c1?auto=format&fit=crop&q=80&w=1000',
            thumbnailUrl: 'https://images.unsplash.com/photo-1528605248644-14dd04cb11c1?auto=format&fit=crop&q=80&w=200',
            filename: 'seminar-douala.jpg',
            uploadedAt: '2024-02-25T10:00:00Z',
            mimeType: 'image/jpeg',
            width: 1000,
            height: 600,
            size: 150000,
            alt: 'Seminar dinner'
        },
        author: MOCK_USER,
        category: MOCK_CATEGORIES[0],
        tags: [MOCK_TAGS[4], MOCK_TAGS[3]], // afrique, strategie
        event: null,
        seo: {
            metaTitle: 'Seminaire Douala | Christian Mamilo',
            metaDescription: 'Intervention au Cameroun.',
            ogTitle: 'Seminaire Douala',
            ogDescription: 'Points cles.',
            ogImage: 'https://images.unsplash.com/photo-1528605248644-14dd04cb11c1?auto=format&fit=crop&q=80&w=1000',
            keywords: ['seminaire', 'cameroun']
        },
        publishedAt: '2024-02-25T20:00:00Z',
        scheduledAt: null,
        createdAt: '2024-02-25T20:00:00Z',
        updatedAt: '2024-02-25T20:00:00Z'
    },
    // --- ARTICLE 5 (Brouillon) ---
    {
        id: 'post-9',
        title: 'Le Futur de l\'Enseignement Hybride',
        slug: 'futur-enseignement-hybride',
        type: 'article',
        status: 'draft',
        excerpt: 'Brouillon d\'une étude sur la pérennité des modèles d\'apprentissage mixtes après la pandémie.',
        content: '<p>Nous sommes à un tournant. Le tout distanciel a montré ses limites, mais le retour au 100% présentiel est impossible...</p>',
        readingTime: 10,
        coverImage: {
            id: 'img-9',
            url: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=1000',
            thumbnailUrl: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=200',
            filename: 'hybrid-learning.jpg',
            uploadedAt: '2024-02-20T10:00:00Z',
            mimeType: 'image/jpeg',
            width: 1000,
            height: 600,
            size: 150000,
            alt: 'Student with laptop'
        },
        author: MOCK_USER,
        category: MOCK_CATEGORIES[3],
        tags: [MOCK_TAGS[5], MOCK_TAGS[1]], // education, recherche
        event: null,
        seo: {
            metaTitle: 'Futur Enseignement Hybride | Christian Mamilo',
            metaDescription: 'Etude en cours.',
            ogTitle: 'Futur Enseignement Hybride',
            ogDescription: 'Brouillon.',
            ogImage: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=1000',
            keywords: ['enseignement', 'digital']
        },
        publishedAt: null,
        scheduledAt: null,
        createdAt: '2024-02-20T10:00:00Z',
        updatedAt: '2024-02-21T15:00:00Z'
    },
    // --- ARTICLE 6 ---
    {
        id: 'post-10',
        title: 'Politique et Médias Sociaux en Afrique',
        slug: 'politique-medias-sociaux-afrique',
        type: 'article',
        status: 'published',
        excerpt: 'Comment les plateformes numériques redéfinissent l\'espace public et le débat politique sur le continent.',
        content: '<p>De Dakar à Nairobi, les réseaux sociaux sont devenus le nouveau champ de bataille des idées politiques...</p>',
        readingTime: 14,
        coverImage: {
            id: 'img-10',
            url: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&q=80&w=1000',
            thumbnailUrl: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&q=80&w=200',
            filename: 'africa-digital.jpg',
            uploadedAt: '2024-02-15T10:00:00Z',
            mimeType: 'image/jpeg',
            width: 1000,
            height: 600,
            size: 150000,
            alt: 'Digital map of Africa'
        },
        author: MOCK_USER,
        category: MOCK_CATEGORIES[2],
        tags: [MOCK_TAGS[4], MOCK_TAGS[7], MOCK_TAGS[0]], // afrique, medias, digital
        event: null,
        seo: {
            metaTitle: 'Politique & Social Media Afrique | Christian Mamilo',
            metaDescription: 'Analyse de l\'espace public africain.',
            ogTitle: 'Politique & Social Media Afrique',
            ogDescription: 'Etude sociologique.',
            ogImage: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&q=80&w=1000',
            keywords: ['afrique', 'politique']
        },
        publishedAt: '2024-02-15T08:00:00Z',
        scheduledAt: null,
        createdAt: '2024-02-15T08:00:00Z',
        updatedAt: '2024-02-15T08:00:00Z'
    }
];
