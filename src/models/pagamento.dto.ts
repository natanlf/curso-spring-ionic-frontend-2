export interface PagamentoDTO {
    numeroDeParcelas : number;
    //quando for um nome incomum devemos colcoar entre aspas
    "@type" : string; //indica que tipo de pagamento é, pois pode ser pagamento com boleto ou cratão
} 