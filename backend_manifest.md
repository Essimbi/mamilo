# Manifest Technique — Backend Laravel du Blog Mamilo

> **Frontend :** Angular 17+ (SSR, Signals) — déjà production-ready
> **Backend :** Laravel 11 + PostgreSQL
> **Date :** Mars 2026

---

## 1. Stack Technique

| Couche | Technologie |
|---|---|
| Framework | **Laravel 11** |
| Base de données | **PostgreSQL** (ou MySQL 8+) |
| ORM | **Eloquent** (intégré à Laravel) |
| Authentification | **Laravel Sanctum** (tokens API) |
| Stockage médias | **Spatie Laravel MediaLibrary** + Cloudinary/S3 |
| Recherche | **PostgreSQL Full-Text** ou **Laravel Scout** |
| Cache | **Redis** via `predis/predis` |
| Email | **Laravel Mail** + Resend/Mailgun |
| Tâches planifiées | **Laravel Task Scheduler** (cron intégré) |
| File d'attente | **Laravel Queues** (Redis) |
| Documentation | **L5-Swagger** (`darkaonline/l5-swagger`) |

---

## 2. Création du Projet

```bash
composer create-project laravel/laravel mamilo-api
cd mamilo-api

# Packages essentiels
composer require laravel/sanctum
composer require spatie/laravel-medialibrary
composer require darkaonline/l5-swagger
composer require predis/predis
composer require intervention/image-laravel

# Dev
composer require --dev barryvdh/laravel-ide-helper
```

---

## 3. Structure du Projet

```
app/
├── Http/
│   ├── Controllers/Api/
│   │   ├── AuthController.php
│   │   ├── PostController.php
│   │   ├── EventController.php
│   │   ├── CategoryController.php
│   │   ├── TagController.php
│   │   ├── MediaController.php
│   │   ├── CommentController.php
│   │   ├── ProfileController.php
│   │   ├── SettingsController.php
│   │   ├── SearchController.php
│   │   └── NewsletterController.php
│   ├── Middleware/
│   │   └── AdminOnly.php
│   └── Requests/         ← FormRequest pour validation
├── Models/
│   ├── User.php
│   ├── Post.php
│   ├── Event.php
│   ├── Category.php
│   ├── Tag.php
│   ├── Comment.php
│   ├── SiteSetting.php
│   └── NewsletterSubscriber.php
├── Resources/            ← API Resources (transformation JSON)
│   ├── PostResource.php
│   ├── EventResource.php
│   └── ...
├── Policies/             ← Autorisations par rôle
└── Console/Commands/
    └── PublishScheduledPosts.php
database/
├── migrations/
└── seeders/
routes/
└── api.php
```

---

## 4. Base de Données — Migrations

### Users
```php
Schema::create('users', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->string('name');
    $table->string('email')->unique();
    $table->string('password');
    $table->text('bio')->default('');
    $table->enum('role', ['admin', 'editor'])->default('editor');
    $table->string('linkedin')->nullable();
    $table->string('twitter')->nullable();
    $table->string('researchgate')->nullable();
    $table->timestamps();
});
```

### Posts
```php
Schema::create('posts', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->string('title');
    $table->string('slug')->unique();
    $table->enum('type', ['article', 'note', 'recap'])->default('article');
    $table->enum('status', ['draft', 'published', 'scheduled', 'archived'])->default('draft');
    $table->text('excerpt');
    $table->longText('content');
    $table->integer('reading_time')->default(0);
    $table->integer('likes_count')->default(0);
    $table->timestamp('published_at')->nullable();
    $table->timestamp('scheduled_at')->nullable();
    $table->foreignUuid('author_id')->constrained('users');
    $table->foreignUuid('category_id')->constrained('categories');
    $table->foreignUuid('event_id')->nullable()->constrained('events')->nullOnDelete();
    $table->timestamps();
});
```

### SEO (relation 1-to-1 avec Post)
```php
Schema::create('post_seos', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->foreignUuid('post_id')->unique()->constrained()->cascadeOnDelete();
    $table->string('meta_title');
    $table->string('meta_description');
    $table->string('og_title');
    $table->string('og_description');
    $table->string('og_image');
    $table->string('canonical_url')->nullable();
    $table->json('keywords')->default('[]');
});
```

