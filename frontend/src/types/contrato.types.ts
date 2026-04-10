export type TipoContrato = "SIMPLES" | "COM_CREDITO";
export type TipoPropriedade = "CLIENTE" | "EMPRESA" | "BANCO";

export interface Contrato {
    id: number;
    pedido_id: number;
    automovel_id: number;
    cliente_id: number;
    agente_id: number;
    tipo: TipoContrato;
    tipo_propriedade: TipoPropriedade;
    data_assinatura: string;
}

export interface CreateContratoRequest {
    pedido_id: number;
    automovel_id: number;
    tipo: TipoContrato;
    tipo_propriedade: TipoPropriedade;
}

export interface Automovel {
    id: number;
    matricula: string;
    ano: number;
    marca: string;
    modelo: string;
    placa: string;
}

export interface CreateAutomovelRequest {
    matricula: string;
    marca: string;
    modelo: string;
    ano: number;
    placa: string;
}

export interface CreateCreditoRequest {
    contrato_id: number;
    valor_credito: number;
    taxa_juros: number;
}
