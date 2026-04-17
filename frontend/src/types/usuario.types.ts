export type TipoUsuario = "CLIENTE" | "AGENTE" | "BANCO";

export interface Usuario {
    id: number;
    nome: string;
    email: string;
    tipo: TipoUsuario;
}

export interface CreateUsuarioRequest {
    nome: string;
    email: string;
    senha: string;
    tipo: TipoUsuario;
    cpf?: string;
    rg?: string;
    endereco?: string;
    profissao?: string;
    tipo_agente?: string;
    nome_instituicao?: string;
    codigo_bancario?: string;
    empregador1?: string;
    rendimento1?: number;
    empregador2?: string;
    rendimento2?: number;
    empregador3?: string;
    rendimento3?: number;
}

export interface LoginRequest {
    email: string;
    senha: string;
}

export interface LoginResponse {
    token: string;
}
