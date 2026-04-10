"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import { pedidoService } from "@/services/pedido.service";
// Garanta que o tipo Pedido inclua soma_renda, marca e modelo
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
import { useRouter } from "next/navigation"; // Alterado para navigation
import { ModalEditarPedido } from "@/components/ModalEditarPedido";

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
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
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
            <div className="min-h-screen bg-background">
                <Navbar />
                <main className="max-w-5xl mx-auto px-6 py-10 space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-semibold">Meus Pedidos</h1>
                        <Link href="/pedidos/novo">
                            <Button size="sm">Novo pedido</Button>
                        </Link>
                    </div>

                    {loading ? (
                        <p className="text-sm text-muted-foreground">
                            Carregando...
                        </p>
                    ) : (pedidos?.length || 0) === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            Nenhum pedido encontrado.
                        </p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Veículo</TableHead>
                                    <TableHead>Data</TableHead>
                                    {/* Nova coluna opcional para o cliente ver a renda que cadastrou */}
                                    <TableHead>Renda Inf.</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">
                                        Ações
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pedidos.map((pedido) => (
                                    <TableRow key={pedido.id}>
                                        <TableCell className="font-medium">
                                            #{pedido.id}
                                        </TableCell>
                                        <TableCell>
                                            {`Carro #${pedido.automovel_id}`}
                                        </TableCell>
                                        <TableCell>
                                            {format(
                                                new Date(
                                                    pedido.data_solicitacao,
                                                ),
                                                "dd/MM/yyyy",
                                                { locale: ptBR },
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {/* Mostra a soma da renda formatada */}
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
                                                <div className="flex gap-2 justify-end">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleEditar(pedido)
                                                        }
                                                    >
                                                        Editar
                                                    </Button>

                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
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
                    )}
                </main>
            </div>
            <ModalEditarPedido
                pedido={pedidoParaEditar}
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                onSuccess={() => {
                    // Função para recarregar os pedidos após editar
                    pedidoService.listar().then(setPedidos);
                }}
            />
        </ProtectedRoute>
    );
}
