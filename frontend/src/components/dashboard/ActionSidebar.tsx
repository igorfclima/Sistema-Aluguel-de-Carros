export interface SidebarActionItem {
    title: string;
    subtitle?: string;
    cta?: string;
    badge?: number;
}

interface ActionSidebarProps {
    heading: string;
    footerButtonLabel: string;
    items: SidebarActionItem[];
}

export function ActionSidebar({
    heading,
    footerButtonLabel,
    items,
}: ActionSidebarProps) {
    return (
        <aside className="fade-up rounded-3xl border border-[#dce2dc] bg-white p-5 shadow-[0_8px_22px_rgba(32,46,39,0.06)]">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-3xl font-semibold tracking-tight text-[#2b342e]">
                    {heading}
                </h3>
                <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-[#f4e9e4] px-2 text-xs font-semibold text-[#8f5a43]">
                    {items.length}
                </span>
            </div>

            <div className="space-y-4">
                {items.map((item, index) => (
                    <article
                        key={`${item.title}-${index}`}
                        className="space-y-2 pb-4"
                    >
                        <h4 className="text-lg font-semibold leading-tight text-[#2d352f]">
                            {item.title}
                        </h4>
                        {item.subtitle && (
                            <p className="text-sm text-[#6e776f]">
                                {item.subtitle}
                            </p>
                        )}
                        {item.cta && (
                            <button
                                type="button"
                                className="text-sm font-semibold text-[#2d6c44] underline decoration-[#8fb89d] underline-offset-4"
                            >
                                {item.cta}
                            </button>
                        )}
                        {index < items.length - 1 && (
                            <div className="border-b border-[#e5ebe5]" />
                        )}
                    </article>
                ))}
            </div>

            <button
                type="button"
                className="mt-2 w-full rounded-2xl border border-[#d6ddd6] bg-[#f0f4f0] px-3 py-2 text-sm font-semibold text-[#445046] transition hover:bg-[#e7ede7]"
            >
                {footerButtonLabel}
            </button>
        </aside>
    );
}
