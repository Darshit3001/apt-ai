"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import {
    motion, AnimatePresence, useReducedMotion,
    useMotionValue, useSpring, useTransform
} from "framer-motion";
import { categories, tools as allTools } from "@/data/tools";
import {
    Search, X, Star, ArrowUpRight, ChevronRight,
    Layers, LayoutGrid, List
} from "lucide-react";
import Link from "next/link";
import type { Tool } from "@/types";

// ─── Colour palette ──────────────────────────────────────────────────────────
const palette = [
    "#7C5CFC", "#00D4AA", "#FF6B6B", "#FFD93D", "#6BCB77",
    "#4D96FF", "#FF922B", "#845EC2", "#00C9A7", "#FF6F91",
    "#FFC75F", "#008E9B", "#D65DB1", "#0089BA", "#F9F871",
    "#FF9671", "#67B7D1", "#E8A0BF", "#B8E986", "#A0D2DB",
];
const getColor = (i: number) => palette[i % palette.length];

// ─── Magnetic Card (3D tilt reused from ToolCard) ────────────────────────────
function MagneticCard({
    cat, index, isSelected, onClick, prefersReducedMotion,
}: {
    cat: typeof categories[0]; index: number; isSelected: boolean;
    onClick: () => void; prefersReducedMotion: boolean | null;
}) {
    const ref = useRef<HTMLButtonElement>(null);
    const color = getColor(index);

    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const sX = useSpring(mx, { stiffness: 280, damping: 28 });
    const sY = useSpring(my, { stiffness: 280, damping: 28 });
    const rotateX = useTransform(sY, [-0.5, 0.5], ["5deg", "-5deg"]);
    const rotateY = useTransform(sX, [-0.5, 0.5], ["-5deg", "5deg"]);
    const glareX = useTransform(sX, [-0.5, 0.5], [100, 0]);
    const glareY = useTransform(sY, [-0.5, 0.5], [100, 0]);

    const onMove = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
        if (prefersReducedMotion || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
    }, [prefersReducedMotion, mx, my]);

    const onLeave = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.025, ease: [0.16, 1, 0.3, 1] }}
            style={{ perspective: 900 }}
        >
            <motion.button
                ref={ref}
                onClick={onClick}
                onPointerMove={onMove}
                onPointerLeave={onLeave}
                style={{
                    rotateX: prefersReducedMotion ? 0 : rotateX,
                    rotateY: prefersReducedMotion ? 0 : rotateY,
                    transformStyle: "preserve-3d",
                    background: isSelected
                        ? `linear-gradient(135deg, ${color}20 0%, ${color}08 100%)`
                        : "rgba(255,255,255,0.025)",
                    borderColor: isSelected ? `${color}55` : "rgba(255,255,255,0.06)",
                    boxShadow: isSelected ? `0 0 24px ${color}25, 0 8px 32px rgba(0,0,0,0.4)` : undefined,
                } as React.CSSProperties}
                className={`group relative w-full text-left rounded-[20px] border p-5 cursor-pointer outline-none
          focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-all duration-300
          ${isSelected ? "scale-[1.02]" : "hover:scale-[1.01]"}`}
                aria-label={`${cat.name}, ${cat.toolCount} tools`}
                aria-pressed={isSelected}
            >
                {/* Spotlight glare */}
                {!prefersReducedMotion && (
                    <motion.div
                        className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[20px]"
                        style={{
                            background: useTransform(
                                [glareX, glareY],
                                ([gx, gy]) => `radial-gradient(circle at ${gx}% ${gy}%, ${color}20 0%, transparent 55%)`
                            ) as any,
                        }}
                    />
                )}

                <div className="relative z-10 flex flex-col gap-3" style={{ transform: "translateZ(20px)" }}>
                    {/* Icon + selector dot */}
                    <div className="flex items-start justify-between">
                        <span className="text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">{cat.icon}</span>
                        {isSelected && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500 }}
                                className="w-2.5 h-2.5 rounded-full mt-1" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
                        )}
                    </div>

                    {/* Name */}
                    <div>
                        <p className={`text-sm font-bold leading-tight transition-colors duration-200
              ${isSelected ? "text-white" : "text-white/75 group-hover:text-white"}`}>
                            {cat.name}
                        </p>
                        <p className="text-[11px] font-mono mt-1 transition-colors duration-200"
                            style={{ color: isSelected ? color : "rgba(255,255,255,0.28)" }}>
                            {cat.toolCount.toLocaleString()} tools
                        </p>
                    </div>

                    {/* Bottom bar */}
                    <div className="h-[2px] w-full rounded-full bg-white/5 overflow-hidden">
                        <motion.div className="h-full rounded-full" style={{ background: color }}
                            initial={{ width: "0%" }}
                            animate={{ width: isSelected ? "100%" : "30%" }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} />
                    </div>
                </div>
            </motion.button>
        </motion.div>
    );
}

