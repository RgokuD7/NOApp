import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-custom-multiple-select',
  templateUrl: './custom-multiple-select.component.html',
  styleUrls: ['./custom-multiple-select.component.scss'],
})
export class CustomMultipleSelectComponent implements OnInit {
  @Input() label!: String;
  @Input() message!: String;
  @Input() icon!: String;
  @Input() faIcon!: String;
  @Input() currentValues: any = [];
  @Input() valueLabel!: any;
  @Input() openWith!: string;
  @Input() options!: any[];
  @Input() search: boolean = false;
  @Input() searchLabel!: string;
  @Output() optionChange = new EventEmitter<any>();

  iconColor = 'primary';
  faColor = 'var(--ion-color-primary)';

  filteredOptions: any[];
  presentingElement = null;

  constructor() {}

  ngOnInit() {
    this.presentingElement = document.querySelector('.ion-page');
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
      console.log(this.currentValues);
      shouldUpdateValueLabel = true;
    }

    // Realiza la actualización de `valueLabel` solo si ambos `options` y `currentValue` están definidos
    if (shouldUpdateValueLabel && this.options && this.options.length > 0) {
      const selectedOption = this.options.find(
        (option) => option[0] === this.currentValues
      );

      // Verifica que se encontró una opción válida
      if (selectedOption) {
        this.valueLabel = selectedOption[1];
      } else {
        console.warn('No se encontró la opción seleccionada en options.');
      }
    }
  }

  onSearchChange(event) {
    const searchTerm = event.target.value.toLowerCase();
    console.log(searchTerm);

    // Filtrar las opciones basadas en el término de búsqueda
    this.filteredOptions = this.options.filter((option) =>
      option[1].toLowerCase().includes(searchTerm)
    );
  }
  isInCurrentValues(optId: string): boolean {
    console.log(optId);
    const option = this.currentValues.find((option) => option[0] === optId);
    if (option) {
      console.log(option);
      return true;
    } else {
      console.log('xd');
      return false;
    }
  }

  addOpt() {}
}
