import { Routes } from '@angular/router';
import { Calendar } from './component/calendar/calendar';
import { Album } from './component/album/album';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'calendar',
    pathMatch: 'full'
  },
  {
    path: 'calendar',
    component: Calendar
  },
  {
    path: 'rule',
    component: Calendar
  },
  {
    path: 'album',
    component: Album
  }
];
