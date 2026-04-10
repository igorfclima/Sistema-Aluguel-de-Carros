import api from "./api";
import { Automovel, CreateAutomovelRequest } from "@/types/contrato.types";

export const automovelService = {
    async listar(): Promise<Automovel[]> {
        const response = await api.get<Automovel[]>("/automoveis");
        return response.data;
    },

    async criar(data: CreateAutomovelRequest): Promise<void> {
        await api.post("/automoveis", data);
    },
};
