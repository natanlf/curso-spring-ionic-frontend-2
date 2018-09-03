import { StorageService } from './../storage.service';
import { API_CONFIG } from './../../config/api.config';
import { ClienteDTO } from './../../models/cliente.dto';
import { Observable } from 'rxjs/Rx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable()    
export class ClienteService{
    constructor(public http: HttpClient, public storage: StorageService) {
    }
     findByEmail(email: string) {
         return this.http.get(`${API_CONFIG.baseUrl}/clientes/email?value=${email}`); 
    }

    getImageFromBucket(id : string) : Observable<any> { //pegando imagem do S3 da Amazon
        let url = `${API_CONFIG.bucketBaseUrl}/cp${id}.jpg`
        return this.http.get(url, {responseType : 'blob'}); //blob diz que a resposta é imagem
    }

    insert(obj : ClienteDTO) {
        return this.http.post(
            `${API_CONFIG.baseUrl}/clientes`, 
            obj,
            { 
                observe: 'response', 
                responseType: 'text' //corpo vazio por isso texto para não dá erro de parse json
            }
        ); 
    }
}