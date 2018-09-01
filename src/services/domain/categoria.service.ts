import { CategoriaDTO } from './../../models/categoria.dto';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { Observable } from 'rxjs/Rx'; //IMPORTAÇÃO CORRETA DE OBSERVABLE

@Injectable()
export class CategoriaService{ //para poder ser injetada em outras classes usamos o @Injectable

    //nesse construtor vou injetar o httpClient, pois é ele que vai fazer a requisição http
    constructor(public http : HttpClient){

    }

    //retorna a lista de todas as categorias, só aceita receber uma lista de categeriasDto
    //para receber somente uma lista do tipo categoriaDto, preciso usar o Observable 
    //assim tenho uma função tipada que retorna uma lista de categoriaDto
    findAll() : Observable<CategoriaDTO[]>{
        //faz a chamada pegando todas as categorias, igual a chamada do POSTMAN
        //Uso a crase, pois facilita concatenar, assim tenho com facilidade a url base + o resto da chamada
        return this.http.get<CategoriaDTO[]>(`${API_CONFIG.baseUrl}/categorias`);
    }
}