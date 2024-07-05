import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Tarjeta } from 'src/app/models/tarjeta.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Observable, of } from 'rxjs';
import { debounceTime, first, map, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-add-update-tarjeta',
  templateUrl: './add-update-tarjeta.component.html',
  styleUrls: ['./add-update-tarjeta.component.scss'],
})
export class AddUpdateTarjetaComponent implements OnInit {

  @Input() tarjeta: Tarjeta;
  cardType: string = '';

  form = new FormGroup({
    id: new FormControl(""),
    numeroTarjeta: new FormControl(null, {
      validators: [Validators.required, Validators.pattern(/^\d{16}$/), this.validateCardType.bind(this)],
      asyncValidators: [this.uniqueCardNumberValidator()],
      updateOn: 'blur' // Lanza la validación al perder el foco
    }),
    banco: new FormControl('', [Validators.minLength(3), Validators.required]),
    cvv: new FormControl(null, [Validators.required, Validators.pattern(/^\d{3}$/)]),
    fechVenc: new FormControl('', [Validators.required]),
    tipo: new FormControl({ value: '', disabled: true }, [Validators.required]),
    capacidad: new FormControl(null, [Validators.min(0), Validators.required])
  });

  constructor() { }
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  user = {} as User;

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');
    if (this.tarjeta) this.form.setValue({
      ...this.tarjeta,
      numeroTarjeta: +this.tarjeta.numeroTarjeta,
      capacidad: +this.tarjeta.capacidad
    });
  }

  validateCardType(control: FormControl) {
    const value = control.value;
    if (!value) return null;

    const visaRegex = /^4[0-9]{12}(?:[0-9]{3})?$/;
    const masterCardRegex = /^5[1-5][0-9]{14}$/;

    if (visaRegex.test(value)) {
      this.form.controls['tipo'].setValue('Visa');
      this.cardType = 'visa';
      return null;
    } else if (masterCardRegex.test(value)) {
      this.form.controls['tipo'].setValue('MasterCard');
      this.cardType = 'mastercard';
      return null;
    } else {
      this.cardType = '';
      return { invalidCardType: true };
    }
  }

  uniqueCardNumberValidator(): AsyncValidatorFn {
    return (control: FormControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }
      return this.firebaseSvc.checkCardNumberExists(this.user.uid, control.value).pipe(
        debounceTime(500),
        map(exists => (exists ? { cardNumberTaken: true } : null)),
        catchError(() => of(null)),
        first()
      );
    };
  }

  submit() {
    if (this.form.valid) {
      if (this.tarjeta) this.updateTarjeta();
      else this.createTarjeta();
    }
  }

  async createTarjeta() {
    let path = `users/${this.user.uid}/tarjetas`;
    const loading = await this.utilsSvc.loading();
    await loading.present();

    // Habilitar el campo tipo para incluirlo en el formulario
    this.form.controls['tipo'].enable();

    const formValue = { ...this.form.value, numeroTarjeta: +this.form.value.numeroTarjeta, capacidad: +this.form.value.capacidad };
    delete formValue.id;

    this.firebaseSvc.addDocument(path, formValue).then(async res => {
      this.utilsSvc.demisseModal({ success: true });

      this.utilsSvc.presentToast({
        message: "Tarjeta Creada Exitosamente",
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });

    }).catch(error => {
      console.log(error);
    }).finally(() => {
      loading.dismiss();
    });
  }

  async updateTarjeta() {
    let path = `users/${this.user.uid}/tarjetas/${this.tarjeta.id}`;
    const loading = await this.utilsSvc.loading();
    await loading.present();

    // Habilitar el campo tipo para incluirlo en el formulario
    this.form.controls['tipo'].enable();

    const formValue = { ...this.form.value, numeroTarjeta: +this.form.value.numeroTarjeta, capacidad: +this.form.value.capacidad };
    delete formValue.id;

    this.firebaseSvc.updateDocument(path, formValue).then(async res => {
      this.utilsSvc.demisseModal({ success: true });

      this.utilsSvc.presentToast({
        message: "Tarjeta Actualizada Exitosamente",
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });

    }).catch(error => {
      console.log(error);
    }).finally(() => {
      loading.dismiss();
    });
  }
}
