"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import { pedidoService } from "@/services/pedido.service";
import { automovelService } from "@/services/automovel.service";
import { Automovel } from "@/types/contrato.types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function NovoPedidoPage() {
    const [automoveis, setAutomoveis] = useState<Automovel[]>([]);
    const [automovelId, setAutomovelId] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        automovelService
            .listar()
            .then(setAutomoveis)
            .catch(() => toast.error("Erro ao carregar automóveis."));
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!automovelId) return;
        setLoading(true);
        try {
            await pedidoService.criar({ automovel_id: Number(automovelId) });
            toast.success("Pedido criado com sucesso!");
            router.push("/pedidos");
        } catch {
            toast.error("Erro ao criar pedido.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <ProtectedRoute tipos={["CLIENTE"]}>
            <div className="min-h-screen bg-background">
                <Navbar />
                <main className="max-w-lg mx-auto px-6 py-10">
                    <Card>
                        <CardHeader>
                            <CardTitle>Novo Pedido de Aluguel</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-1">
                                    <Label>Automóvel</Label>
                                    <Select
                                        onValueChange={setAutomovelId}
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione um automóvel..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {automoveis.map((a) => (
                                                <SelectItem
                                                    key={a.id}
                                                    value={String(a.id)}
                                                >
                                                    {a.marca} {a.modelo} (
                                                    {a.ano}) — {a.placa}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={loading || !automovelId}
                                >
                                    {loading ? "Criando..." : "Criar pedido"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </ProtectedRoute>
    );
}
