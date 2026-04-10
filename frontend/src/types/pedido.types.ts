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

    soma_renda?: number;
    rendimientos?: { empregador: string; valor: number }[];
    nome_cliente?: string;
    cpf?: string;
    rg?: string;
    profissao?: string;
}

export interface RendimentoDTO {
    empregador: string;
    valor: number;
}

export interface PedidoResponse {
    id: number;
    status:
        | "AGUARDANDO_ANALISE"
        | "APROVADO"
        | "REPROVADO"
        | "CANCELADO"
        | "CONTRATADO";
    data_solicitacao: string;

    automovel_id: number;
    marca?: string;
    modelo?: string;
    cliente_id: number;
    nome_cliente?: string;
    cpf?: string;
    rg?: string;
    profissao?: string;

    rendimentos?: RendimentoDTO[];
    soma_renda?: number;
}

export interface CreatePedidoRequest {
    automovel_id: number;
}
export interface CreatePedidoRequest {
    automovel_id: number;
}

export interface UpdatePedidoStatusRequest {
    status: "APROVADO" | "CANCELADO";
}
