import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
@Component({
  selector: 'app-sigin-up',
  templateUrl: './sigin-up.page.html',
  styleUrls: ['./sigin-up.page.scss'],
})
export class SiginUpPage implements OnInit {

  form = new FormGroup({
    uid:new FormControl(""),
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required,noWhitespaceValidator(),minLengthValidator(6)]),
    name:new FormControl('', [Validators.minLength(4), Validators.required]),
  })
  constructor() { }
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService)

  ngOnInit() {
  }
  async submit() {
    const loading = await this.utilsSvc.loading();
    await loading.present();
    if (this.form.valid) {
      this.firebaseSvc.signUp(this.form.value as User).then(async res => {
        await this.firebaseSvc.updateUser(this.form.value.name)
        let uid = res.user.uid;
        this.form.controls.uid.setValue(uid);
        this.setUserInfo(uid)

        
      }).catch(error => {
        console.log(error);
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })


      }).finally(() => {
        loading.dismiss();
      })

    }
  }

  async setUserInfo(uid:string) {
    
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();
      let path = `users/${uid}`
      delete this.form.value.password;
      
      this.firebaseSvc.setDocument(path,this.form.value).then(async res => {
        this.utilsSvc.saveLocalStorage('user',this.form.value)
        this.utilsSvc.routerlink('/main/home');
        this.form.reset();
        
      }).catch(error => {
        console.log(error);
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })


      }).finally(() => {
        loading.dismiss();
      })

    }
  }

}
export function noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isWhitespace = (control.value || '').toString().trim().length !== control.value.length;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  };
  
}
export function minLengthValidator(minLength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isValid = (control.value || '').toString().length >= minLength;
    return isValid ? null : { 'minLength': { requiredLength: minLength } };
  };
}