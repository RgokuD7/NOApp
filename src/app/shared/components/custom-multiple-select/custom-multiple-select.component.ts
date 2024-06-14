import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { AddEditPetComponent } from '../add-edit-pet/add-edit-pet.component';
import { UtilsService } from 'src/app/services/utils.service';

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

  isModalOpen: boolean = false;
  filteredOptions: any[];
  searchTerm: string = '';
  presentingElement = null;

  utilSvc = inject(UtilsService);

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
    if (changes['currentValues'] && changes['currentValues'].currentValue) {
      console.log(this.currentValues);
      shouldUpdateValueLabel = true;
    }

    // Realiza la actualización de `valueLabel` solo si ambos `options` y `currentValue` están definidos
/*     if (shouldUpdateValueLabel && this.options && this.options.length > 0) {
      const selectedOption = this.options.find(
        (option) => option[0] === this.currentValues
      );

      // Verifica que se encontró una opción válida
      if (selectedOption) {
        this.valueLabel = selectedOption[1];
      } else {
        console.warn('No se encontró la opción seleccionada en options.');
      }
    } */
  }
  openOptionsModal(){
    this.isModalOpen = true;
  }

  onModalWillDismiss(){
    this.isModalOpen = false;
  }

  async openAddPetModal() {
    const modal = await this.utilSvc.presentModal({
      component: AddEditPetComponent,
      presentingElement: document.querySelector('.page'),
      canDismiss: this.modalCanDismiss,
    });

    console.log(modal);

    if (modal && modal.valid){
      this.filteredOptions.push([modal.petId,modal.petNames]);
      this.currentValues.push(modal.petId);
      this.isModalOpen = false;
    }
  }

  modalCanDismiss = async (data?: any, role?: string) => {
    if (data && data.valid) {
      console.log(data);
      return true;
    }
    var actRole = await this.utilSvc.presentActionSheet({
      header: 'Advertencia',
      subHeader:
        'Si cierras esta ventana, perderás toda la información que has agregado. ¿Estás seguro de que quieres salir?',
      buttons: [
        {
          text: 'Salir sin guardar',
          icon: 'exit',
          role: 'confirm',
        },
        {
          text: 'Continuar editando',
          icon: 'return-down-back',
          role: 'cancel',
        },
      ],
    });
    console.log(actRole);
    return actRole === 'confirm';
  };

  onSearchChange(event) {
    this.searchTerm = event.target.value.toLowerCase();
    console.log(this.searchTerm);

    // Filtrar las opciones basadas en el término de búsqueda
    this.filteredOptions = this.options.filter((option) =>
      option[1].toLowerCase().includes(this.searchTerm)
    );
  }
  isInCurrentValues(optId: string): boolean {
    const option = this.currentValues.find((option) => option === optId);
    if (option) {
      return true;
    } else {
      return false;
    }
  }

  add(optId) {
    this.currentValues.push(optId);
    this.optionChange.emit(this.currentValues);
  }

  remove(optId) {
    this.currentValues = this.currentValues.filter((value) => value !== optId);
    this.optionChange.emit(this.currentValues);
  }
}