### Events
```php
Schema::create('events', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->string('title');
    $table->string('slug')->unique();
    $table->enum('type', ['conference', 'seminar', 'workshop', 'webinar', 'forum']);
    $table->longText('description');
    $table->string('city');
    $table->string('country');
    $table->string('venue');
    $table->boolean('is_online')->default(false);
    $table->string('online_url')->nullable();
    $table->dateTime('start_date');
    $table->dateTime('end_date');
    $table->string('external_url')->nullable();
    $table->enum('role', ['speaker', 'attendee', 'organizer'])->default('speaker');
    $table->enum('status', ['upcoming', 'ongoing', 'past'])->default('upcoming');
    $table->integer('likes_count')->default(0);
    $table->timestamps();
});
```

### Autres tables
```php
// categories
Schema::create('categories', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->string('name')->unique();
    $table->string('slug')->unique();
    $table->text('description')->default('');
    $table->string('color')->default('#1B3A6B');
    $table->string('icon')->default('book');
});

// tags
Schema::create('tags', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->string('name')->unique();
    $table->string('slug')->unique();
});

// post_tag (pivot)
Schema::create('post_tag', function (Blueprint $table) {
    $table->foreignUuid('post_id')->constrained()->cascadeOnDelete();
    $table->foreignUuid('tag_id')->constrained()->cascadeOnDelete();
    $table->primary(['post_id', 'tag_id']);
});

// comments
Schema::create('comments', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->foreignUuid('post_id')->constrained()->cascadeOnDelete();
    $table->string('author_name');
    $table->string('author_avatar');
    $table->text('content');
    $table->boolean('is_approved')->default(false);
    $table->timestamps();
});

// site_settings (singleton)
Schema::create('site_settings', function (Blueprint $table) {
    $table->string('id')->primary()->default('singleton');
    $table->string('site_name')->default('Blog Mamilo');
    $table->text('site_description')->default('');
    $table->json('keywords')->default('[]');
    $table->boolean('notify_comments')->default(true);
    $table->boolean('notify_newsletter')->default(true);
});

// newsletter_subscribers
Schema::create('newsletter_subscribers', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->string('email')->unique();
    $table->boolean('is_active')->default(true);
    $table->string('unsubscribe_token')->unique();
    $table->timestamp('subscribed_at')->useCurrent();
});
```

---

## 5. Modèles Eloquent (exemples clés)

### Post.php
```php
class Post extends Model
{
    use HasUuids, HasFactory;

    protected $casts = [
        'published_at' => 'datetime',
        'scheduled_at' => 'datetime',
    ];

    public function author()   { return $this->belongsTo(User::class, 'author_id'); }
    public function category() { return $this->belongsTo(Category::class); }
    public function event()    { return $this->belongsTo(Event::class)->withDefault(); }
    public function tags()     { return $this->belongsToMany(Tag::class); }
    public function comments() { return $this->hasMany(Comment::class); }
    public function seo()      { return $this->hasOne(PostSeo::class); }
    public function coverImage(){ return $this->media()->where('collection_name', 'cover'); }
}
```

### User.php
```php
class User extends Authenticatable
{
    use HasApiTokens, HasUuids, HasFactory, InteractsWithMedia;

    public function posts() { return $this->hasMany(Post::class, 'author_id'); }

    // Accesseur pour retourner le shape attendu par le front
    public function getAvatarAttribute()
    {
        $media = $this->getFirstMedia('avatar');
        return $media ? [
            'id'           => $media->uuid,
            'url'          => $media->getFullUrl(),
            'thumbnailUrl' => $media->getFullUrl('thumb'),
            'filename'     => $media->file_name,
            'mimeType'     => $media->mime_type,
            'width'        => $media->getCustomProperty('width', 0),
            'height'       => $media->getCustomProperty('height', 0),
            'size'         => $media->size,
            'alt'          => $media->getCustomProperty('alt', ''),
        ] : null;
    }
}
```

---

## 6. Routes API

