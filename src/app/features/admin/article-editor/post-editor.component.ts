import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { GlobalStateService } from '../../../core/services/global-state.service';
import { ContentStore } from '../../../core/services/content-store.service';
import { IContentService } from '../../../core/services/content.interface';
import { Post, ContentBlock } from '../../../core/models/post.model';
import { MediaPickerComponent } from '../../../shared/components/media-picker.component';
import { MediaAsset } from '../../../core/models/user.model';

@Component({
  selector: 'app-post-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, RouterModule, MediaPickerComponent],
  styleUrl: './post-editor.component.scss',
  template: `
    <div class="editor-container">
      <header class="editor-header">
        <div class="header-left">
          <button routerLink="/admin" class="btn-back">
            <lucide-icon name="arrow-left" size="18"></lucide-icon>
          </button>
          <h1>{{ isEditMode() ? 'Modifier l\\'article' : 'Nouvel Article' }}</h1>
        </div>
        <div class="header-right">
          <button type="button" class="btn-save" (click)="onSubmit()" [disabled]="isLoading()">
            <span *ngIf="!isLoading()">{{ isEditMode() ? 'Mettre à jour' : 'Publier' }}</span>
            <span *ngIf="isLoading()" class="loader"></span>
          </button>
        </div>
      </header>

      <form [formGroup]="postForm" class="editor-form">
        <!-- Main Content -->
        <div class="editor-main">
          <!-- Server Error Banner -->
          <div *ngIf="serverErrorAlert()" class="server-error-banner">
             <lucide-icon name="alert-triangle" size="18"></lucide-icon>
             <p>{{ serverErrorAlert() }}</p>
          </div>

          <div class="form-section card">
            <input formControlName="title" placeholder="Titre de l'article..." class="title-input" (input)="updateSlug()">
            <div *ngIf="hasError('title')" class="error-msg">{{ getError('title') }}</div>
            
            <div class="slug-display" *ngIf="postForm.get('slug')?.value">
              <lucide-icon name="link" size="14"></lucide-icon>
              <span>{{ postForm.get('slug')?.value }}</span>
            </div>

            <textarea formControlName="excerpt" placeholder="Court résumé de l'article..." class="excerpt-input" rows="2"></textarea>
            <div *ngIf="hasError('excerpt')" class="error-msg">{{ getError('excerpt') }}</div>
          </div>

          <!-- BLOCK EDITOR -->
          <div class="block-editor card">
            <div class="block-editor-header">
               <h3>Contenu de l'article (Blocs)</h3>
               <div class="block-toolbar">
                  <button type="button" class="btn-add-block" (click)="addBlock('paragraph')"><lucide-icon name="type" size="16"></lucide-icon> TXT</button>
                  <button type="button" class="btn-add-block" (click)="addBlock('heading')"><lucide-icon name="heading-2" size="16"></lucide-icon> Titre</button>
                  <button type="button" class="btn-add-block" (click)="addBlock('image')"><lucide-icon name="image" size="16"></lucide-icon> Image</button>
                  <button type="button" class="btn-add-block" (click)="addBlock('quote')"><lucide-icon name="quote" size="16"></lucide-icon> Citation</button>
               </div>
            </div>
            
            <div formArrayName="blocks" class="blocks-list">
               <div *ngFor="let blockGroup of blocksArray.controls; let i = index" [formGroupName]="i" class="block-item">
                  <div class="block-controls">
                     <span class="block-number">#{{ i + 1 }}</span>
                     <span class="block-type">{{ blockGroup.get('type')?.value }}</span>
                     <div class="block-actions">
                        <button type="button" (click)="moveBlock(i, -1)" [disabled]="i === 0"><lucide-icon name="arrow-up" size="14"></lucide-icon></button>
                        <button type="button" (click)="moveBlock(i, 1)" [disabled]="i === blocksArray.length - 1"><lucide-icon name="arrow-down" size="14"></lucide-icon></button>
                        <button type="button" class="btn-delete-block" (click)="removeBlock(i)"><lucide-icon name="trash" size="14"></lucide-icon></button>
                     </div>
                  </div>
                  
                  <div formGroupName="content" class="block-body">
                     <!-- Paragraph -->
                     <textarea *ngIf="blockGroup.get('type')?.value === 'paragraph'" formControlName="text" class="block-input" rows="3" placeholder="Texte du paragraphe..."></textarea>
                     
                     <!-- Heading -->
                     <ng-container *ngIf="blockGroup.get('type')?.value === 'heading'">
                        <select formControlName="level" class="block-input small">
                           <option [value]="1">H1 (Titre principal)</option>
                           <option [value]="2">H2 (Sous-titre)</option>
                           <option [value]="3">H3 (Sous-section)</option>
                           <option [value]="4">H4 (Petite section)</option>
                        </select>
                        <input formControlName="text" class="block-input" placeholder="Titre...">
                     </ng-container>

                     <!-- Image -->
                     <ng-container *ngIf="blockGroup.get('type')?.value === 'image'">
                        <div class="image-picker-container">
                           <div class="image-preview-mini" *ngIf="blockGroup.get('content.url')?.value">
                              <img [src]="blockGroup.get('content.url')?.value" alt="Preview">
                           </div>
                           <div class="image-picker-actions">
                              <button type="button" class="btn-outline-sm" (click)="openMediaPicker('block', i)">
                                 <lucide-icon name="image" size="14"></lucide-icon>
                                 {{ blockGroup.get('content.url')?.value ? 'Changer l\\'image' : 'Choisir une image' }}
                              </button>
                              <input formControlName="url" class="block-input" placeholder="URL de l'image (ou via sélecteur)">
                           </div>
                        </div>
                        <input formControlName="caption" class="block-input" placeholder="Légende de l'image (optionnel)...">
                     </ng-container>

                     <!-- Quote -->
                     <ng-container *ngIf="blockGroup.get('type')?.value === 'quote'">
                        <textarea formControlName="text" class="block-input quote-text" rows="2" placeholder="Citation..."></textarea>
                        <input formControlName="caption" class="block-input" placeholder="Auteur (optionnel)...">
                     </ng-container>
                  </div>
               </div>
               
               <div *ngIf="blocksArray.length === 0" class="empty-blocks">
                  <p>Aucun bloc. Commencez par ajouter un paragraphe ou un titre !</p>
               </div>
            </div>
            <div *ngIf="hasError('blocks')" class="error-msg">{{ getError('blocks') }}</div>
          </div>
          
          <!-- SEO Settings -->
          <div class="seo-section card" formGroupName="seo">
            <h3>Paramètres SEO</h3>
            <div class="field-group">
               <label>Meta Title</label>
               <input formControlName="meta_title" class="select-input" placeholder="Titre SEO (max 60 car.)">
            </div>
            <div class="field-group">
               <label>Meta Description</label>
               <textarea formControlName="meta_description" class="select-input" rows="2" placeholder="Description SEO..."></textarea>
            </div>
            <div class="field-group">
               <label>URL OpenGraph Image</label>
               <input formControlName="og_image" class="select-input" placeholder="URL Image SEO">
            </div>
          </div>
        </div>

        <!-- Sidebar Settings -->
        <aside class="editor-sidebar">
           <div class="sidebar-box card">
              <div class="field-group">
                 <label>Statut</label>
                 <select formControlName="status" class="select-input">
                    <option value="draft">Brouillon</option>
                    <option value="review">En Révision</option>
                    <option value="scheduled">Planifié</option>
                    <option value="published">Publié</option>
                    <option value="archived">Archivé</option>
                 </select>
                 <div *ngIf="hasError('status')" class="error-msg">{{ getError('status') }}</div>
              </div>

              <div class="field-group">
                 <label>Type de publication</label>
                 <select formControlName="type" class="select-input">
                    <option value="article">Article</option>
                    <option value="note">Note d'intention</option>
                    <option value="recap">Récapitulatif</option>
                 </select>
              </div>

              <div class="field-group">
                 <label>Catégories</label>
                 <div class="tags-selector">
                   <div class="tag-badges" *ngIf="selectedCategories().length > 0">
                     <span *ngFor="let cat of selectedCategories()" class="tag-badge category-badge">
                       {{ cat.name }}
                       <button type="button" (click)="removeCategory(cat)" class="btn-remove-tag">&times;</button>
                     </span>
                   </div>
                   <select (change)="onCategorySelect($event)" class="select-input">
                     <option value="">Ajouter une catégorie...</option>
                     <option *ngFor="let cat of availableCategories()" [value]="cat.id">
                       {{ cat.name }}
                     </option>
                   </select>
                 </div>
                 <div *ngIf="hasError('category_ids')" class="error-msg">{{ getError('category_ids') }}</div>
              </div>
              
              <div class="field-group">
                 <label>Image de couverture</label>
                 <div class="cover-picker-box">
                    <div class="cover-preview" *ngIf="getAssetUrl(postForm.get('coverImageId')?.value || null) as url">
                       <img [src]="url" alt="Cover preview">
                       <button type="button" class="btn-remove-cover" (click)="postForm.patchValue({coverImageId: ''})">&times;</button>
                    </div>
                    <button type="button" class="btn-picker-trigger" (click)="openMediaPicker('cover')">
                       <lucide-icon name="image" size="18"></lucide-icon>
                       <span>{{ postForm.get('coverImageId')?.value ? 'Changer l\\'image' : 'Sélectionner une couverture' }}</span>
                    </button>
                    <input type="hidden" formControlName="coverImageId">
                 </div>
                 <div *ngIf="hasError('coverImageId')" class="error-msg">{{ getError('coverImageId') }}</div>
              </div>

              <div class="field-group">
                 <label>Date de publication</label>
                 <input type="datetime-local" formControlName="publishedAt" class="select-input">
              </div>

              <div class="field-group">
                 <label>Tags</label>
                 <div class="tags-selector">
                   <div class="tag-badges" *ngIf="selectedTags().length > 0">
                     <span *ngFor="let tag of selectedTags()" class="tag-badge">
                       {{ tag.name }}
                       <button type="button" (click)="removeTag(tag)" class="btn-remove-tag">&times;</button>
                     </span>
                   </div>
                   <select (change)="onTagSelect($event)" class="select-input">
                     <option value="">Ajouter un tag...</option>
                     <option *ngFor="let tag of availableTags()" [value]="tag.id">
                       {{ tag.name }}
                     </option>
                   </select>
                 </div>
              </div>
           </div>
        </aside>
      </form>
      
      <!-- Media Picker Modal -->
      <app-media-picker 
        *ngIf="isMediaPickerOpen()"
        [title]="mediaPickerTarget()?.type === 'cover' ? 'Choisir la couverture' : 'Choisir une image pour le bloc'"
        (select)="onMediaSelected($event)"
        (close)="isMediaPickerOpen.set(false)">
      </app-media-picker>
    </div>
  `
})
export class PostEditorComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private state = inject(GlobalStateService);
  private store = inject(ContentStore);
  private contentService = inject(IContentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditMode = signal(false);
  editingPostId = signal<string | null>(null);

  categories = this.state.categories;
  availableTags = this.state.tags;
  selectedTags = signal<any[]>([]);
  selectedCategories = signal<any[]>([]);
  isLoading = this.state.isLoading;

  serverErrors = signal<Record<string, string>>({});
  serverErrorAlert = signal<string | null>(null);

  isMediaPickerOpen = signal(false);
  mediaPickerTarget = signal<{type: 'cover' | 'block', index?: number} | null>(null);

  media = this.state.media;

  postForm = this.fb.group({
    title: ['', [Validators.required]],
    slug: [''],
    excerpt: [''],
    status: ['draft', [Validators.required]],
    type: ['article'],
    coverImageId: [''],
    publishedAt: [''],
    blocks: this.fb.array([], [Validators.required]),
    seo: this.fb.group({
      meta_title: [''],
      meta_description: [''],
      og_image: [''],
      keywords: [[] as string[]]
    })
  });

  get blocksArray() {
    return this.postForm.get('blocks') as FormArray;
  }

  ngOnInit(): void {
    // Ensure media list is available for previews
    this.store.loadMedia();
    
    this.route.params.subscribe(params => {
      if (params['slug']) {
        // ALWAYS fetch from API to ensure blocks and all relations are loaded
        this.contentService.getPostBySlug(params['slug']).subscribe(post => {
          if (post) {
            this.loadPostForEdit(post);
          }
        });
      }
    });
  }

  ngOnDestroy(): void {}

  private loadPostForEdit(post: Post) {
    this.isEditMode.set(true);
    this.editingPostId.set(post.id);
    this.selectedTags.set(post.tags || []);
    this.selectedCategories.set(post.categories || (post.category ? [post.category] : []));
    
    // Clear blocks
    while (this.blocksArray.length !== 0) {
      this.blocksArray.removeAt(0);
    }

    // Populate blocks
    if (post.blocks && post.blocks.length) {
       post.blocks.forEach(block => {
          this.blocksArray.push(this.createBlockGroup(block.type, block.content));
       });
    }

    this.postForm.patchValue({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      status: post.status,
      type: post.type || 'article',
      coverImageId: post.coverImage?.id || '',
      publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : '',
      seo: post.seo || { meta_title: '', meta_description: '', og_image: '' }
    });
  }

  createBlockGroup(type: string, initialContent: any = {}): FormGroup {
     return this.fb.group({
        type: [type, Validators.required],
        position: [this.blocksArray.length],
        content: this.fb.group({
           text: [initialContent.text || ''],
           level: [initialContent.level || 2],
           url: [initialContent.url || ''],
           caption: [initialContent.caption || '']
        })
     });
  }

  addBlock(type: string) {
     this.blocksArray.push(this.createBlockGroup(type));
  }

  removeBlock(index: number) {
     this.blocksArray.removeAt(index);
     this.updatePositions();
  }

  moveBlock(index: number, dir: number) {
     const newIndex = index + dir;
     if (newIndex < 0 || newIndex >= this.blocksArray.length) return;
     const currentGroup = this.blocksArray.at(index);
     this.blocksArray.removeAt(index);
     this.blocksArray.insert(newIndex, currentGroup);
     this.updatePositions();
  }

  private updatePositions() {
     this.blocksArray.controls.forEach((ctrl, idx) => {
        ctrl.get('position')?.setValue(idx + 1);
     });
  }

  updateSlug() {
    if (!this.isEditMode()) {
      const slug = this.postForm.get('title')?.value
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      this.postForm.patchValue({ slug });
    }
  }

  onTagSelect(event: any) {
    const tagId = event.target.value;
    if (!tagId) return;
    const tag = this.availableTags().find(t => t.id === tagId);
    if (tag && !this.selectedTags().find(t => t.id === tagId)) {
      this.selectedTags.update(tags => [...tags, tag]);
    }
    event.target.value = '';
  }

  removeTag(tag: any) {
    this.selectedTags.update(tags => tags.filter(t => t.id !== tag.id));
  }

  // --- Categories multi-select ---
  availableCategories = computed(() => {
    const selectedIds = this.selectedCategories().map(c => c.id);
    return this.categories().filter(c => !selectedIds.includes(c.id));
  });

  onCategorySelect(event: any) {
    const catId = event.target.value;
    if (!catId) return;
    const cat = this.categories().find(c => c.id === catId);
    if (cat && !this.selectedCategories().find(c => c.id === catId)) {
      this.selectedCategories.update(cats => [...cats, cat]);
    }
    event.target.value = '';
  }

  removeCategory(cat: any) {
    this.selectedCategories.update(cats => cats.filter(c => c.id !== cat.id));
  }

  hasError(controlName: string): boolean {
    return this.serverErrors()[controlName] !== undefined || 
           (this.postForm.get(controlName)?.invalid && (this.postForm.get(controlName)?.dirty || this.postForm.get(controlName)?.touched)) || false;
  }

  getError(controlName: string): string {
    return this.serverErrors()[controlName] || 'Ce champ est requis / invalide';
  }

  // --- Media Picker logic ---
  getAssetUrl(id: string | null): string | null {
    if (!id) return null;
    return this.media().find(m => m.id === id)?.url || null;
  }

  openMediaPicker(type: 'cover' | 'block', index?: number) {
    this.mediaPickerTarget.set({ type, index });
    this.isMediaPickerOpen.set(true);
  }

  onMediaSelected(asset: MediaAsset) {
    const target = this.mediaPickerTarget();
    if (!target) return;

    if (target.type === 'cover') {
      this.postForm.patchValue({ coverImageId: asset.id });
    } else if (target.type === 'block' && target.index !== undefined) {
      const block = this.blocksArray.at(target.index);
      block.get('content.url')?.setValue(asset.url);
      // We could also store the media ID if the backend expects it, 
      // but for now blocks use direct URLs.
    }
    this.isMediaPickerOpen.set(false);
  }

  onSubmit() {
    this.serverErrors.set({});
    this.serverErrorAlert.set(null);

    // Filter empty tags, ensure blocks array is sorted by position
    this.updatePositions();

    const formValue = this.postForm.value;

    // Clean blocks: remove empty/irrelevant fields per block type
    const cleanedBlocks = (formValue.blocks || []).map((block: any, idx: number) => {
      const cleaned: any = { type: block.type, position: idx + 1 };
      const content: any = {};
      switch (block.type) {
        case 'paragraph':
          content.text = block.content?.text || '';
          break;
        case 'heading':
          content.text = block.content?.text || '';
          content.level = Number(block.content?.level) || 2;
          break;
        case 'image':
          content.url = block.content?.url || '';
          if (block.content?.caption) content.caption = block.content.caption;
          break;
        case 'quote':
          content.text = block.content?.text || '';
          if (block.content?.caption) content.caption = block.content.caption;
          break;
      }
      cleaned.content = content;
      return cleaned;
    });

    const postData: any = {
      title: formValue.title,
      slug: formValue.slug,
      excerpt: formValue.excerpt,
      status: formValue.status,
      type: formValue.type,
      categories: this.selectedCategories(),
      tags: this.selectedTags(),
      seo: formValue.seo,
      blocks: cleanedBlocks,
    };
    if (formValue.coverImageId) {
       postData.coverImage = { id: formValue.coverImageId };
    }
    if (formValue.publishedAt) {
       postData.publishedAt = new Date(formValue.publishedAt).toISOString();
    }

    const obs$ = this.isEditMode() && this.editingPostId() 
      ? this.store.updatePost(this.editingPostId()!, postData)
      : this.store.createPost(postData);

    obs$.subscribe({
      next: () => this.router.navigate(['/admin/articles']), // Assuming list is at /admin/articles or /admin
      error: (err) => {
        if (err.status === 422 && err.error?.errors) {
           this.serverErrors.set(err.error.errors);
           this.serverErrorAlert.set('Le formulaire contient des erreurs de validation.');
        } else {
           this.serverErrorAlert.set('Une erreur inattendue est survenue.');
        }
      }
    });
  }
}
