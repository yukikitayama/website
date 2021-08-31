// import { SafeResourceUrl } from '@angular/platform-browser';

export interface Post {
  id: string;
  title: string;
  category: string;
  date: string;
  content: string;
  urlGoogleSlides?: string;
  // urlGoogleSlides?: SafeResourceUrl;
  urlYoutube?: string;
  // urlYoutube?: SafeResourceUrl;
}
