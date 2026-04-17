export type TipoContrato = "SIMPLES" | "COM_CREDITO";
export type TipoPropriedade = "CLIENTE" | "EMPRESA" | "BANCO";
export type StatusContrato =
    | "PENDENTE_ASSINATURA"
    | "AGUARDANDO_APROVACAO_BANCO"
    | "ATIVO";

export interface Contrato {
    id: number;
    pedido_id: number;
    automovel_id: number;
    automovel_marca?: string;
    automovel_modelo?: string;
    automovel_placa?: string;
    cliente_id: number;
    cliente_nome?: string;
    cliente_cpf?: string;
    cliente_rg?: string;
    cliente_endereco?: string;
    cliente_profissao?: string;
    agente_id: number;
    agente_nome_aprovador?: string;
    agente_instituicao?: string;
    banco_nome_instituicao?: string;
    banco_codigo_bancario?: string;
    banco_aprovador_nome?: string;
    valor_credito?: number;
    taxa_juros?: number;
    tipo: TipoContrato;
    tipo_propriedade: TipoPropriedade;
    status: StatusContrato;
    valor_automovel: number;
    valor_aluguel: number;
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
    valor: number;
}

export interface CreateAutomovelRequest {
    matricula: string;
    marca: string;
    modelo: string;
    ano: number;
    placa: string;
    valor: number;
}

export interface CreateCreditoRequest {
    contrato_id: number;
    valor_credito: number;
    taxa_juros: number;
}
