import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'map',
        loadChildren: () =>
          import('../main/map/map.module').then((m) => m.MapPageModule),
      },
      {
        path: 'home',
        loadChildren: () =>
          import('../main/home/home.module').then((m) => m.HomePageModule),
      },
      {
        path: 'user-profile',
        loadChildren: () =>
          import('../main/user-profile/user-profile.module').then(
            (m) => m.UserProfilePageModule
          ),
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('../main/reports/reports.module').then(
            (m) => m.ReportsPageModule
          ),
      },
      {
        path: '',
        redirectTo: 'tabs/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'tabs/home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
