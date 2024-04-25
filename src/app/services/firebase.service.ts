import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc } from '@angular/fire/firestore';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  
  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);

  getAuth() {
    return getAuth();
  }

  // Registro

  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  // Login

  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  // actualizar usuario

  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName });
  }

  // envair email para reestablecer contraseña

  sendRecoberyEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  // Base de  Datos

  // Crear documento

  setDocument(path: string, data: any) {
    let usuarioJS = Object.assign({}, data);
    return setDoc(doc(getFirestore(), path), usuarioJS);
  }

  // obtener documento

  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }
}
