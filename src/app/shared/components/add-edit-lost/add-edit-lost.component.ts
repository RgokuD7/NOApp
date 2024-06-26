import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';
import { Pet } from 'src/app/models/pet.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ReadNfcComponent } from '../read-nfc/read-nfc.component';
import { ScannedChipComponent } from '../scanned-chip/scanned-chip.component';
import { Lost } from 'src/app/models/lost.model';


@Component({
  selector: 'app-add-edit-lost',
  templateUrl: './add-edit-lost.component.html',
  styleUrls: ['./add-edit-lost.component.scss'],
})
export class AddEditLostComponent  implements OnInit {
  constructor() {}

  @Input() lost!: Lost;

  utilSvc = inject(UtilsService);
  firebaseSvc = inject(FirebaseService);
  route = inject(ActivatedRoute);
  navParams = inject(NavParams);
  pets = [];

  lostId: string;

  user(): User {
    return this.utilSvc.getFromLocalStorage('user');
  }

  lostForm = new FormGroup({
    id: new FormControl(''),
    uid: new FormControl(this.user().uid),
    title: new FormControl('', [Validators.required]),
    petid: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    needs: new FormControl(''),
    img: new FormControl(''),
    location: new FormControl(''),
    lat: new FormControl(null),
    lng: new FormControl(null),
    report_state: new FormControl(''),
    creation_date: new FormControl(new Date().toISOString()),
  });

  async ionViewWillEnter() {
    await this.loadData();
    console.log('Pet Name:', this.lost);
  }

  async loadData() {
    this.getPets();
  }

  async getPets() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.firebaseSvc.getCollectionData('pets/').subscribe({
        next: (data: any) => {
          this.pets = data.filter((item) => item.uid === this.user().uid);
          this.pets = this.pets.map((item) => [item.id, item.names]);
          sub.unsubscribe();
          resolve();
        },
        error: (err) => reject(err),
      });
    });
  }

  ngOnInit() {
    if (this.lost) {
      console.log(this.lost);
      this.lostForm.setValue(this.lost);
    }
  }

  async takeImage() {
    const dataUrl = (await this.utilSvc.takePicture('Imagen de referencia'))
      .dataUrl;
    this.lostForm.controls.img.setValue(dataUrl);
  }

  onPetChange(event) {
    this.lostForm.controls.petid.setValue(event);
  }

  async onSubmit() {
    if (this.lostForm.valid) {
      const loading = await this.utilSvc.presentLoading({
        message: this.lost ? 'Publicando' : 'Actualizando',
        keyboardClose: true,
        spinner: 'bubbles',
      });
      await loading.present();

      delete this.lostForm.value.id;

      if (!this.lost) {
        if (this.lostForm.value.img) {
          let dataUrl = this.lostForm.value.img;
          let imagePath = `lost/${
            this.lostForm.value.uid
          }/${Date.now()}`;
          let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
          this.lostForm.controls.img.setValue(imageUrl);
        }

        this.firebaseSvc
          .addDocument('lost', this.lostForm.value as Lost)
          .then(async (lost) => {
            this.lostId = lost.id;
            this.utilSvc.presentToast({
              message: 'Publicado con exito',
              duration: 1500,
              position: 'middle',
              color: 'primary',
            });
            this.utilSvc.dismissModal({ valid: true });
          })
          .catch((err) => {
            console.log(err);
            this.utilSvc.presentToast({
              message: 'Error al publicar',
              duration: 1500,
              position: 'middle',
              color: 'danger',
            });
          })
          .finally(() => {
            loading.dismiss();
          });
      } else {
        if (this.lostForm.value.img && !this.lost.img) {
          let dataUrl = this.lostForm.value.img;
          let imagePath = `lost/${
            this.lostForm.value.uid
          }/${Date.now()}`;
          let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
          this.lostForm.controls.img.setValue(imageUrl);
        } else if (this.lostForm.value.img !== this.lost.img) {
          let dataUrl = this.lostForm.value.img;
          let imagePath = await this.firebaseSvc.getFilePath(this.lost.img);
          let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
          this.lostForm.controls.img.setValue(imageUrl);
        }
        let path = `lost/${this.lost.id}`;
        console.log(path);
        this.firebaseSvc
          .updateDocument(path, this.lostForm.value as Lost)
          .then(async () => {
            this.utilSvc.presentToast({
              message: 'Publicación actualizada',
              duration: 1500,
              position: 'middle',
              color: 'primary',
            });
            this.utilSvc.dismissModal({ valid: true });
          })
          .catch((error) => {
            console.log(error);
            this.utilSvc.presentToast({
              message: 'Error al actualizar publicación',
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
}
