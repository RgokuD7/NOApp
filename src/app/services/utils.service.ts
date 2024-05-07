import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  AlertOptions,
  LoadingController,
  ToastController,
  ToastOptions,
} from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}

  loadCtrl = inject(LoadingController);
  alertCtrl = inject(AlertController);
  toastCtrl = inject(ToastController);
  router = inject(Router);

  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  getFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }
  removeFromLocalStorage(key: string) {
    localStorage.removeItem(key);
  }

  loading(message: string) {
    return this.loadCtrl.create({
      spinner: 'bubbles',
      message: message,
      cssClass: 'class',
      /*   showBackdrop?: boolean;
  duration?: number;
  translucent?: boolean;
  animated?: boolean;
  backdropDismiss?: boolean;
  mode?: Mode;
  keyboardClose?: boolean;
  id?: string;
  htmlAttributes?: { [key: string]: any };

  enterAnimation?: AnimationBuilder;
  leaveAnimation?: AnimationBuilder; */
    });
  }

  async presentAlert(opts: AlertOptions) {
    const alert = await this.alertCtrl.create(opts);
    alert.present();
  }

  async presentToast(opts: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

  routerLink(link: string) {
    return this.router.navigateByUrl(link);
  }
}
