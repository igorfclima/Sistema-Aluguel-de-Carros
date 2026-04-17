"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import { TipoUsuario, Usuario } from "@/types/usuario.types";
import { CarFront } from "lucide-react";

interface JwtPayload {
    sub: number;
    exp: number;
    tipo: string;
    nome: string;
}

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await authService.login({ email, senha });
            const decoded = jwtDecode<JwtPayload>(response.token);
            const userType: TipoUsuario =
                decoded.tipo === "AGENTE" ||
                decoded.tipo === "BANCO" ||
                decoded.tipo === "CLIENTE"
                    ? decoded.tipo
                    : "CLIENTE";

            const usuario: Usuario = {
                id: decoded.sub,
                nome: decoded.nome || email.split("@")[0],
                email,
                tipo: userType,
            };

            login(response.token, usuario);

            toast.success("Login realizado!");

            router.push("/dashboard");
        } catch {
            toast.error("Erro ao entrar", {
                description: "E-mail ou senha inválidos.",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#f8f9f7] text-[#232b26] lg:grid lg:grid-cols-2">
            <section className="relative hidden overflow-hidden border-r border-[#dfe4de] bg-[radial-gradient(circle_at_10%_20%,#f7fbf8_0%,#e7eee9_38%,#d9e3da_100%)] lg:flex lg:items-center lg:justify-center">
                <div className="fade-up w-full max-w-125 px-10">
                    <div className="mb-7 flex items-center gap-3">
                        <CarFront className="h-10 w-10 text-[#4f9f68] drop-shadow-[0_8px_18px_rgba(79,159,104,0.35)]" />
                        <p className="text-5xl font-semibold tracking-tight">
                            LocaMais
                        </p>
                    </div>
                    <h1 className="text-5xl font-semibold leading-[1.08] tracking-tight text-[#26302a]">
                        Gerencie sua frota e contratos em um so lugar.
                    </h1>
                    <p className="mt-6 text-2xl leading-relaxed text-[#667267]">
                        Acesse pedidos, acompanhe veiculos e administre
                        contratos de aluguel de forma simples e rapida.
                    </p>
                </div>
                <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-[#4f9f68]/12 blur-2xl" />
                <div className="absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-[#8ab99a]/30 blur-2xl" />
            </section>

            <section className="flex items-center justify-center px-4 py-12 sm:px-6">
                <div className="fade-up w-full max-w-105 rounded-3xl border border-[#dce2dc] bg-white px-6 py-8 shadow-[0_14px_34px_rgba(36,50,41,0.08)] sm:px-8">
                    <div className="mb-8">
                        <h2 className="text-5xl font-semibold tracking-tight text-[#242d27]">
                            Bem-vindo de volta
                        </h2>
                        <p className="mt-2 text-base text-[#6a756c]">
                            Entre com suas credenciais para acessar o sistema.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label
                                htmlFor="email"
                                className="text-sm font-semibold"
                            >
                                E-mail
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-12 rounded-2xl border-[#d7ddd7] text-base"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="senha"
                                className="text-sm font-semibold"
                            >
                                Senha
                            </Label>
                            <Input
                                id="senha"
                                type="password"
                                placeholder="••••••••"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                className="h-12 rounded-2xl border-[#d7ddd7] text-base"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="h-12 w-full rounded-2xl bg-[#4f9f68] text-base font-semibold text-white shadow-[0_10px_20px_rgba(79,159,104,0.35)] hover:bg-[#43895a]"
                            disabled={loading}
                        >
                            {loading ? "Entrando..." : "Entrar"}
                        </Button>

                        <Link
                            href="/"
                            className="inline-flex h-12 w-full items-center justify-center rounded-2xl border border-[#d7ddd7] bg-white text-base font-semibold text-[#3e4a41] transition hover:bg-[#f2f5f2]"
                        >
                            Voltar para a pagina inicial
                        </Link>
                    </form>

                    <p className="mt-6 text-center text-sm text-[#6a746c]">
                        Nao tem uma conta?{" "}
                        <Link
                            href="/cadastro"
                            className="font-semibold text-[#2f6f46] underline decoration-[#8fb99d] underline-offset-4"
                        >
                            Cadastre-se
                        </Link>
                    </p>
                </div>
            </section>
        </div>
    );
}
