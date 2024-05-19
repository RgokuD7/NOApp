import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { User } from 'src/app/models/user.model';
import { Gender } from 'src/app/models/gender.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Timestamp, GeoPoint } from 'firebase/firestore';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {
  constructor() {}

  firebaseSvc = inject(FirebaseService);
  utilSvc = inject(UtilsService);
  loadingCtrl = inject(LoadingController);
  router = inject(Router);

  uid: string = '';
  section: number = 1;
  birthday: string = this.user().birthday;
  genders: any[] = [];
  regions: any[] = [];
  comunas: any[] = [];
  currentGenderLabel: string;
  currentRegionLabel: string;
  currentComunaLabel: string;
  filteredComunas: any[] = [[null, 'Primero selecciona Región']];

  userForm = new FormGroup({
    uid: new FormControl(this.user().uid),
    names: new FormControl(this.user().names, [Validators.required]),
    email: new FormControl(this.user().email, [
      Validators.required,
      Validators.email,
    ]),
    username: new FormControl(this.user().username, [
      Validators.required,
      Validators.minLength(4),
    ]),
    birthday: new FormControl(this.user().birthday, [Validators.required]),
    age: new FormControl(this.user().age, [
      Validators.required,
      Validators.min(7),
    ]),
    gender: new FormControl(this.user().gender ? this.user().gender : null),
    phone: new FormControl(this.user().phone ? this.user().phone : null, [
      Validators.pattern('^[0-9]*$'),
      Validators.minLength(9),
    ]),
    pets_number: new FormControl(this.user().pets_number, [
      Validators.required,
    ]),
    pet_foster: new FormControl(
      this.user().pet_foster ? this.user().pet_foster : false,
      [Validators.required]
    ),
    has_store: new FormControl(
      this.user().has_store ? this.user().has_store : false,
      [Validators.required]
    ),
    has_vet: new FormControl(
      this.user().has_vet ? this.user().has_vet : false,
      [Validators.required]
    ),
    address: new FormControl(this.user().address),
    comuna: new FormControl(this.user().comuna),
    region: new FormControl(this.user().region),
    creation_date: new FormControl(new Date().toISOString()),
    last_login: new FormControl(new Date().toISOString()),
  });

  async ionViewWillEnter() {
    await this.loadData();
    console.log(this.regions);
  }

  user(): User {
    return this.utilSvc.getFromLocalStorage('user');
  }

  ngOnInit() {
    console.log(this.userForm.value);
  }

  async loadData() {
    await this.getGenders();
    await this.getRegions();
    console.log(this.regions);
    if (this.regions) {
      console.log(this.regions);
      this.filteredComunas = this.comunas.find(
        (comunas) => comunas[0] == this.user().region
      );
      this.filteredComunas = this.filteredComunas[1].map((comuna, index) => [
        index.toString(),
        comuna,
      ]);
    }
  }

  async getGenders() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.firebaseSvc.getCollectionData('genders/').subscribe({
        next: (data: any) => {
          this.genders = data.map((item) => [item.id, item.gender]);
          sub.unsubscribe();
          resolve();
        },
        error: (err) => reject(err),
      });
    });
  }

  async getRegions() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.firebaseSvc.getCollectionData('regions/').subscribe({
        next: (data: any) => {
          this.regions = data.map((item) => [item.id, item.region]);
          this.comunas = data.map((item) => [item.id, item.comunas]);
          sub.unsubscribe();
          resolve();
        },
        error: (err) => reject(err),
      });
    });
  }

  onBirthDayChange(event) {
    this.userForm.controls.birthday.setValue(event.datetime);
    this.userForm.controls.age.setValue(event.age);
  }

  onGenderChange(event) {
    console.log(event);
    this.userForm.controls.gender.setValue(event);
  }

  onRegionChange(event) {
    this.filteredComunas = this.comunas.find((comunas) => comunas[0] == event);
    this.filteredComunas = this.filteredComunas[1].map((comuna, index) => [
      index.toString(),
      comuna,
    ]);
    this.userForm.controls.region.setValue(event);
  }

  onComunaChange(event) {
    this.userForm.controls.comuna.setValue(event);
  }

  signPersonalInfo() {
    if (
      this.userForm.controls.birthday.valid &&
      this.userForm.controls.age.valid
    ) {
      this.section++;
    }
  }

  async onSubmit() {
    let uid = this.userForm.value.uid;
    console.log('si');
    await this.setUsuario(uid);
  }

  async setUsuario(uid: string) {
    let path = `users/${uid}`;
    const loading = await this.utilSvc.loading('Guardando');
    await loading.present();
    this.firebaseSvc
      .setDocument(path, this.userForm.value as User)
      .then(() => {
        this.utilSvc.saveInLocalStorage('user', this.userForm.value);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(async () => {
        loading.dismiss();
        if (this.userForm.controls.pets_number.value > 0) {
          this.utilSvc.routerLink('main/pet/add-pet');
        } else if (this.userForm.controls.has_store.value) {
          this.utilSvc.routerLink('main/pet/add-pet');
        } else {
          this.utilSvc.routerLink('/tabs');
        }
      });
  }
}
