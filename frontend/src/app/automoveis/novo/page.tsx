"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/services/api";

export default function NovoAutomovelPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        matricula: "",
        ano: new Date().getFullYear(),
        marca: "",
        modelo: "",
        placa: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/automoveis", formData);
            toast.success("Automóvel cadastrado com sucesso!");
            router.push("/automoveis/novo");
        } catch (error: any) {
            toast.error(
                error.response?.data?.error || "Erro ao cadastrar automóvel",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute tipos={["AGENTE"]}>
            {" "}
            <Navbar />
            <main className="max-w-2xl mx-auto px-6 py-10">
                <h1 className="text-2xl font-bold mb-6">
                    Cadastrar Novo Veículo
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4 bg-card p-6 rounded-lg border"
                >
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="marca">Marca</Label>
                            <Input
                                id="marca"
                                placeholder="Ex: Toyota"
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

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="ano">Ano</Label>
                            <Input
                                id="ano"
                                type="number"
                                defaultValue={formData.ano}
                                required
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        ano: parseInt(e.target.value),
                                    })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="placa">Placa</Label>
                            <Input
                                id="placa"
                                placeholder="ABC-1234"
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
                            <Label htmlFor="matricula">Matrícula</Label>
                            <Input
                                id="matricula"
                                placeholder="Nº Registro"
                                required
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        matricula: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Salvando..." : "Salvar Veículo"}
                        </Button>
                    </div>
                </form>
            </main>
        </ProtectedRoute>
    );
}
