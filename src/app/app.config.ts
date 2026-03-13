import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { IContentService } from './core/services/content.interface';
import { ContentMockService } from './mock-data/services/content.mock.service';
import { tokenInterceptor } from './core/interceptors/token.interceptor';
import {
  LucideAngularModule, Search, Menu, X, Calendar, Clock, User,
  ArrowRight, ArrowLeft, TrendingUp, Layout, Megaphone, GraduationCap, Image,
  Linkedin, Twitter, Share2, ChevronRight, ChevronLeft, MessageSquare,
  FileText, Hash, BookOpen, LayoutGrid, MapPin, Github, Shield, Check,
  Instagram, Mail, Mic, Book, ExternalLink, Globe, Phone, LogOut,
  Settings, Plus, Filter, MoreHorizontal, Download, Eye, MessageCircle,
  TrendingDown, Minus, Lock, AlertCircle, EyeOff, Pencil, Bold, Italic,
  List, ListOrdered, Quote, Link,
  Trash2, UploadCloud, Camera
} from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideHttpClient(withFetch(), withInterceptors([tokenInterceptor])),
    provideClientHydration(),
    { provide: IContentService, useClass: ContentMockService },
    importProvidersFrom(
      LucideAngularModule.pick({
        Search, Menu, X, Calendar, Clock, User, ArrowRight, ArrowLeft, TrendingUp, Layout,
        Megaphone, GraduationCap, Image, Linkedin, Twitter, Share2, ChevronRight,
        ChevronLeft, MessageSquare, FileText, Hash, BookOpen, LayoutGrid, MapPin,
        Github, Shield, Check, Instagram, Mail, Mic, Book, ExternalLink, Globe,
        Phone, LogOut, Settings, Plus, Filter, MoreHorizontal, Download, Eye,
        MessageCircle, TrendingDown, Minus, Lock, AlertCircle, EyeOff,
        Pencil, Bold, Italic, List, ListOrdered, Quote, Link,
        Trash2, UploadCloud, Camera
      })
    )
  ]
};
