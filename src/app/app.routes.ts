import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './guard/AuthGuard';
import { AboutComponent } from './pages/about/about.component';
import { UserInfoComponent } from './pages/user-info/user-info.component';
import { ChatComponent } from './pages/chat/chat.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { AddImagesComponent } from './modals/gallery/add-images/add-images.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: 'login', loadChildren: () => import('./pages/login/login.routing').then(m => m.LOGIN_ROUTES) },
  { path: 'register', loadChildren: () => import('./pages/register/register.routing').then(m => m.REGISTER_ROUTES) },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'about' },
      { path: 'about', component: AboutComponent },
      { path: 'chat', component: ChatComponent },
      { path: 'gallery', component: GalleryComponent },
      { path: 'add-image', component: AddImagesComponent },
      { path: 'userInfo', component: UserInfoComponent },
      { path: 'notes', loadChildren: () => import('./pages/notes/notes.routes').then(m => m.NOTES_ROUTES) }
    ]
  },

];
