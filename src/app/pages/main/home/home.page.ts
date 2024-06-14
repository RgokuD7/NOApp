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
import { Adoption } from 'src/app/models/adoption.model';
import { User } from 'src/app/models/user.model';

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
  nfcSvc = inject(NfcService);

  @ViewChild(IonModal) modal: IonModal;

  tag: string = '';
  adoptions: Adoption[];

  async ngOnInit() {}


  async ionViewWillEnter() {
    await this.loadData();
  }

  async loadData() {
    await this.getAdoptions();
  }

  user(): User {
    return this.utilSvc.getFromLocalStorage('user');
  }

  onPress(adopt: Adoption) {
    const userUid = this.user().uid;
    const isOwner = adopt.uid === userUid;
  
    const buttons = [
      {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancelar clicked');
        },
      },
    ];
  
    if (isOwner) {
      buttons.unshift(
        {
          text: 'Editar',
          icon: 'create',
          role: 'edit',
          handler: () => {
            console.log('Editar clicked');
            this.openAddAoptionModal(adopt);
          },
        },
        {
          text: 'Eliminar',
          icon: 'trash',
          role: 'destructive',
          handler: () => {
            console.log('Eliminar clicked');
            this.deletAdoption(adopt);
          },
        }
      );
    } else {
      buttons.unshift(
        {
          text: 'Reportar',
          role: 'report',
          icon: 'warning',
          handler: () => {
            console.log('Reportar clicked');
            // Implementa la lógica para reportar la adopción
          },
        }
      );
    }
  
    this.utilSvc.presentActionSheet({
      buttons,
    });
  }

  async deletAdoption(adopt: Adoption) {
    const loading = await this.utilSvc.presentLoading({
      message: 'Eliminando',
      keyboardClose: true,
      spinner: 'bubbles',
    });
    await loading.present();

    if (adopt.img) {
      let imagePath = await this.firebaseSvc.getFilePath(adopt.img);
      await this.firebaseSvc.deleteFile(imagePath);
    }

    var user = this.user();

    let path = `adoptions/${adopt.id}`;
    console.log(path);
    this.firebaseSvc
      .deleteDocument(path)
      .then(() => {
        this.utilSvc.presentToast({
          message: 'Mascota Eliminada',
          duration: 1500,
          position: 'middle',
          color: 'primary',
        });
      })
      .catch((error) => {
        console.log(error);
        this.utilSvc.presentToast({
          message: 'Error al eliminar mascota',
          duration: 1500,
          position: 'middle',
          color: 'danger',
        });
      })
      .finally(() => {
        loading.dismiss();
        this.loadData();
      });
  }
  

  onSubmit() {}
  async openAddAoptionModal(adopt?: Adoption) {
    const modal = await this.utilSvc.presentModal({
      component: AddEditAdoptionComponent,
      componentProps: {adoption: adopt},
      presentingElement: document.querySelector('.page'),
      canDismiss: this.modalCanDismiss,
    });

    console.log(modal);

    if (modal && modal.valid) this.loadData();
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
  async getAdoptions() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.firebaseSvc.getCollectionData('adoptions/').subscribe({
        next: (data: any) => {
          this.adoptions = data;
          sub.unsubscribe();
          resolve();
        },
        error: (err) => reject(err),
      });
    });
  }
}
