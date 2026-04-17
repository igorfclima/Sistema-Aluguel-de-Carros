"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/services/api";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { useAuth } from "@/context/AuthContext";
import { getDashboardNavItems } from "@/lib/dashboard-nav";

interface ApiError {
    response?: {
        data?: {
            error?: string;
        };
    };
}

export default function NovoAutomovelPage() {
    const { usuario } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        matricula: "",
        ano: new Date().getFullYear(),
        marca: "",
        modelo: "",
        placa: "",
        valor: 0,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/automoveis", formData);
            toast.success("Automóvel cadastrado com sucesso!");
            router.push("/automoveis");
        } catch (error: unknown) {
            const message =
                typeof error === "object" && error
                    ? (error as ApiError).response?.data?.error
                    : undefined;

            toast.error(message || "Erro ao cadastrar automóvel");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute tipos={["AGENTE"]}>
            <DashboardShell
                greeting="Cadastro de veiculo"
                subtitle="Inclua novos automoveis para disponibilidade da frota."
                navItems={getDashboardNavItems(usuario?.tipo, "/automoveis")}
            >
                <section className="mx-auto w-full max-w-3xl rounded-3xl border border-[#dce2dc] bg-white p-6 shadow-[0_8px_22px_rgba(32,46,39,0.06)]">
                    <h2 className="text-3xl font-semibold tracking-tight text-[#283129]">
                        Cadastrar novo veiculo
                    </h2>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="marca">Marca</Label>
                                <Input
                                    id="marca"
                                    placeholder="Ex: Toyota"
                                    className="h-12 rounded-2xl border-[#d7ddd7]"
                                    required
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            marca: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="modelo">Modelo</Label>
                                <Input
                                    id="modelo"
                                    placeholder="Ex: Corolla"
                                    className="h-12 rounded-2xl border-[#d7ddd7]"
                                    required
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            modelo: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-4">
                            <div className="space-y-2">
                                <Label htmlFor="ano">Ano</Label>
                                <Input
                                    id="ano"
                                    type="number"
                                    defaultValue={formData.ano}
                                    className="h-12 rounded-2xl border-[#d7ddd7]"
                                    required
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            ano: parseInt(e.target.value, 10),
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="placa">Placa</Label>
                                <Input
                                    id="placa"
                                    placeholder="ABC-1234"
                                    className="h-12 rounded-2xl border-[#d7ddd7]"
                                    required
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            placa: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="matricula">Matricula</Label>
                                <Input
                                    id="matricula"
                                    placeholder="Numero de registro"
                                    className="h-12 rounded-2xl border-[#d7ddd7]"
                                    required
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            matricula: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="valor">
                                    Valor do automovel
                                </Label>
                                <Input
                                    id="valor"
                                    type="number"
                                    step="0.01"
                                    placeholder="Ex: 85000"
                                    className="h-12 rounded-2xl border-[#d7ddd7]"
                                    required
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            valor:
                                                parseFloat(e.target.value) || 0,
                                        })
                                    }
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                className="rounded-2xl"
                                onClick={() => router.back()}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="rounded-2xl bg-[#4f9f68] text-white hover:bg-[#43895a]"
                                disabled={loading}
                            >
                                {loading ? "Salvando..." : "Salvar veiculo"}
                            </Button>
                        </div>
                    </form>
                </section>
            </DashboardShell>
        </ProtectedRoute>
    );
}
