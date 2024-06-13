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
  constructor() {}

  firebaseSvc = inject(FirebaseService);
  utilSvc = inject(UtilsService);
  liadingCtrl = inject(LoadingController);
  router = inject(Router);

  filteredComunas: any[] = [[null, 'Primero selecciona Región']];

  ionViewWillEnter() {}

  userForm = new FormGroup({
    uid: new FormControl(''),
    names: new FormControl('', [Validators.required]),
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
    creation_date: new FormControl(new Date().toISOString()),
    last_login: new FormControl(new Date().toISOString()),
  });

  ngOnInit() {
    console.log('ngOnInit');
  }

  async onSubmit() {
    if (this.userForm.valid) {
      this.firebaseSvc
        .signUp(this.userForm.value as User)
        .then(async (res) => {
          await this.firebaseSvc.updateUser(this.userForm.value.username);
          let uid = res.user.uid;
          this.userForm.controls.uid.setValue(uid);
          this.setUsuario(uid);
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
                  role: 'cancel',
                },
              ],
            });
          }
        })
        .finally(async () => {});
    }
  }

  async setUsuario(uid: string) {
    const loading = await this.utilSvc.presentLoading({
      message: 'Registrando',
      keyboardClose: true,
      spinner: 'bubbles',
    });
    await loading.present();
    let path = `users/${uid}`;
    this.userForm.value.password = '';
    this.firebaseSvc
      .setDocument(path, this.userForm.value as User)
      .then(() => {
        this.utilSvc.presentToast({
          message: 'Información guardada correctamente',
          duration: 1500,
          position: 'middle',
          color: 'primary',
        });
        this.utilSvc.saveInLocalStorage('user', this.userForm.value);
        this.utilSvc.routerLink('/main/user-profile/info');
      })
      .catch((error) => {
        console.log(error);
        this.utilSvc.presentToast({
          message: 'Error al guardar iformación',
          duration: 1500,
          position: 'middle',
          color: 'danger',
        });
      })
      .finally(async () => {
        loading.dismiss();
      });
  }
}
