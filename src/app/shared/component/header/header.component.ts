import { Component, Input, OnInit, inject, input } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { SearchTarjetasComponent } from '../search-tarjetas/search-tarjetas.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() title!: String;
  @Input() backButton!: string;
  @Input() isModal!: boolean;
  @Input() showMenu!: boolean;

  utilsSvc = inject(UtilsService)

  ngOnInit() { }

  dismissModal() {
    this.utilsSvc.demisseModal();
  }
  async openSearchModal() {
    const modal = await this.utilsSvc.presenModal({
      component: SearchTarjetasComponent,
      cssClass: 'search-modal'
    });
    return await modal.present();
  }

}
