import { Component, Input, OnInit, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
  @Input() capacidadTarjeta: number;

  form = new FormGroup({
    id: new FormControl(""),
    nombreCategoria: new FormControl("", [Validators.minLength(4), Validators.required]),
    descripcion: new FormControl('', [Validators.minLength(4), Validators.required]),
    presupuesto: new FormControl(null, [Validators.required, Validators.min(0)]), // Modificado validator de mínimo
    fechaReg: new FormControl(null, [Validators.required, this.dateValidator]), // Añadido validator de fecha
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
        presupuesto: +this.gasto.presupuesto,
        fechaReg: this.gasto.fechaReg || new Date().toISOString().split('T')[0] // Añadir fecha actual si no está definido
      });
    } else {
      this.form.patchValue({ fechaReg: new Date().toISOString().split('T')[0] }); // Establecer la fecha actual en nuevos gastos
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

    const newGasto = { ...this.form.value, presupuesto: +this.form.value.presupuesto };
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
    const path = `users/${this.user.uid}/tarjetas/${this.gasto.id}`;
    const loading = await this.utilsSvc.loading();
    await loading.present();

    const updatedGasto = { ...this.form.value, presupuesto: +this.form.value.presupuesto };
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

  // Validator para asegurar que la fecha no sea menor a la actual
  dateValidator(control: AbstractControl): ValidationErrors | null {
    const inputDate = new Date(control.value);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Asegurar que se compara solo la fecha sin la hora
    return inputDate >= currentDate ? null : { invalidDate: true };
  }
}

export function capacidadTarjetaValidator(capacidad: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const presupuesto = control.value;
    return presupuesto <= capacidad ? null : { capacidadExcedida: true };
  };
}
