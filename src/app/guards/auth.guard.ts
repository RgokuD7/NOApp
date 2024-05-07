import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UtilsService } from '../services/utils.service';
import { FirebaseService } from '../services/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor() {}

  utilSvc = inject(UtilsService); 
  firebaseSvc = inject(FirebaseService);


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return new Promise((resolve) => {
        let user = this.utilSvc.getFromLocalStorage('user');
        this.firebaseSvc.getAuth().onAuthStateChanged((auth) => {
          if(auth){
            if(user) resolve(true);
          }
          else{
            this.utilSvc.routerLink('/auth');
            resolve(false);
          }
        });
      });
  }
}
