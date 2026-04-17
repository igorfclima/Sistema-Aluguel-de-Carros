"use client";

import { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { pedidoService } from "@/services/pedido.service";
import { contratoService } from "@/services/contrato.service";
import { automovelService } from "@/services/automovel.service";
import { Pedido } from "@/types/pedido.types";
import { Contrato, Automovel } from "@/types/contrato.types";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { SummaryStats } from "@/components/dashboard/SummaryStats";
import { WorkflowCard } from "@/components/dashboard/WorkflowCard";
import { ActionSidebar } from "@/components/dashboard/ActionSidebar";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

type StatusPedido = Pedido["status"];

const statusLabel: Record<StatusPedido, string> = {
    AGUARDANDO_ANALISE: "Em Analise",
    APROVADO: "Aprovado",
    CANCELADO: "Cancelado",
    CONTRATADO: "Contrato Ativo",
};

function formatDate(isoDate: string) {
    const date = new Date(isoDate);

    if (Number.isNaN(date.getTime())) {
        return "Data indefinida";
    }

    return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value);
}

export default function DashboardPage() {
    const { usuario } = useAuth();
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [contratos, setContratos] = useState<Contrato[]>([]);
    const [automoveis, setAutomoveis] = useState<Automovel[]>([]);
    const [loading, setLoading] = useState(true);
    const [pedidoDetalhes, setPedidoDetalhes] = useState<Pedido | null>(null);

    useEffect(() => {
        async function loadDashboardData() {
            setLoading(true);

            const [pedidosRes, contratosRes, automoveisRes] =
                await Promise.allSettled([
                    pedidoService.listar(),
                    contratoService.listar(),
                    automovelService.listar(),
                ]);

            if (pedidosRes.status === "fulfilled") {
                setPedidos(pedidosRes.value || []);
            }

            if (contratosRes.status === "fulfilled") {
                setContratos(contratosRes.value || []);
            }

            if (automoveisRes.status === "fulfilled") {
                setAutomoveis(automoveisRes.value || []);
            }

            setLoading(false);
        }

        loadDashboardData();
    }, []);

    const automoveisMap = useMemo(() => {
        return new Map(automoveis.map((item) => [item.id, item]));
    }, [automoveis]);

    const pedidosCliente = useMemo(() => {
        // A API de cliente já retorna somente os pedidos do usuário autenticado.
        return pedidos;
    }, [pedidos]);

    const navItemsByRole = {
        CLIENTE: [
            { label: "Painel Principal", href: "/dashboard", active: true },
            { label: "Meus Pedidos", href: "/pedidos" },
            { label: "Novo Pedido", href: "/pedidos/novo" },
            { label: "Configuracoes", href: "/dashboard" },
        ],
        AGENTE: [
            { label: "Painel Principal", href: "/dashboard", active: true },
            { label: "Pedidos", href: "/admin" },
            { label: "Contratos", href: "/contratos" },
            { label: "Veiculos", href: "/automoveis" },
        ],
        BANCO: [
            { label: "Painel Principal", href: "/dashboard", active: true },
            { label: "Analise de Credito", href: "/admin" },
            { label: "Contratos", href: "/contratos" },
            { label: "Risco", href: "/dashboard" },
        ],
    };

    function getVehicleDisplay(pedido: Pedido) {
        const automovel = automoveisMap.get(pedido.automovel_id);
        if (!automovel) {
            return {
                reference: `AUTO-${pedido.automovel_id}`,
                title: `Veiculo #${pedido.automovel_id}`,
                subtitle: "Cadastro do veiculo em processamento",
            };
        }

        return {
            reference: automovel.placa || `AUTO-${pedido.automovel_id}`,
            title: `${automovel.marca} ${automovel.modelo}`,
            subtitle: `Ano ${automovel.ano} - Matricula ${automovel.matricula}`,
        };
    }

    function renderClienteDashboard() {
        const pedidosAtivos = pedidosCliente.filter(
            (pedido) => pedido.status !== "CANCELADO",
        );
        const aguardandoAprovacao = pedidosCliente.filter(
            (pedido) => pedido.status === "AGUARDANDO_ANALISE",
        );
        const pedidosClienteIds = new Set(
            pedidosCliente.map((pedido) => pedido.id),
        );
        const contratosComCredito = contratos.filter(
            (contrato) =>
                contrato.tipo === "COM_CREDITO" &&
                pedidosClienteIds.has(contrato.pedido_id),
        );

        return (
            <>
                <SummaryStats
                    items={[
                        {
                            label: "Meus Pedidos Ativos",
                            value: `${pedidosAtivos.length}`,
                        },
                        {
                            label: "Aguardando Aprovacao",
                            value: `${aguardandoAprovacao.length}`,
                        },
                        {
                            label: "Parcelas a Pagar",
                            value: `${contratosComCredito.length}`,
                        },
                    ]}
                />

                <div className="grid gap-6">
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-4xl font-semibold tracking-tight text-[#263029]">
                                Minhas Reservas
                            </h2>
                            <span className="text-sm font-semibold text-[#667068]">
                                Ver agenda completa
                            </span>
                        </div>

                        {pedidosCliente.slice(0, 4).map((pedido) => {
                            const car = getVehicleDisplay(pedido);

                            return (
                                <WorkflowCard
                                    key={pedido.id}
                                    reference={car.reference}
                                    status={statusLabel[pedido.status]}
                                    title={car.title}
                                    subtitle={`Status do pedido: ${statusLabel[pedido.status]} - ${car.subtitle}`}
                                    schedule={`Retirada: ${formatDate(pedido.data_solicitacao)}`}
                                    actions={
                                        pedido.status === "APROVADO"
                                            ? [
                                                  {
                                                      label: "Ver Detalhes",
                                                      tone: "ghost",
                                                  },
                                                  {
                                                      label: "Solicitar Entrega",
                                                      tone: "primary",
                                                  },
                                              ]
                                            : [
                                                  {
                                                      label: "Atualizar Pedido",
                                                      tone: "neutral",
                                                  },
                                              ]
                                    }
                                />
                            );
                        })}

                        {pedidosCliente.length === 0 && (
                            <div className="rounded-3xl border border-dashed border-[#cfd8cf] bg-white px-6 py-10 text-center text-[#6b756c]">
                                Nenhuma reserva registrada no momento.
                            </div>
                        )}
                    </section>
                </div>
            </>
        );
    }

    function renderAgenteDashboard() {
        const pedidosComContrato = new Set(
            contratos.map((contrato) => contrato.pedido_id),
        );
        const pendentesAnalise = pedidos.filter(
            (pedido) => pedido.status === "AGUARDANDO_ANALISE",
        );
        const rendimentosValidar = pedidos.filter(
            (pedido) =>
                pedido.status === "AGUARDANDO_ANALISE" &&
                (pedido.soma_renda ?? 0) <= 0,
        );
        const prontosExecucao = pedidos.filter(
            (pedido) =>
                pedido.status === "APROVADO" &&
                !pedidosComContrato.has(pedido.id),
        );
        const pedidosAvaliacao = pedidos.filter(
            (pedido) => pedido.status === "AGUARDANDO_ANALISE",
        );

        const aprovadosSemContrato = pedidos.filter(
            (pedido) =>
                pedido.status === "APROVADO" &&
                !pedidosComContrato.has(pedido.id),
        );

        const acoesPendentes = [
            ...aprovadosSemContrato.slice(0, 3).map((pedido) => ({
                title: `Gerar contrato do pedido #${pedido.id}`,
                subtitle: `Status: ${statusLabel[pedido.status]} - Cliente ${pedido.nome_cliente || `#${pedido.cliente_id}`}`,
                cta: "Gerar contrato",
            })),
        ];

        return (
            <>
                <SummaryStats
                    items={[
                        {
                            label: "Pedidos Pendentes de Analise",
                            value: `${pendentesAnalise.length}`,
                        },
                        {
                            label: "Rendimentos a Validar",
                            value: `${rendimentosValidar.length}`,
                        },
                        {
                            label: "Contratos Prontos para Execucao",
                            value: `${prontosExecucao.length}`,
                        },
                    ]}
                />

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-4xl font-semibold tracking-tight text-[#263029]">
                                Pedidos a Avaliar
                            </h2>
                            <span className="text-sm font-semibold text-[#667068]">
                                Visao analitica completa
                            </span>
                        </div>

                        {pedidosAvaliacao.slice(0, 5).map((pedido) => {
                            const car = getVehicleDisplay(pedido);

                            return (
                                <WorkflowCard
                                    key={pedido.id}
                                    reference={car.reference}
                                    status={statusLabel[pedido.status]}
                                    title={car.title}
                                    subtitle={`Cliente: ${pedido.nome_cliente || `#${pedido.cliente_id}`} - Valor do aluguel: ${formatCurrency(pedido.valor_aluguel || 0)}`}
                                    schedule={`Solicitacao: ${formatDate(pedido.data_solicitacao)}`}
                                    actions={[
                                        {
                                            label: "Ver Detalhes do Cliente",
                                            tone: "ghost",
                                            onClick: () =>
                                                setPedidoDetalhes(pedido),
                                        },
                                        { label: "Aprovar", tone: "primary" },
                                        { label: "Recusar", tone: "neutral" },
                                    ]}
                                />
                            );
                        })}

                        {pedidosAvaliacao.length === 0 && (
                            <div className="rounded-3xl border border-dashed border-[#cfd8cf] bg-white px-6 py-10 text-center text-[#6b756c]">
                                Sem pedidos pendentes para analise.
                            </div>
                        )}
                    </section>

                    <ActionSidebar
                        heading="Acoes Pendentes"
                        footerButtonLabel="Abrir fila de analise"
                        items={acoesPendentes}
                    />
                </div>
            </>
        );
    }

    function renderBancoDashboard() {
        const contratosCreditoAtivos = contratos.filter(
            (contrato) =>
                contrato.tipo === "COM_CREDITO" && contrato.status === "ATIVO",
        );
        const solicitacoesPendentes = contratos.filter(
            (contrato) =>
                contrato.tipo === "COM_CREDITO" &&
                contrato.status === "AGUARDANDO_APROVACAO_BANCO",
        );
        const listaCredito = contratos.filter(
            (contrato) =>
                contrato.tipo === "COM_CREDITO" &&
                (contrato.status === "AGUARDANDO_APROVACAO_BANCO" ||
                    contrato.status === "ATIVO"),
        );

        const acoesCredito = [
            ...solicitacoesPendentes.slice(0, 3).map((contrato) => ({
                title: `Aprovar credito do contrato #${contrato.id}`,
                subtitle: `Status: ${contrato.status} - Cliente #${contrato.cliente_id}`,
                cta: "Aprovar agora",
            })),
        ];

        return (
            <>
                <SummaryStats
                    items={[
                        {
                            label: "Contratos de Credito Ativos",
                            value: `${contratosCreditoAtivos.length}`,
                        },
                        {
                            label: "Solicitacoes de Credito Pendentes",
                            value: `${solicitacoesPendentes.length}`,
                        },
                        {
                            label: "Taxa de Inadimplencia",
                            value: "4.2",
                            suffix: "%",
                        },
                    ]}
                />

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-4xl font-semibold tracking-tight text-[#263029]">
                                Solicitacoes de Credito
                            </h2>
                            <span className="text-sm font-semibold text-[#667068]">
                                Analise financeira bancaria
                            </span>
                        </div>

                        {listaCredito.slice(0, 5).map((contrato) => {
                            const pedidoVinculado = pedidos.find(
                                (pedido) => pedido.id === contrato.pedido_id,
                            );
                            const car = pedidoVinculado
                                ? getVehicleDisplay(pedidoVinculado)
                                : {
                                      reference: `AUTO-${contrato.automovel_id}`,
                                      title: `Veiculo #${contrato.automovel_id}`,
                                      subtitle: "Sem detalhes adicionais",
                                  };

                            return (
                                <WorkflowCard
                                    key={contrato.id}
                                    reference={car.reference}
                                    status={contrato.status}
                                    title={car.title}
                                    subtitle={`Cliente #${contrato.cliente_id} - Total do aluguel: ${formatCurrency(contrato.valor_aluguel || 0)}`}
                                    schedule={`Contrato #${contrato.id}`}
                                    actions={[
                                        {
                                            label: "Aprovar Credito",
                                            tone: "primary",
                                        },
                                        {
                                            label: "Analise Profunda",
                                            tone: "ghost",
                                        },
                                    ]}
                                />
                            );
                        })}

                        {listaCredito.length === 0 && (
                            <div className="rounded-3xl border border-dashed border-[#cfd8cf] bg-white px-6 py-10 text-center text-[#6b756c]">
                                Nenhuma solicitacao de credito encontrada.
                            </div>
                        )}
                    </section>

                    <ActionSidebar
                        heading="Acoes de Credito"
                        footerButtonLabel="Ver fila completa"
                        items={acoesCredito}
                    />
                </div>
            </>
        );
    }

    const roleGreeting = {
        CLIENTE: `Bom dia, ${usuario?.nome || "Cliente"}.`,
        AGENTE: `Bom dia, ${usuario?.nome || "Agente"}.`,
        BANCO: `Bom dia, ${usuario?.nome || "Time de Credito"}.`,
    };

    const roleSubtitle = {
        CLIENTE:
            "Veja o status do seu pedido e as proximas acoes da sua reserva.",
        AGENTE: "Analise pedidos e tome decisoes operacionais com rapidez.",
        BANCO: "Monitore contratos de credito e acompanhe risco de inadimplencia.",
    };

    return (
        <ProtectedRoute tipos={["CLIENTE", "AGENTE", "BANCO"]}>
            <DashboardShell
                greeting={roleGreeting[usuario?.tipo || "CLIENTE"]}
                subtitle={
                    loading
                        ? "Carregando dados do seu painel..."
                        : roleSubtitle[usuario?.tipo || "CLIENTE"]
                }
                navItems={navItemsByRole[usuario?.tipo || "CLIENTE"]}
            >
                {usuario?.tipo === "AGENTE" && renderAgenteDashboard()}
                {usuario?.tipo === "BANCO" && renderBancoDashboard()}
                {(!usuario?.tipo || usuario?.tipo === "CLIENTE") &&
                    renderClienteDashboard()}
            </DashboardShell>

            <Dialog
                open={!!pedidoDetalhes}
                onOpenChange={(open) => !open && setPedidoDetalhes(null)}
            >
                <DialogContent className="max-w-xl rounded-3xl border-[#dce2dc]">
                    <DialogHeader>
                        <DialogTitle>Detalhes do cliente</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-3 text-sm text-[#425044] sm:grid-cols-2">
                        <div className="rounded-2xl bg-[#f4f8f5] p-3">
                            <p className="text-xs uppercase tracking-wide text-[#6c7a6f]">
                                Nome
                            </p>
                            <p className="mt-1 font-semibold text-[#273128]">
                                {pedidoDetalhes?.nome_cliente ||
                                    "Nao informado"}
                            </p>
                        </div>
                        <div className="rounded-2xl bg-[#f4f8f5] p-3">
                            <p className="text-xs uppercase tracking-wide text-[#6c7a6f]">
                                CPF
                            </p>
                            <p className="mt-1 font-semibold text-[#273128]">
                                {pedidoDetalhes?.cpf || "Nao informado"}
                            </p>
                        </div>
                        <div className="rounded-2xl bg-[#f4f8f5] p-3">
                            <p className="text-xs uppercase tracking-wide text-[#6c7a6f]">
                                RG
                            </p>
                            <p className="mt-1 font-semibold text-[#273128]">
                                {pedidoDetalhes?.rg || "Nao informado"}
                            </p>
                        </div>
                        <div className="rounded-2xl bg-[#f4f8f5] p-3">
                            <p className="text-xs uppercase tracking-wide text-[#6c7a6f]">
                                Profissao
                            </p>
                            <p className="mt-1 font-semibold text-[#273128]">
                                {pedidoDetalhes?.profissao || "Nao informado"}
                            </p>
                        </div>
                        <div className="rounded-2xl bg-[#f4f8f5] p-3 sm:col-span-2">
                            <p className="text-xs uppercase tracking-wide text-[#6c7a6f]">
                                Renda total comprovada
                            </p>
                            <p className="mt-1 text-lg font-semibold text-[#2f6f46]">
                                {formatCurrency(
                                    pedidoDetalhes?.soma_renda || 0,
                                )}
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </ProtectedRoute>
    );
}
