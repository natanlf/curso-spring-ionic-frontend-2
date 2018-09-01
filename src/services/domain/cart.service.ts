import { Injectable } from '@angular/core';
import { StorageService } from '../storage.service';
import { Cart } from '../../models/cart';
import { ProdutoDTO } from '../../models/produto.dto';
 @Injectable()
export class CartService {
     constructor(public storage: StorageService) {
    }
     createOrClearCart() : Cart {
        let cart: Cart = {items: []}; //coloco em meu objeto cart uma lista vazia
        this.storage.setCart(cart); //seto no localstorage o carrinho vazio
        return cart;
    }
     getCart() : Cart {
        let cart: Cart = this.storage.getCart(); //pego o carrinho do localstorage
        if (cart == null) { //se o cart esta nulo então cria senão só retorna
            cart = this.createOrClearCart();
        }
        return cart;
    }
     addProduto(produto: ProdutoDTO) : Cart { //adiciona produto ao carrihno
        let cart = this.getCart();
        //procuramos na lista de produtos do carrinho se existe algum com o mesmo id que o produto que desejamos inserir
        //se o produto existir na lista vai ser retornada sua posição, caso contrário retorna -1
        //o findindex funciona dessa forma
        let position = cart.items.findIndex(x => x.produto.id == produto.id);
        if (position == -1) { //produto não existe então adicionamos o elemento na lista
            cart.items.push({quantidade: 1, produto: produto});
        }
        this.storage.setCart(cart); //adiciono o carrinho no localStorage
        return cart;
    }
}