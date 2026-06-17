import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/page/dashboard-home-page/dashboard-home-page.component').then(
        (c) => c.DashboardHomePageComponent,
      ),
  },
];
