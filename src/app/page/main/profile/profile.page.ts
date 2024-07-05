import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  router = inject(Router);
  firebaseSvc = inject(FirebaseService);
  utilSvc = inject(UtilsService);
  currentPath: string = '';

  user(): User {
    return this.utilSvc.getFromLocalStorage('user');
  }

}
