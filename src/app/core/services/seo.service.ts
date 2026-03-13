import { Injectable, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Post } from '../models/post.model';

@Injectable({
    providedIn: 'root'
})
export class SeoService {
    constructor(
        private title: Title,
        private meta: Meta,
        @Inject(DOCUMENT) private dom: any
    ) { }

    updateTitle(newTitle: string): void {
        this.title.setTitle(`${newTitle} | Blog Professionnel`);
    }

    updateMeta(description: string, keywords: string[]): void {
        this.meta.updateTag({ name: 'description', content: description });
        this.meta.updateTag({ name: 'keywords', content: keywords.join(', ') });
    }

    updateOpenGraph(og: { title: string, description: string, image: string, url: string }): void {
        this.meta.updateTag({ property: 'og:title', content: og.title });
        this.meta.updateTag({ property: 'og:description', content: og.description });
        this.meta.updateTag({ property: 'og:image', content: og.image });
        this.meta.updateTag({ property: 'og:url', content: og.url });
        this.meta.updateTag({ property: 'og:type', content: 'article' });
    }

    updateCanonical(url: string): void {
        let link: HTMLLinkElement = this.dom.querySelector("link[rel='canonical']");
        if (!link) {
            link = this.dom.createElement('link');
            link.setAttribute('rel', 'canonical');
            this.dom.head.appendChild(link);
        }
        link.setAttribute('href', url);
    }

    generateStructuredData(post: Post): void {
        const schema = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": post.title,
            "image": post.coverImage?.url || '',
            "author": {
                "@type": "Person",
                "name": post.author.name
            },
            "datePublished": post.publishedAt,
            "dateModified": post.updatedAt,
            "description": post.excerpt
        };

        const script = this.dom.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(schema);
        this.dom.head.appendChild(script);
    }
}
