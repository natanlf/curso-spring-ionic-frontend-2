import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PedidoDTO } from '../../models/pedido.dto';
import { CartItem } from '../../models/cart-item';
import { EnderecoDTO } from '../../models/endereco.dto';
import { ClienteDTO } from '../../models/cliente.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { CartService } from '../../services/domain/cart.service';
import { PedidoService } from '../../services/domain/pedido.service';

@IonicPage()
@Component({
  selector: 'page-order-confirmation',
  templateUrl: 'order-confirmation.html',
})
export class OrderConfirmationPage {
   pedido: PedidoDTO;
  cartItems: CartItem[];
  cliente: ClienteDTO;
  endereco: EnderecoDTO;
  codpedido: string;

   constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public clienteService: ClienteService,
    public cartService: CartService,
    public pedidoService: PedidoService) {
     this.pedido = this.navParams.get('pedido'); //recebo o objeto pedido passado pela página anterior
  }

   ionViewDidLoad() {
    this.cartItems = this.cartService.getCart().items; //pego os itens do carrinho
     this.clienteService.findById(this.pedido.cliente.id) //vou buscar o cliente logado por id
      .subscribe(response => {
        this.cliente = response as ClienteDTO;
        this.endereco = this.findEndereco(this.pedido.enderecoDeEntrega.id, response['enderecos']);
      },
      error => {
        this.navCtrl.setRoot('HomePage');
      });
  }

  //percorre a lita de endereços e retorna o endereço que tme o id passado
   private findEndereco(id: string, list: EnderecoDTO[]) : EnderecoDTO {
    let position = list.findIndex(x => x.id == id);
    return list[position];
  }
   total() : number {
    return this.cartService.total();
  } 

  back() {
    this.navCtrl.setRoot('CartPage');
  }

  home() {
    this.navCtrl.setRoot('CategoriasPage');
  }

  checkout() {
    this.pedidoService.insert(this.pedido)
      .subscribe(response => {
        this.cartService.createOrClearCart(); //se a inserção do pedido der certo então limpo o carrinho
        this.codpedido = this.extractId(response.headers.get('location')); //pega o id do pedido que fi inserido no banco de dados
      },
      error => { //se algo der acesso negado vai para a página home
        if (error.status == 403) {
          this.navCtrl.setRoot('HomePage');
        }
      });
  }

  private extractId(location : string) : string {
    let position = location.lastIndexOf('/'); //ultima posição da ultima barra
    return location.substring(position + 1, location.length); //pego apartir da barra ais um, ou seja, o caracter que está na frente da barra
  }
}