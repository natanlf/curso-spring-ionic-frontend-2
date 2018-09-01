import { STORAGE_KEYS } from './../config/storage_keys.config';
import { LocalUser } from './../models/local_user';
import { Injectable } from '@angular/core';
import { Cart } from "../models/cart";

@Injectable()
export class StorageService{
    getLocalUser(): LocalUser{ //pega o usuário logado pela key do local storage
        let usr = localStorage.getItem(STORAGE_KEYS.localUser);
        if(usr==null){
            return null; //se não estiver logado retorna nulo
        }else{ //se existir retorna o usuário convertendo para json, pois o local storage armazena string
            return JSON.parse(usr); 
        }
    }

    setLocalUser(obj: LocalUser){ //coloca o usuário logado no local storage
        if(obj==null){ //se o objeto que passar for nulo, quer dizer que quero remover do local storage
            localStorage.removeItem(STORAGE_KEYS.localUser);
        }else{ //converto de json para string, pois o local storage trabalha com string
            localStorage.setItem(STORAGE_KEYS.localUser, JSON.stringify(obj));
        }
    }
    
    getCart() : Cart { //peg ao carrinho
        let str = localStorage.getItem(STORAGE_KEYS.cart);
        if (str != null) {
            return JSON.parse(str);
        }
        else {
            return null;
        }
    }
    
    setCart(obj : Cart) { //adiciona o item no carrinho
        if (obj != null) {
            localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(obj));
        } 
        else {
            localStorage.removeItem(STORAGE_KEYS.cart);
        }
    }
}