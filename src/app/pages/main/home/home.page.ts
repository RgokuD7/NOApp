import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonModal, LoadingController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  constructor() {}

  firebaseSvc = inject(FirebaseService);
  utilSvc = inject(UtilsService);
  liadingCtrl = inject(LoadingController);
  
  @ViewChild(IonModal) modal: IonModal;

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name: string;

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.name, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  adoptionnForm = new FormGroup({
    id: new FormControl(''),
    title: new FormControl('',[Validators.required]),
    pets_number: new FormControl('',[Validators.required]),
    description: new FormControl('',[Validators.required]),
    needs: new FormControl('',[Validators.required]),
    img: new FormControl('',[Validators.required]),
    lotion: new FormControl('',[Validators.required]),
    lat: new FormControl('',[Validators.required]),
    lng: new FormControl('',[Validators.required]),
    report_state: new FormControl('',[Validators.required]),
    creation_date: new FormControl('',[Validators.required]),
  });

  ngOnInit() {}

  onSubmit(){
    
  }
  addClick() {}
}
