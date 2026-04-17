"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { pedidoService } from "@/services/pedido.service";
import { automovelService } from "@/services/automovel.service";
import { Automovel } from "@/types/contrato.types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { useAuth } from "@/context/AuthContext";
import { getDashboardNavItems } from "@/lib/dashboard-nav";

export default function NovoPedidoPage() {
    const { usuario } = useAuth();
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
            <DashboardShell
                greeting="Novo pedido"
                subtitle="Escolha um veiculo da frota para iniciar seu aluguel."
                navItems={getDashboardNavItems(usuario?.tipo, "/pedidos/novo")}
            >
                <section className="mx-auto w-full max-w-2xl rounded-3xl border border-[#dce2dc] bg-white p-6 shadow-[0_8px_22px_rgba(32,46,39,0.06)]">
                    <h2 className="text-3xl font-semibold tracking-tight text-[#283129]">
                        Solicitar aluguel
                    </h2>
                    <p className="mt-2 text-sm text-[#69746b]">
                        Preencha os dados abaixo para enviar o pedido para
                        analise.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                        <div className="space-y-2">
                            <Label>Automovel</Label>
                            <Select onValueChange={setAutomovelId} required>
                                <SelectTrigger className="h-12 rounded-2xl border-[#d7ddd7]">
                                    <SelectValue placeholder="Selecione um automovel..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {automoveis.map((a) => (
                                        <SelectItem
                                            key={a.id}
                                            value={String(a.id)}
                                        >
                                            {a.marca} {a.modelo} ({a.ano}) -{" "}
                                            {a.placa}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            type="submit"
                            className="h-12 w-full rounded-2xl bg-[#4f9f68] text-base font-semibold text-white hover:bg-[#43895a]"
                            disabled={loading || !automovelId}
                        >
                            {loading ? "Criando..." : "Criar pedido"}
                        </Button>
                    </form>
                </section>
            </DashboardShell>
        </ProtectedRoute>
    );
}
