import { API_CONFIG } from './../../config/api.config';
import { CategoriaDTO } from './../../models/categoria.dto';
import { CategoriaService } from './../../services/domain/categoria.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CategoriasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-categorias',
  templateUrl: 'categorias.html',
})
export class CategoriasPage {

  bucketUrl: string = API_CONFIG.bucketBaseUrl;

  items: CategoriaDTO[]; //lista de categorias para moostrar na tela de categorias

  //coloco categoriaService no construtor para poder fazer o request e pegas a lista de categorias
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public categoriaService: CategoriaService) { 
  }

  //quando a página terminar de ser carregada, executa o que tiver dentor do método
  ionViewDidLoad() { 
    //como é uma chamada assincrona, tenho que me inscrever, então uso o subscribe
    //dentro do subscribe() coloco uma função para ser executada quando a resposta chegar
    //essa função é a famosa "callback"
    //vamos usar uma função anonima, que é também chamada de arrow function
    this.categoriaService.findAll()
      .subscribe(response =>{ //com arrow function, declarei uma função dentro de outra
        this.items = response; //tenho duas funções dentro da função subscribe, a response e a error
      },
    error => {});
  }

  showProdutos(categoria_id: string) { //envio para a página de produtos o id da categoria
    this.navCtrl.push('ProdutosPage', {categoria_id: categoria_id});    
  }
}
