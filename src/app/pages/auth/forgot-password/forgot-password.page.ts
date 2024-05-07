import { Component, OnInit, inject } from '@angular/core';
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
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  constructor(private formBuilder: FormBuilder) {}

  firebaseSvc = inject(FirebaseService);
  utilSvc = inject(UtilsService);
  liadingCtrl = inject(LoadingController);
  router = inject(Router);

  section: number = 1;
  birthday: string;

  recoveryForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  ngOnInit() {}

  async onSubmit() {
    if (this.recoveryForm.valid) {
      const loading = await this.utilSvc.loading('Verificando correo');
      await loading.present();
      this.firebaseSvc
        .sendRecoberyEmail(this.recoveryForm.value.email)
        .then((res) => {
          /* this.modal.present(); */
          console.log(res);
        })
        .catch((error) => {
          if (error.code == 'auth/user-not-found') {
            console.log(error.code);
            this.recoveryForm.get('email').setErrors({'wrong-email': true});
            this.recoveryForm.get('email').markAsDirty();
          }
        })
        .finally(() => {
          loading.dismiss();
        });
    }
  }
}
