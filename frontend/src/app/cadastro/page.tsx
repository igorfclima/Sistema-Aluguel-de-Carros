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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type CadastroForm = {
    nome: string;
    email: string;
    senha: string;
    tipo: TipoUsuario | "";
    cpf: string;
    rg: string;
    endereco: string;
    profissao: string;
    nome_instituicao: string;
    tipo_agente: string;
    codigo_bancario: string;
    empregador1: string;
    rendimento1: string;
    empregador2: string;
    rendimento2: string;
    empregador3: string;
    rendimento3: string;
};

const CAMPOS_RENDIMENTO = [
    { i: 1, empregadorKey: "empregador1", rendimentoKey: "rendimento1" },
    { i: 2, empregadorKey: "empregador2", rendimentoKey: "rendimento2" },
    { i: 3, empregadorKey: "empregador3", rendimentoKey: "rendimento3" },
] as const;

export default function CadastroPage() {
    const [form, setForm] = useState<CadastroForm>({
        nome: "",
        email: "",
        senha: "",
        tipo: "",
        cpf: "",
        rg: "",
        endereco: "",
        profissao: "",
        nome_instituicao: "",
        tipo_agente: "",
        codigo_bancario: "",
        empregador1: "",
        rendimento1: "",
        empregador2: "",
        rendimento2: "",
        empregador3: "",
        rendimento3: "",
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    function handleChange<K extends keyof CadastroForm>(
        field: K,
        value: CadastroForm[K],
    ) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!form.tipo) {
            toast.error("Selecione o tipo de conta.");
            return;
        }

        setLoading(true);
        try {
            await authService.cadastrar({
                ...form,
                tipo: form.tipo,
                rendimento1: Number(form.rendimento1 || 0),
                rendimento2: Number(form.rendimento2 || 0),
                rendimento3: Number(form.rendimento3 || 0),
            });
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
        <div className="min-h-screen bg-[#f8f9f7] text-[#232b26] lg:grid lg:grid-cols-2">
            <section className="relative hidden overflow-hidden border-r border-[#dfe4de] bg-[radial-gradient(circle_at_20%_20%,#f7fbf8_0%,#e7eee9_38%,#d9e3da_100%)] lg:flex lg:items-center lg:justify-center">
                <div className="fade-up w-full max-w-[520px] px-10">
                    <div className="mb-7 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#4f9f68] shadow-[0_8px_18px_rgba(79,159,104,0.35)]" />
                        <p className="text-5xl font-semibold tracking-tight">
                            LocaMais
                        </p>
                    </div>
                    <h1 className="text-5xl font-semibold leading-[1.08] tracking-tight text-[#26302a]">
                        Crie sua conta e gerencie alugueis com fluidez.
                    </h1>
                    <p className="mt-6 text-2xl leading-relaxed text-[#667267]">
                        Cadastro unico para cliente, agente e banco com o mesmo
                        ecossistema de pedidos e contratos.
                    </p>
                </div>
            </section>

            <section className="px-4 py-10 sm:px-6 lg:px-10 lg:py-12">
                <div className="mx-auto w-full max-w-[560px] rounded-3xl border border-[#dce2dc] bg-white p-6 shadow-[0_14px_34px_rgba(36,50,41,0.08)] sm:p-8">
                    <div className="mb-6">
                        <h2 className="text-4xl font-semibold tracking-tight text-[#242d27]">
                            Criar conta
                        </h2>
                        <p className="mt-2 text-sm text-[#6a756c]">
                            Preencha os campos abaixo para entrar na plataforma.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Nome</Label>
                            <Input
                                className="h-11 rounded-2xl border-[#d7ddd7]"
                                value={form.nome}
                                onChange={(e) =>
                                    handleChange("nome", e.target.value)
                                }
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>E-mail</Label>
                            <Input
                                type="email"
                                className="h-11 rounded-2xl border-[#d7ddd7]"
                                value={form.email}
                                onChange={(e) =>
                                    handleChange("email", e.target.value)
                                }
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Senha</Label>
                            <Input
                                type="password"
                                className="h-11 rounded-2xl border-[#d7ddd7]"
                                value={form.senha}
                                onChange={(e) =>
                                    handleChange("senha", e.target.value)
                                }
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Tipo de conta</Label>
                            <Select
                                value={form.tipo}
                                onValueChange={(v) =>
                                    handleChange("tipo", v as TipoUsuario)
                                }
                                required
                            >
                                <SelectTrigger className="h-11 rounded-2xl border-[#d7ddd7]">
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
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>CPF</Label>
                                        <Input
                                            className="h-11 rounded-2xl border-[#d7ddd7]"
                                            value={form.cpf}
                                            onChange={(e) =>
                                                handleChange(
                                                    "cpf",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="000.000.000-00"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>RG</Label>
                                        <Input
                                            className="h-11 rounded-2xl border-[#d7ddd7]"
                                            value={form.rg}
                                            onChange={(e) =>
                                                handleChange(
                                                    "rg",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Endereco</Label>
                                    <Input
                                        className="h-11 rounded-2xl border-[#d7ddd7]"
                                        value={form.endereco}
                                        onChange={(e) =>
                                            handleChange(
                                                "endereco",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Profissao</Label>
                                    <Input
                                        className="h-11 rounded-2xl border-[#d7ddd7]"
                                        value={form.profissao}
                                        onChange={(e) =>
                                            handleChange(
                                                "profissao",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <div className="space-y-3 rounded-2xl border border-[#e0e6e0] bg-[#f7faf7] p-4">
                                    <p className="text-sm font-semibold text-[#425044]">
                                        Rendimentos mensais (maximo 3)
                                    </p>
                                    {CAMPOS_RENDIMENTO.map(
                                        ({ i, empregadorKey, rendimentoKey }) => {
                                        return (
                                            <div
                                                key={i}
                                                className="grid gap-2 sm:grid-cols-2"
                                            >
                                                <Input
                                                    className="h-11 rounded-2xl border-[#d7ddd7]"
                                                    placeholder={`Empregador ${i}`}
                                                    value={form[empregadorKey]}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            empregadorKey,
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                <Input
                                                    className="h-11 rounded-2xl border-[#d7ddd7]"
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="Valor mensal"
                                                    value={form[rendimentoKey]}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            rendimentoKey,
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                        );
                                    },
                                    )}
                                </div>
                            </>
                        )}

                        {(form.tipo === "AGENTE" || form.tipo === "BANCO") && (
                            <div className="space-y-2">
                                <Label>Nome da instituicao</Label>
                                <Input
                                    className="h-11 rounded-2xl border-[#d7ddd7]"
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
                        )}

                        {form.tipo === "BANCO" && (
                            <div className="space-y-2">
                                <Label>Codigo bancario</Label>
                                <Input
                                    className="h-11 rounded-2xl border-[#d7ddd7]"
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
                            className="h-12 w-full rounded-2xl bg-[#4f9f68] text-base font-semibold text-white hover:bg-[#43895a]"
                            disabled={loading}
                        >
                            {loading ? "Cadastrando..." : "Criar conta"}
                        </Button>
                    </form>

                    <p className="mt-5 text-center text-sm text-[#6a746c]">
                        Ja tem conta?{" "}
                        <Link
                            href="/login"
                            className="font-semibold text-[#2f6f46] underline decoration-[#8fb99d] underline-offset-4"
                        >
                            Entrar
                        </Link>
                    </p>
                </div>
            </section>
        </div>
    );
}
