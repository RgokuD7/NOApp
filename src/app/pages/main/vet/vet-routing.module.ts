import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VetPage } from './vet.page';

const routes: Routes = [
  {
    path: '',
    component: VetPage
  },  {
    path: 'add-vet',
    loadChildren: () => import('./add-vet/add-vet.module').then( m => m.AddVetPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VetPageRoutingModule {}
