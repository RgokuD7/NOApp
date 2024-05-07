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
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  form: FormGroup;

  constructor() {}

  firebaseSvc = inject(FirebaseService);
  utilSvc = inject(UtilsService);
  liadingCtrl = inject(LoadingController);
  router = inject(Router);

  section: number = 1;
  birthday: string;
  genders: any[] = [];
  comunas: any[] = [];
  regions: any[] = [];
  filteredComunas: any[] = [[null, 'Primero selecciona Región']];

  ionViewWillEnter() {
    this.getGenders();
    this.getRegions();
  }

  userForm = new FormGroup({
    uid: new FormControl(''),
    names: new FormControl('', [Validators.required]),
    profile_img: new FormControl(''),
    birthday: new FormControl('', [Validators.required]),
    age: new FormControl(0, [Validators.required, Validators.min(7)]),
    gender: new FormControl(''),
    phone: new FormControl(null, [
      Validators.pattern('^[0-9]*$'),
      Validators.minLength(9),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8), // Mínimo 8 caracteres
      Validators.pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
      ), // Al menos una minúscula, una mayúscula, un número y un carácter especial
    ]),
    pets_number: new FormControl(null, [Validators.required]),
    pet_foster: new FormControl(false, [Validators.required]),
    has_store: new FormControl(false, [Validators.required]),
    has_vet: new FormControl(false, [Validators.required]),
    address: new FormControl(''),
    comuna: new FormControl(''),
    region: new FormControl(''),
    lat: new FormControl(0),
    lng: new FormControl(0),
    notifications: new FormControl(false),
    creation_date: new FormControl(''),
    last_login: new FormControl(''),
    donations: new FormControl(0),
  });

  ngOnInit() {
    console.log('ngOnInit');
  }

  onBirthDayChange(event) {
    this.userForm.controls.birthday.setValue(event.datetime);
    this.userForm.controls.age.setValue(event.age);
  }

  onGenderChange(event) {
    console.log(event);
    this.userForm.controls.gender.setValue(event);
  }

  onRegionChange(event){
    this.filteredComunas = this.comunas.find(comunas => comunas[0] == event);
    this.filteredComunas = this.filteredComunas[1].map((comuna, index) => [index.toString(), comuna]);
    this.userForm.controls.region.setValue(event);
  }

  onComunaChange(event){
    this.userForm.controls.comuna.setValue(event);
  }

  async signEmail() {
    if (
      this.userForm.controls.email.valid ||
      this.userForm.controls.password.valid
    ) {
      const loading = await this.utilSvc.loading('Registrando correo');
      await loading.present();
      this.firebaseSvc
        .signUp(this.userForm.value as User)
        .then(async (res) => {
          await this.firebaseSvc.updateUser(this.userForm.value.username);
          let uid = res.user.uid;
          this.userForm.controls.uid.setValue(uid);
          this.section++;
        })
        .catch(async (error) => {
          console.log(error);
          if (error.code == 'auth/email-already-in-use') {
            /* const alert = await this.utilSvc.emailInUse();
            await alert.present(); */
            this.utilSvc.presentAlert({
              header: 'Este correo ya esta registrado',
              message: '¿Quieres recuperar la contraseña?',
              keyboardClose: true,
              buttons: [
                {
                  text: 'Recuperar',
                  role: '',
                  handler: () => {
                    this.utilSvc.routerLink('auth/forgot-password');
                  },
                },
                {
                  text: 'No',
                  role: 'cancel'
                },
              ],
            });
          }
        })
        .finally(async () => {
          await loading.dismiss();
        });
    }
  }
  signPersonalInfo() {
    if (
      this.userForm.controls.birthday.valid &&
      this.userForm.controls.age.valid
    )
      this.section++;
  }
  async onSubmit() {
    let uid = this.userForm.value.uid;
    await this.setUsuario(uid);
  }

  async setUsuario(uid: string) {
    let path = `users/${uid}`;
    this.userForm.value.password = '';
    const loading = await this.utilSvc.loading('Crenado usuario');
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
        if(this.userForm.controls.pets_number.value > 0) this.utilSvc.routerLink('main/pet/add-pet');
        else if(this.userForm.controls.has_store.value) this.utilSvc.routerLink('main/pet/add-pet');
        /* this.utilSvc.routerLink('/tabs'); */
      });
  }

  getGenders() {
    let sub = this.firebaseSvc.getCollectionData('genders/').subscribe({
      next: (data: any) => {
        this.genders = data.map((item) => [item.id, item.gender]);
        sub.unsubscribe;
      },
    });
  }

  getRegions() {
    let sub = this.firebaseSvc.getCollectionData('regions/').subscribe({
      next: (data: any) => {
        this.regions = data.map((item) => [item.id, item.region]);
        this.comunas = data.map((item) => [item.id, item.comunas]);
        sub.unsubscribe;
      },
    });
  }

  
}
