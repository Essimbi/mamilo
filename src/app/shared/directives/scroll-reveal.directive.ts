import { Directive, ElementRef, OnInit, inject, Input, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appScrollReveal]',
  standalone: true
})
export class ScrollRevealDirective implements OnInit {
  private el = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);
  
  @Input() delay = 0;
  @Input() duration = '0.8s';
  @Input() threshold = 0.1;

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.el.nativeElement.style.opacity = '0';
    this.el.nativeElement.style.transform = 'translateY(30px)';
    this.el.nativeElement.style.transition = `opacity ${this.duration} cubic-bezier(0.4, 0, 0.2, 1), transform ${this.duration} cubic-bezier(0.4, 0, 0.2, 1)`;
    this.el.nativeElement.style.transitionDelay = `${this.delay}ms`;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.el.nativeElement.style.opacity = '1';
            this.el.nativeElement.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: this.threshold }
    );

    observer.observe(this.el.nativeElement);
  }
}
