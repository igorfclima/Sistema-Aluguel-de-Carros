"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { pedidoService } from "@/services/pedido.service";
import { Pedido } from "@/types/pedido.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ModalEditarPedido } from "@/components/ModalEditarPedido";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getDashboardNavItems } from "@/lib/dashboard-nav";
import { useAuth } from "@/context/AuthContext";

const statusLabel: Record<string, string> = {
    AGUARDANDO_ANALISE: "Aguardando análise",
    APROVADO: "Aprovado",
    CANCELADO: "Cancelado",
    CONTRATADO: "Contratado",
};

const statusVariant: Record<
    string,
    "default" | "secondary" | "destructive" | "outline"
> = {
    AGUARDANDO_ANALISE: "secondary",
    APROVADO: "default",
    CANCELADO: "destructive",
    CONTRATADO: "outline",
};

export default function PedidosPage() {
    const { usuario } = useAuth();
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(true);
    const [pedidoParaEditar, setPedidoParaEditar] = useState<Pedido | null>(
        null,
    );
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        pedidoService
            .listar()
            .then(setPedidos)
            .catch(() => toast.error("Erro ao carregar pedidos"))
            .finally(() => setLoading(false));
    }, []);

    const handleEditar = (pedido: Pedido) => {
        setPedidoParaEditar(pedido);
        setIsModalOpen(true);
    };

    async function handleCancelar(id: number) {
        if (!confirm("Deseja realmente cancelar este pedido?")) return;

        try {
            // Chamando a rota de atualização de status que criamos no Go
            await pedidoService.atualizarStatus(id, { status: "CANCELADO" });
            setPedidos((prev) =>
                prev.map((p) =>
                    p.id === id ? { ...p, status: "CANCELADO" } : p,
                ),
            );
            toast.success("Pedido cancelado com sucesso.");
        } catch {
            toast.error("Erro ao cancelar pedido.");
        }
    }

    return (
        <ProtectedRoute tipos={["CLIENTE"]}>
            <DashboardShell
                greeting={`Pedidos de ${usuario?.nome || "Cliente"}`}
                subtitle="Acompanhe status, renda informada e ajuste pedidos em analise."
                navItems={getDashboardNavItems(usuario?.tipo, "/pedidos")}
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-4xl font-semibold tracking-tight text-[#263029]">
                        Minha fila de pedidos
                    </h2>
                    <Link href="/pedidos/novo">
                        <Button className="rounded-2xl bg-[#4f9f68] px-5 text-white hover:bg-[#43895a]">
                            Novo pedido
                        </Button>
                    </Link>
                </div>

                {loading ? (
                    <p className="text-sm text-[#667067]">
                        Carregando pedidos...
                    </p>
                ) : (pedidos?.length || 0) === 0 ? (
                    <div className="rounded-3xl border border-dashed border-[#cfd8cf] bg-white px-6 py-10 text-center text-[#6b756c]">
                        Nenhum pedido encontrado.
                    </div>
                ) : (
                    <div className="rounded-3xl border border-[#dce2dc] bg-white p-4 shadow-[0_8px_22px_rgba(32,46,39,0.06)]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Veiculo</TableHead>
                                    <TableHead>Data</TableHead>
                                    <TableHead>Renda Inf.</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">
                                        Acoes
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pedidos.map((pedido) => (
                                    <TableRow key={pedido.id}>
                                        <TableCell className="font-medium">
                                            #{pedido.id}
                                        </TableCell>
                                        <TableCell>{`Carro #${pedido.automovel_id}`}</TableCell>
                                        <TableCell>
                                            {format(
                                                new Date(
                                                    pedido.data_solicitacao,
                                                ),
                                                "dd/MM/yyyy",
                                                {
                                                    locale: ptBR,
                                                },
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {pedido.soma_renda
                                                ? new Intl.NumberFormat(
                                                      "pt-BR",
                                                      {
                                                          style: "currency",
                                                          currency: "BRL",
                                                      },
                                                  ).format(pedido.soma_renda)
                                                : "---"}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    statusVariant[pedido.status]
                                                }
                                            >
                                                {statusLabel[pedido.status]}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {pedido.status ===
                                                "AGUARDANDO_ANALISE" && (
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="rounded-xl"
                                                        onClick={() =>
                                                            handleEditar(pedido)
                                                        }
                                                    >
                                                        Editar
                                                    </Button>

                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        className="rounded-xl"
                                                        onClick={() =>
                                                            handleCancelar(
                                                                pedido.id,
                                                            )
                                                        }
                                                    >
                                                        Cancelar
                                                    </Button>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </DashboardShell>
            <ModalEditarPedido
                pedido={pedidoParaEditar}
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                onSuccess={() => {
                    pedidoService.listar().then(setPedidos);
                }}
            />
        </ProtectedRoute>
    );
}
