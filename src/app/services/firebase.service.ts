import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from "firebase/auth"
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { getFirestore, setDoc, doc, getDoc, addDoc, collection, collectionData, query, updateDoc, deleteDoc } from '@angular/fire/firestore'
import { UtilsService } from './utils.service';
import { deleteObject, getStorage, ref } from "firebase/storage";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  fireStore = inject(AngularFirestore)
  utilSvc = inject(UtilsService)

  //================Authentication=======================
  getAuth() {
    return getAuth();
  }

  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password)
  }


  //===============Create User===========================

  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password)
  }

  //=============== Modifier User =========================
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName })
  }

  //?================ Correo Para Restablecer Contraseña=?=====================
  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email)
  }


  //============== DATA BASE =============================



  //============== OBtener Documento de la colección======


  getColecctionData(path: string, collectionQuery?: any) {
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref, collectionQuery), { idField: 'id' });

  }

  //============= Setear Document ========================

  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);

  }
  //============= Update Document ========================

  updateDocument(path: string, data: any) {
    return updateDoc(doc(getFirestore(), path), data);

  }

  //============= Eliminar Document ========================

  deleteDocument(path: string) {
    return deleteDoc(doc(getFirestore(), path));

  }

  async getDocument(path: string) {
    return ((await getDoc(doc(getFirestore(), path))).data());
  }


  //=============== Cerrar Sesion ?=======================
  signOut() {
    getAuth().signOut;
    localStorage.removeItem("user");
    this.utilSvc.routerlink("/auth")
  }
  async addDocument(path: string, data: any) {
    return await addDoc(collection(getFirestore(), path), data);
  }



  deleteFile(path: string) {
    return deleteObject(ref(getStorage(), path));

  }


}
