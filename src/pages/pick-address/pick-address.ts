import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EnderecoDTO } from '../../models/endereco.dto';
import { StorageService } from '../../services/storage.service';
import { ClienteService } from '../../services/domain/cliente.service';
import { PedidoDTO } from '../../models/pedido.dto';
import { CartService } from '../../services/domain/cart.service';

@IonicPage()
@Component({
  selector: 'page-pick-address',
  templateUrl: 'pick-address.html',
})
export class PickAddressPage {
   items: EnderecoDTO[];
   pedido: PedidoDTO;

   constructor(
     public navCtrl: NavController,
     public navParams: NavParams,
     public storage: StorageService,
     public clienteService: ClienteService,
     public cartService: CartService) {
  }

   ionViewDidLoad() {
    let localUser = this.storage.getLocalUser();
      if (localUser && localUser.email) { //verifico se o usuário está logado
        this.clienteService.findByEmail(localUser.email)
          .subscribe(response => {
            this.items = response['enderecos']; //coloco entre colchetes para não reclamar se há endereços ou não
            
            let cart = this.cartService.getCart(); //pega o carrinho do localStorage

            this.pedido = {
              cliente: {id: response['id']},
              enderecoDeEntrega: null,
              pagamento: null,
              //Vamos percorrer a lista de carrinho para converter o formato da lista de produtos para o que vamos enviar
              //map percorre a lista do carrinho e vai transformar essa lista em outra lista
              itens: cart.items.map(x => {return {quantidade: x.quantidade, produto: {id: x.produto.id}}}) //os itens do pedido são os itens do carrinho
            }
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

    nextPage(item: EnderecoDTO) {
      this.pedido.enderecoDeEntrega = {id: item.id};
      console.log(this.pedido); 
    }
}