import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PedidoDTO } from '../../models/pedido.dto';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
 @IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {
   pedido: PedidoDTO; //vai vir da página de endereço
   parcelas: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
   formGroup: FormGroup;
   constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder) {
     this.pedido = this.navParams.get('pedido'); //veio o objeto pedido da página de endereço
     this.formGroup = this.formBuilder.group({
      numeroDeParcelas: [1, Validators.required], //o número de parcelas é ignorado no backend caso seja boleto
      //pagamentoComCartao, precisa estar igual ao nome dado no BackEnd
      "@type": ["pagamentoComCartao", Validators.required] //type informa se é pagamento com cartão ou boleto
    });
  }
   nextPage() {
    this.pedido.pagamento = this.formGroup.value;
    this.navCtrl.setRoot('OrderConfirmationPage', {pedido: this.pedido});
  }
}