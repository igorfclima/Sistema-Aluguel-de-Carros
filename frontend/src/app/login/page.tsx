"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/auth.service";
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
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import { Usuario } from "@/types/usuario.types";

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

            const usuario: Usuario = {
                id: decoded.sub,
                nome: decoded.nome || email.split("@")[0],
                email,
                tipo: decoded.tipo as any,
            };

            login(response.token, usuario);

            toast.success("Login realizado!");

            if (decoded.tipo === "AGENTE" || decoded.tipo === "BANCO") {
                router.push("/dashboard");
            } else {
                router.push("/dashboard");
            }
        } catch {
            toast.error("Erro ao entrar", {
                description: "E-mail ou senha inválidos.",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Entrar</CardTitle>
                    <CardDescription>
                        Acesse o sistema de aluguel de carros
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="senha">Senha</Label>
                            <Input
                                id="senha"
                                type="password"
                                placeholder="••••••"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? "Entrando..." : "Entrar"}
                        </Button>
                    </form>
                    <p className="mt-4 text-center text-sm text-muted-foreground">
                        Não tem conta?{" "}
                        <Link href="/cadastro" className="underline">
                            Cadastre-se
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
