import { TipoUsuario } from "@/types/usuario.types";
import { DashboardNavItem } from "@/components/dashboard/DashboardShell";

const navByRole: Record<TipoUsuario, Omit<DashboardNavItem, "active">[]> = {
    CLIENTE: [
        { label: "Painel Principal", href: "/dashboard" },
        { label: "Meus Pedidos", href: "/pedidos" },
        { label: "Novo Pedido", href: "/pedidos/novo" },
    ],
    AGENTE: [
        { label: "Painel Principal", href: "/dashboard" },
        { label: "Pedidos", href: "/admin" },
        { label: "Contratos", href: "/contratos" },
        { label: "Veiculos", href: "/automoveis" },
    ],
    BANCO: [
        { label: "Painel Principal", href: "/dashboard" },
        { label: "Analise de Credito", href: "/admin" },
        { label: "Contratos", href: "/contratos" },
    ],
};

export function getDashboardNavItems(
    role: TipoUsuario | undefined,
    activeHref: string,
): DashboardNavItem[] {
    const selectedRole = role || "CLIENTE";

    return navByRole[selectedRole].map((item) => ({
        ...item,
        active: item.href === activeHref,
    }));
}
