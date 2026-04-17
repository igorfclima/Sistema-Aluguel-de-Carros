"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export interface DashboardNavItem {
    label: string;
    href: string;
    active?: boolean;
}

interface DashboardShellProps {
    greeting: string;
    subtitle: string;
    navItems: DashboardNavItem[];
    children: React.ReactNode;
}

export function DashboardShell({
    greeting,
    subtitle,
    navItems,
    children,
}: DashboardShellProps) {
    const { usuario, logout } = useAuth();

    return (
        <div className="min-h-screen bg-[#f8f9f7] text-[#222629]">
            <div className="flex w-full gap-0">
                <aside className="w-full border-b border-[#dfe4de] bg-[#f3f5f2] px-5 py-5 lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-[292px] lg:flex-col lg:rounded-none lg:border-b-0 lg:border-r lg:px-6 lg:py-8 lg:shadow-[0_10px_24px_rgba(39,56,48,0.06)]">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-[#4f9f68] shadow-[0_8px_18px_rgba(79,159,104,0.35)]" />
                        <div>
                            <p className="text-2xl font-semibold tracking-tight">
                                LocaMais
                            </p>
                            <p className="text-xs text-[#707a71]">
                                Gestao de alugueis
                            </p>
                        </div>
                    </div>

                    <nav className="mt-8 grid gap-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                                    item.active
                                        ? "bg-[#e5efe8] text-[#2d6c44]"
                                        : "text-[#6a736b] hover:bg-[#ebf1ec] hover:text-[#2d6c44]"
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="mt-7 flex items-center justify-between border-t border-[#d9dfd8] pt-5 lg:mt-auto lg:pt-6">
                        <div>
                            <p className="text-sm font-semibold">
                                {usuario?.nome}
                            </p>
                            <p className="text-xs text-[#6f786f]">
                                {usuario?.tipo}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={logout}
                            className="inline-flex items-center gap-2 rounded-full border border-[#d0d9d1] bg-white px-3 py-1.5 text-xs font-medium text-[#405145] transition hover:border-[#4f9f68] hover:text-[#2d6c44]"
                        >
                            <LogOut size={14} />
                            Sair
                        </button>
                    </div>
                </aside>

                <main className="w-full px-5 py-6 lg:px-12 lg:py-10">
                    <div className="w-full max-w-[1820px]">
                        <header className="fade-up">
                            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-[#242c28] lg:text-5xl">
                                {greeting}
                            </h1>
                            <p className="mt-2 text-sm text-[#707970] lg:text-lg">
                                {subtitle}
                            </p>
                        </header>

                        <section className="mt-7 space-y-6 lg:mt-10">
                            {children}
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}
