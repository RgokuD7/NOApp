import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonModal, LoadingController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { NfcService } from 'src/app/services/nfc';
import { Observable } from 'rxjs';
import { NfcTag } from '@capawesome-team/capacitor-nfc';
import { ReadNfcComponent } from 'src/app/shared/components/read-nfc/read-nfc.component';
import { AddEditAdoptionComponent } from 'src/app/shared/components/add-edit-adoption/add-edit-adoption.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  public scannedTag$: Observable<NfcTag>;

  private showLastScannedTag = false;

  constructor() {}

  firebaseSvc = inject(FirebaseService);
  utilSvc = inject(UtilsService);
  liadingCtrl = inject(LoadingController);
  nfcSvc = inject(NfcService);

  @ViewChild(IonModal) modal: IonModal;

  message =
    'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name: string;
  tag: string = '';

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  async ngOnInit() {}

  async openNfcModal() {
    const modal = await this.utilSvc.presentModal({
      component: ReadNfcComponent,
      presentingElement: document.querySelector('.page'),
    });

    console.log(modal);
    if (modal.error) {
      this.utilSvc.presentAlert({
        header: 'Lo sentimos',
        message: modal.error,
        keyboardClose: true,
        buttons: [
          {
            text: 'Escanear QR',
            role: '',
            handler: () => {
              /* this.utilSvc.routerLink('auth/forgot-password'); */
            },
          },
          {
            text: 'Cancelar',
            role: 'cancel',
          },
        ],
      });
    } else if (modal.tag) {
      this.tag = modal.tag;
    }
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

  onSubmit() {}
  async addClick() {
    const modal = await this.utilSvc.presentModal({
      component: AddEditAdoptionComponent,
      presentingElement: document.querySelector('.page'),
      canDismiss: this.modalCanDismiss,
    });

    console.log(modal);

    //if (modal && modal.valid) this.loadData();
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

}
