import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required,noWhitespaceValidator(),minLengthValidator(6)])
  })
  constructor() { }
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService)

  ngOnInit() {
  }

  async submit() {
    const loading = await this.utilsSvc.loading();
    await loading.present();
   if(this.form.valid){
    this.firebaseSvc.signIn(this.form.value as User).then(res=>{
      this.getUserInfo(res.user.uid)
      console.log(res)
    }).catch(error =>{
      console.log(error);
      this.utilsSvc.presentToast({
        message:error.message,
        duration:2500,
        color:'primary',
        position:'middle',
        icon:'alert-circle-outline'
      })
      

    }).finally(()=>{
      loading.dismiss();
    })
    
   }
  }

  async getUserInfo(uid:string) {
    
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();
      let path = `users/${uid}`
      
      this.firebaseSvc.getDocument(path).then((user:User) => {
        this.utilsSvc.saveLocalStorage('user',user)
        this.utilsSvc.routerlink('/main/home');
        this.form.reset();
        
        this.utilsSvc.presentToast({
          message: `Te damos la Bienvenida ${user.name}`,
          duration: 1500,
          color: 'primary',
          position: 'middle',
          icon: 'person-circle-outline'
        })
        
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
