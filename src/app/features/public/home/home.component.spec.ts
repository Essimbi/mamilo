import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { RouterTestingModule } from '@angular/router/testing';
import { IContentService } from '../../../core/services/content.interface';
import { SeoService } from '../../../core/services/seo.service';
import { of } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockContentService: jasmine.SpyObj<IContentService>;
  let mockSeoService: jasmine.SpyObj<SeoService>;

  beforeEach(async () => {
    const contentServiceSpy = jasmine.createSpyObj('IContentService', ['getPosts', 'getEvents']);
    const seoServiceSpy = jasmine.createSpyObj('SeoService', ['updateTitle', 'updateMeta']);

    await TestBed.configureTestingModule({
      imports: [HomeComponent, RouterTestingModule],
      providers: [
        { provide: IContentService, useValue: contentServiceSpy },
        { provide: SeoService, useValue: seoServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    mockContentService = TestBed.inject(IContentService) as jasmine.SpyObj<IContentService>;
    mockSeoService = TestBed.inject(SeoService) as jasmine.SpyObj<SeoService>;

    // Setup default mock returns
    mockContentService.getPosts.and.returnValue(of({ items: [], total: 0 }));
    mockContentService.getEvents.and.returnValue(of([]));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize SEO settings on init', () => {
    component.ngOnInit();
    
    expect(mockSeoService.updateTitle).toHaveBeenCalledWith('Accueil');
    expect(mockSeoService.updateMeta).toHaveBeenCalledWith(
      'Plateforme éditoriale du Dr. Christian Mamilo. Communication digitale et perspectives académiques.',
      ['communication', 'digital', 'académique', 'expertise']
    );
  });

  it('should load posts and events on init', () => {
    component.ngOnInit();
    
    expect(mockContentService.getPosts).toHaveBeenCalled();
    expect(mockContentService.getEvents).toHaveBeenCalled();
  });
});