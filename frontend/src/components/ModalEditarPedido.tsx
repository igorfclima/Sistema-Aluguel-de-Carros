"use client";

import { useState, useEffect, SetStateAction } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { pedidoService } from "@/services/pedido.service";
import api from "@/services/api";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Pedido } from "@/types/pedido.types";

interface Automovel {
    id: number;
    marca: string;
    modelo: string;
}

interface ModalEditarPedidoProps {
    pedido: Pedido | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function ModalEditarPedido({
    pedido,
    open,
    onOpenChange,
    onSuccess,
}: ModalEditarPedidoProps) {
    const [veiculos, setVeiculos] = useState<Automovel[]>([]);
    const [novoVeiculoId, setNovoVeiculoId] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            api.get("/automoveis").then(
                (res: { data: SetStateAction<Automovel[]> }) =>
                    setVeiculos(res.data),
            );
        }
    }, [open]);

    const handleSalvar = async () => {
        if (!pedido) return;
        if (!novoVeiculoId) return toast.error("Selecione um novo veículo");
        setLoading(true);
        try {
            await pedidoService.atualizar(pedido.id, {
                automovel_id: Number(novoVeiculoId),
            });
            toast.success("Pedido modificado com sucesso!");
            onSuccess();
            onOpenChange(false);
        } catch {
            toast.error(
                "Erro ao modificar: verifique se o pedido ainda está em análise.",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Modificar Pedido #{pedido?.id}</DialogTitle>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Você pode alterar o automóvel deste pedido enquanto ele
                        estiver aguardando análise.
                    </p>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase">
                            Escolha o novo veículo:
                        </label>
                        <Select onValueChange={setNovoVeiculoId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione um carro da frota" />
                            </SelectTrigger>
                            <SelectContent>
                                {veiculos && veiculos.length > 0 ? (
                                    veiculos.map(
                                        (v) =>
                                            // Verificação de segurança: só renderiza se o ID existir
                                            v?.id && (
                                                <SelectItem
                                                    key={v.id}
                                                    value={String(v.id)}
                                                >
                                                    {v.marca} {v.modelo} (ID:{" "}
                                                    {v.id})
                                                </SelectItem>
                                            ),
                                    )
                                ) : (
                                    <SelectItem value="0" disabled>
                                        Nenhum veículo disponível
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="credito" />
                            <label htmlFor="credito" className="text-sm">
                                Solicitar Crédito Bancário
                            </label>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancelar
                    </Button>
                    <Button onClick={handleSalvar} disabled={loading}>
                        {loading ? "Salvando..." : "Confirmar Mudança"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
