import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, NgModel } from '@angular/forms';
@Component({
  selector: 'app-custom-datetime-picker',
  templateUrl: './custom-datetime-picker.component.html',
  styleUrls: ['./custom-datetime-picker.component.scss'],
})
export class CustomDatetimePickerComponent implements OnInit {
  @Input() label!: string;
  @Input() datetime!: string;
  @Input() birthday!: boolean;
  @Input() petBirthday!: string;
  @Input() dateOpt!: string;
  @Input() minAge: number = 0;
  @Input() icon: String = 'calendar-outline';
  @Input() faIcon!: String;
  @Output() datetimeChange = new EventEmitter<
    string | { datetime: string; age: number }
  >();
  formattedDate: string;
  age: number;
  stringAge: string = '';
  class: string = 'normal-list';
  iconColor: string = 'primary';
  faColor: string = 'var(--ion-color-primary)';
  errors: boolean = false;
  constructor() {}

  ngOnInit() {
    if (this.faIcon) {
      this.icon = '';
    }
  }

  dateChange() {
    const date = new Date(this.datetime);
    this.formattedDate = `${date.getDate()} de ${this.getMonth(
      date.getMonth()
    )} del ${date.getFullYear()}`;
    this.datetimeChange.emit(this.datetime);
    if (this.birthday) {
      this.calcAge();
      this.stringAge = this.calculateStringAge(date, 'ymd');
      console.log(this.calculatePetAge(date, parseInt(this.petBirthday)));
      this.datetimeChange.emit({ datetime: this.datetime, age: this.age });
      this.showErrors();
    } else this.datetimeChange.emit(this.datetime);
  }

  calcAge() {
    const today = new Date();
    const birthday = new Date(this.datetime);
    const milisecondAge = today.getTime() - birthday.getTime();
    const age = Math.floor(milisecondAge / (365.25 * 24 * 60 * 60 * 1000));
    if (age < 1) console.log(age);
    this.age = age;
  }

  calculateStringAge(birthday, option = 'y') {
    const today = new Date();
    const diff = today.getTime() - birthday.getTime(); // Obtener la diferencia de tiempo en milisegundos
    const ageDate = new Date(diff);
    const years = ageDate.getUTCFullYear() - 1970;
    const months = ageDate.getUTCMonth();
    const days = ageDate.getUTCDate() - 1;
    let result = '';

    if (option.includes('y') && years != 0) {
      result += years === 1 ? '1 año' : `${years} años`;
    }
    if (option.includes('m') && months != 0) {
      if (result !== '') result += ' ';
      result += months === 1 ? '1 mes' : `${months} meses`;
    }
    if (option.includes('d') && days != 0) {
      if (result !== '') result += ' ';
      result += days === 1 ? '1 día' : `${days} dias`;
    }

    return result.trim();
  }

  calculatePetAge(birthday, speciesId, option = 'ym') {
    const today = new Date();
    const diff = today.getTime() - birthday.getTime(); // Obtener la diferencia de tiempo en milisegundos
    const ageDate = new Date(diff);
    let years = ageDate.getUTCFullYear() - 1970;
    const months = ageDate.getUTCMonth();
    const days = ageDate.getUTCDate() - 1;
    let result = '';

    // Transformar años humanos a años de mascotas
    switch (speciesId) {
      case 1: // Perro
        years *= 7;
        break;
      case 2: // Gato
        years *= 5;
        break;
      case 3: // Conejo
        years *= 6;
        break;
      case 4: // Hamster
        years *= 2.5;
        break;
      case 5: // Pájaro
        years *= 4;
        break;
      case 6: // Tortuga
        years *= 0.5;
        break;
      case 7: // Pez
        years *= 3;
        break;
      case 8: // Cobaya
        years *= 4;
        break;
      case 9: // Hurón
        years *= 10;
        break;
      case 10: // Erizo
        years *= 8;
        break;
      case 11: // Iguana
        years *= 3;
        break;
      default:
        break;
    }

    if (option.includes('y') && years > 0) {
      result += years === 1 ? '1 year' : `${years} years`;
    }
    if (option.includes('m') && months > 0) {
      if (result !== '') result += ' ';
      result += months === 1 ? '1 month' : `${months} months`;
    }
    if (option.includes('d') && days > 0) {
      if (result !== '') result += ' ';
      result += days === 1 ? 'and 1 day' : `and ${days} days`;
    }
    result += ' aproximadamente';

    return result.trim();
  }

  showErrors() {
    if (this.age < this.minAge) {
      this.class = 'error-list';
      this.iconColor = 'danger';
      this.faColor = 'var(--ion-color-danger)';
      this.errors = this.errors = true;
    } else {
      this.class = 'normal-list';
      this.iconColor = 'primary';
      this.faColor = 'var(--ion-color-primary)';
      this.errors = this.errors = false;
    }
  }

  getMonth(monthNumber: number): string {
    const months = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];
    return months[monthNumber];
  }
}
