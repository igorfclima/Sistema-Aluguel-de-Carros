import { Clock3 } from "lucide-react";

export interface WorkflowAction {
    label: string;
    tone?: "primary" | "neutral" | "ghost";
}

interface WorkflowCardProps {
    reference: string;
    status: string;
    title: string;
    subtitle: string;
    schedule: string;
    actions?: WorkflowAction[];
}

const toneClass: Record<NonNullable<WorkflowAction["tone"]>, string> = {
    primary:
        "border-[#4f9f68] bg-[#4f9f68] text-white shadow-[0_8px_18px_rgba(79,159,104,0.35)] hover:bg-[#43895a]",
    neutral: "border-[#d7ddd7] bg-[#eff3ef] text-[#5d675f] hover:bg-[#e6ece6]",
    ghost: "border-[#d4dbd4] bg-white text-[#5a655c] hover:bg-[#f4f7f4]",
};

export function WorkflowCard({
    reference,
    status,
    title,
    subtitle,
    schedule,
    actions,
}: WorkflowCardProps) {
    return (
        <article className="fade-up grid gap-4 rounded-3xl border border-[#dce2dc] bg-white p-4 shadow-[0_8px_22px_rgba(32,46,39,0.06)] lg:grid-cols-[100px_1fr_auto] lg:items-center">
            <div className="flex h-[88px] w-full items-center justify-center rounded-2xl bg-[#f1f3f0] text-sm font-medium tracking-wide text-[#8a9189] lg:w-[92px]">
                {reference}
            </div>

            <div>
                <div className="mb-1 flex flex-wrap items-center gap-2 text-sm">
                    <span className="rounded-full bg-[#e5efe8] px-2.5 py-1 text-xs font-semibold text-[#2f6f46]">
                        {status}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[#68746b]">
                        <Clock3 size={14} />
                        {schedule}
                    </span>
                </div>
                <h3 className="text-2xl font-semibold tracking-tight text-[#28302a] lg:text-[1.72rem]">
                    {title}
                </h3>
                <p className="mt-1 text-sm text-[#667067]">{subtitle}</p>
            </div>

            <div className="flex flex-wrap gap-2 lg:justify-end">
                {actions?.map((action) => {
                    const tone = action.tone ?? "ghost";

                    return (
                        <button
                            key={action.label}
                            type="button"
                            className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${toneClass[tone]}`}
                        >
                            {action.label}
                        </button>
                    );
                })}
            </div>
        </article>
    );
}
