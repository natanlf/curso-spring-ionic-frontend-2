import { ProdutoService } from '../../services/domain/produto.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProdutoDTO } from '../../models/produto.dto';
import { API_CONFIG } from '../../config/api.config';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {
  //sempre que eu buscar uma nova página vou concatenar com uma lista que já existia
  //por isso que a lista tem que começar vazia, pois a busca é paginada
  items : ProdutoDTO[] = []; 
  page : number = 0;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public produtoService: ProdutoService,
    public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    this.loadData();
  }

  loadData(){
    let categoria_id = this.navParams.get('categoria_id'); //assim pego o id que foi selecionado na página de categoria
    let loader = this.presentLoading(); //chamo o loader
    //busca paginada
    this.produtoService.findByCategoria(categoria_id, this.page, 10)
    .subscribe(response=>{
      let start = this.items.length; //tamanho da lista antes do carregamento
      //estou concatenando a lista antiga com a nova pois é uma busca paginada
      this.items = this.items.concat(response['content']);
      let end = this.items.length-1; //tamanho da lista após o carregamento menos 1
      loader.dismiss(); //fecho o loader
      console.log(this.page);
      console.log(this.items);
      this.loadImageUrls(start, end);
    },error=>{
      loader.dismiss(); //fecho o loader
    });
  }

  //a posição inicial é o valor que a lista tinha antes do carregamento
  //a posição final é o valor que a lista tem depois do carregamento menos 1
  loadImageUrls(start: number, end: number) {
    for (var i=start; i<=end; i++) {
      let item = this.items[i];
      this.produtoService.getSmallImageFromBucket(item.id)
        .subscribe(response => {
          item.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod${item.id}-small.jpg`;
        },
        error => {});
    }
  }
  
  showDetail(produto_id: string){
    this.navCtrl.push("ProdutoDetailPage", {produto_id: produto_id});
  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Aguarde..."
    });
    loader.present();
    return loader;
  }

  //como famzemos uma busca paginada devemos zerar a nosa lista e página
  //caso contrário temos um carregamento desordenado
  doRefresh(refresher) { 
    this.page = 0;
    this.items = [];
    this.loadData();
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  doInfinite(infiniteScroll) { //infinite scroll
    //toda vez que esse método for chamado significa que queremos buscar mais dados
    //incrementamos a página e pegamos mais dados chamando o loadData
    this.page++;
    this.loadData();
    setTimeout(() => {
      infiniteScroll.complete();
    }, 1000);
  }
}