import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Timestamp, GeoPoint } from 'firebase/firestore';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.model';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  constructor() {}

  firebaseSvc = inject(FirebaseService);
  utilSvc = inject(UtilsService);
  liadingCtrl = inject(LoadingController);
  router = inject(Router);

  authForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  ngOnInit() {}

  async onSubmit() {
    if (this.authForm.valid) {
      const loading = await this.utilSvc.presentLoading({
        message: 'Iniciando sesión',
        keyboardClose: true,
        spinner: 'bubbles',
      });
      await loading.present();
      this.firebaseSvc
        .signIn(this.authForm.value as User)
        .then(async (res) => {
          await this.getUsuario(res.user.uid);
        })
        .catch((error) => {
          console.log(error);
          if (error.code == 'auth/wrong-password') {
            console.log(error.code);
            this.authForm.get('password').setErrors({ 'wrong-password': true });
            this.authForm.get('password').markAsDirty();
          } else if (error.code == 'auth/user-not-found') {
            console.log(error.code);
            this.authForm.get('email').setErrors({ 'wrong-email': true });
            this.authForm.get('email').markAsDirty();
          } else if (error.code == 'auth/too-many-requests') {
            console.log(error.code);
            this.utilSvc.presentToast({
              message:
                'Demasiados intentos fallidos, vuelve a intentarlo más tarde o restablece la contraseña',
              duration: 1500,
              position: 'middle',
            });
          } else {
            console.log(error.code);
            this.utilSvc.presentToast({
              message: 'Ocurrió un problema, vuelve a intentarlo más tarde',
              duration: 1500,
              position: 'middle',
            });
          }
        })
        .finally(() => {
          loading.dismiss();
        });
    }
  }

  async getUsuario(uid: string) {
    let path = `users/${uid}`;
    this.firebaseSvc
      .getDocument(path)
      .then(async (user: User) => {
        await this.utilSvc.saveInLocalStorage('user', user);
        this.utilSvc.routerLink('tabs');
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
