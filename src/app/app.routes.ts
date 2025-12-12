import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { NewsList } from './components/news-list/news-list';
import { Signup } from './components/signup/signup';
import { Login } from './components/login/login';
import { Profile } from './components/profile/profile';
import { authGuard } from './guards/auth.guard';
import { NewsDetails } from './components/news-details/news-details';
import { Favorites } from './components/favorites/favorites';

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
  {
    path: 'news/:id',
    component: NewsDetails,
    title: 'News Details',
  },
  { path: 'favorites', component: Favorites, title: 'Favorites' },
];
