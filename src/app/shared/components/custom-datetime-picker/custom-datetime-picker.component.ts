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
  @Output() datetimeChange = new EventEmitter<
    string | { datetime: string; age: number }
  >();
  formattedDate: string;
  age: number;
  class: string = 'normal-item';
  iconColor: string = 'primary';
  errors: boolean = false;
  constructor() {}

  ngOnInit() {}

  dateChange() {
    const date = new Date(this.datetime);
    this.formattedDate = `${date.getDate()} de ${this.getMonth(
      date.getMonth()
    )} del ${date.getFullYear()}`;
    this.datetimeChange.emit(this.datetime);
    if (this.birthday) {
      this.calcAge();
      this.datetimeChange.emit({ datetime: this.datetime, age: this.age });
      this.showErrors();
    } else this.datetimeChange.emit(this.datetime);
  }
  calcAge() {
    const today = new Date();
    const birthday = new Date(this.datetime);
    const milisecondAge = today.getTime() - birthday.getTime();
    const age = Math.floor(milisecondAge / (365.25 * 24 * 60 * 60 * 1000));
    this.age = age;
  }

  showErrors() {
    if (this.age < 7){
      this.class = 'error-item';
      this.iconColor = 'danger';
      this.errors = this.errors = true;
    }else{
      this.class = 'normal-item';
      this.iconColor = 'primary';
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
