import api from "./api";
import {
    Contrato,
    CreateContratoRequest,
    CreateCreditoRequest,
} from "@/types/contrato.types";

export const contratoService = {
    async criar(data: CreateContratoRequest): Promise<Contrato> {
        const response = await api.post<Contrato>("/contratos", data);
        return response.data;
    },

    async concederCredito(data: CreateCreditoRequest): Promise<void> {
        await api.post("/creditos", data);
    },
};
