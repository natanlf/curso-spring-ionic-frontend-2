import { StorageService } from './../storage.service';
import { API_CONFIG } from './../../config/api.config';
import { ClienteDTO } from './../../models/cliente.dto';
import { Observable } from 'rxjs/Rx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ImageUtilService } from '../image-util.service';

@Injectable()    
export class ClienteService{
    constructor(
        public http: HttpClient, 
        public storage: StorageService,
        public imageUtilService: ImageUtilService) {
    }

    findById(id: string) {
        return this.http.get(`${API_CONFIG.baseUrl}/clientes/${id}`);
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

    uploadPicture(picture) {
        //coverte a imagem que está em base 64 para blob
        let pictureBlob = this.imageUtilService.dataUriToBlob(picture);
        //quando fazemos o upload o endpoint precisa receber os parametros do tipo formdata
        let formData : FormData = new FormData(); 
        formData.set('file', pictureBlob, 'file.png');
        return this.http.post(
            `${API_CONFIG.baseUrl}/clientes/picture`, 
            formData,
            { 
                observe: 'response', 
                responseType: 'text'
            }
        ); 
    }
}