import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VetPageRoutingModule } from './vet-routing.module';

import { VetPage } from './vet.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VetPageRoutingModule
  ],
  declarations: [VetPage]
})
export class VetPageModule {}
