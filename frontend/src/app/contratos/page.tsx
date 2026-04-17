"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { contratoService } from "@/services/contrato.service";
import { Contrato } from "@/types/contrato.types";
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
import { FileText, Download, CheckCircle2 } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getDashboardNavItems } from "@/lib/dashboard-nav";
import { useAuth } from "@/context/AuthContext";

export default function ContratosPage() {
    const { usuario } = useAuth();
    const [contratos, setContratos] = useState<Contrato[]>([]);
    const [loading, setLoading] = useState(true);

    const statusLabel: Record<string, string> = {
        PENDENTE_ASSINATURA: "Pendente de assinatura",
        AGUARDANDO_APROVACAO_BANCO: "Aguardando aprovacao do banco",
        ATIVO: "Ativo",
    };

    useEffect(() => {
        contratoService
            .listar()
            .then((res) => {
                setContratos(res || []);
            })
            .catch(() => toast.error("Erro ao carregar listagem de contratos."))
            .finally(() => setLoading(false));
    }, []);

    const handleDownload = (id: number) => {
        toast.info(`Iniciando download do contrato #${id}...`);
    };

    async function handleAssinar(contratoId: number) {
        try {
            await contratoService.assinar(contratoId);
            toast.success("Contrato assinado com sucesso.");
            const list = await contratoService.listar();
            setContratos(list || []);
        } catch {
            toast.error("Nao foi possivel assinar o contrato.");
        }
    }

    async function handleAprovarCredito(contrato: Contrato) {
        try {
            await contratoService.aprovarCredito(contrato.id, {
                valor_credito: contrato.valor_aluguel || 0,
                taxa_juros: 1.9,
            });
            toast.success("Credito aprovado com sucesso.");
            const list = await contratoService.listar();
            setContratos(list || []);
        } catch {
            toast.error("Nao foi possivel aprovar o credito.");
        }
    }

    return (
        <ProtectedRoute tipos={["AGENTE", "BANCO"]}>
            <DashboardShell
                greeting="Gestao de contratos"
                subtitle="Consulte contratos ativos e acompanhe documentos emitidos."
                navItems={getDashboardNavItems(usuario?.tipo, "/contratos")}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-4xl font-semibold tracking-tight text-[#263029]">
                            Contratos gerados
                        </h2>
                        <p className="text-sm text-[#68736b]">
                            Visualize e gerencie os contratos formalizados pelo
                            sistema.
                        </p>
                    </div>
                    <Badge
                        variant="outline"
                        className="rounded-full border-[#cfd8cf] px-4 py-1 text-[#59655c]"
                    >
                        {contratos.length} contratos
                    </Badge>
                </div>

                {loading ? (
                    <p className="text-sm text-[#667067]">
                        Carregando base de dados...
                    </p>
                ) : contratos.length === 0 ? (
                    <div className="rounded-3xl border-2 border-dashed border-[#ccd6cd] bg-white p-12 text-center">
                        <FileText className="mx-auto h-12 w-12 text-[#90a092]" />
                        <h3 className="mt-4 text-2xl font-semibold text-[#2b342d]">
                            Nenhum contrato encontrado
                        </h3>
                        <p className="text-sm text-[#69756b]">
                            Pedidos aprovados aparecem aqui apos emissao.
                        </p>
                    </div>
                ) : (
                    <div className="rounded-3xl border border-[#dce2dc] bg-white p-4 shadow-[0_8px_22px_rgba(32,46,39,0.06)]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">
                                        ID
                                    </TableHead>
                                    <TableHead>Pedido Origem</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead>Propriedade</TableHead>
                                    <TableHead>Valor Aluguel</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">
                                        Acoes
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {contratos.map((contrato) => (
                                    <TableRow key={contrato.id}>
                                        <TableCell className="font-medium">
                                            #{contrato.id}
                                        </TableCell>
                                        <TableCell>
                                            Pedido #{contrato.pedido_id}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">
                                                {contrato.tipo}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {contrato.tipo_propriedade}
                                        </TableCell>
                                        <TableCell>
                                            {new Intl.NumberFormat("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                            }).format(
                                                contrato.valor_aluguel || 0,
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2
                                                    className={`h-4 w-4 ${
                                                        contrato.status ===
                                                        "ATIVO"
                                                            ? "text-green-600"
                                                            : "text-amber-600"
                                                    }`}
                                                />
                                                <span className="text-sm">
                                                    {statusLabel[
                                                        contrato.status
                                                    ] || contrato.status}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {contrato.status ===
                                                    "PENDENTE_ASSINATURA" && (
                                                    <Button
                                                        size="sm"
                                                        className="rounded-xl bg-[#4f9f68] text-white hover:bg-[#43895a]"
                                                        onClick={() =>
                                                            handleAssinar(
                                                                contrato.id,
                                                            )
                                                        }
                                                    >
                                                        Assinar
                                                    </Button>
                                                )}
                                                {usuario?.tipo === "BANCO" &&
                                                    contrato.tipo ===
                                                        "COM_CREDITO" &&
                                                    contrato.status ===
                                                        "AGUARDANDO_APROVACAO_BANCO" && (
                                                        <Button
                                                            size="sm"
                                                            className="rounded-xl bg-[#4f9f68] text-white hover:bg-[#43895a]"
                                                            onClick={() =>
                                                                handleAprovarCredito(
                                                                    contrato,
                                                                )
                                                            }
                                                        >
                                                            Aprovar credito
                                                        </Button>
                                                    )}

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="rounded-xl"
                                                    onClick={() =>
                                                        handleDownload(
                                                            contrato.id,
                                                        )
                                                    }
                                                >
                                                    <Download className="mr-2 h-4 w-4" />
                                                    PDF
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </DashboardShell>
        </ProtectedRoute>
    );
}
