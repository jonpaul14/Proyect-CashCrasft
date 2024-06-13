import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'firebase/auth';
import { Gasto } from 'src/app/models/gasto.model';
import { Tarjeta } from 'src/app/models/tarjeta.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateGastoComponent } from 'src/app/shared/component/add-update-gasto/add-update-gasto.component';


@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.page.html',
  styleUrls: ['./categoria.page.scss'],
})
export class CategoriaPage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  gastos: Gasto[] = [];
  loading: boolean = false;
  tarjetaId: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.tarjetaId = this.route.snapshot.paramMap.get('tarjetaId');
    this.getGastos(this.tarjetaId);
  }

  // Método para obtener los gastos de una tarjeta específica
  getGastos(tarjetaId: string) {
    const user = this.utilsSvc.getFromLocalStorage('user');
    const path = `users/${user.uid}/tarjetas/${tarjetaId}/gastos`;
    this.loading = true;
    const sub = this.firebaseSvc.getColecctionData(path).subscribe({
      next: (res: any) => {
        console.log(res);
        this.gastos = res;
        this.loading = false;
        sub.unsubscribe();
      },
      error: (err: any) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  // Método para confirmar la eliminación de un gasto
  async confirmDeleteGasto(gasto: Gasto) {
    this.utilsSvc.presentAlert({
      header: 'Eliminar Gasto',
      message: '¿Quieres eliminar este gasto?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
        }, {
          text: 'Sí, eliminar',
          handler: () => {
            this.deleteGasto(gasto);
          }
        }
      ]
    });
  }

  // Método para eliminar un gasto
  async deleteGasto(gasto: Gasto) {
    const user = this.utilsSvc.getFromLocalStorage('user');
    const path = `users/${user.uid}/tarjetas/${this.tarjetaId}/gastos/${gasto.id}`;
    const loading = await this.utilsSvc.loading();
    await loading.present();

    this.firebaseSvc.deleteDocument(path).then(async () => {
      this.gastos = this.gastos.filter(t => t.id !== gasto.id);

      this.utilsSvc.presentToast({
        message: 'Gasto eliminado correctamente',
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

  // Método para agregar o actualizar un gasto
  async addUpdateGasto(gasto?: Gasto) {
    const success = await this.utilsSvc.presenModal({
      component: AddUpdateGastoComponent,
      cssClass: 'add-update-modal',
      componentProps: { gasto, tarjetaId: this.tarjetaId }
    });
    if (success) this.getGastos(this.tarjetaId);
  }

  doRefresh(event: any) {
    setTimeout(() => {
      this.getGastos(this.tarjetaId);
      event.target.complete();
    }, 1000);
  }

  backhome() {

    return this.utilsSvc.routerlink("/main/home");
  }

}