```php
// routes/api.php
Route::prefix('v1')->group(function () {

    // === PUBLIQUES ===
    Route::post('auth/login',  [AuthController::class, 'login']);
    Route::post('auth/refresh',[AuthController::class, 'refresh']);

    Route::get('posts',               [PostController::class, 'index']);
    Route::get('posts/{slug}',        [PostController::class, 'show']);
    Route::post('posts/{id}/like',    [PostController::class, 'like']);
    Route::post('posts/{id}/comments',[CommentController::class, 'store']);

    Route::get('events',              [EventController::class, 'index']);
    Route::get('events/{slug}',       [EventController::class, 'show']);
    Route::post('events/{id}/like',   [EventController::class, 'like']);

    Route::get('categories', [CategoryController::class, 'index']);
    Route::get('tags',        [TagController::class, 'index']);
    Route::get('search',      [SearchController::class, 'index']);
    Route::get('settings',    [SettingsController::class, 'show']);

    Route::post('newsletter/subscribe',   [NewsletterController::class, 'subscribe']);
    Route::delete('newsletter/unsubscribe',[NewsletterController::class, 'unsubscribe']);

    // === AUTHENTIFIÉES ===
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::get('auth/me',      [AuthController::class, 'me']);

        Route::get('profile',  [ProfileController::class, 'show']);
        Route::put('profile',  [ProfileController::class, 'update']);
        Route::put('settings', [SettingsController::class, 'update']);

        Route::post('media/upload', [MediaController::class, 'upload']);
        Route::get('media',         [MediaController::class, 'index']);
        Route::delete('media/{id}', [MediaController::class, 'destroy']);

        // === ADMIN SEULEMENT ===
        Route::middleware('role:admin')->group(function () {
            Route::apiResource('posts',      PostController::class)->except(['index', 'show']);
            Route::apiResource('events',     EventController::class)->except(['index', 'show']);
            Route::apiResource('categories', CategoryController::class)->except(['index']);
            Route::apiResource('tags',       TagController::class)->except(['index']);

            Route::get('comments',              [CommentController::class, 'index']);
            Route::put('comments/{id}/approve', [CommentController::class, 'approve']);
            Route::delete('comments/{id}',      [CommentController::class, 'destroy']);

            Route::get('newsletter/subscribers', [NewsletterController::class, 'subscribers']);
        });
    });
});
```

---

## 7. Contrat des Endpoints Principaux

### `POST /v1/auth/login`
```json
// Request
{ "email": "admin@mamilo.com", "password": "secret" }

// Response 200
{
  "accessToken": "1|abc123...",
  "user": {
    "id": "uuid", "name": "Christian Mamilo", "email": "admin@mamilo.com",
    "bio": "...", "role": "admin",
    "avatar": { "id": "uuid", "url": "https://cdn.../image.jpg", "thumbnailUrl": "..." },
    "social": { "linkedin": "...", "twitter": "...", "researchgate": "..." },
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

> Le frontend stocke ce token dans `localStorage['mamilo_auth_token']` et l'envoie automatiquement en header `Authorization: Bearer <token>`.

### `GET /v1/posts?type=article&page=1&limit=20`
```json
{
  "items": [ /* Post[] */ ],
  "total": 48
}
```

### Contrat [Post](file:///home/essimbi/work_space/3cm/blog/src/app/core/models/post.model.ts#20-42) (réponse complète)
```json
{
  "id": "uuid",
  "title": "Folies numériques",
  "slug": "folies-numeriques",
  "type": "article",
  "status": "published",
  "excerpt": "...",
  "content": "<p>HTML...</p>",
  "readingTime": 7,
  "likesCount": 42,
  "publishedAt": "2024-03-01T00:00:00Z",
  "scheduledAt": null,
  "createdAt": "2024-02-28T00:00:00Z",
  "updatedAt": "2024-03-01T00:00:00Z",
  "author": {
    "id": "uuid", "name": "...", "bio": "...",
    "avatar": { "id": "...", "url": "...", "thumbnailUrl": "..." },
    "social": {}
  },
  "category": { "id": "uuid", "name": "Éthique", "slug": "ethique", "color": "#1B3A6B", "icon": "book", "postCount": 12 },
  "coverImage": { "id": "uuid", "url": "https://cdn.../image.jpg", "thumbnailUrl": "...", "alt": "..." },
  "tags": [{ "id": "uuid", "name": "IA", "slug": "ia", "postCount": 5 }],
  "event": null,
  "seo": {
    "metaTitle": "...", "metaDescription": "...", "ogTitle": "...",
    "ogDescription": "...", "ogImage": "...", "canonicalUrl": "...", "keywords": []
  },
  "comments": [
    { "id": "uuid", "postId": "uuid", "authorName": "...", "authorAvatar": "...",
      "content": "...", "isApproved": true, "createdAt": "..." }
  ]
}
```

### `GET /v1/events?status=upcoming` → `Event[]`
```json
{
  "id": "uuid", "title": "Forum IA", "slug": "forum-ia-2024",
  "type": "conference", "description": "...",
  "location": { "city": "Stockholm", "country": "Sweden", "venue": "...", "isOnline": false },
  "startDate": "2024-10-01T09:00:00Z", "endDate": "2024-10-01T17:00:00Z",
  "role": "speaker", "status": "past", "likesCount": 18,
  "externalUrl": null, "recap": null,
  "coverImage": { "id": "...", "url": "...", "thumbnailUrl": "...", "alt": "..." },
  "createdAt": "..."
}
```

---

## 8. Contrôleurs — Exemples clés

### PostController.php
```php
class PostController extends Controller
{
    public function index(Request $request)
    {
        $query = Post::with(['author', 'category', 'tags', 'seo', 'comments'])
            ->when($request->type,     fn($q) => $q->where('type', $request->type))
            ->when($request->category, fn($q) => $q->whereHas('category', fn($c) => $c->where('slug', $request->category)))
            ->when($request->tag,      fn($q) => $q->whereHas('tags', fn($t) => $t->where('slug', $request->tag)))
            ->when($request->search,   fn($q) => $q->where(fn($s) =>
                $s->where('title', 'ILIKE', "%{$request->search}%")
                  ->orWhere('excerpt', 'ILIKE', "%{$request->search}%")
            ))
            ->when(!auth()->check(),   fn($q) => $q->where('status', 'published'))
            ->latest('published_at');

        $paginated = $query->paginate($request->get('limit', 20));

        return response()->json([
            'items' => PostResource::collection($paginated->items()),
            'total' => $paginated->total(),
        ]);
    }

