import { Component, inject, Input, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

  @Input() title!: string;
  @Input() backButtom!: string;
  @Input() isModal!: boolean;
  @Input() icon!: string;

  
  utilSvc = inject(UtilsService);

  constructor() { }

  ngOnInit() {}

  dismissModal(){
    console.log("dismiss");
    this.utilSvc.dismissModal();
  }

}
