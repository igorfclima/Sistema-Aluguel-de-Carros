import { Contrato, CreateContratoRequest } from "@/types/contrato.types";
import api from "@/services/api";

type ContratoApi = Partial<Contrato> & {
    ID?: number;
    PedidoID?: number;
    AutomovelID?: number;
    ClienteID?: number;
    AgenteID?: number;
    Tipo?: Contrato["tipo"];
    TipoPropriedade?: Contrato["tipo_propriedade"];
    Status?: Contrato["status"];
    ValorAutomovel?: number;
    ValorAluguel?: number;
    AutomovelMarca?: string;
    AutomovelModelo?: string;
    AutomovelPlaca?: string;
    ClienteNome?: string;
    ClienteCPF?: string;
    ClienteRG?: string;
    ClienteEndereco?: string;
    ClienteProfissao?: string;
    AgenteNomeAprovador?: string;
    AgenteInstituicao?: string;
    BancoNomeInstituicao?: string;
    BancoCodigoBancario?: string;
    BancoAprovadorNome?: string;
    ValorCredito?: number;
    TaxaJuros?: number;
    DataAssinatura?: string;
    CreatedAt?: string;
};

function normalizeContrato(c: ContratoApi): Contrato {
    return {
        id: c.id ?? c.ID ?? 0,
        pedido_id: c.pedido_id ?? c.PedidoID ?? 0,
        automovel_id: c.automovel_id ?? c.AutomovelID ?? 0,
        automovel_marca: c.automovel_marca ?? c.AutomovelMarca,
        automovel_modelo: c.automovel_modelo ?? c.AutomovelModelo,
        automovel_placa: c.automovel_placa ?? c.AutomovelPlaca,
        cliente_id: c.cliente_id ?? c.ClienteID ?? 0,
        cliente_nome: c.cliente_nome ?? c.ClienteNome,
        cliente_cpf: c.cliente_cpf ?? c.ClienteCPF,
        cliente_rg: c.cliente_rg ?? c.ClienteRG,
        cliente_endereco: c.cliente_endereco ?? c.ClienteEndereco,
        cliente_profissao: c.cliente_profissao ?? c.ClienteProfissao,
        agente_id: c.agente_id ?? c.AgenteID ?? 0,
        agente_nome_aprovador: c.agente_nome_aprovador ?? c.AgenteNomeAprovador,
        agente_instituicao: c.agente_instituicao ?? c.AgenteInstituicao,
        banco_nome_instituicao:
            c.banco_nome_instituicao ?? c.BancoNomeInstituicao,
        banco_codigo_bancario: c.banco_codigo_bancario ?? c.BancoCodigoBancario,
        banco_aprovador_nome: c.banco_aprovador_nome ?? c.BancoAprovadorNome,
        valor_credito: c.valor_credito ?? c.ValorCredito,
        taxa_juros: c.taxa_juros ?? c.TaxaJuros,
        tipo: c.tipo ?? c.Tipo ?? "SIMPLES",
        tipo_propriedade: c.tipo_propriedade ?? c.TipoPropriedade ?? "CLIENTE",
        status: c.status ?? c.Status ?? "PENDENTE_ASSINATURA",
        valor_automovel: c.valor_automovel ?? c.ValorAutomovel ?? 0,
        valor_aluguel: c.valor_aluguel ?? c.ValorAluguel ?? 0,
        data_assinatura:
            c.data_assinatura ?? c.DataAssinatura ?? c.CreatedAt ?? "",
    };
}

export const contratoService = {
    listar: async (): Promise<Contrato[]> => {
        const response = await api.get<ContratoApi[]>("/contratos");
        const dados = response.data || [];
        return dados.map(normalizeContrato);
    },

    criar: async (data: CreateContratoRequest): Promise<Contrato> => {
        const response = await api.post("/contratos", data);
        return response.data;
    },
    buscarPorId: async (id: number): Promise<Contrato> => {
        const response = await api.get<ContratoApi>(`/contratos/${id}`);
        return normalizeContrato(response.data);
    },

    assinar: async (contratoId: number): Promise<Contrato> => {
        const response = await api.post<ContratoApi>(
            `/contratos/${contratoId}/assinar`,
        );
        return normalizeContrato(response.data);
    },

    aprovarCredito: async (
        contratoId: number,
        payload: { valor_credito: number; taxa_juros: number },
    ): Promise<Contrato> => {
        const response = await api.post<ContratoApi>(
            `/contratos/${contratoId}/aprovar-credito`,
            {
                contrato_id: contratoId,
                ...payload,
            },
        );
        return normalizeContrato(response.data);
    },
};
