import { AuthService } from './../../services/auth.service';
import { CredenciaisDTO } from './../../models/credenciais.dto';
import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { MenuController } from 'ionic-angular/components/app/menu-controller';

@IonicPage()
@Component({ //@Component faz ser o controller de alguma view
  selector: 'page-home',
  templateUrl: 'home.html' //view desse controller
})
export class HomePage { //controller da view home.html

  //Usado para fazer o bind no formulário de login, começam vazios
  creds: CredenciaisDTO = { 
    email: "",
    senha: ""
  };

  constructor(
    public navCtrl: NavController, //navController permite navegar de uma página a outra 
    public menu: MenuController, //quando entrar na página home devemos desabilitar o menu e quando sair habilitar
    public auth: AuthService) { //para fazer login
  }

  ionViewWillEnter() { //quando for entrar na página acesso o menu e o desabilito    
    this.menu.swipeEnable(false);   
  } 
 
  ionViewDidLeave() {    //quando sair da página, volta com o menu 
    this.menu.swipeEnable(true);   
  }

  ionViewDidEnter() {
    this.auth.refreshToken()
      .subscribe(response => {
        this.auth.successfulLogin(response.headers.get('Authorization'));
        this.navCtrl.setRoot('CategoriasPage');
      },
      error => {});  
  }

  login(){
    //push empilha uma página em cima da outra
    //CategoriasPage é o nome do controlador de categorias que devo colocar para chegar a página de categorias
    //navegar de uma página para outra, sempre usar this.
    //this.navCtrl.push('CategoriasPage');
    this.auth.authenticate(this.creds)
    .subscribe(response => {
      this.auth.successfulLogin(response.headers.get('Authorization')); //pega o cabeçalho como meu token
      this.navCtrl.setRoot('CategoriasPage');
    },
    error => {});    
    
  }

  signup(){
    console.log("signup");
    this.navCtrl.push("SignupPage");
  }
}
