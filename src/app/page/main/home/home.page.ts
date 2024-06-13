import { Component, OnInit, inject } from '@angular/core';
import { Tarjeta } from 'src/app/models/tarjeta.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateTarjetaComponent } from 'src/app/shared/component/add-update-tarjeta/add-update-tarjeta.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  router = inject(Router);

  tarjetas: Tarjeta[] = [];
  loading: boolean = false;
  selectedTarjeta: Tarjeta | null = null;

  ngOnInit() {
    this.getTarjetas();
  }

  // Obtener el usuario desde el almacenamiento local
  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  ionViewWillEnter() {
    this.getTarjetas();
  }

  doRefresh(event: any) {
    setTimeout(() => {
      this.getTarjetas();
      event.target.complete();
    }, 1000);
  }

  // Método para obtener las tarjetas
  getTarjetas() {
    const path = `users/${this.user().uid}/tarjetas`;
    this.loading = true;
    const sub = this.firebaseSvc.getColecctionData(path).subscribe({
      next: (res: any) => {
        console.log(res);
        this.tarjetas = res;
        this.loading = false;
        sub.unsubscribe();
      },
      error: (err: any) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  // Método para agregar o actualizar una tarjeta
  async addUpdateTarjeta(tarjeta?: Tarjeta) {
    const success = await this.utilsSvc.presenModal({
      component: AddUpdateTarjetaComponent,
      cssClass: 'add-update-modal',
      componentProps: { tarjeta }
    });
    if (success) this.getTarjetas();
  }

  // Método para confirmar la eliminación de una tarjeta
  async confirmDeleteTarjeta(tarjeta: Tarjeta) {
    this.utilsSvc.presentAlert({
      header: 'Eliminar Tarjeta',
      message: '¿Quieres eliminar esta tarjeta?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
        }, {
          text: 'Sí, eliminar',
          handler: () => {
            this.deleteTarjeta(tarjeta);
          }
        }
      ]
    });
  }

  // Método para eliminar una tarjeta
  async deleteTarjeta(tarjeta: Tarjeta) {
    const path = `users/${this.user().uid}/tarjetas/${tarjeta.id}`;
    const loading = await this.utilsSvc.loading();
    await loading.present();

    this.firebaseSvc.deleteDocument(path).then(async () => {
      this.tarjetas = this.tarjetas.filter(t => t.id !== tarjeta.id);

      this.utilsSvc.presentToast({
        message: 'Tarjeta eliminada correctamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });
    }).catch(error => {
      console.error(error);
    }).finally(() => {
      loading.dismiss();
    });
  }

  // Método para navegar a la página de gastos de una tarjeta específica
  viewGastos(tarjeta: Tarjeta) {
    this.router.navigate(['./main/categoria', { tarjetaId: tarjeta.id }]);
  }
}
