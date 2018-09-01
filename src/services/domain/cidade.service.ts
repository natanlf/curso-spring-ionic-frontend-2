import { CidadeDTO } from './../../models/cidade.dto';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { Observable } from 'rxjs/Rx'; //IMPORTAÇÃO CORRETA DE OBSERVABLE

@Injectable()
export class CidadeService{ //para poder ser injetada em outras classes usamos o @Injectable

    //nesse construtor vou injetar o httpClient, pois é ele que vai fazer a requisição http
    constructor(public http : HttpClient){

    }

    findAll(estado_id: string) : Observable<CidadeDTO[]>{ //busca as cidades de um estado
        return this.http.get<CidadeDTO[]>(`${API_CONFIG.baseUrl}/estados/${estado_id}/cidades`);
    }
}