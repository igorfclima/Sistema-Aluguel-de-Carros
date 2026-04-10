"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    const { usuario } = useAuth();

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-background">
                <Navbar />
                <main className="max-w-4xl mx-auto px-6 py-10 space-y-6">
                    <div>
                        <h1 className="text-2xl font-semibold">
                            Olá, {usuario?.nome} 👋
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Bem-vindo ao sistema de aluguel de carros.
                        </p>
                    </div>

                    {usuario?.tipo === "CLIENTE" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">
                                        Meus Pedidos
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Acompanhe seus pedidos de aluguel.
                                    </p>
                                    <Link href="/pedidos">
                                        <Button variant="outline" size="sm">
                                            Ver pedidos
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">
                                        Novo Pedido
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Solicite um novo aluguel de automóvel.
                                    </p>
                                    <Link href="/pedidos/novo">
                                        <Button size="sm">Criar pedido</Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {(usuario?.tipo === "AGENTE" ||
                        usuario?.tipo === "BANCO") && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">
                                        Painel Admin
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Gerencie e analise pedidos de aluguel.
                                    </p>
                                    <Link href="/admin">
                                        <Button variant="outline" size="sm">
                                            Acessar painel
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">
                                        Contratos
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Visualize e gerencie contratos.
                                    </p>
                                    <Link href="/contratos">
                                        <Button variant="outline" size="sm">
                                            Ver contratos
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </main>
            </div>
        </ProtectedRoute>
    );
}
