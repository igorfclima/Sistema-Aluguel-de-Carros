"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getDashboardNavItems } from "@/lib/dashboard-nav";
import { useAuth } from "@/context/AuthContext";
import { automovelService } from "@/services/automovel.service";
import { Automovel, CreateAutomovelRequest } from "@/types/contrato.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function AutomoveisPage() {
    const { usuario } = useAuth();
    const [automoveis, setAutomoveis] = useState<Automovel[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<Automovel | null>(null);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(8);
    const [editForm, setEditForm] = useState<CreateAutomovelRequest>({
        matricula: "",
        ano: new Date().getFullYear(),
        marca: "",
        modelo: "",
        placa: "",
        valor: 0,
    });

    async function loadAutomoveis() {
        setLoading(true);
        try {
            const list = await automovelService.listar();
            setAutomoveis(list || []);
        } catch {
            toast.error("Erro ao carregar frota de veiculos.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadAutomoveis();
    }, []);

    useEffect(() => {
        setPage(1);
    }, [searchTerm, itemsPerPage]);

    function openEditDialog(automovel: Automovel) {
        setEditing(automovel);
        setEditForm({
            matricula: automovel.matricula,
            ano: automovel.ano,
            marca: automovel.marca,
            modelo: automovel.modelo,
            placa: automovel.placa,
            valor: automovel.valor,
        });
    }

    async function handleSaveEdit() {
        if (!editing) return;

        setSaving(true);
        try {
            await automovelService.atualizar(editing.id, editForm);
            toast.success("Veiculo atualizado com sucesso.");
            setEditing(null);
            await loadAutomoveis();
        } catch {
            toast.error("Nao foi possivel atualizar o veiculo.");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id: number) {
        if (!confirm("Deseja realmente remover este veiculo da frota?")) return;

        try {
            await automovelService.remover(id);
            toast.success("Veiculo removido com sucesso.");
            setAutomoveis((prev) => prev.filter((v) => v.id !== id));
        } catch {
            toast.error("Nao foi possivel remover o veiculo.");
        }
    }

    const filteredAutomoveis = automoveis.filter((automovel) => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return true;

        return [
            automovel.marca,
            automovel.modelo,
            automovel.placa,
            automovel.matricula,
            String(automovel.ano),
        ]
            .join(" ")
            .toLowerCase()
            .includes(term);
    });

    const totalPages = Math.max(
        1,
        Math.ceil(filteredAutomoveis.length / itemsPerPage),
    );
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * itemsPerPage;
    const paginatedAutomoveis = filteredAutomoveis.slice(
        start,
        start + itemsPerPage,
    );

    return (
        <ProtectedRoute tipos={["AGENTE"]}>
            <DashboardShell
                greeting="Gestao de veiculos"
                subtitle="Gerencie toda a frota com edicao e controle centralizado."
                navItems={getDashboardNavItems(usuario?.tipo, "/automoveis")}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-4xl font-semibold tracking-tight text-[#263029]">
                            Frota cadastrada
                        </h2>
                        <p className="text-sm text-[#68736b]">
                            Edite dados, remova veiculos e acompanhe
                            disponibilidade.
                        </p>
                    </div>

                    <Link href="/automoveis/novo">
                        <Button className="h-11 rounded-2xl bg-[#4f9f68] px-4 text-white hover:bg-[#43895a]">
                            <Plus size={16} className="mr-2" />
                            Cadastrar novo
                        </Button>
                    </Link>
                </div>

                <div className="flex flex-col gap-3 rounded-3xl border border-[#dce2dc] bg-white p-4 shadow-[0_8px_22px_rgba(32,46,39,0.06)] md:flex-row md:items-center md:justify-between">
                    <div className="relative w-full md:max-w-lg">
                        <Search
                            size={16}
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7f8a80]"
                        />
                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar por marca, modelo, placa, matricula ou ano"
                            className="h-11 rounded-2xl border-[#d7ddd7] pl-9"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-[#6a756d]">
                            Itens por pagina
                        </span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) =>
                                setItemsPerPage(Number(e.target.value))
                            }
                            className="h-11 rounded-2xl border border-[#d7ddd7] bg-white px-3 text-sm text-[#334137] outline-none"
                        >
                            <option value={8}>8</option>
                            <option value={12}>12</option>
                            <option value={20}>20</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <p className="text-sm text-[#667067]">
                        Carregando frota...
                    </p>
                ) : filteredAutomoveis.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-[#cfd8cf] bg-white px-6 py-10 text-center text-[#6b756c]">
                        Nenhum veiculo encontrado para o filtro informado.
                    </div>
                ) : (
                    <div className="space-y-3 rounded-3xl border border-[#dce2dc] bg-white p-4 shadow-[0_8px_22px_rgba(32,46,39,0.06)]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Marca/Modelo</TableHead>
                                    <TableHead>Ano</TableHead>
                                    <TableHead>Placa</TableHead>
                                    <TableHead>Matricula</TableHead>
                                    <TableHead>Valor</TableHead>
                                    <TableHead className="text-right">
                                        Acoes
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedAutomoveis.map((automovel) => (
                                    <TableRow key={automovel.id}>
                                        <TableCell>#{automovel.id}</TableCell>
                                        <TableCell>
                                            {automovel.marca} {automovel.modelo}
                                        </TableCell>
                                        <TableCell>{automovel.ano}</TableCell>
                                        <TableCell>{automovel.placa}</TableCell>
                                        <TableCell>
                                            {automovel.matricula}
                                        </TableCell>
                                        <TableCell>
                                            {new Intl.NumberFormat("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                            }).format(automovel.valor)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="rounded-xl"
                                                    onClick={() =>
                                                        openEditDialog(
                                                            automovel,
                                                        )
                                                    }
                                                >
                                                    <Pencil
                                                        size={14}
                                                        className="mr-2"
                                                    />
                                                    Editar
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    className="rounded-xl"
                                                    onClick={() =>
                                                        handleDelete(
                                                            automovel.id,
                                                        )
                                                    }
                                                >
                                                    <Trash2
                                                        size={14}
                                                        className="mr-2"
                                                    />
                                                    Remover
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <div className="flex flex-col gap-2 border-t border-[#e4eae4] pt-3 text-sm text-[#647065] sm:flex-row sm:items-center sm:justify-between">
                            <span>
                                Mostrando {start + 1}-
                                {Math.min(
                                    start + itemsPerPage,
                                    filteredAutomoveis.length,
                                )}{" "}
                                de {filteredAutomoveis.length} veiculos
                            </span>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-xl"
                                    onClick={() =>
                                        setPage((prev) => Math.max(1, prev - 1))
                                    }
                                    disabled={safePage === 1}
                                >
                                    Anterior
                                </Button>
                                <span className="min-w-22 text-center">
                                    Pagina {safePage} de {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-xl"
                                    onClick={() =>
                                        setPage((prev) =>
                                            Math.min(totalPages, prev + 1),
                                        )
                                    }
                                    disabled={safePage === totalPages}
                                >
                                    Proxima
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
                    <DialogContent className="rounded-3xl border-[#dce2dc]">
                        <DialogHeader>
                            <DialogTitle>
                                Editar veiculo #{editing?.id}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4 py-2">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Marca</Label>
                                    <Input
                                        className="h-11 rounded-2xl border-[#d7ddd7]"
                                        value={editForm.marca}
                                        onChange={(e) =>
                                            setEditForm((prev) => ({
                                                ...prev,
                                                marca: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Modelo</Label>
                                    <Input
                                        className="h-11 rounded-2xl border-[#d7ddd7]"
                                        value={editForm.modelo}
                                        onChange={(e) =>
                                            setEditForm((prev) => ({
                                                ...prev,
                                                modelo: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-4">
                                <div className="space-y-2">
                                    <Label>Ano</Label>
                                    <Input
                                        type="number"
                                        className="h-11 rounded-2xl border-[#d7ddd7]"
                                        value={editForm.ano}
                                        onChange={(e) =>
                                            setEditForm((prev) => ({
                                                ...prev,
                                                ano:
                                                    parseInt(
                                                        e.target.value,
                                                        10,
                                                    ) || prev.ano,
                                            }))
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Placa</Label>
                                    <Input
                                        className="h-11 rounded-2xl border-[#d7ddd7]"
                                        value={editForm.placa}
                                        onChange={(e) =>
                                            setEditForm((prev) => ({
                                                ...prev,
                                                placa: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Matricula</Label>
                                    <Input
                                        className="h-11 rounded-2xl border-[#d7ddd7]"
                                        value={editForm.matricula}
                                        onChange={(e) =>
                                            setEditForm((prev) => ({
                                                ...prev,
                                                matricula: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Valor</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        className="h-11 rounded-2xl border-[#d7ddd7]"
                                        value={editForm.valor}
                                        onChange={(e) =>
                                            setEditForm((prev) => ({
                                                ...prev,
                                                valor:
                                                    parseFloat(
                                                        e.target.value,
                                                    ) || 0,
                                            }))
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                variant="outline"
                                className="rounded-xl"
                                onClick={() => setEditing(null)}
                                disabled={saving}
                            >
                                Cancelar
                            </Button>
                            <Button
                                className="rounded-xl bg-[#4f9f68] text-white hover:bg-[#43895a]"
                                onClick={handleSaveEdit}
                                disabled={saving}
                            >
                                {saving ? "Salvando..." : "Salvar alteracoes"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </DashboardShell>
        </ProtectedRoute>
    );
}
