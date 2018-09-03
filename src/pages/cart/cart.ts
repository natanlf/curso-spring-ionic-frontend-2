import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CartItem } from '../../models/cart-item';
import { ProdutoService } from '../../services/domain/produto.service';
import { API_CONFIG } from '../../config/api.config';
import { CartService } from '../../services/domain/cart.service';
import { ProdutoDTO } from '../../models/produto.dto';

 @IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {
   items: CartItem[];
   constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public cartService: CartService,
    public produtoService: ProdutoService) {
  }
   ionViewDidLoad() {
     //pegamos o carrinho esse método getCart cria um caso seja necessário
    let cart = this.cartService.getCart(); 
    this.items = cart.items;
    this.loadImageUrls();
  }
   loadImageUrls() { //pega as imagens dos produtos que possuem imagem
    for (var i=0; i<this.items.length; i++) {
      let item = this.items[i];
      this.produtoService.getSmallImageFromBucket(item.produto.id)
        .subscribe(response => {
          item.produto.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod${item.produto.id}-small.jpg`;
        },
        error => {});
    }
  }
  
  //passa o produto que será removido para o método de remover do cartService 
  removeItem(produto: ProdutoDTO) {
    this.items = this.cartService.removeProduto(produto).items;
  }
   increaseQuantity(produto: ProdutoDTO) {
    this.items = this.cartService.increaseQuantity(produto).items;
  }
   decreaseQuantity(produto: ProdutoDTO) {
    this.items = this.cartService.decreaseQuantity(produto).items;
  }
   total() : number {
    return this.cartService.total();
  }  
   goOn() {
    this.navCtrl.setRoot('CategoriasPage');
  }

  checkout() { //finalizar o pedido, chamo a páginda de escolha de endereço
    this.navCtrl.push('PickAddressPage');
  }
}