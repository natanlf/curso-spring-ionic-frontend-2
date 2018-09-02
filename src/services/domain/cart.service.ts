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

    removeProduto(produto: ProdutoDTO) : Cart {
        let cart = this.getCart();
        let position = cart.items.findIndex(x => x.produto.id == produto.id);
        if (position != -1) { //se for -1 então existe na lista e removemos o item
            cart.items.splice(position, 1); //remove o item do carrinho
        }
        this.storage.setCart(cart); //atualizamos o carrinho no localStorage
        return cart;
    }
     increaseQuantity(produto: ProdutoDTO) : Cart { //aumenta a quantidade do produto
        let cart = this.getCart();
        let position = cart.items.findIndex(x => x.produto.id == produto.id);
        if (position != -1) {
            cart.items[position].quantidade++;
        }
        this.storage.setCart(cart);
        return cart;
    }
     decreaseQuantity(produto: ProdutoDTO) : Cart { //diminui a quantidade do produto
        let cart = this.getCart();
        let position = cart.items.findIndex(x => x.produto.id == produto.id);
        if (position != -1) {
            cart.items[position].quantidade--;
            if (cart.items[position].quantidade < 1) {
                cart = this.removeProduto(produto);
            }
        }
        this.storage.setCart(cart);
        return cart;
    }
     total() : number {
        let cart = this.getCart(); //pega o carrinho
        let sum = 0;
        for (var i=0; i<cart.items.length; i++) { //percorre os itens do carrinho
            sum += cart.items[i].produto.preco * cart.items[i].quantidade;
        }
        return sum;
    }
}