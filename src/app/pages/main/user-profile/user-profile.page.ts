import { Component, OnInit, inject } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage {

  constructor() { }

  utilSvc = inject(UtilsService);
  firebaseSvc = inject(FirebaseService);


   user(): User {
    return this.utilSvc.getFromLocalStorage('user');
  }
  

  signOut(){
    this.firebaseSvc.signOut();
  }

}
