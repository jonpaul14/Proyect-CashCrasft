import { Component, OnInit, inject, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Gasto } from 'src/app/models/gasto.model';
import { Tarjeta } from 'src/app/models/tarjeta.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateGastoComponent } from 'src/app/shared/component/add-update-gasto/add-update-gasto.component';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.page.html',
  styleUrls: ['./categoria.page.scss'],
})
export class CategoriaPage implements OnInit, AfterViewInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  gastos: Gasto[] = [];
  loading: boolean = false;
  tarjetaId: string;
  tarjeta: Tarjeta;
  saldoRestante: number;
  chart: any;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.tarjetaId = this.route.snapshot.paramMap.get('tarjetaId');
    this.getTarjeta(this.tarjetaId);
    Chart.register(...registerables); // Registrar todos los componentes de Chart.js
  }

  ngAfterViewInit(): void {
    this.generarGrafico();
  }

  // Método para obtener los detalles de una tarjeta específica
  getTarjeta(tarjetaId: string) {
    const user = this.utilsSvc.getFromLocalStorage('user');
    const path = `users/${user.uid}/tarjetas/${tarjetaId}`;
    this.loading = true;
    const sub = this.firebaseSvc.getDocumentData(path).subscribe({
      next: (res: any) => {
        console.log(res);
        this.tarjeta = res;
        this.getGastos(this.tarjetaId); // Obtener gastos después de obtener la tarjeta
        sub.unsubscribe();
      },
      error: (err: any) => {
        console.error(err);
        this.loading = false;
      }
    });
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
        this.calculateSaldoRestante(); // Calcular el saldo restante después de obtener los gastos
        this.generarGrafico(); // Generar gráfico después de obtener los gastos
        sub.unsubscribe();
      },
      error: (err: any) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  // Método para calcular el saldo restante de la tarjeta
  calculateSaldoRestante() {
    if (!this.gastos || !this.tarjeta) {
      console.error('Gastos o tarjeta no disponibles');
      return;
    }
    const totalGastos = this.gastos.reduce((sum, gasto) => { 
      return parseFloat((sum + gasto.presupuesto * 1).toFixed(2)); // Asegúrate de que 'presupuesto' sea la propiedad correcta
    }, 0);
    this.saldoRestante = parseFloat((this.tarjeta.capacidad - totalGastos).toFixed(2));

    // Mostrar notificación si el saldo restante está al 10% o menos de la capacidad total
    if (this.saldoRestante <= this.tarjeta.capacidad * 0.1) {
      this.utilsSvc.presentAlert({
        header: 'Advertencia',
        message: 'La capacidad de la tarjeta está al 10% o menos.',
        mode: 'ios',
        buttons: ['OK']
      });
    }
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

      // Recalcular el saldo restante después de eliminar un gasto
      this.calculateSaldoRestante();
      this.generarGrafico(); // Regenerar gráfico después de eliminar un gasto
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
      componentProps: { gasto, tarjetaId: this.tarjetaId, capacidadTarjeta: this.tarjeta.capacidad }
    });
    if (success) {
      this.getGastos(this.tarjetaId);
    }
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

  generarGrafico() {
    if (this.chart) {
      this.chart.destroy();
    }

    const labels = this.gastos.map(gasto => gasto.nombreCategoria);
    const data = this.gastos.map(gasto => gasto.presupuesto);

    this.chart = new Chart('myChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Gastos',
          data: data,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
