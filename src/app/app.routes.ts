import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { NewsList } from './components/news-list/news-list';
import { Signup } from './components/signup/signup';
import { Login } from './components/login/login';
import { Profile } from './components/profile/profile';
import { AuthGuard } from '@angular/fire/auth-guard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: Home, title: 'Home' },
  { path: 'news', component: NewsList, title: 'News' },
  { path: 'signup', component: Signup, title: 'Sign Up' },
  { path: 'login', component: Login, title: 'Log In' },
  {
    path: 'profile',
    component: Profile,
    title: 'Profile',
    canActivate: [authGuard],
  },
];
