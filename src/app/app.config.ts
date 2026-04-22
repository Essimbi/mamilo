import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions, withInMemoryScrolling, withRouterConfig, withPreloading, PreloadAllModules } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { IContentService } from './core/services/content.interface';
import { ContentHttpService } from './core/services/content-http.service';
import { tokenInterceptor } from './core/interceptors/token.interceptor';
import {
  LucideAngularModule, Search, Menu, X, Calendar, Clock, User,
  ArrowRight, ArrowLeft, TrendingUp, Layout, Megaphone, GraduationCap, Image,
  Linkedin, Twitter, Share2, ChevronRight, ChevronLeft, MessageSquare,
  FileText, Hash, BookOpen, LayoutGrid, MapPin, Github, Shield, Check,
  Instagram, Mail, Mic, Book, ExternalLink, Globe, Phone, LogOut,
  Settings, Plus, Filter, MoreHorizontal, Download, Eye, MessageCircle,
  TrendingDown, Minus, Lock, AlertCircle, EyeOff, Pencil, Bold, Italic,
  List, ListOrdered, Quote, Link, Type, Heading2, AlertTriangle, ArrowUp, ArrowDown,
  Trash2, Trash, UploadCloud, Camera, Tag, Heart, CalendarPlus, Wrench, Edit3,
  Mic2, Users, Video, CalendarOff, Clock3, SortAsc, ImageOff, Activity, Trophy,
  BarChart3, Inbox, CalendarDays, ShieldCheck, Send
} from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes, 
      withComponentInputBinding(), 
      withViewTransitions(), 
      withPreloading(PreloadAllModules),
      withInMemoryScrolling({ scrollPositionRestoration: 'top' })
    ),
    provideHttpClient(withFetch(), withInterceptors([tokenInterceptor])),
    provideClientHydration(),
    { provide: IContentService, useClass: ContentHttpService },
    importProvidersFrom(
      LucideAngularModule.pick({
        Search, Menu, X, Calendar, Clock, User, ArrowRight, ArrowLeft, TrendingUp, Layout,
        Megaphone, GraduationCap, Image, Linkedin, Twitter, Share2, ChevronRight,
        ChevronLeft, MessageSquare, FileText, Hash, BookOpen, LayoutGrid, MapPin,
        Github, Shield, Check, Instagram, Mail, Mic, Book, ExternalLink, Globe,
        Phone, LogOut, Settings, Plus, Filter, MoreHorizontal, Download, Eye,
        MessageCircle, TrendingDown, Minus, Lock, AlertCircle, EyeOff,
        Pencil, Bold, Italic, List, ListOrdered, Quote, Link, Type, Heading2, AlertTriangle, ArrowUp, ArrowDown,
        Trash2, Trash, UploadCloud, Camera, Tag, Heart, CalendarPlus, Wrench, Edit3,
        Mic2, Users, Video, CalendarOff, Clock3, SortAsc, ImageOff, Activity, Trophy,
        BarChart3, Inbox, CalendarDays, ShieldCheck, Send
      })
    )
  ]
};