    public function store(CreatePostRequest $request)
    {
        $data = $request->validated();
        $data['slug']         = $this->generateSlug($data['title'], Post::class);
        $data['reading_time'] = $this->calculateReadingTime($data['content']);
        $data['author_id']    = auth()->id();

        $post = Post::create($data);
        $post->tags()->sync($data['tag_ids'] ?? []);
        $post->seo()->create($data['seo'] ?? []);

        return new PostResource($post->load(['author', 'category', 'tags', 'seo', 'comments']));
    }

    public function like(string $id)
    {
        $post = Post::findOrFail($id);
        $post->increment('likes_count');
        return response()->json(['likesCount' => $post->likes_count]);
    }
}
```

---

## 9. Logique Métier Importante

### 9.1 Auto-calcul `readingTime`
```php
private function calculateReadingTime(string $html): int
{
    $text = strip_tags($html);
    $words = str_word_count($text);
    return (int) ceil($words / 200); // 200 mots/min
}
```

### 9.2 Auto-génération de `slug` unique
```php
private function generateSlug(string $title, string $model): string
{
    $slug = Str::slug($title);
    $count = $model::where('slug', 'LIKE', "{$slug}%")->count();
    return $count ? "{$slug}-{$count}" : $slug;
}
```

### 9.3 Publication différée (Scheduled Posts)
```php
// app/Console/Commands/PublishScheduledPosts.php
class PublishScheduledPosts extends Command
{
    protected $signature = 'posts:publish-scheduled';

    public function handle()
    {
        Post::where('status', 'scheduled')
            ->where('scheduled_at', '<=', now())
            ->update(['status' => 'published', 'published_at' => now()]);
    }
}

// bootstrap/app.php — Scheduler
->withSchedule(function (Schedule $schedule) {
    $schedule->command('posts:publish-scheduled')->everyFiveMinutes();
    $schedule->command('events:update-status')->daily();
})
```

### 9.4 Mise à jour automatique du statut des événements
```php
class UpdateEventStatuses extends Command
{
    protected $signature = 'events:update-status';

    public function handle()
    {
        Event::where('end_date', '<', now())
             ->where('status', '!=', 'past')
             ->update(['status' => 'past']);

        Event::where('start_date', '<=', now())
             ->where('end_date', '>=', now())
             ->update(['status' => 'ongoing']);
    }
}
```

### 9.5 Upload de médias (Spatie)
```php
class MediaController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpeg,png,webp,gif|max:10240'
        ]);

        // Entité temporaire pour attacher via Spatie
        $media = (new User)->addMedia($request->file('file'))
            ->withCustomProperties([
                'alt'    => $request->input('alt', ''),
                'width'  => 0,
                'height' => 0,
            ])
            ->toMediaCollection('uploads');

        return response()->json([
            'id'           => $media->uuid,
            'url'          => $media->getFullUrl(),
            'thumbnailUrl' => $media->getFullUrl('thumb'),
            'filename'     => $media->file_name,
            'mimeType'     => $media->mime_type,
            'size'         => $media->size,
            'alt'          => $media->getCustomProperty('alt', ''),
            'uploadedAt'   => $media->created_at->toISOString(),
        ]);
    }
}
```

---

## 10. Authentification avec Sanctum

```php
// config/sanctum.php
'expiration' => 60 * 24 * 7, // 7 jours en minutes

