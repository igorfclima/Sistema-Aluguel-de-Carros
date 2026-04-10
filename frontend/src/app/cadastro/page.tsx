"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/services/auth.service";
import { TipoUsuario } from "@/types/usuario.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function CadastroPage() {
    const [form, setForm] = useState({
        nome: "",
        email: "",
        senha: "",
        tipo: "" as TipoUsuario,
        cpf: "",
        rg: "",
        endereco: "",
        profissao: "",
        nome_instituicao: "",
        tipo_agente: "",
        codigo_bancario: "",
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    function handleChange(field: string, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.cadastrar(form);
            toast.success("Cadastro realizado!", {
                description: "Faça login para continuar.",
            });
            router.push("/login");
        } catch {
            toast.error("Erro no cadastro", {
                description: "Verifique os dados e tente novamente.",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Cadastro</CardTitle>
                    <CardDescription>Crie sua conta no sistema</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <Label>Nome</Label>
                            <Input
                                value={form.nome}
                                onChange={(e) =>
                                    handleChange("nome", e.target.value)
                                }
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>E-mail</Label>
                            <Input
                                type="email"
                                value={form.email}
                                onChange={(e) =>
                                    handleChange("email", e.target.value)
                                }
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>Senha</Label>
                            <Input
                                type="password"
                                value={form.senha}
                                onChange={(e) =>
                                    handleChange("senha", e.target.value)
                                }
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>Tipo de conta</Label>
                            <Select
                                onValueChange={(v) => handleChange("tipo", v)}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CLIENTE">
                                        Cliente
                                    </SelectItem>
                                    <SelectItem value="AGENTE">
                                        Agente (Empresa)
                                    </SelectItem>
                                    <SelectItem value="BANCO">Banco</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {form.tipo === "CLIENTE" && (
                            <>
                                <div className="space-y-1">
                                    <Label>CPF</Label>
                                    <Input
                                        value={form.cpf}
                                        onChange={(e) =>
                                            handleChange("cpf", e.target.value)
                                        }
                                        placeholder="000.000.000-00"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>RG</Label>
                                    <Input
                                        value={form.rg}
                                        onChange={(e) =>
                                            handleChange("rg", e.target.value)
                                        }
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Endereço</Label>
                                    <Input
                                        value={form.endereco}
                                        onChange={(e) =>
                                            handleChange(
                                                "endereco",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Profissão</Label>
                                    <Input
                                        value={form.profissao}
                                        onChange={(e) =>
                                            handleChange(
                                                "profissao",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                            </>
                        )}

                        {(form.tipo === "AGENTE" || form.tipo === "BANCO") && (
                            <>
                                <div className="space-y-1">
                                    <Label>Nome da instituição</Label>
                                    <Input
                                        value={form.nome_instituicao}
                                        onChange={(e) =>
                                            handleChange(
                                                "nome_instituicao",
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                </div>
                            </>
                        )}

                        {form.tipo === "BANCO" && (
                            <div className="space-y-1">
                                <Label>Código bancário</Label>
                                <Input
                                    value={form.codigo_bancario}
                                    onChange={(e) =>
                                        handleChange(
                                            "codigo_bancario",
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? "Cadastrando..." : "Criar conta"}
                        </Button>
                    </form>
                    <p className="mt-4 text-center text-sm text-muted-foreground">
                        Já tem conta?{" "}
                        <Link href="/login" className="underline">
                            Entrar
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
