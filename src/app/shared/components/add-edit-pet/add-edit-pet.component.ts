import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Pet } from 'src/app/models/pet.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ReadNfcComponent } from '../read-nfc/read-nfc.component';
import { ScannedChipComponent } from '../scanned-chip/scanned-chip.component';

@Component({
  selector: 'app-add-edit-pet',
  templateUrl: './add-edit-pet.component.html',
  styleUrls: ['./add-edit-pet.component.scss'],
})
export class AddEditPetComponent implements OnInit {
  constructor() {}

  @Input() pet!: Pet;

  utilSvc = inject(UtilsService);
  firebaseSvc = inject(FirebaseService);
  route = inject(ActivatedRoute);
  species: any[];
  pet_gender: any[] = [
    [1, 'Hembra'],
    [2, 'Macho'],
  ];
  petId: string;
  chip_valid: number = 0;
  section: number = 1;

  user(): User {
    return this.utilSvc.getFromLocalStorage('user');
  }

  petForm = new FormGroup({
    id: new FormControl(''),
    uid: new FormControl(this.user().uid),
    specie: new FormControl(''),
    breed: new FormControl(''),
    animal_gender: new FormControl(0),
    names: new FormControl('', [Validators.required]),
    photo: new FormControl('/assets/icon/pet-avatar.png'),
    weight: new FormControl(null),
    height: new FormControl(null),
    size: new FormControl(null),
    birthday: new FormControl(''),
    age: new FormControl(0),
    pet_age: new FormControl(0),
    has_adopted_here: new FormControl(false),
    isForAdoption: new FormControl(false),
    isLost: new FormControl(false),
    color: new FormControl(''),
    medical_info: new FormControl(''),
    vaccine_info: new FormControl(''),
    chip_id: new FormControl(''),
    registration_date: new FormControl(new Date().toISOString()),
  });

  async ionViewWillEnter() {
    await this.loadData();
    console.log('Pet Name:', this.pet);
  }

  async loadData() {
    await this.getSpecies();
  }

  ngOnInit() {
    if (this.pet) {
      console.log(this.pet);
      this.petForm.setValue(this.pet);
      this.petId = this.pet.id;
    }
  }

  canDismiss() {
    this.utilSvc.dismissModal();
  }

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
    const isSame =
      this.petForm.controls.chip_id.value === chipid ? true : false;
    const modal = await this.utilSvc.presentModal({
      component: ScannedChipComponent,
      backdropDismiss: false,
      componentProps: { chipid: chipid, isRegistering: true, isSame: isSame },
      breakpoints: [0, 1],
      initialBreakpoint: 1,
      cssClass: 'modal',
    });

    if (modal.valid) {
      console.log(modal.valid);
      this.chip_valid = 1;
      this.petForm.controls.chip_id.setValue(chipid);
    } else this.chip_valid = -1;
  }

  async takeImage() {
    const dataUrl = (await this.utilSvc.takePicture('Imagen de tu mascota'))
      .dataUrl;
    this.petForm.controls.photo.setValue(dataUrl);
  }

  onSpecieChange(event) {
    this.petForm.controls.specie.setValue(event);
  }

  onGenderChange(event) {
    this.petForm.controls.animal_gender.setValue(event);
  }

  onBirthDayChange(event) {
    this.petForm.controls.birthday.setValue(event.datetime);
    this.petForm.controls.age.setValue(event.age);
  }

  nextSection() {
    this.section++;
  }

  async onSubmit() {
    if (this.petForm.valid) {
      const loading = await this.utilSvc.presentLoading({
        message: this.pet ? 'Guardando' : 'Actualizando',
        keyboardClose: true,
        spinner: 'bubbles',
      });
      await loading.present();

      var user = this.user();
      console.log(user);

      delete this.petForm.value.id;

      if (!this.pet) {
        if (this.petForm.value.photo !== '/assets/icon/pet-avatar.png') {
          let dataUrl = this.petForm.value.photo;
          let imagePath = `pets/${this.petForm.value.uid}/${Date.now()}`;
          let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
          this.petForm.controls.photo.setValue(imageUrl);
        }

        this.firebaseSvc
          .addDocument('pets', this.petForm.value as Pet)
          .then(async (pet) => {
            this.petId = pet.id;
            user.pets.push(pet.id);
            user.pets_number =
              user.pets.length > user.pets_number
                ? user.pets.length
                : user.pets_number;
            this.utilSvc.saveInLocalStorage('user', user);
            await this.saveUserPet(user.uid, user);
            if (this.petForm.controls.chip_id.value) await this.registrarNfc();
            await this.updatePet();
            this.utilSvc.presentToast({
              message: 'Mascota añadida con exito',
              duration: 1500,
              position: 'middle',
              color: 'primary',
            });
            this.utilSvc.dismissModal({ valid: true, petId: pet.id, petNames: this.petForm.controls.names.value });
          })
          .catch((err) => {
            console.log(err);
            this.utilSvc.presentToast({
              message: 'Error al guardar información de mascota',
              duration: 1500,
              position: 'middle',
              color: 'danger',
            });
          })
          .finally(() => {
            loading.dismiss();
          });
      } else {
        if (this.petForm.value.photo !== this.pet.photo) {
          let dataUrl = this.petForm.value.photo;
          let imagePath = await this.firebaseSvc.getFilePath(this.pet.photo);
          let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
          this.petForm.controls.photo.setValue(imageUrl);
        }
        let path = `pets/${this.pet.id}`;
        console.log(path);
        this.firebaseSvc
          .updateDocument(path, this.petForm.value as Pet)
          .then(async () => {
            if (this.petForm.controls.chip_id.value) await this.registrarNfc();
            await this.updatePet();
            this.utilSvc.presentToast({
              message: 'Información actualizada',
              duration: 1500,
              position: 'middle',
              color: 'primary',
            });
            this.utilSvc.dismissModal({ valid: true });
          })
          .catch((error) => {
            console.log(error);
            this.utilSvc.presentToast({
              message: 'Error al guardar Información',
              duration: 1500,
              position: 'middle',
              color: 'danger',
            });
          })
          .finally(() => {
            loading.dismiss();
          });
      }
    }
  }

  async registrarNfc() {
    let path = `chips/${this.petForm.controls.chip_id.value}`;
    this.firebaseSvc
      .setDocument(path, {
        petid: this.petId,
        uid: this.user().uid,
      })
      .catch((error) => {
        console.log(error);
        throw new Error(error.message);
      });
  }

  async updatePet() {
    let path = `pets/${this.petId}`;
    this.firebaseSvc
      .updateDocument(path, this.petForm.value as Pet)
      .catch((error) => {
        console.log(error);
        throw new Error(error.message);
      });
  }

  async getSpecies() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.firebaseSvc.getCollectionData('species/').subscribe({
        next: (data: any) => {
          this.species = data.map((item) => [item.id, item.specie]);
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

  async saveUserPet(uid: string, user: User) {
    console.log(uid, user);
    let path = `users/${uid}`;
    this.firebaseSvc.updateDocument(path, user).catch((error) => {
      console.log(error);
      throw new Error(error);
    });
  }
}
