import { ClienteService } from './../../services/domain/cliente.service';
import { ClienteDTO } from './../../models/cliente.dto';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageService } from '../../services/storage.service';
import { API_CONFIG } from '../../config/api.config';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

   cliente: ClienteDTO;

   constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: StorageService,
    public clienteService: ClienteService) {
  }
   ionViewDidLoad() {
    let localUser = this.storage.getLocalUser();
    if (localUser && localUser.email) {
      this.clienteService.findByEmail(localUser.email)
      .subscribe(response=>{
        this.cliente = response; //meu ClienteDto recebe a resposta
        this.getImageIfExists();//buscar a imagem
      },
    error=>{
      //se der erro 403 quer dizer que não estou autorizado e nesse caso o sistema
      //vai me redirecionar para a página Home
      if(error.status==403){ 
        this.navCtrl.setRoot('HomePage');
      }
    });
    }else{ //caso não ache email no local user também deve redirecionar para a página Home
      this.navCtrl.setRoot('HomePage');
    }
  }

  getImageIfExists() { //se a imagem do usuário existe então a pegamos
    this.clienteService.getImageFromBucket(this.cliente.id)
    .subscribe(response => {
      this.cliente.imageUrl = `${API_CONFIG.bucketBaseUrl}/cp${this.cliente.id}.jpg`;
    },
    error => {});
  }

}
