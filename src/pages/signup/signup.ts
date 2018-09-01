import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { ClienteService } from './../../services/domain/cliente.service';
import { CidadeDTO } from './../../models/cidade.dto';
import { EstadoDTO } from './../../models/estado.dto';
import { EstadoService } from './../../services/domain/estado.service';
import { CidadeService } from './../../services/domain/cidade.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  //Colocamos essa variável no html para acessar as validações
  formGroup: FormGroup; //administrar o formulário
  estados: EstadoDTO[];
  cidades: CidadeDTO[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public cidadeService: CidadeService,
    public estadoService: EstadoService,
    public clienteService: ClienteService,
    public alertCtrl: AlertController ) {//administrar o formulário
    
    this.formGroup = this.formBuilder.group({ //aqui vamos validar os campos do formulário
      nome: ['Joaquim',[Validators.required, Validators.minLength(5), Validators.maxLength(120)]], //valor inicial, lista de valores que aceita
      email: ['joaquim@gmail.com', [Validators.required, Validators.email]],
      tipo : ['1', [Validators.required]],
      cpfOuCnpj : ['06134596280', [Validators.required, Validators.minLength(11), Validators.maxLength(14)]],
      senha : ['123', [Validators.required]],
      logradouro : ['Rua Via', [Validators.required]],
      numero : ['25', [Validators.required]],
      complemento : ['Apto 3', []],
      bairro : ['Copacabana', []],
      cep : ['10828333', [Validators.required]],
      telefone1 : ['977261827', [Validators.required]],
      telefone2 : ['', []],
      telefone3 : ['', []],
      estadoId : [null, [Validators.required]],
      cidadeId : [null, [Validators.required]]     
    });  
  }

  ionViewDidLoad() {
    this.estadoService.findAll()
    .subscribe(response=>{
      this.estados = response;
      //vamos atribuit o primeiro elemento da minha lista de estados no formgroup de estado
      //Dessa forma temos o primeiro estado da lista aparecendo em meu select lá na minha view
      this.formGroup.controls.estadoId.setValue(this.estados[0].id);
      this.updateCidades(); //buscamos as cidades correspondentes ao estado que está selecionado
    },error=>{

    });
  }

  updateCidades(){
    //pego o id do estado que está selecionado na minha view
    let estado_id = this.formGroup.value.estadoId;
    this.cidadeService.findAll(estado_id)
    .subscribe(response=>{
      this.cidades = response;
      //Quando mudar o estado não deve ter nenhuma cidade selecionada
      this.formGroup.controls.cidadeId.setValue(null);
    },
  error=>{

  });
  }

  signupUser() {
    this.clienteService.insert(this.formGroup.value)
    .subscribe(response=>{
      this.showInsertOK();
    },error=>{});
  }

  showInsertOK(){
    let alert = this.alertCtrl.create({
      title: "Sucesso!",
      message: "Cadastro efetuado com sucesso",
      enableBackdropDismiss: false,
      buttons:[
        {
          text: "OK",
          handler: () => {
            this.navCtrl.pop(); //desempilhar essa página
          }
        }
      ] 
    });
    alert.present(); //apresenta o alert na tela
  }

}
