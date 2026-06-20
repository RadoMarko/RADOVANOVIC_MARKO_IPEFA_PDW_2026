import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/page/dashboard-home-page/dashboard-home-page.component').then(
        (c) => c.DashboardHomePageComponent,
      ),
  },
  {
    path: 'studies',
    loadComponent: () =>
      import('./study/page/study-list-page/study-list-page.component').then(
        (c) => c.StudyListPageComponent,
      ),
  },
  {
    path: 'studies/create',
    loadComponent: () =>
      import('./study/page/study-create-page/study-create-page.component').then(
        (c) => c.StudyCreatePageComponent,
      ),
  },
  {
    path: 'studies/:id',
    loadComponent: () =>
      import('./study/page/study-detail-page/study-detail-page.component').then(
        (c) => c.StudyDetailPageComponent,
      ),
  },
];
