import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormControlName } from '@angular/forms';


@Component({
  selector: 'app-custom-text-area',
  templateUrl: './custom-text-area.component.html',
  styleUrls: ['./custom-text-area.component.scss'],
})
export class CustomTextAreaComponent  implements OnInit {

  @Input() control!: FormControl;
  @Input() type!: String;
  @Input() label!: String;
  @Input() icon!: String;
  @Input() faIcon!: String;
  iconColor = 'primary';
  faColor = 'var(--ion-color-primary)';

  @ViewChild('item') item: ElementRef;
  class: string = 'normal-input';

  firstTry: boolean = false;
  errors: boolean = false;

  constructor() {}

  ngOnInit() {
    this.control.statusChanges.subscribe(status => {
      if (status === 'INVALID') {
        console.log(this.control.errors);
        if(this.control.hasError('wrong-password')) {
          console.log('status');
          this.showErrors();
        }
        if(this.control.hasError('wrong-email')) {
          console.log('status');
          this.showErrors();
        }
      }
    });
  }

  statusChanged(){
    
  }
  

  onChange() {
    if (!this.firstTry) this.firstTry = true;
    this.showErrors();
  }
  onInput() {
    this.showErrors();
  }

  showErrors() {
    if (this.control.errors && this.firstTry) {
      this.class = 'error-input';
      this.iconColor = 'danger';
      this.faColor = 'var(--ion-color-danger)';
      this.errors = this.errors = true;
    } else {
      this.class = 'normal-input';
      this.iconColor = 'primary';
      this.faColor = 'var(--ion-color-primary)';
      this.errors = this.errors = false;
    }
  }
}
