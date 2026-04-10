"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";

export default function Navbar() {
    const { usuario, logout } = useAuth();

    return (
        <nav className="border-b bg-background px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                <span className="font-semibold text-sm">
                    Sistema de Aluguel
                </span>
            </div>

            <div className="flex items-center gap-4">
                {usuario?.tipo === "CLIENTE" && (
                    <>
                        <Link
                            href="/dashboard"
                            className="text-sm text-muted-foreground hover:text-foreground"
                        >
                            Início
                        </Link>
                        <Link
                            href="/pedidos"
                            className="text-sm text-muted-foreground hover:text-foreground"
                        >
                            Meus Pedidos
                        </Link>
                        <Link
                            href="/pedidos/novo"
                            className="text-sm text-muted-foreground hover:text-foreground"
                        >
                            Novo Pedido
                        </Link>
                    </>
                )}

                {(usuario?.tipo === "AGENTE" || usuario?.tipo === "BANCO") && (
                    <>
                        <Link
                            href="/dashboard"
                            className="text-sm text-muted-foreground hover:text-foreground"
                        >
                            Início
                        </Link>
                        <Link
                            href="/admin"
                            className="text-sm text-muted-foreground hover:text-foreground"
                        >
                            Painel Admin
                        </Link>
                        <Link
                            href="/contratos"
                            className="text-sm text-muted-foreground hover:text-foreground"
                        >
                            Contratos
                        </Link>
                        <Link
                            href="/admin/automoveis/novo"
                            className="text-sm font-medium hover:text-primary"
                        >
                            Cadastrar Veículo
                        </Link>
                    </>
                )}

                <div className="flex items-center gap-3 ml-4 pl-4 border-l">
                    <span className="text-sm text-muted-foreground">
                        {usuario?.nome}
                    </span>
                    <Button variant="outline" size="sm" onClick={logout}>
                        Sair
                    </Button>
                </div>
            </div>
        </nav>
    );
}
