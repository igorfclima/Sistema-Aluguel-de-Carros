"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import { pedidoService } from "@/services/pedido.service";
import { contratoService } from "@/services/contrato.service";
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TipoContrato, TipoPropriedade } from "@/types/contrato.types";

const statusLabel: Record<string, string> = {
    AGUARDANDO_ANALISE: "Aguardando",
    APROVADO: "Aprovado",
    CANCELADO: "Cancelado",
    CONTRATADO: "Contratado",
};

export default function AdminPage() {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(true);
    const [contratoDialog, setContratoDialog] = useState<Pedido | null>(null);
    const [tipoContrato, setTipoContrato] = useState<TipoContrato>("SIMPLES");
    const [tipoPropriedade, setTipoPropriedade] =
        useState<TipoPropriedade>("CLIENTE");

    useEffect(() => {
        pedidoService
            .listar()
            .then(setPedidos)
            .catch(() => toast.error("Erro ao carregar pedidos."))
            .finally(() => setLoading(false));
    }, []);

    async function handleAprovar(id: number) {
        try {
            await pedidoService.atualizarStatus(id, { status: "APROVADO" });
            setPedidos((prev) =>
                prev.map((p) =>
                    p.id === id ? { ...p, status: "APROVADO" } : p,
                ),
            );
            toast.success("Pedido aprovado.");
        } catch {
            toast.error("Erro ao aprovar pedido.");
        }
    }

    async function handleCancelar(id: number) {
        try {
            await pedidoService.atualizarStatus(id, { status: "CANCELADO" });
            setPedidos((prev) =>
                prev.map((p) =>
                    p.id === id ? { ...p, status: "CANCELADO" } : p,
                ),
            );
            toast.success("Pedido cancelado.");
        } catch {
            toast.error("Erro ao cancelar pedido.");
        }
    }

    async function handleGerarContrato() {
        if (!contratoDialog) return;
        try {
            await contratoService.criar({
                pedido_id: contratoDialog.id,
                automovel_id: contratoDialog.automovel_id,
                tipo: tipoContrato,
                tipo_propriedade: tipoPropriedade,
            });
            setPedidos((prev) =>
                prev.map((p) =>
                    p.id === contratoDialog.id
                        ? { ...p, status: "CONTRATADO" }
                        : p,
                ),
            );
            toast.success("Contrato gerado com sucesso.");
            setContratoDialog(null);
        } catch {
            toast.error("Erro ao gerar contrato.");
        }
    }

    return (
        <ProtectedRoute tipos={["AGENTE", "BANCO"]}>
            <div className="min-h-screen bg-background">
                <Navbar />
                <main className="max-w-6xl mx-auto px-6 py-10 space-y-6">
                    <h1 className="text-xl font-semibold">Painel do Agente</h1>

                    {loading ? (
                        <p className="text-sm text-muted-foreground">
                            Carregando...
                        </p>
                    ) : pedidos.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            Nenhum pedido encontrado.
                        </p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Automóvel</TableHead>
                                    <TableHead>Data</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Ações</TableHead>
                                    <TableHead>Registrar Propriedade</TableHead>
                                    <TableHead>Renda Comprovada</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pedidos.map((pedido) => (
                                    <TableRow key={pedido.id}>
                                        <TableCell>#{pedido.id}</TableCell>
                                        <TableCell>
                                            #{pedido.cliente_id}
                                        </TableCell>
                                        <TableCell>
                                            #{pedido.automovel_id}
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
                                            <Badge>
                                                {statusLabel[pedido.status]}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                {pedido.status ===
                                                    "AGUARDANDO_ANALISE" && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            onClick={() =>
                                                                handleAprovar(
                                                                    pedido.id,
                                                                )
                                                            }
                                                        >
                                                            Aprovar
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() =>
                                                                handleCancelar(
                                                                    pedido.id,
                                                                )
                                                            }
                                                        >
                                                            Cancelar
                                                        </Button>
                                                    </>
                                                )}
                                                {pedido.status ===
                                                    "APROVADO" && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            setContratoDialog(
                                                                pedido,
                                                            )
                                                        }
                                                    >
                                                        Gerar contrato
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-2">
                                                <Select
                                                    onValueChange={(value) =>
                                                        setTipoPropriedade(
                                                            value as TipoPropriedade,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o proprietário" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="CLIENTE">
                                                            Cliente (Registro
                                                            Direto)
                                                        </SelectItem>
                                                        <SelectItem value="EMPRESA">
                                                            Empresa de Aluguel
                                                        </SelectItem>
                                                        <SelectItem value="BANCO">
                                                            Banco
                                                            (Leasing/Crédito)
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {pedido.soma_renda ? (
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-green-700">
                                                        {new Intl.NumberFormat(
                                                            "pt-BR",
                                                            {
                                                                style: "currency",
                                                                currency: "BRL",
                                                            },
                                                        ).format(
                                                            pedido.soma_renda,
                                                        )}
                                                    </span>
                                                    <span className="text-[10px] uppercase text-gray-500">
                                                        Renda Comprovada
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">
                                                    Não informado
                                                </span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </main>

                <Dialog
                    open={!!contratoDialog}
                    onOpenChange={() => setContratoDialog(null)}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                Gerar Contrato — Pedido #{contratoDialog?.id}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                            <div className="space-y-1">
                                <Label>Tipo de contrato</Label>
                                <Select
                                    value={tipoContrato}
                                    onValueChange={(v) =>
                                        setTipoContrato(v as TipoContrato)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="SIMPLES">
                                            Simples
                                        </SelectItem>
                                        <SelectItem value="COM_CREDITO">
                                            Com crédito
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label>Tipo de propriedade</Label>
                                <Select
                                    value={tipoPropriedade}
                                    onValueChange={(v) =>
                                        setTipoPropriedade(v as TipoPropriedade)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CLIENTE">
                                            Cliente
                                        </SelectItem>
                                        <SelectItem value="EMPRESA">
                                            Empresa
                                        </SelectItem>
                                        <SelectItem value="BANCO">
                                            Banco
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setContratoDialog(null)}
                            >
                                Cancelar
                            </Button>
                            <Button onClick={handleGerarContrato}>
                                Confirmar contrato
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </ProtectedRoute>
    );
}
