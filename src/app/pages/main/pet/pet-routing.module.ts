import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PetPage } from './pet.page';

const routes: Routes = [
  {
    path: '',
    component: PetPage
  },  {
    path: 'add-pet',
    loadChildren: () => import('./add-pet/add-pet.module').then( m => m.AddPetPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PetPageRoutingModule {}
