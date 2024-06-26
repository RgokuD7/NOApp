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
import { AddEditLostComponent } from 'src/app/shared/components/add-edit-lost/add-edit-lost.component';
import { Lost } from 'src/app/models/lost.model';
import { ScannedChipComponent } from 'src/app/shared/components/scanned-chip/scanned-chip.component';

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
  lost: Lost[];
  allPublications: any[];

  async ngOnInit() {}

  async ionViewWillEnter() {
    await this.loadData();
  }

  async loadData() {
    await this.getAdoptions();
    await this.getLost();
    await this.getAllPublications();
  }

  user(): User {
    return this.utilSvc.getFromLocalStorage('user');
  }

  onPress(publi: any) {
    const userUid = this.user().uid;
    const isOwner = publi.uid === userUid;

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
            if (publi.type == 'adoption') {
              this.openAddEditAdoptionModal(publi);
            } else {
              this.openAddEditLostModal(publi);
            }
          },
        },
        {
          text: 'Eliminar',
          icon: 'trash',
          role: 'destructive',
          handler: () => {
            console.log('Eliminar clicked');
            this.deletePublication(publi);
          },
        }
      );
    } else {
      buttons.unshift({
        text: 'Reportar',
        role: 'report',
        icon: 'warning',
        handler: () => {
          console.log('Reportar clicked');
          // Implementa la lógica para reportar la adopción
        },
      });
    }

    this.utilSvc.presentActionSheet({
      buttons,
    });
  }

  async deletePublication(publi: any) {
    const loading = await this.utilSvc.presentLoading({
      message: 'Eliminando',
      keyboardClose: true,
      spinner: 'bubbles',
    });
    await loading.present();

    if (publi.img) {
      let imagePath = await this.firebaseSvc.getFilePath(publi.img);
      await this.firebaseSvc.deleteFile(imagePath);
    }
    let path = '';
    if (publi.type == 'adoption') {
      path += 'adoptions/';
    } else {
      path += 'lost/';
    }
    path += `${publi.id}`;
    console.log(path);
    this.firebaseSvc
      .deleteDocument(path)
      .then(() => {
        this.utilSvc.presentToast({
          message: 'Publicación Eliminada',
          duration: 1500,
          position: 'middle',
          color: 'primary',
        });
      })
      .catch((error) => {
        console.log(error);
        this.utilSvc.presentToast({
          message: 'Error al eliminar publicación',
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

  async createPublication() {
    var actRole = await this.utilSvc.presentActionSheet({
      header: 'Que deseas publicar',
      buttons: [
        {
          text: 'Adopción',
          icon: 'paw',
          role: 'adopt',
          handler: () => {
            this.openAddEditAdoptionModal();
          },
        },
        {
          text: 'Mascota Perdida',
          icon: 'alert',
          role: 'lost',
          handler: () => {
            this.openAddEditLostModal();
          },
        },
        {
          text: 'Cancelar',
          icon: 'return-down-back',
          role: 'cancel',
        },
      ],
    });
  }
  async openAddEditAdoptionModal(adopt?: Adoption) {
    const modal = await this.utilSvc.presentModal({
      component: AddEditAdoptionComponent,
      componentProps: { adoption: adopt },
      presentingElement: document.querySelector('.page'),
      canDismiss: this.modalCanDismiss,
    });

    console.log(modal);

    if (modal && modal.valid) this.loadData();
  }

  async openAddEditLostModal(lost?: Lost) {
    const modal = await this.utilSvc.presentModal({
      component: AddEditLostComponent,
      componentProps: { lost: lost },
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

  async openNfcModal() {
    console.log('open modal');
    const modal = await this.utilSvc.presentModal({
      component: ReadNfcComponent,
      backdropDismiss: false,
      breakpoints: [0, 1],
      initialBreakpoint: 1,
      cssClass: 'modal',
    });

    console.log(modal);
    if (modal.error) {
      this.utilSvc.presentAlert({
        header: 'Lo sentimos',
        message: modal.error,
        keyboardClose: true,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
          },
        ],
      });
    } else if (modal.tag) {
      this.openScannedChipModal(modal.tag);
      /* 
      this.petForm.controls.nfc_id.setValue(this.tag);
      this.tagtype = typeof this.tag; */
    }
  }
  async openScannedChipModal(chipid) {

    const modal = await this.utilSvc.presentModal({
      component: ScannedChipComponent,
      backdropDismiss: false,
      componentProps: { chipid: chipid},
      breakpoints: [0, 1],
      initialBreakpoint: 1,
      cssClass: 'modal',
    });

  }

  async getAdoptions() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.firebaseSvc.getCollectionData('adoptions/').subscribe({
        next: (data: any) => {
          this.adoptions = data.map((item) => ({ ...item, type: 'adoption' }));
          sub.unsubscribe();
          resolve();
        },
        error: (err) => reject(err),
      });
    });
  }

  async getLost() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.firebaseSvc.getCollectionData('lost/').subscribe({
        next: (data: any) => {
          this.lost = data.map((item) => ({ ...item, type: 'lost' }));
          sub.unsubscribe();
          resolve();
        },
        error: (err) => reject(err),
      });
    });
  }

  async getAllPublications() {
    try {
      await Promise.all([this.getAdoptions(), this.getLost()]);
      this.allPublications = [...this.adoptions, ...this.lost];
  
      // Asegúrate de que creation_date es un objeto Date antes de ordenar
      this.allPublications = this.allPublications.map(item => {
        return {
          ...item,
          creation_date: new Date(item.creation_date)
        };
      });
  
      // Ordenar publicaciones por fecha (de más reciente a más antiguo)
      this.allPublications.sort((a, b) => b.creation_date.getTime() - a.creation_date.getTime());
  
      console.log(this.allPublications);
    } catch (error) {
      console.error('Error fetching publications:', error);
    }
  }
  
}
