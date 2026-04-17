import api from "./api";
import { Automovel, CreateAutomovelRequest } from "@/types/contrato.types";

type AutomovelApi = Partial<Automovel> & {
    ID?: number;
    Matricula?: string;
    Ano?: number;
    Marca?: string;
    Modelo?: string;
    Placa?: string;
    Valor?: number;
};

function normalizeAutomovel(item: AutomovelApi): Automovel {
    return {
        id: item.id ?? item.ID ?? 0,
        matricula: item.matricula ?? item.Matricula ?? "",
        ano: item.ano ?? item.Ano ?? new Date().getFullYear(),
        marca: item.marca ?? item.Marca ?? "",
        modelo: item.modelo ?? item.Modelo ?? "",
        placa: item.placa ?? item.Placa ?? "",
        valor: item.valor ?? item.Valor ?? 0,
    };
}

export const automovelService = {
    async listar(): Promise<Automovel[]> {
        const response = await api.get<AutomovelApi[]>("/automoveis");
        return (response.data || []).map(normalizeAutomovel);
    },

    async criar(data: CreateAutomovelRequest): Promise<void> {
        await api.post("/automoveis", data);
    },

    async atualizar(id: number, data: CreateAutomovelRequest): Promise<void> {
        await api.put(`/automoveis/${id}`, data);
    },

    async remover(id: number): Promise<void> {
        await api.delete(`/automoveis/${id}`);
    },
};
