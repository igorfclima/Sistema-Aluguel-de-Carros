import api from "./api";
import {
    CreateUsuarioRequest,
    LoginRequest,
    LoginResponse,
} from "@/types/usuario.types";

export const authService = {
    async login(data: LoginRequest): Promise<LoginResponse> {
        const response = await api.post<LoginResponse>("/login", data);
        return response.data;
    },

    async cadastrar(data: CreateUsuarioRequest): Promise<void> {
        await api.post("/usuarios", data);
    },

    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        window.location.href = "/login";
    },
};
