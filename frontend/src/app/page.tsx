"use client";

import { useEffect, useSyncExternalStore } from "react";
import imagemCarro from "../assets/imgs/carro.jpg";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowRight,
    CarFront,
    Clock3,
    CreditCard,
    ShieldCheck,
} from "lucide-react";

export default function Home() {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const isClient = useSyncExternalStore(
        () => () => {},
        () => true,
        () => false,
    );

    useEffect(() => {
        if (!isLoading) {
            if (isAuthenticated) {
                router.push("/dashboard");
            }
        }
    }, [isAuthenticated, isLoading, router]);

    if (!isClient || isLoading || isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#f7f8f6] text-[#262d29]">
            <header className="sticky top-0 z-20 border-b border-[#dce2db] bg-[#f7f8f6]/95 backdrop-blur">
                <div className="mx-auto flex h-16 w-full max-w-350 items-center justify-between px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <CarFront className="h-8 w-8 text-[#4f9f68] drop-shadow-[0_8px_18px_rgba(79,159,104,0.35)]" />
                        <p className="text-3xl font-semibold tracking-tight">
                            LocaMais
                        </p>
                    </div>

                    <nav className="hidden items-center gap-8 text-sm text-[#667067] md:flex">
                        <a href="#vantagens" className="hover:text-[#2f6f46]">
                            Vantagens
                        </a>
                        <a href="#numeros" className="hover:text-[#2f6f46]">
                            Numeros
                        </a>
                        <a href="#contato" className="hover:text-[#2f6f46]">
                            Contato
                        </a>
                    </nav>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <Link
                            href="/login"
                            className="rounded-full px-4 py-2 text-sm font-semibold text-[#2d352f] transition hover:bg-[#eef2ee]"
                        >
                            Entrar
                        </Link>
                        <Link
                            href="/cadastro"
                            className="rounded-full bg-[#4f9f68] px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(79,159,104,0.35)] transition hover:bg-[#43895a]"
                        >
                            Cadastre-se
                        </Link>
                    </div>
                </div>
            </header>

            <section className="border-b border-[#dce2db]">
                <div className="mx-auto grid w-full max-w-350 gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-20">
                    <div className="fade-up">
                        <span className="inline-flex items-center gap-2 rounded-full bg-[#e5efe8] px-4 py-2 text-sm font-semibold text-[#2f6f46]">
                            <CarFront size={16} /> Plataforma lider em aluguel
                            de veiculos
                        </span>
                        <h1 className="mt-7 max-w-155 text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl">
                            Alugue o carro ideal com
                            <span className="text-[#4f9f68]">
                                {" "}
                                total simplicidade
                            </span>
                        </h1>
                        <p className="mt-5 max-w-135 text-xl leading-relaxed text-[#5f6a61]">
                            Gerencie pedidos, contratos e frota em uma unica
                            plataforma. Para clientes individuais, agentes
                            corporativos e bancos.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                href="/cadastro"
                                className="inline-flex items-center gap-2 rounded-3xl bg-[#4f9f68] px-7 py-3.5 text-lg font-semibold text-white shadow-[0_12px_26px_rgba(79,159,104,0.38)] transition hover:bg-[#43895a]"
                            >
                                Comecar agora
                                <ArrowRight size={18} />
                            </Link>
                            <Link
                                href="/login"
                                className="rounded-3xl border border-[#d6ddd5] bg-white px-7 py-3.5 text-lg font-semibold text-[#364238] transition hover:bg-[#f2f5f2]"
                            >
                                Ja tenho conta
                            </Link>
                        </div>
                    </div>

                    <div className="fade-up relative">
                        <Image
                            src={imagemCarro}
                            alt="Carro"
                            priority
                            className="h-full w-full rounded-3xl object-cover shadow-[0_12px_24px_rgba(34,48,40,0.12)]"
                        />
                        <div className="absolute -bottom-5 left-5 rounded-3xl border border-[#dbe3db] bg-white px-5 py-4 shadow-[0_12px_24px_rgba(34,48,40,0.12)]">
                            <p className="text-sm text-[#6f786f]">
                                Disponivel agora
                            </p>
                            <p className="text-4xl font-semibold tracking-tight">
                                142 veiculos
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section
                id="vantagens"
                className="border-b border-[#dde3dc] bg-white/60"
            >
                <div className="mx-auto w-full max-w-350 px-4 py-20 text-center sm:px-6">
                    <h2 className="text-5xl font-semibold tracking-tight">
                        Por que escolher a LocaMais?
                    </h2>
                    <p className="mx-auto mt-4 max-w-180 text-xl text-[#646f65]">
                        Uma plataforma completa que conecta clientes, empresas e
                        bancos em um so lugar.
                    </p>

                    <div className="mt-12 grid gap-4 text-left md:grid-cols-2 xl:grid-cols-4">
                        {[
                            {
                                icon: <CarFront size={20} />,
                                title: "Frota Diversificada",
                                text: "SUVs, sedas e utilitarios para cada perfil de locacao.",
                            },
                            {
                                icon: <ShieldCheck size={20} />,
                                title: "Seguro Completo",
                                text: "Contratos com cobertura contra terceiros e assistencia 24h.",
                            },
                            {
                                icon: <Clock3 size={20} />,
                                title: "Retirada Rapida",
                                text: "Processo 100% digital para retirada em poucos minutos.",
                            },
                            {
                                icon: <CreditCard size={20} />,
                                title: "Credito Facilitado",
                                text: "Parceria com bancos para aprovacao de credito direto na plataforma.",
                            },
                        ].map((item) => (
                            <article
                                key={item.title}
                                className="fade-up rounded-3xl border border-[#dde3dc] bg-[#f8faf8] p-6 shadow-[0_8px_16px_rgba(47,63,52,0.04)]"
                            >
                                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e5efe8] text-[#2f6f46]">
                                    {item.icon}
                                </div>
                                <h3 className="text-3xl font-semibold tracking-tight text-[#273029]">
                                    {item.title}
                                </h3>
                                <p className="mt-2 text-lg leading-relaxed text-[#657066]">
                                    {item.text}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section id="numeros" className="border-b border-[#dde3dc]">
                <div className="mx-auto grid w-full max-w-350 gap-10 px-4 py-16 text-center text-[#4f9f68] sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
                    {[
                        ["2.500+", "Veiculos na frota"],
                        ["98%", "Satisfacao dos clientes"],
                        ["45+", "Cidades atendidas"],
                        ["24/7", "Suporte ao cliente"],
                    ].map(([value, label]) => (
                        <div key={label} className="fade-up">
                            <p className="text-6xl font-semibold tracking-tight">
                                {value}
                            </p>
                            <p className="mt-2 text-xl text-[#637065]">
                                {label}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <section id="contato" className="border-b border-[#dde3dc] py-24">
                <div className="mx-auto w-full max-w-225 px-4 text-center sm:px-6">
                    <h2 className="text-5xl font-semibold tracking-tight">
                        Pronto para simplificar seus alugueis?
                    </h2>
                    <p className="mx-auto mt-4 max-w-185 text-2xl leading-relaxed text-[#616d62]">
                        Cadastre-se gratuitamente e comece a gerenciar pedidos,
                        contratos e frota de forma inteligente.
                    </p>
                    <Link
                        href="/cadastro"
                        className="mt-8 inline-flex items-center gap-2 rounded-3xl bg-[#4f9f68] px-8 py-4 text-xl font-semibold text-white shadow-[0_12px_26px_rgba(79,159,104,0.38)] transition hover:bg-[#43895a]"
                    >
                        Criar conta gratuita
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </section>

            <footer className="py-8">
                <div className="mx-auto flex w-full max-w-350 flex-col items-center justify-between gap-3 px-4 text-[#68736a] sm:flex-row sm:px-6">
                    <div className="flex items-center gap-3">
                        <CarFront className="h-7 w-7 text-[#4f9f68]" />
                        <p className="text-3xl font-semibold tracking-tight text-[#2a332d]">
                            LocaMais
                        </p>
                    </div>
                    <div className="flex gap-6 text-sm">
                        <span>Termos de Uso</span>
                        <span>Privacidade</span>
                        <span>Suporte</span>
                    </div>
                    <p className="text-sm">
                        © 2026 LocaMais. Todos os direitos reservados.
                    </p>
                </div>
            </footer>
        </div>
    );
}
