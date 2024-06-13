import { Component, Input, OnInit, inject, input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Tarjeta } from 'src/app/models/tarjeta.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-tarjeta',
  templateUrl: './add-update-tarjeta.component.html',
  styleUrls: ['./add-update-tarjeta.component.scss'],
})
export class AddUpdateTarjetaComponent implements OnInit {

  @Input() tarjeta: Tarjeta

  form = new FormGroup({
    id: new FormControl(""),
    numeroTarjeta: new FormControl(null, [Validators.min(16), Validators.required]),
    banco: new FormControl('', [Validators.min(3), Validators.required]),
    cvv: new FormControl(null, [Validators.min(3), Validators.required]),
    fechVenc: new FormControl('', [Validators.required]),
    tipo: new FormControl('', [Validators.minLength(4), Validators.required]),

  })
  constructor() { }
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService)
  user = {} as User;

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');
    if (this.tarjeta) this.form.setValue(this.tarjeta);
  }


  submit() {
    if (this.form.valid) {
      if (this.tarjeta) this.updateTarjeta();
      else this.createTarjeta();
    }

  }
  async createTarjeta() {


    let path = `users/${this.user.uid}/tarjetas`
    const loading = await this.utilsSvc.loading();
    await loading.present();

    delete this.form.value.id


    this.firebaseSvc.addDocument(path, this.form.value).then(async res => {

      this.utilsSvc.demisseModal({ success: true });

      this.utilsSvc.presentToast({
        message: "Producto Creado Exitosamente",
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      })

    }).catch(error => {
      console.log(error);



    }).finally(() => {
      loading.dismiss();
    })


  }

  async updateTarjeta() {

    let path = `users/${this.user.uid}/tarjetas/${this.tarjeta.id}`
    const loading = await this.utilsSvc.loading();
    await loading.present();

    delete this.form.value.id


    this.firebaseSvc.updateDocument(path, this.form.value).then(async res => {

      this.utilsSvc.demisseModal({ success: true });

      this.utilsSvc.presentToast({
        message: "Producto Actualizadp Exitosamente",
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      })

    }).catch(error => {
      console.log(error);



    }).finally(() => {
      loading.dismiss();
    })

  }



}
