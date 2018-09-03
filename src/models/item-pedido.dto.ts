import { RefDTO } from "./ref.dto";
 export interface ItemPedidoDTO {
    quantidade: number;
    produto: RefDTO; //é um objeot do tipo RefDTO que tem somente o id
} 