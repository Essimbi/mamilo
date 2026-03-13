import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { LucideAngularModule } from 'lucide-angular';
import { GlobalStateService } from '../../../core/services/global-state.service';
import { ContentStore } from '../../../core/services/content-store.service';
import { Post } from '../../../core/models/post.model';
import { catchError, of, take } from 'rxjs';

@Component({
   selector: 'app-post-editor',
   standalone: true,
   imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, RouterModule],
   styleUrl: './post-editor.component.scss',
   template: `
    <div class="editor-container">
      <header class="editor-header">
        <div class="header-left">
          <button routerLink="/admin" class="btn-back">
            <lucide-icon name="arrow-left" size="18"></lucide-icon>
          </button>
          <h1>{{ isEditMode() ? 'Modifier l\'article' : 'Nouvel Article' }}</h1>
        </div>
        <div class="header-right">
          <button 
            type="button" 
            class="btn-save" 
            (click)="onSubmit()"
            [disabled]="postForm.invalid || isLoading()"
          >
            <span *ngIf="!isLoading()">{{ isEditMode() ? 'Mettre à jour' : 'Publier' }}</span>
            <span *ngIf="isLoading()" class="loader"></span>
          </button>
        </div>
      </header>

      <form [formGroup]="postForm" class="editor-form">
        <!-- Main Content (Left) -->
        <div class="editor-main">
          <div class="form-section card">
            <input 
              formControlName="title"
              placeholder="Titre de l'article..."
              class="title-input"
              (input)="updateSlug()"
            >
            
            <div class="slug-display" *ngIf="postForm.get('slug')?.value">
              <lucide-icon name="link" size="14"></lucide-icon>
              <span>{{ postForm.get('slug')?.value }}</span>
            </div>

            <textarea 
              formControlName="excerpt" 
              placeholder="Court résumé de l'article (max 160 caractères)..."
              class="excerpt-input"
              rows="2"
            ></textarea>
          </div>

          <div class="tiptap-wrapper card">
            <!-- TipTap Toolbar -->
            <div class="tiptap-toolbar">
               <button type="button" (click)="editor.chain().focus().toggleBold().run()" [class.active]="editor.isActive('bold')" class="btn-tool">
                  <lucide-icon name="bold" size="18"></lucide-icon>
               </button>
               <button type="button" (click)="editor.chain().focus().toggleItalic().run()" [class.active]="editor.isActive('italic')" class="btn-tool">
                  <lucide-icon name="italic" size="18"></lucide-icon>
               </button>
               <div class="tool-divider"></div>
               <button type="button" (click)="editor.chain().focus().toggleHeading({ level: 2 }).run()" [class.active]="editor.isActive('heading', { level: 2 })" class="btn-tool">
                  <span>H2</span>
               </button>
               <button type="button" (click)="editor.chain().focus().toggleHeading({ level: 3 }).run()" [class.active]="editor.isActive('heading', { level: 3 })" class="btn-tool">
                  <span>H3</span>
               </button>
               <div class="tool-divider"></div>
               <button type="button" (click)="editor.chain().focus().toggleBulletList().run()" [class.active]="editor.isActive('bulletList')" class="btn-tool">
                  <lucide-icon name="list" size="18"></lucide-icon>
               </button>
               <button type="button" (click)="editor.chain().focus().toggleOrderedList().run()" [class.active]="editor.isActive('orderedList')" class="btn-tool">
                  <lucide-icon name="list-ordered" size="18"></lucide-icon>
               </button>
               <button type="button" (click)="editor.chain().focus().toggleBlockquote().run()" [class.active]="editor.isActive('blockquote')" class="btn-tool">
                  <lucide-icon name="quote" size="18"></lucide-icon>
               </button>
            </div>
            
            <!-- Editor Content -->
            <div id="editor-container" class="editor-content"></div>
          </div>
        </div>

        <!-- Settings (Right) -->
        <aside class="editor-sidebar">
           <div class="sidebar-box card">
              <div class="field-group">
                 <label>Statut</label>
                 <select formControlName="status" class="select-input">
                    <option value="draft">Brouillon</option>
                    <option value="published">Publié</option>
                 </select>
              </div>

              <div class="field-group">
                 <label>Catégorie</label>
                 <select formControlName="category" class="select-input">
                    <option [ngValue]="null">Sélectionner une catégorie</option>
                    <option *ngFor="let cat of categories()" [ngValue]="cat">
                      {{ cat.name }}
                    </option>
                 </select>
              </div>

              <div class="field-group">
                 <label>Tags</label>
                 <div class="tags-selector">
                   <div class="tag-badges" *ngIf="selectedTags().length > 0">
                     <span *ngFor="let tag of selectedTags()" class="tag-badge">
                       {{ tag.name }}
                       <button (click)="removeTag(tag)" class="btn-remove-tag">&times;</button>
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

              <div class="field-group">
                 <label>Type de Contenu</label>
                 <div class="type-selector">
                    <button 
                      type="button" 
                      *ngFor="let t of types" 
                      (click)="postForm.patchValue({type: t.value})" 
                      [class.active]="postForm.value.type === t.value" 
                      class="type-btn"
                    >
                       <span class="type-label">{{ t.label }}</span>
                       <lucide-icon *ngIf="postForm.value.type === t.value" name="check" size="14"></lucide-icon>
                    </button>
                 </div>
              </div>
           </div>

           <!-- Featured Image Placeholder -->
           <div class="sidebar-box card">
             <div class="field-group">
               <label>Image de couverture</label>
               <div class="image-upload-placeholder">
                 <lucide-icon name="image" size="32"></lucide-icon>
                 <p>Cliquez pour uploader (Simulé)</p>
               </div>
             </div>
           </div>
        </aside>
      </form>
    </div>
  `,
   styles: [`
    /* Styles are mostly in SCSS, but adding reactive loaders here */
    .loader {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class PostEditorComponent implements OnInit, OnDestroy {
   private fb = inject(FormBuilder);
   private state = inject(GlobalStateService);
   private store = inject(ContentStore);
   private route = inject(ActivatedRoute);
   private router = inject(Router);

   editor!: Editor;
   isEditMode = signal(false);
   editingPostId = signal<string | null>(null);

   categories = this.state.categories;
   availableTags = this.state.tags;
   selectedTags = signal<any[]>([]);
   isLoading = this.state.isLoading;

   types = [
      { label: 'Article', value: 'article' },
      { label: 'Note d\'intention', value: 'note' },
      { label: 'Récapitulatif', value: 'recap' }
   ];

   postForm: FormGroup = this.fb.group({
      title: ['', [Validators.required]],
      slug: ['', [Validators.required]],
      excerpt: ['', [Validators.maxLength(200)]],
      content: [''],
      status: ['draft'],
      type: ['article'],
      category: [null, [Validators.required]]
   });

   ngOnInit(): void {
      this.initEditor();

      // Check if we are in edit mode
      this.route.params.subscribe(params => {
         if (params['slug']) {
            const post = this.state.posts().find(p => p.slug === params['slug']);
            if (post) {
               this.loadPostForEdit(post);
            }
         }
      });
   }

   ngOnDestroy(): void {
      if (this.editor) {
         this.editor.destroy();
      }
   }

   private initEditor() {
      this.editor = new Editor({
         element: document.querySelector('#editor-container')!,
         extensions: [
            StarterKit,
            Link.configure({ openOnClick: false }),
            Placeholder.configure({ placeholder: 'Commencez à rédiger votre contenu...' })
         ],
         content: this.postForm.get('content')?.value || '',
         onUpdate: ({ editor }) => {
            this.postForm.patchValue({ content: editor.getHTML() }, { emitEvent: false });
         }
      });
   }

   private loadPostForEdit(post: Post) {
      this.isEditMode.set(true);
      this.editingPostId.set(post.id);
      this.selectedTags.set(post.tags || []);

      this.postForm.patchValue({
         title: post.title,
         slug: post.slug,
         excerpt: post.excerpt,
         content: post.content,
         status: post.status,
         type: post.type,
         category: this.categories().find(c => c.id === post.category.id) || post.category
      });

      if (this.editor) {
         this.editor.commands.setContent(post.content);
      }
   }

   updateSlug() {
      if (!this.isEditMode()) {
         const slug = this.postForm.get('title')?.value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
         this.postForm.patchValue({ slug });
      }
   }

   onSubmit() {
      if (this.postForm.invalid) return;

      const postData = {
         ...this.postForm.value,
         tags: this.selectedTags()
      };

      if (this.isEditMode() && this.editingPostId()) {
         this.store.updatePost(this.editingPostId()!, postData).subscribe({
            next: () => this.router.navigate(['/admin']),
            error: (err) => console.error('Update failed', err)
         });
      } else {
         this.store.createPost(postData).subscribe({
            next: () => this.router.navigate(['/admin']),
            error: (err) => console.error('Creation failed', err)
         });
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
}
