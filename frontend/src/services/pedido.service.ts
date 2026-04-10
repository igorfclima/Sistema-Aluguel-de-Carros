import api from "./api";
import {
    Pedido,
    CreatePedidoRequest,
    UpdatePedidoStatusRequest,
} from "@/types/pedido.types";

export const pedidoService = {
    async criar(data: CreatePedidoRequest): Promise<Pedido> {
        const response = await api.post<Pedido>("/pedidos", data);
        return response.data;
    },

    async listar(): Promise<Pedido[]> {
        const response = await api.get<Pedido[]>("/pedidos");
        return response.data;
    },

    async atualizarStatus(
        id: number,
        data: UpdatePedidoStatusRequest,
    ): Promise<void> {
        await api.patch(`/pedidos/${id}/status`, data);
    },

    atualizar: async (id: number, data: CreatePedidoRequest): Promise<void> => {
        await api.put(`/pedidos/${id}`, data);
    },

    cancelar: async (id: number): Promise<void> => {
        await api.delete(`/pedidos/${id}`);
    },
};
