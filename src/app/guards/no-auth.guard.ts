import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UtilsService } from '../services/utils.service';
import { FirebaseService } from '../services/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class noAuthGuard implements CanActivate {

  constructor() {}

  utilSvc = inject(UtilsService); 
  firebaseSvc = inject(FirebaseService);


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return new Promise((resolve) => {
        this.firebaseSvc.getAuth().onAuthStateChanged((auth) => {
          if(!auth) resolve(true);
          else{
            this.utilSvc.routerLink('/tabs');
            resolve(false);
          }
        });
      });
  }
}
