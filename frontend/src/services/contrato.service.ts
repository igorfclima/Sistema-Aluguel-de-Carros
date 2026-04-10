import {
    Contrato,
    CreateContratoRequest,
    TipoContrato,
    TipoPropriedade,
} from "@/types/contrato.types";
import api from "@/services/api";

export const contratoService = {
    listar: async (): Promise<Contrato[]> => {
        const response = await api.get("/contratos");
        const dados = response.data || [];

        return dados.map((c: any) => ({
            id: c.id || c.ID,
            pedido_id: c.pedido_id || c.PedidoID,
            automovel_id: c.automovel_id || c.AutomovelID,
            cliente_id: c.cliente_id || c.ClienteID,
            agente_id: c.agente_id || c.AgenteID,
            tipo: c.tipo || c.Tipo,
            tipo_propriedade: c.tipo_propriedade || c.TipoPropriedade,
            data_assinatura:
                c.data_assinatura || c.DataAssinatura || c.CreatedAt,
        }));
    },

    criar: async (data: CreateContratoRequest): Promise<Contrato> => {
        const response = await api.post("/contratos", data);
        return response.data;
    },
    buscarPorId: async (id: number): Promise<Contrato> => {
        const response = await api.get(`/contratos/${id}`);
        const c = response.data;

        return {
            id: c.id || c.ID,
            pedido_id: c.pedido_id || c.PedidoID,
            automovel_id: c.automovel_id || c.AutomovelID,
            cliente_id: c.cliente_id || c.ClienteID,
            agente_id: c.agente_id || c.AgenteID,
            tipo: c.tipo || c.Tipo,
            tipo_propriedade: c.tipo_propriedade || c.TipoPropriedade,
            data_assinatura:
                c.data_assinatura || c.DataAssinatura || c.CreatedAt,
        };
    },

    concederCredito: async (contratoId: number, valor: number) => {
        const response = await api.post(`/contratos/${contratoId}/credito`, {
            valor,
        });
        return response.data;
    },
};
