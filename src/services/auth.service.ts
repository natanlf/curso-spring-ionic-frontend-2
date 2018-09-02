import { LocalUser } from './../models/local_user';
import { API_CONFIG } from './../config/api.config';
import { HttpClient } from '@angular/common/http';
import { CredenciaisDTO } from './../models/credenciais.dto';
import { Injectable } from "@angular/core";
import { StorageService } from './storage.service';
import { JwtHelper } from "angular2-jwt";
import { CartService } from "./domain/cart.service";

@Injectable()
export class AuthService{

    jwtHelper: JwtHelper = new JwtHelper();

    constructor(
        public http: HttpClient, 
        public storage: StorageService,
        public cartService: CartService){

    }

    authenticate(creds : CredenciaisDTO) {
        return this.http.post(
            `${API_CONFIG.baseUrl}/login`, 
            creds,
            {
                observe: 'response',
                responseType: 'text' //uso text pois não tenho corpo só header, assim não terei erro de parse json
            });
    }

    //Quando o usuário vai abrir o app, não vai precisar logar novamente caso o token ainda esteja válido
    refreshToken() {
        return this.http.post(
            `${API_CONFIG.baseUrl}/auth/refresh_token`, 
            {},
            {
                observe: 'response',
                responseType: 'text' //uso text pois não tenho corpo só header, assim não terei erro de parse json
            });
    }

    //precisa receber um argumento que é o Beader token
    successfulLogin(authorizationValue: string){
        let tok =  authorizationValue.substring(7); //assim tiro a palavra Beader espaço e deixo só o token
        let user : LocalUser = { //local user recebe o token
            token: tok,
            email: this.jwtHelper.decodeToken(tok).sub //extraindo email do token
        };
        this.storage.setLocalUser(user); //assim guardo o usuário no LocalStorage
        this.cartService.createOrClearCart(); //limpa o carrinho quando houver troca de usuários
    }

    logout(){ //o logout vai lá no Storage e remove o usuário
        this.storage.setLocalUser(null);
    }
}