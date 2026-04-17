"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Usuario } from "@/types/usuario.types";

interface AuthContextType {
    usuario: Usuario | null;
    token: string | null;
    login: (token: string, usuario: Usuario) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

function getInitialAuthState() {
    if (typeof window === "undefined") {
        return {
            usuario: null as Usuario | null,
            token: null as string | null,
            isLoading: true,
        };
    }

    const storedToken = localStorage.getItem("token");
    const storedUsuario = localStorage.getItem("usuario");

    if (!storedToken || !storedUsuario) {
        return {
            usuario: null as Usuario | null,
            token: null as string | null,
            isLoading: false,
        };
    }

    try {
        return {
            usuario: JSON.parse(storedUsuario) as Usuario,
            token: storedToken,
            isLoading: false,
        };
    } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        return {
            usuario: null as Usuario | null,
            token: null as string | null,
            isLoading: false,
        };
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [initialState] = useState(getInitialAuthState);
    const [usuario, setUsuario] = useState<Usuario | null>(
        initialState.usuario,
    );
    const [token, setToken] = useState<string | null>(initialState.token);
    const isLoading = initialState.isLoading;

    function login(token: string, usuario: Usuario) {
        localStorage.setItem("token", token);
        localStorage.setItem("usuario", JSON.stringify(usuario));
        setToken(token);
        setUsuario(usuario);
    }

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        setToken(null);
        setUsuario(null);
        window.location.href = "/login";
    }

    return (
        <AuthContext.Provider
            value={{
                usuario,
                token,
                login,
                logout,
                isAuthenticated: !!token,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
