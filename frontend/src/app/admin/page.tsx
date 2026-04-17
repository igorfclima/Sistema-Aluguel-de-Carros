"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
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
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { useAuth } from "@/context/AuthContext";
import { getDashboardNavItems } from "@/lib/dashboard-nav";

const statusLabel: Record<string, string> = {
    AGUARDANDO_ANALISE: "Aguardando",
    APROVADO: "Aprovado",
    CANCELADO: "Cancelado",
    CONTRATADO: "Contratado",
};

export default function AdminPage() {
    const { usuario } = useAuth();
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
        const propriedadeFinal: TipoPropriedade =
            tipoContrato === "COM_CREDITO" ? "BANCO" : tipoPropriedade;

        try {
            await contratoService.criar({
                pedido_id: contratoDialog.id,
                automovel_id: contratoDialog.automovel_id,
                tipo: tipoContrato,
                tipo_propriedade: propriedadeFinal,
            });
            toast.success("Contrato gerado. Agora ele precisa ser assinado.");
            setContratoDialog(null);
        } catch {
            toast.error("Erro ao gerar contrato.");
        }
    }

    return (
        <ProtectedRoute tipos={["AGENTE", "BANCO"]}>
            <DashboardShell
                greeting="Central de analise"
                subtitle="Aprove, recuse pedidos e gere contratos com rastreabilidade."
                navItems={getDashboardNavItems(usuario?.tipo, "/admin")}
            >
                {loading ? (
                    <p className="text-sm text-[#667067]">
                        Carregando pedidos...
                    </p>
                ) : pedidos.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-[#cfd8cf] bg-white px-6 py-10 text-center text-[#6b756c]">
                        Nenhum pedido encontrado.
                    </div>
                ) : (
                    <div className="rounded-3xl border border-[#dce2dc] bg-white p-4 shadow-[0_8px_22px_rgba(32,46,39,0.06)]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Automovel</TableHead>
                                    <TableHead>Data</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Acoes</TableHead>
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
                                                {
                                                    locale: ptBR,
                                                },
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
                                                            className="rounded-xl bg-[#4f9f68] text-white hover:bg-[#43895a]"
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
                                                            className="rounded-xl"
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
                                                        className="rounded-xl"
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
                                            <span className="text-sm text-[#69756b]">
                                                Definido na geracao do contrato
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {pedido.soma_renda !== undefined &&
                                            pedido.soma_renda !== null ? (
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
                                                        Renda comprovada
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">
                                                    Nao informado
                                                </span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                <Dialog
                    open={!!contratoDialog}
                    onOpenChange={() => setContratoDialog(null)}
                >
                    <DialogContent className="rounded-3xl border-[#dce2dc]">
                        <DialogHeader>
                            <DialogTitle>
                                Gerar contrato - Pedido #{contratoDialog?.id}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                            <div className="space-y-1">
                                <Label>Tipo de contrato</Label>
                                <Select
                                    value={tipoContrato}
                                    onValueChange={(v) => {
                                        const tipo = v as TipoContrato;
                                        setTipoContrato(tipo);

                                        if (tipo === "COM_CREDITO") {
                                            setTipoPropriedade("BANCO");
                                        }
                                    }}
                                >
                                    <SelectTrigger className="rounded-xl border-[#d7ddd7]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="SIMPLES">
                                            Simples
                                        </SelectItem>
                                        <SelectItem value="COM_CREDITO">
                                            Com credito
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
                                    disabled={tipoContrato === "COM_CREDITO"}
                                >
                                    <SelectTrigger className="rounded-xl border-[#d7ddd7]">
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
                                className="rounded-xl"
                                onClick={() => setContratoDialog(null)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                className="rounded-xl bg-[#4f9f68] text-white hover:bg-[#43895a]"
                                onClick={handleGerarContrato}
                            >
                                Confirmar contrato
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </DashboardShell>
        </ProtectedRoute>
    );
}
