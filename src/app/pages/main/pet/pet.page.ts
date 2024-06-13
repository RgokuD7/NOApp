import {
  Component,
  ElementRef,
  inject,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Pet } from 'src/app/models/pet.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddPetPage } from './add-pet/add-pet.page';
import { AddEditPetComponent } from 'src/app/shared/components/add-edit-pet/add-edit-pet.component';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
@Component({
  selector: 'app-pet',
  templateUrl: './pet.page.html',
  styleUrls: ['./pet.page.scss'],
})
export class PetPage implements OnInit {
  firebaseSvc = inject(FirebaseService);
  utilSvc = inject(UtilsService);

  pets: Pet[] = [];
  species: any[] = [];

  constructor() {}

  ngOnInit() {}

  onPress(pet: Pet) {
    const hapticsVibrate = async () => {
      await Haptics.vibrate();
    };
    this.utilSvc.presentActionSheet({
      buttons: [
        {
          text: 'Editar',
          icon: 'create',
          handler: () => {
            console.log('Editar clicked');
            this.openAddPetModal(pet);
          },
        },
        {
          text: 'Eliminar',
          icon: 'trash',
          role: 'destructive',
          handler: () => {
            console.log('Eliminar clicked');
            this.deletePet(pet);
          },
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancelar clicked');
          },
        },
      ],
    });
  }

  async openAddPetModal(pet?: Pet) {
    console.log(pet);
    const modal = await this.utilSvc.presentModal({
      component: AddEditPetComponent,
      componentProps: { pet: pet },
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

  async ionViewWillEnter() {
    await this.loadData();
  }

  async loadData() {
    this.getPets();
    this.getSpecies();
  }
  user(): User {
    return this.utilSvc.getFromLocalStorage('user');
  }

  async getPets() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.firebaseSvc.getCollectionData('pets/').subscribe({
        next: (data: any) => {
          this.pets = data.filter((item) => item.uid === this.user().uid);
          sub.unsubscribe();
          resolve();
        },
        error: (err) => reject(err),
      });
    });
  }

  async getSpecies() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.firebaseSvc.getCollectionData('species/').subscribe({
        next: (data: any) => {
          this.species = data.map((item) => [item.id, item.specie]);
          console.log(this.species);
          sub.unsubscribe();
          resolve();
        },
        error: (error) => {
          console.log(error);
          reject(error);
        },
      });
    });
  }

  getSpecieName(specieId: string): string {
    const specie = this.species.find((s) => s[0] === specieId);
    return specie ? specie[1] : '';
  }

  async deletePet(pet: Pet) {
    const loading = await this.utilSvc.presentLoading({
      message: 'Eliminando',
      keyboardClose: true,
      spinner: 'bubbles',
    });
    await loading.present();

    if (pet.photo !== '/assets/icon/pet-avatar.png') {
      let imagePath = await this.firebaseSvc.getFilePath(pet.photo);
      await this.firebaseSvc.deleteFile(imagePath);
    }

    var user = this.user();

    let path = `pets/${pet.id}`;
    console.log(path);
    this.firebaseSvc
      .deleteDocument(path)
      .then(() => {
        user.pets_number =
          user.pets.length == user.pets_number
            ? user.pets.length - 1
            : user.pets_number;
        user.pets = user.pets.filter((petId) => petId !== pet.id);
        this.saveUserPet(user.uid, user);
        this.utilSvc.saveInLocalStorage('user', user);
        if(pet.chip_id) this.deleteChip(pet.chip_id);
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

  async deleteChip(chipId) {
    let path = `chips/${chipId}`;
    this.firebaseSvc.deleteDocument(path).catch((error) => {
      console.log(error);
      throw new Error(error.message);
    });
  }
  async saveUserPet(uid: string, user: User) {
    console.log(uid, user);
    let path = `users/${uid}`;
    this.firebaseSvc.updateDocument(path, user).then(() => {});
  }
}
