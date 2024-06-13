import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  ActionSheetController,
  ActionSheetOptions,
  AlertController,
  AlertOptions,
  LoadingController,
  LoadingOptions,
  ModalController,
  ModalOptions,
  ToastController,
  ToastOptions,
} from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Clipboard } from '@capacitor/clipboard';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}

  loadCtrl = inject(LoadingController);
  alertCtrl = inject(AlertController);
  toastCtrl = inject(ToastController);
  actionSheetCtrl = inject(ActionSheetController);
  modalCtrl = inject(ModalController);
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

  async presentLoading(opt: LoadingOptions) {
    return this.loadCtrl.create(opt);
  }

  async presentToast(opts: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

  async presentAlert(opts: AlertOptions) {
    const alert = await this.alertCtrl.create(opts);
    await alert.present();

    const { role } = await alert.onWillDismiss();
    return role;
  }

  async presentActionSheet(opts: ActionSheetOptions) {
    const actionSheet = await this.actionSheetCtrl.create(opts);
    await actionSheet.present();

    const { role } = await actionSheet.onWillDismiss();
    return role;
  }

  async presentModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts);
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) return data;
  }

  dismissModal(data?: any) {
    return this.modalCtrl.dismiss(data);
  }

  async routerLink(link: string, params?: any) {
    if (params) {
      await this.router.navigate([link, params]);
    } else {
      await this.router.navigateByUrl(link);
    }
  }

  async takePicture(promptLabelHeader: string) {
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      promptLabelHeader,
      promptLabelPhoto: 'Selecciona una imagen',
      promptLabelPicture: 'Toma una foto',
    });
  }

  async copyToClipboard(text: string) {
    await Clipboard.write({
      string: text,
    });
    this.presentToast({
      message: 'Copiado',
      duration: 1500,
      color: 'primary',
      position: 'bottom',
    });
  }

  dateToString(date, format) {
    const monthNames = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    const d = new Date(date);
    const day = d.getDate();
    const month = monthNames[d.getMonth()];
    const year = d.getFullYear();

    switch (format) {
      case 'dm':
        return `${day} de ${month}`;
      case 'dma':
        return `${day} de ${month} de ${year}`;
      case 'ma':
        return `${month} de ${year}`;
      default:
        return date;
    }
  }

  calculateStringAge(birthday, option = 'y') {
    const today = new Date();
    const birthDate = new Date(birthday);
    const diff = today.getTime() - birthDate.getTime();
    const ageDate = new Date(diff);
    const years = ageDate.getUTCFullYear() - 1970;
    const months = ageDate.getUTCMonth();
    const days = ageDate.getUTCDate() - 1;
    let result = '';

    if (option.includes('y') && years !== 0) {
      result += years === 1 ? '1 año' : `${years} años`;
    }
    if (option.includes('m') && months !== 0) {
      if (result !== '') result += ' ';
      result += months === 1 ? '1 mes' : `${months} meses`;
    }
    if (option.includes('d') && days !== 0 || result == '') {
      if (result !== '') result += ' ';
      result += days === 1 ? '1 día' : `${days} dias`;
    }
    return result.trim();
  }
}
