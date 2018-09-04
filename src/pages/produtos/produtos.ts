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
   items : ProdutoDTO[];
   constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public produtoService: ProdutoService,
    public loadingCtrl: LoadingController) {
  }

   ionViewDidLoad() {
    let categoria_id = this.navParams.get('categoria_id'); //assim pego o id que foi selecionado na página de categoria
    let loader = this.presentLoading(); //chamo o loader
    this.produtoService.findByCategoria(categoria_id)
    .subscribe(response=>{
      this.items = response['content'];
      loader.dismiss(); //fecho o loader
      this.loadImageUrls();
    },error=>{
      loader.dismiss(); //fecho o loader
    });
  };

  loadImageUrls() {
    for (var i=0; i<this.items.length; i++) {
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
}