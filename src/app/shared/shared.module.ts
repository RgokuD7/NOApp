import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { LogoComponent } from './components/logo/logo.component';
import { HeaderComponent } from './components/header/header.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomDatetimePickerComponent } from './components/custom-datetime-picker/custom-datetime-picker.component';
import { CustomSelectComponent } from './components/custom-select/custom-select.component';
import { CustomToggleComponent } from './components/custom-toggle/custom-toggle.component';
import { CustomTextAreaComponent } from './components/custom-text-area/custom-text-area.component';
import { AddEditPetComponent } from './components/add-edit-pet/add-edit-pet.component';
import { ReadNfcComponent } from './components/read-nfc/read-nfc.component';
import { ScannedChipComponent } from './components/scanned-chip/scanned-chip.component';
import { AddEditAdoptionComponent } from './components/add-edit-adoption/add-edit-adoption.component';
import { CustomMultipleSelectComponent } from './components/custom-multiple-select/custom-multiple-select.component';


const COMPONENTDECLARATIONS = [
  CustomInputComponent,
  LogoComponent,
  HeaderComponent,
  CustomDatetimePickerComponent,
  CustomSelectComponent,
  CustomToggleComponent,
  CustomTextAreaComponent,
  AddEditPetComponent,
  ReadNfcComponent,
  ScannedChipComponent,
  AddEditAdoptionComponent,
  CustomMultipleSelectComponent
];


@NgModule({
  declarations: [
    ...COMPONENTDECLARATIONS,
  ],
  exports: [
    ...COMPONENTDECLARATIONS,
  ],
  imports: [CommonModule, IonicModule, ReactiveFormsModule, FormsModule],
})
export class SharedModule {}
