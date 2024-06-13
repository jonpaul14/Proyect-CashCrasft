import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'firebase/auth';
import { Gasto } from 'src/app/models/gasto.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-gasto',
  templateUrl: './add-update-gasto.component.html',
  styleUrls: ['./add-update-gasto.component.scss'],
})
export class AddUpdateGastoComponent implements OnInit {

  @Input() gasto: Gasto;
  @Input() tarjetaId: string;

  form = new FormGroup({
    id: new FormControl(""),
    nombreCategoria: new FormControl("", [Validators.minLength(4), Validators.required]),
    descripcion: new FormControl('', [Validators.minLength(4), Validators.required]),
    presupuesto: new FormControl(null, [Validators.min(3), Validators.required]),
  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  user = {} as User;

  constructor() { }

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');
    if (this.gasto) {
      this.form.setValue({
        id: this.gasto.id,
        nombreCategoria: this.gasto.nombreCategoria,
        descripcion: this.gasto.descripcion,
        presupuesto: this.gasto.presupuesto
      });
    }
  }

  submit() {
    if (this.form.valid) {
      if (this.gasto) this.updateGasto();
      else this.createGasto();
    }
  }

  async createGasto() {
    const path = `users/${this.user.uid}/tarjetas/${this.tarjetaId}/gastos`;
    const loading = await this.utilsSvc.loading();
    await loading.present();

    const newGasto = { ...this.form.value };
    delete newGasto.id;

    this.firebaseSvc.addDocument(path, newGasto).then(async () => {
      this.utilsSvc.demisseModal({ success: true });

      this.utilsSvc.presentToast({
        message: "Gasto Creado Exitosamente",
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

  async updateGasto() {
    const path = `users/${this.user.uid}/tarjetas/${this.tarjetaId}/gastos/${this.gasto.id}`;
    const loading = await this.utilsSvc.loading();
    await loading.present();

    const updatedGasto = { ...this.form.value };
    delete updatedGasto.id;

    this.firebaseSvc.updateDocument(path, updatedGasto).then(async () => {
      this.utilsSvc.demisseModal({ success: true });

      this.utilsSvc.presentToast({
        message: "Gasto Actualizado Exitosamente",
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
}
