import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EnderecoDTO } from '../../models/endereco.dto';
import { StorageService } from '../../services/storage.service';
import { ClienteService } from '../../services/domain/cliente.service';

@IonicPage()
@Component({
  selector: 'page-pick-address',
  templateUrl: 'pick-address.html',
})
export class PickAddressPage {
   items: EnderecoDTO[];
   constructor(
     public navCtrl: NavController,
     public navParams: NavParams,
     public storage: StorageService,
     public clienteService: ClienteService) {
  }
   ionViewDidLoad() {
    let localUser = this.storage.getLocalUser();
      if (localUser && localUser.email) { //verifico se o usuário está logado
        this.clienteService.findByEmail(localUser.email)
          .subscribe(response => {
            this.items = response['enderecos']; //coloco entre colchetes para não reclamar se há endereços ou não
          },
          error => {
            if (error.status == 403) {
              this.navCtrl.setRoot('HomePage');
            }
        });
      }
      else {
        this.navCtrl.setRoot('HomePage');
      }
    }
}