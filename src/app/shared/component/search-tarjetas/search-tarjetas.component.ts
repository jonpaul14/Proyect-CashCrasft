import { Component, OnInit, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Tarjeta } from 'src/app/models/tarjeta.model';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-search-tarjetas',
  templateUrl: './search-tarjetas.component.html',
  styleUrls: ['./search-tarjetas.component.scss'],
})
export class SearchTarjetasComponent implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  modalCtrl = inject(ModalController);
  searchControl = new FormControl();
  tarjetas: Tarjeta[] = [];
  loading: boolean = false;

  constructor() { }

  ngOnInit() {
    this.searchControl.valueChanges.subscribe(value => {
      if (value) {
        this.searchTarjetas(value);
      } else {
        this.tarjetas = [];
      }
    });
  }

  searchTarjetas(tipo: string) {
    this.loading = true;
    const user = this.utilsSvc.getFromLocalStorage('user');
    this.firebaseSvc.getTarjetasByTipo(user.uid, tipo).subscribe({
      next: (res: any) => {
        this.tarjetas = res;
        this.loading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  selectTarjeta(tarjeta: Tarjeta) {
    this.modalCtrl.dismiss(tarjeta);
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }
}
