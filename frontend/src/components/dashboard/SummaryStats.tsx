interface SummaryStat {
    label: string;
    value: string;
    suffix?: string;
}

interface SummaryStatsProps {
    items: SummaryStat[];
}

export function SummaryStats({ items }: SummaryStatsProps) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
                <article
                    key={item.label}
                    className="fade-up rounded-3xl border border-[#dce2dc] bg-white px-6 py-5 shadow-[0_10px_24px_rgba(49,69,57,0.05)]"
                >
                    <p className="text-sm text-[#768176]">{item.label}</p>
                    <p className="mt-2 text-4xl font-semibold tracking-tight text-[#243029]">
                        {item.value}
                        {item.suffix && (
                            <span className="ml-1 text-xl font-medium text-[#7f8a7f]">
                                {item.suffix}
                            </span>
                        )}
                    </p>
                </article>
            ))}
        </div>
    );
}
