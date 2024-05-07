import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.scss'],
})
export class CustomSelectComponent implements OnInit {
  constructor() {}

  @Input() label!: string;
  @Input() openWith!: string;
  @Input() options!: any[];
  @Input() icon!: string;
  @Input() search: boolean = false;
  @Input() searchLabel!: string;
  @Output() optionChange = new EventEmitter<any>();
  
  currentValue: any;
  valueLabel: any;
  filteredOptions: any[];
  class: string = 'normal-item';

  ngOnInit() { 
  }

  ngOnChanges(){
    if (this.options) {
      this.filteredOptions = [...this.options];
    }
  }


  onPickerChange(event) {
    console.log(this.filteredOptions);
    this.currentValue = event.detail.value;
    this.valueLabel = this.options.find(option => option[0] === this.currentValue)[1];
    console.log(this.valueLabel);
    this.optionChange.emit(this.currentValue);
  }

  onSearchChange(event) {
    
    const searchTerm = event.target.value.toLowerCase();
    console.log(searchTerm);

    // Filtrar las opciones basadas en el término de búsqueda
    this.filteredOptions = this.options.filter(option => option[1].toLowerCase().includes(searchTerm));
  }

  
}
