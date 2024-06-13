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
import { Adoption } from 'src/app/models/adoption.model';

@Component({
  selector: 'app-add-edit-adoption',
  templateUrl: './add-edit-adoption.component.html',
  styleUrls: ['./add-edit-adoption.component.scss'],
})
export class AddEditAdoptionComponent implements OnInit {
  constructor() {}

  @Input() adoption!: Adoption;


  utilSvc = inject(UtilsService);
  firebaseSvc = inject(FirebaseService);
  route = inject(ActivatedRoute);
  navParams = inject(NavParams);
  pets = [];

  adoptionId: string;
  chip_valid: number = 0;
  section: number = 1;

  user(): User {
    return this.utilSvc.getFromLocalStorage('user');
  }

  adoptionForm = new FormGroup({
    id: new FormControl(''),
    uid: new FormControl(this.user().uid),
    title: new FormControl('', [Validators.required]),
    pets_number: new FormControl(null, [Validators.required]),
    pets: new FormControl([], [Validators.required]),
    description: new FormControl('', [Validators.required]),
    needs: new FormControl('', [Validators.required]),
    img: new FormControl('', [Validators.required]),
    lotion: new FormControl('', [Validators.required]),
    lat: new FormControl(null, [Validators.required]),
    lng: new FormControl(null, [Validators.required]),
    report_state: new FormControl('', [Validators.required]),
    creation_date: new FormControl('', [Validators.required]),
  });

  async ionViewWillEnter() {
    await this.loadData();
    console.log('Pet Name:', this.adoption);
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
    if (this.adoption) {
      console.log(this.adoption);
      this.adoptionForm.setValue(this.adoption);
    }
  }

  canDismiss() {
    this.utilSvc.dismissModal();
  }

  async takeImage() {
    const dataUrl = (await this.utilSvc.takePicture('Imagen de referencia'))
      .dataUrl;
    this.adoptionForm.controls.img.setValue(dataUrl);
  }

  nextSection() {
    this.section++;
  }

  async onSubmit() {
    if (this.adoptionForm.valid) {
      const loading = await this.utilSvc.presentLoading({
        message: this.adoption ? 'Publicando' : 'Actualizando',
        keyboardClose: true,
        spinner: 'bubbles',
      });
      await loading.present();

      var user = this.user();
      console.log(user);

      delete this.adoptionForm.value.id;

      if (!this.adoption) {
        if (this.adoptionForm.value.img) {
          let dataUrl = this.adoptionForm.value.img;
          let imagePath = `${this.adoptionForm.value.uid}/${Date.now()}`;
          let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
          this.adoptionForm.controls.img.setValue(imageUrl);
        }

        this.firebaseSvc
          .addDocument('pets', this.adoptionForm.value as Adoption)
          .then(async (adoption) => {
            this.adoptionId = adoption.id;
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
        if (this.adoptionForm.value.img !== this.adoption.img) {
          let dataUrl = this.adoptionForm.value.img;
          let imagePath = await this.firebaseSvc.getFilePath(this.adoption.img);
          let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
          this.adoptionForm.controls.img.setValue(imageUrl);
        }
        let path = `pets/${this.adoption.id}`;
        console.log(path);
        this.firebaseSvc
          .updateDocument(path, this.adoptionForm.value as Adoption)
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
