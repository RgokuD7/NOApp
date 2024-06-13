import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.scss'],
})
export class CustomSelectComponent implements OnInit {
  constructor() {}

  @Input() label!: string;
  @Input() currentValue!: any;
  @Input() valueLabel!: any;
  @Input() openWith!: string;
  @Input() options!: any[];
  @Input() icon!: string;
  @Input() faIcon!: String;
  @Input() search: boolean = false;
  @Input() searchLabel!: string;
  @Output() optionChange = new EventEmitter<any>();

  filteredOptions: any[];
  class: string = 'normal-item';
  iconColor: string = 'primary';
  faColor: string = 'var(--ion-color-primary)';

  ngOnInit() {
    console.log(this.options);
  }

  ngOnChanges(changes: SimpleChanges) {
  let shouldUpdateValueLabel = false;

  // Verifica si `options` ha cambiado
  if (changes['options'] && changes['options'].currentValue) {
    this.filteredOptions = [...changes['options'].currentValue];
    console.log('ngOnChanges - options:', this.options);
    shouldUpdateValueLabel = true;
  }

  // Verifica si `currentValue` ha cambiado
  if (changes['currentValue'] && changes['currentValue'].currentValue) {
    console.log(this.currentValue);
    shouldUpdateValueLabel = true;
  }

  // Realiza la actualización de `valueLabel` solo si ambos `options` y `currentValue` están definidos
  if (shouldUpdateValueLabel && this.options && this.options.length > 0) {
    const selectedOption = this.options.find(
      (option) => option[0] === this.currentValue
    );

    // Verifica que se encontró una opción válida
    if (selectedOption) {
      this.valueLabel = selectedOption[1];
    } else {
      console.warn('No se encontró la opción seleccionada en options.');
    }
  }
}


  onPickerChange(event?) {
    console.log(this.filteredOptions);
    this.currentValue = event.detail.value;
    this.valueLabel = this.options.find(
      (option) => option[0] === this.currentValue
    )[1];
    console.log(this.valueLabel);
    this.optionChange.emit(this.currentValue);
  }

  onSearchChange(event) {
    const searchTerm = event.target.value.toLowerCase();
    console.log(searchTerm);

    // Filtrar las opciones basadas en el término de búsqueda
    this.filteredOptions = this.options.filter((option) =>
      option[1].toLowerCase().includes(searchTerm)
    );
  }
}
