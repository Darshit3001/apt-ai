"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { type Tool } from "@/types";
import { ExternalLink, Share2, Eye, Bookmark, Star, Clock, CheckCircle2, MessageCircle } from "lucide-react";
import { useSavedTools } from "@/hooks/useSavedTools";

function formatCount(count: number): string {
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(1)}k`;
    return count.toString();
}

function PricingBadge({ tool }: { tool: Tool }) {
    if (tool.pricingModel === "FREE") return <span className="text-[var(--color-free)] font-semibold border border-[var(--color-free)]/20 bg-[var(--color-free)]/10 px-2 py-0.5 rounded-full text-xs">100% Free</span>;
    if (tool.pricingModel === "FREEMIUM") return <span className="text-[var(--color-accent)] font-semibold border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/10 px-2 py-0.5 rounded-full text-xs">Freemium</span>;
    return <span className="text-[var(--color-primary-light)] font-semibold border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10 px-2 py-0.5 rounded-full text-xs">Paid</span>;
}

export function ToolCard({ tool, index = 0 }: { tool: Tool; index?: number }) {
    const { isSaved, toggleSave } = useSavedTools();
    const saved = isSaved(tool.id);
    const prefersReducedMotion = useReducedMotion();

    // Physics values for Magnetic 3D interaction
    const ref = useRef<HTMLAnchorElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

    // Calculate dynamic glare origin based on pointer position relative to 100%
    const glareX = useTransform(mouseXSpring, [-0.5, 0.5], [100, 0]);
    const glareY = useTransform(mouseYSpring, [-0.5, 0.5], [100, 0]);

    const handlePointerMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
        if (!ref.current || prefersReducedMotion) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        x.set(mouseX / width - 0.5);
        y.set(mouseY / height - 0.5);
    };

    const handlePointerLeave = () => {
        if (prefersReducedMotion) return;
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
            style={{ perspective: 1200 }}
            className="h-full"
        >
            <motion.a
                ref={ref}
                href={`/tool/${tool.slug}`}
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
                onFocus={() => { x.set(0); y.set(0.1); }}  // Lift slightly on keyboard focus
                onBlur={handlePointerLeave}
                style={{
                    rotateX: prefersReducedMotion ? 0 : rotateX,
                    rotateY: prefersReducedMotion ? 0 : rotateY,
                    transformStyle: "preserve-3d"
                }}
                className="group relative block h-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-black rounded-[24px]"
                aria-label={`View details for ${tool.name}. Rating: ${tool.avgRating} out of 5 stars.`}
            >
                {/* Main Glass Surface */}
                <article className="h-full p-6 flex flex-col gap-4 relative overflow-hidden rounded-[24px] bg-[var(--bg-surface)] backdrop-blur-2xl border border-[var(--border-default)] transition-colors duration-300 group-hover:border-[var(--color-primary)]/40 group-focus-visible:border-[var(--color-primary)]/40">

                    {/* Directional Glare */}
                    {!prefersReducedMotion && (
                        <motion.div
                            className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[24px]"
                            style={{
                                background: useTransform(
                                    [glareX, glareY],
                                    ([gx, gy]) => `radial-gradient(circle at ${gx}% ${gy}%, rgba(124, 92, 252, 0.15) 0%, transparent 60%)`
                                ) as any
                            }}
                        />
                    )}

                    {/* Z-Depth Content Container */}
                    <div className="relative z-10 flex flex-col h-full pointer-events-none" style={{ transform: "translateZ(30px)" }}>

                        <div className="flex items-start gap-4 mb-2">
                            {/* App Logo */}
                            <div className="w-12 h-12 rounded-2xl bg-[#030308] flex items-center justify-center border border-[var(--border-default)] shadow-inner overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-500 ease-out">
                                {tool.logo ? (
                                    <img src={tool.logo} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-[var(--color-primary)] font-bold text-lg font-mono">{tool.name.charAt(0)}</span>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-white truncate transition-colors group-hover:text-[var(--color-primary-light)] group-focus-visible:text-[var(--color-primary-light)]">
                                        {tool.name}
                                    </h3>

                                    {/* Breathing Verified Badge */}
                                    {tool.isVerified && (
                                        <div className="relative w-4 h-4 flex items-center justify-center shrink-0" aria-label="Verified Tool">
                                            {!prefersReducedMotion && (
                                                <>
                                                    <motion.div
                                                        className="absolute inset-[-2px] rounded-full border border-[var(--color-success)] opacity-0"
                                                        animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0] }}
                                                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
                                                    />
                                                    <motion.div
                                                        className="absolute inset-[0px] rounded-full border-t border-[var(--color-success)] opacity-0"
                                                        animate={{ rotate: 360, opacity: 1 }}
                                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                                    />
                                                </>
                                            )}
                                            <CheckCircle2 size={12} className="relative z-10 text-[var(--color-success)] drop-shadow-[0_0_5px_rgba(0,212,170,0.5)]" fill="currentColor" stroke="#050510" strokeWidth={1} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                                        <span>{tool.category.icon}</span> {tool.category.name}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-[var(--text-tertiary)] line-clamp-2 leading-relaxed flex-grow">
                            {tool.description}
                        </p>

                        {/* Divider */}
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--border-default)] to-transparent my-4 opacity-50" />

                        {/* Footer Metrics */}
                        <div className="flex items-center justify-between text-xs font-mono tracking-tight pointer-events-auto">
                            <PricingBadge tool={tool} />

                            <div className="flex items-center gap-4 text-[var(--text-muted)]">
                                <span className="flex items-center gap-1 group/stat hover:text-white transition-colors" title="Views">
                                    <Eye size={12} className="group-hover/stat:text-[var(--color-accent)]" /> {formatCount(tool.viewCount)}
                                </span>
                                <span className="flex items-center gap-1 text-[var(--color-warning)]" title="Rating">
                                    <Star size={12} fill="currentColor" className="drop-shadow-[0_0_4px_rgba(255,217,61,0.4)]" /> {tool.avgRating.toFixed(1)}
                                </span>

                                {/* Save Action */}
                                <button
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleSave(tool.slug, tool.id); }}
                                    className={`flex items-center gap-1 p-1 -m-1 rounded hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${saved ? 'text-[var(--color-primary)]' : 'hover:text-[var(--color-primary-light)]'}`}
                                    aria-label={saved ? "Remove from saved tools" : "Save this tool"}
                                    title={saved ? "Unsave" : "Save"}
                                >
                                    <Bookmark size={14} className={saved ? "fill-[var(--color-primary)] drop-shadow-[0_0_8px_rgba(124,92,252,0.6)]" : ""} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions overlay (translates in on hover) */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        whileHover={{ opacity: 1, y: 0 }}
                        className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all pointer-events-auto z-20"
                        style={{ transform: "translateZ(40px)" }}
                    >
                        <button onClick={(e) => { e.preventDefault(); window.open(tool.website, '_blank'); }} className="w-8 h-8 rounded-full bg-black/50 border border-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all hover:scale-110" aria-label="Open external site">
                            <ExternalLink size={12} />
                        </button>
                    </motion.div>
                </article>
            </motion.a>
        </motion.div>
    );
}

export function ToolCardSkeleton() {
    return (
        <div className="clay-card p-6 space-y-4 rounded-[24px]" style={{ pointerEvents: "none" }}>
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl skeleton shrink-0" />
                <div className="flex-1 space-y-2 mt-1">
                    <div className="h-4 w-32 skeleton" />
                    <div className="h-3 w-24 skeleton" />
                </div>
            </div>
            <div className="space-y-2 mt-4">
                <div className="h-3 w-full skeleton" />
                <div className="h-3 w-4/5 skeleton" />
            </div>
            <div className="h-px w-full bg-[var(--border-default)] my-4 opacity-50" />
            <div className="flex justify-between">
                <div className="h-5 w-16 skeleton rounded-full" />
                <div className="h-4 w-24 skeleton" />
            </div>
        </div>
    );
}
