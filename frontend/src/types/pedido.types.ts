export type StatusPedido =
    | "AGUARDANDO_ANALISE"
    | "APROVADO"
    | "CANCELADO"
    | "CONTRATADO";

export interface Pedido {
    id: number;
    cliente_id: number;
    automovel_id: number;
    status: StatusPedido;
    data_solicitacao: string;
}

export interface CreatePedidoRequest {
    automovel_id: number;
}

export interface UpdatePedidoStatusRequest {
    status: "APROVADO" | "CANCELADO";
}
