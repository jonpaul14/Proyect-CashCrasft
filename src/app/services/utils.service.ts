import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AlertOptions, LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController)
  modalCtrl = inject(ModalController)
  router = inject(Router)
  alertCtrl = inject(AlertController)

  async presentAlert(opts?: AlertOptions) {
    const alert = await this.alertCtrl.create(opts);
    await alert.present();
  }



  //=========================Loading=====================
  loading() {
    return this.loadingCtrl.create({ spinner: 'crescent' })
  }

  //=========================Toast=======================
  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }
  //E¿==========Enrutar a culquier page===============

  routerlink(url: string) {
    return this.router.navigateByUrl(url);
  }
  //==========GUARDAR ELEMENTO EN EL LOCAL STORAGE=====

  saveLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));

  }

  //================= OBTENER ELEMENTO EN EL LOCAL STORGE =======

  getFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key))

  }

  //================= MODAL ======================================

  async presenModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts);
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) return data

  }
  //============== Cerrar Modal

  demisseModal(data?: any) {
    return this.modalCtrl.dismiss(data);
  }

}