// ─── Tool Row in panel ────────────────────────────────────────────────────────
function ToolRow({ tool }: { tool: Tool }) {
    return (
        <Link href={`/tool/${tool.slug}`}
            className="group flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06] transition-all">
            <div className="w-9 h-9 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0 overflow-hidden group-hover:border-white/20 transition-colors">
                {tool.logo
                    ? <img src={tool.logo} alt="" className="w-full h-full object-cover rounded-xl" />
                    : <span className="text-sm">{tool.name.charAt(0)}</span>}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white/90 truncate group-hover:text-white transition-colors">{tool.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-0.5 text-[10px] text-amber-400 font-mono">
                        <Star size={8} className="fill-current" />{tool.avgRating.toFixed(1)}
                    </span>
                    <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-full border
            ${tool.pricingModel === "FREE"
                            ? "text-emerald-400 border-emerald-400/20 bg-emerald-400/10"
                            : tool.pricingModel === "FREEMIUM"
                                ? "text-blue-400 border-blue-400/20 bg-blue-400/10"
                                : "text-amber-400 border-amber-400/20 bg-amber-400/10"}`}>
                        {tool.pricingModel === "FREE" ? "Free" : tool.pricingModel === "FREEMIUM" ? "Freemium" : "Paid"}
                    </span>
                </div>
            </div>
            <ArrowUpRight size={13} className="text-white/20 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        </Link>
    );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function MapPage() {
    const prefersReducedMotion = useReducedMotion();
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState<string | null>(null);
    const [view, setView] = useState<"grid" | "list">("grid");

    const filtered = useMemo(() =>
        query.trim()
            ? categories.filter(c =>
                c.name.toLowerCase().includes(query.toLowerCase()) ||
                (c.description ?? "").toLowerCase().includes(query.toLowerCase()))
            : categories,
        [query]);

    const selectedCat = selected ? categories.find(c => c.id === selected) : null;
    const selectedCatIdx = selected ? categories.findIndex(c => c.id === selected) : -1;
    const selectedColor = selectedCatIdx >= 0 ? getColor(selectedCatIdx) : "#7C5CFC";
    const selectedTools = selected
        ? allTools.filter(t => t.categoryId === selected || t.category.id === selected)
        : [];

    const totalTools = allTools.length;

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">

            {/* ── Command Bar ─────────────────────────────────────────────────── */}
            <div className="shrink-0 px-4 lg:px-8 py-5 border-b border-white/[0.05] bg-[var(--bg-primary)]/80 backdrop-blur-2xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">

                    {/* Left: Title + stats */}
                    <div className="shrink-0">
                        <div className="flex items-center gap-2 mb-0.5">
                            <Layers size={16} className="text-[var(--color-primary)]" />
                            <h1 className="text-base font-bold tracking-tight text-white">AI Category Atlas</h1>
                        </div>
                        <p className="text-[11px] font-mono text-white/30 tracking-wider">
                            {filtered.length} categories · {totalTools.toLocaleString()}+ tools
                        </p>
                    </div>

                    {/* Center: Search */}
                    <div className="flex-1 relative">
                        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                        <input
                            type="text" value={query} onChange={e => setQuery(e.target.value)}
                            placeholder="Search categories..."
                            className="w-full pl-10 pr-10 py-2.5 bg-white/[0.04] border border-white/[0.07] rounded-xl text-sm text-white placeholder:text-white/25 outline-none focus:border-[var(--color-primary)]/50 focus:bg-white/[0.06] transition-all"
                        />
                        {query && (
                            <button onClick={() => setQuery("")}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    {/* Right: View toggle */}
                    <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.07] rounded-xl p-1 shrink-0">
                        <button onClick={() => setView("grid")}
                            className={`p-1.5 rounded-lg transition-all ${view === "grid" ? "bg-white/10 text-white" : "text-white/30 hover:text-white"}`}
                            aria-label="Grid view">
                            <LayoutGrid size={14} />
                        </button>
                        <button onClick={() => setView("list")}
                            className={`p-1.5 rounded-lg transition-all ${view === "list" ? "bg-white/10 text-white" : "text-white/30 hover:text-white"}`}
                            aria-label="List view">
                            <List size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Body ────────────────────────────────────────────────────────── */}
            <div className="flex-1 flex overflow-hidden">

                {/* ── Main Grid / List ─────────────────────────────────────────── */}
                <div className={`flex-1 overflow-y-auto no-scrollbar transition-all duration-500 p-4 lg:p-6
          ${selected ? "lg:pr-4" : ""}`}>

                    {/* Search result count */}
                    <AnimatePresence>
                        {query && (
                            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                                className="flex items-center gap-2 mb-4 text-xs text-white/40 font-mono">
                                <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/60">
                                    {filtered.length}
                                </span>
                                results for &ldquo;{query}&rdquo;
                                <button onClick={() => setQuery("")} className="text-white/30 hover:text-white transition-colors ml-1">
                                    Clear
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <div className="text-5xl mb-4 opacity-30">∅</div>
                            <p className="text-base font-semibold text-white/40">No categories match</p>
                            <button onClick={() => setQuery("")}
                                className="mt-3 text-sm text-[var(--color-accent)] hover:underline">Clear search</button>
                        </div>
                    ) : view === "grid" ? (
                        /* ── GRID VIEW ── */
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 lg:gap-4">
                            {filtered.map((cat, i) => (
                                <MagneticCard
                                    key={cat.id} cat={cat} index={i}
                                    isSelected={selected === cat.id}
                                    onClick={() => setSelected(selected === cat.id ? null : cat.id)}
                                    prefersReducedMotion={prefersReducedMotion}
                                />
                            ))}
                        </div>
                    ) : (
                        /* ── LIST VIEW ── */
                        <div className="space-y-2 max-w-2xl">
                            {filtered.map((cat, i) => {
                                const color = getColor(i);
                                const isSelected = selected === cat.id;
                                return (
                                    <motion.button
                                        key={cat.id}
                                        initial={{ opacity: 0, x: -12 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: i * 0.02 }}
                                        onClick={() => setSelected(isSelected ? null : cat.id)}
                                        className={`group w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl border text-left transition-all cursor-pointer
                      ${isSelected ? "border-white/10 scale-[1.01]" : "border-white/[0.05] hover:border-white/10"}`}
                                        style={{
                                            background: isSelected ? `${color}12` : "rgba(255,255,255,0.02)",
                                            boxShadow: isSelected ? `0 0 20px ${color}15` : undefined,
                                        }}
                                    >
                                        <span className="text-2xl shrink-0">{cat.icon}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-bold transition-colors ${isSelected ? "text-white" : "text-white/70 group-hover:text-white"}`}>
                                                {cat.name}
                                            </p>
                                            {cat.description && (
                                                <p className="text-xs text-white/35 truncate mt-0.5">{cat.description}</p>
                                            )}
                                        </div>
                                        <div className="shrink-0 text-right">
                                            <p className="text-xs font-mono font-bold" style={{ color }}>{cat.toolCount}</p>
                                            <p className="text-[10px] text-white/25 font-mono">tools</p>
                                        </div>
                                        <ChevronRight size={14} className={`shrink-0 transition-all text-white/20 ${isSelected ? "rotate-90 text-white/60" : "group-hover:text-white/40"}`} />
                                    </motion.button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* ── Detail Panel ─────────────────────────────────────────────── */}
                <AnimatePresence>
                    {selectedCat && (
                        <motion.aside
                            key="panel"
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 360, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 280, damping: 30 }}
                            className="shrink-0 flex flex-col h-full overflow-hidden border-l border-white/[0.06] bg-[#06060C]"
                            style={{ minWidth: 0 }}
                        >
                            {/* Top colour wash */}
                            <div className="h-[2px] w-full shrink-0"
                                style={{ background: `linear-gradient(to right, ${selectedColor}, transparent)` }} />

                            {/* Panel header */}
                            <div className="px-5 py-5 shrink-0 border-b border-white/[0.05]"
                                style={{ background: `linear-gradient(135deg, ${selectedColor}14 0%, transparent 65%)` }}>
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                                            style={{ background: `${selectedColor}18`, border: `1px solid ${selectedColor}35` }}>
                                            {selectedCat.icon}
                                        </div>
                                        <div>
                                            <h2 className="text-base font-bold text-white leading-tight">{selectedCat.name}</h2>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[11px] font-mono font-bold" style={{ color: selectedColor }}>
                                                    {selectedCat.toolCount.toLocaleString()}
                                                </span>
                                                <span className="text-[11px] text-white/35 font-mono">tools indexed</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelected(null)}
                                        className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all shrink-0 mt-0.5"
                                        aria-label="Close">
                                        <X size={13} />
                                    </button>
                                </div>

                                {selectedCat.description && (
                                    <p className="text-xs text-white/45 leading-relaxed mt-3">{selectedCat.description}</p>
                                )}
                            </div>

                            {/* Tools */}
                            <div className="flex-1 overflow-y-auto no-scrollbar py-3">
                                <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/25 px-5 mb-2">
                                    Top Tools
                                </p>
                                {selectedTools.length === 0 ? (
                                    <div className="px-5 py-8 text-center">
                                        <p className="text-sm text-white/30">No tools found for this category.</p>
                                    </div>
                                ) : (
                                    <div className="px-2">
                                        {selectedTools.slice(0, 15).map((tool, i) => (
                                            <motion.div
                                                key={tool.id}
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.03, duration: 0.3 }}>
                                                <ToolRow tool={tool} />
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* CTA */}
                            <div className="p-4 border-t border-white/[0.05] shrink-0">
                                <Link
                                    href={`/categories/${selectedCat.slug}`}
                                    className="group flex items-center justify-between w-full px-4 py-3.5 rounded-2xl font-bold text-sm transition-all hover:scale-[1.01] active:scale-[0.99]"
                                    style={{
                                        background: `linear-gradient(135deg, ${selectedColor}22 0%, ${selectedColor}0A 100%)`,
                                        border: `1px solid ${selectedColor}35`,
                                        color: selectedColor,
                                    }}>
                                    <span>Browse all {selectedCat.toolCount.toLocaleString()} tools</span>
                                    <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </Link>
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
