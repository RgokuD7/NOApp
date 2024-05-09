import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-custom-toggle',
  templateUrl: './custom-toggle.component.html',
  styleUrls: ['./custom-toggle.component.scss'],
})
export class CustomToggleComponent  implements OnInit {

  @Input() control!: FormControl;
  @Input() label: string;
  @Input() note!: string;
  @Input() icon!: string;
  @Input() faIcon!: String;
  @Output() optionChange = new EventEmitter<any>();

  iconColor: string = 'primary';
  faColor: string = 'var(--ion-color-primary)';


  constructor() { }

  ngOnInit() {}

}
