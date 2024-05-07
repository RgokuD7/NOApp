import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { LogoComponent } from './components/logo/logo.component';
import { HeaderComponent } from './components/header/header.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomDatetimePickerComponent } from './components/custom-datetime-picker/custom-datetime-picker.component';
import { CustomSelectComponent } from './components/custom-select/custom-select.component';

@NgModule({
  declarations: [CustomInputComponent, LogoComponent,HeaderComponent,CustomDatetimePickerComponent, CustomSelectComponent],
  exports: [CustomInputComponent, LogoComponent,HeaderComponent,CustomDatetimePickerComponent, CustomSelectComponent],
  imports: [CommonModule, IonicModule, ReactiveFormsModule, FormsModule],
})
export class SharedModule {}