// AuthController.php
public function login(LoginRequest $request)
{
    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Identifiants invalides'], 401);
    }

    $token = $user->createToken('mamilo-api')->plainTextToken;

    return response()->json([
        'accessToken' => $token,
        'user'        => new UserResource($user),
    ]);
}

public function logout(Request $request)
{
    $request->user()->currentAccessToken()->delete();
    return response()->json(['message' => 'Déconnecté']);
}
```

---

## 11. Sécurité

| Mesure | Laravel |
|---|---|
| Hachage mots de passe | `Hash::make()` — bcrypt par défaut |
| Rate limiting login | `RateLimiter` dans `AppServiceProvider` — 5 req/min |
| Validation | `FormRequest` sur tous les endpoints |
| Sanitisation HTML | `HTMLPurifier` via `mewebstudio/purifier` |
| Headers sécurité | `barryvdh/laravel-cors` + Middleware `SecureHeaders` |
| Rôles | Middleware `AdminOnly` + `Gate::define` |
| CORS | `config/cors.php` — `allowed_origins: ['https://mamilo.com']` |

```php
// AppServiceProvider.php — Rate limiting
RateLimiter::for('login', function (Request $request) {
    return Limit::perMinute(5)->by($request->email . $request->ip());
});
```

---

## 12. Variables d'Environnement

```env
APP_NAME="Mamilo Blog API"
APP_ENV=production
APP_URL=https://api.mamilo.com

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=mamilo_blog
DB_USERNAME=mamilo
DB_PASSWORD=secret

# Sanctum
SANCTUM_STATEFUL_DOMAINS=mamilo.com

# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
CACHE_DRIVER=redis
QUEUE_CONNECTION=redis

# Cloudinary (ou S3)
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
MEDIA_DISK=cloudinary

# Email
MAIL_MAILER=smtp
MAIL_HOST=smtp.resend.com
MAIL_PORT=587
MAIL_USERNAME=resend
MAIL_PASSWORD=re_...
MAIL_FROM_ADDRESS=no-reply@mamilo.com
ADMIN_EMAIL=admin@mamilo.com
```

---

## 13. Intégration avec le Frontend Angular

La migration mock → production ne nécessite **qu'une seule ligne** modifiée dans [app.config.ts](file:///home/essimbi/work_space/3cm/blog/src/app/app.config.ts) :

```typescript
// AVANT (données simulées)
{ provide: IContentService, useClass: ContentMockService }

// APRÈS (API Laravel)
{ provide: IContentService, useClass: ContentHttpService }
```

Le `ContentHttpService` implémente la même interface [IContentService](file:///home/essimbi/work_space/3cm/blog/src/app/core/services/content.interface.ts#21-54) et pointe vers `https://api.mamilo.com/v1`. Aucune autre modification du frontend.

---

## 14. Plan d'Implémentation (6 semaines)

```
Phase 1 — Setup & Auth (sem. 1)
  ├── laravel new mamilo-api + config PostgreSQL/Redis
  ├── Toutes les migrations + seeders
  ├── Sanctum + AuthController (login, logout, me)
  ├── Middleware AdminOnly + FormRequests
  └── Tests Feature: auth

Phase 2 — Contenu (sem. 2-3)
  ├── Modèles + Relations Eloquent
  ├── API Resources (transformation JSON exacte)
  ├── PostController (CRUD + filtres + pagination + like)
  ├── CommentController (create + modération)
  ├── CategoryController + TagController
  └── Tests Feature: posts, comments

Phase 3 — Médias & Profil (sem. 4)
  ├── Spatie MediaLibrary + upload Cloudinary
  ├── MediaController
  ├── ProfileController + SettingsController
  └── Tests Feature: media, profile

Phase 4 — Événements & Newsletter (sem. 5)
  ├── EventController (CRUD + like)
  ├── SearchController (Full-Text ILIKE)
  ├── NewsletterController (subscribe + email confirmation)
  ├── Commands: publish-scheduled + update-event-status
  └── Task Scheduler

Phase 5 — Production (sem. 6)
  ├── Redis cache sur routes publiques (60s TTL)
  ├── Rate limiting (login, API globale)
  ├── L5-Swagger — documentation API complète
  ├── Tests E2E (Feature Tests Laravel)
  └── Déploiement (Railway / Forge + VPS / Laravel Vapor)
```
