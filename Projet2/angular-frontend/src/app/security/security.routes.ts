import { Routes } from '@angular/router';

export const securityRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./page/sign-in-page/sign-in-page.component').then((c) => c.SignInPageComponent),
  },
];
