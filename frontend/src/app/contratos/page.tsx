"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
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

export default function ContratosPage() {
    const [contratos, setContratos] = useState<Contrato[]>([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <ProtectedRoute tipos={["AGENTE", "BANCO"]}>
            <div className="min-h-screen bg-background">
                <Navbar />
                <main className="max-w-6xl mx-auto px-6 py-10 space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-xl font-semibold">
                                Contratos Gerados
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Visualize e gerencie os contratos formalizados
                                pelo sistema.
                            </p>
                        </div>
                        <Badge variant="outline" className="px-4 py-1">
                            {contratos.length} Contratos
                        </Badge>
                    </div>

                    {loading ? (
                        <p className="text-sm text-muted-foreground">
                            Carregando base de dados...
                        </p>
                    ) : contratos.length === 0 ? (
                        <div className="border-2 border-dashed rounded-lg p-12 text-center">
                            <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                            <h3 className="mt-4 text-lg font-medium">
                                Nenhum contrato encontrado
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Pedidos aprovados pelo Agente aparecerão aqui
                                após a emissão.
                            </p>
                        </div>
                    ) : (
                        <div className="border rounded-md bg-card">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">
                                            ID
                                        </TableHead>
                                        <TableHead>Pedido Origem</TableHead>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead>Propriedade</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">
                                            Ações
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {contratos.map((contrato: any) => (
                                        <TableRow
                                            key={contrato.id || contrato.ID}
                                        >
                                            <TableCell className="font-medium">
                                                #{contrato.id || contrato.ID}
                                            </TableCell>
                                            <TableCell>
                                                Pedido #
                                                {contrato.pedido_id ||
                                                    contrato.PedidoID}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {contrato.tipo ||
                                                        contrato.Tipo}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {contrato.tipo_propriedade ||
                                                    contrato.TipoPropriedade}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                    <span className="text-sm">
                                                        Ativo
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDownload(
                                                            contrato.id ||
                                                                contrato.ID,
                                                        )
                                                    }
                                                >
                                                    <Download className="h-4 w-4 mr-2" />
                                                    PDF
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </main>
            </div>
        </ProtectedRoute>
    );
}
