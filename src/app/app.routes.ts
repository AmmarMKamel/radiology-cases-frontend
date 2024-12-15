import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'cases',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./cases/cases/cases.component').then((c) => c.CasesComponent),
      },
      {
        path: 'add',
        loadComponent: () =>
          import('./cases/add-case/add-case.component').then(
            (c) => c.AddCaseComponent
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./cases/case/case.component').then((c) => c.CaseComponent),
      },
    ],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'cases',
  },
];
