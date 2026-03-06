"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/stores/uiStore";
import { searchTools } from "@/data/tools";
import { type Tool } from "@/types";
import { Search, X, TrendingUp, Clock, ArrowRight, Zap, Globe, Cpu } from "lucide-react";
import Link from "next/link";

const trendingSearches = [
    "ChatGPT", "Midjourney", "Sora", "Claude", "Cursor", "Stable Diffusion"
];

export function SearchModal() {
    const { searchOpen, setSearchOpen } = useUIStore();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Tool[]>([]);
    const [isSearchingWeb, setIsSearchingWeb] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Ctrl+K shortcut
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                setSearchOpen(true);
            }
            if (e.key === "Escape") {
                setSearchOpen(false);
            }
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [setSearchOpen]);

    // Focus input when modal opens
    useEffect(() => {
        if (searchOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            setQuery("");
            setResults([]);
            setIsSearchingWeb(false);
        }
    }, [searchOpen]);

    // Search Physics and Web Fallback Simulation
    useEffect(() => {
        if (query.length >= 2) {
            const localResults = searchTools(query).slice(0, 8);

            if (localResults.length > 0) {
                setIsSearchingWeb(false);
                setResults(localResults);
            } else {
                // Trigger Neural Web Fallback UI
                setIsSearchingWeb(true);
                setResults([]);

                // Simulate web fetch delay
                const delay = setTimeout(() => {
                    // Injecting a simulated web result to demonstrate the UI
                    setResults([{
                        id: 'web-' + Date.now(),
                        slug: 'simulated-web-result',
                        name: `Web Result for "${query}"`,
                        description: `Automatically pulled from the global neural net due to local cache miss.`,
                        logo: '',
                        website: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
                        categoryId: 'ai-search',
                        pricingModel: 'FREE',
                        priceFrom: null,
                        viewCount: Math.floor(Math.random() * 5000),
                        saveCount: Math.floor(Math.random() * 100),
                        reviewCount: Math.floor(Math.random() * 50),
                        avgRating: (Math.random() * 2 + 3),
                        releasedAt: new Date().toISOString(),
                        isVerified: false,
                        isSponsored: false,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        features: [],
                        gallery: [],
                        tags: [{ id: 'external', slug: 'external', name: 'External' }],
                        category: {
                            id: 'neural-net',
                            name: 'External Source',
                            slug: 'external',
                            icon: '🌐',
                            description: 'Data sourced from global web'
                        }
                    } as unknown as Tool]);
                    setIsSearchingWeb(false);
                }, 1500);

                return () => clearTimeout(delay);
            }
        } else {
            setResults([]);
            setIsSearchingWeb(false);
        }
    }, [query]);

    return (
        <AnimatePresence>
            {searchOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
                        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[100] bg-[#030308]/80"
                        onClick={() => setSearchOpen(false)}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.95, y: -20, filter: "blur(10px)" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed top-[15%] left-1/2 -translate-x-1/2 z-[101] w-[95%] max-w-2xl"
                    >
                        <div className="relative overflow-hidden rounded-[24px] bg-[var(--bg-surface)] backdrop-blur-3xl border border-white/5 shadow-[0_0_100px_rgba(124,92,252,0.15)] ring-1 ring-white/10 group">

                            {/* Neural Web Fallback Glow */}
                            <motion.div
                                className="absolute inset-0 z-0 pointer-events-none opacity-0"
                                animate={{ opacity: isSearchingWeb ? 1 : 0 }}
                                transition={{ duration: 0.3 }}
                                style={{
                                    boxShadow: "inset 0 0 50px rgba(0, 212, 170, 0.2), inset 0 0 10px rgba(0, 212, 170, 0.5)",
                                    border: "1px solid rgba(0, 212, 170, 0.5)"
                                }}
                            />

                            {/* Search Input Area */}
                            <div className="relative z-10 flex items-center gap-4 px-6 py-5 border-b border-white/5 bg-black/20">
                                <motion.div animate={isSearchingWeb ? { rotate: 360, color: "var(--color-accent)" } : { color: "var(--text-tertiary)" }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                                    {isSearchingWeb ? <Cpu size={22} /> : <Search size={22} />}
                                </motion.div>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Access Neural Directory..."
                                    className="flex-1 bg-transparent text-white placeholder:text-white/30 outline-none text-lg font-medium selection:bg-[var(--color-primary)]/30"
                                    id="search-input"
                                    autoComplete="off"
                                />
                                <button
                                    onClick={() => setSearchOpen(false)}
                                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Neural Uplink Status Bar */}
                            <AnimatePresence>
                                {isSearchingWeb && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="relative z-10 bg-[var(--color-accent)]/10 border-b border-[var(--color-accent)]/20 px-6 py-2 overflow-hidden"
                                    >
                                        <div className="flex items-center gap-2 text-[var(--color-accent)] text-xs font-mono tracking-widest uppercase">
                                            <Zap size={12} className="animate-pulse" />
                                            <span>Local database exhausted. Accessing global neural net...</span>
                                        </div>
                                        <div className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-[var(--color-accent)]/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Results / Suggestions */}
                            <div className="relative z-10 max-h-[60vh] overflow-y-auto no-scrollbar p-4">
                                {results.length > 0 ? (
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-mono tracking-widest uppercase text-white/40 px-3 py-1 mb-2">
                                            Found Entities ({results.length})
                                        </p>
                                        <motion.div variants={{ show: { transition: { staggerChildren: 0.05 } } }} initial="hidden" animate="show">
                                            {results.map((tool, idx) => (
                                                <motion.div
                                                    key={tool.id}
                                                    variants={{ hidden: { opacity: 0, y: 10, scale: 0.98 }, show: { opacity: 1, y: 0, scale: 1 } }}
                                                >
                                                    <Link
                                                        href={tool.website?.startsWith('http') ? tool.website : `/tool/${tool.slug}`}
                                                        target={tool.website?.startsWith('http') ? "_blank" : "_self"}
                                                        onClick={() => !tool.website?.startsWith('http') && setSearchOpen(false)}
                                                        className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group
                                                        ${tool.tags?.some(t => t.slug === 'external')
                                                                ? 'bg-[#00D4AA]/5 hover:bg-[#00D4AA]/10 border border-[#00D4AA]/20'
                                                                : 'bg-white/5 hover:bg-white/10 border border-transparent'}`}
                                                    >
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shadow-inner
                                                            ${tool.tags?.some(t => t.slug === 'external') ? 'bg-[#00D4AA]/20 text-[#00D4AA]' : 'bg-black/50 text-[var(--color-primary)] border border-white/10'}`}>
                                                            {tool.tags?.some(t => t.slug === 'external') ? <Globe size={18} /> : tool.name.charAt(0)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <span className={`text-base font-semibold ${tool.tags?.some(t => t.slug === 'external') ? 'text-[#00D4AA]' : 'text-white'}`}>
                                                                    {tool.name}
                                                                </span>
                                                                <span className="text-[10px] font-mono tracking-wider text-white/40 bg-black/50 border border-white/10 px-2 py-0.5 rounded-full">
                                                                    {tool.category.name}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-white/50 truncate mt-0.5">
                                                                {tool.description}
                                                            </p>
                                                        </div>
                                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/30 group-hover:bg-white group-hover:text-black transition-all transform group-hover:scale-110">
                                                            <ArrowRight size={14} className={tool.tags?.some(t => t.slug === 'external') ? '-rotate-45' : ''} />
                                                        </div>
                                                    </Link>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    </div>
                                ) : query.length === 0 ? (
                                    <div className="space-y-6 px-2">
                                        {/* Trending */}
                                        <div>
                                            <p className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-white/40 mb-3">
                                                <TrendingUp size={12} className="text-[var(--color-warning)]" />
                                                Trending Queries
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {trendingSearches.map((term, i) => (
                                                    <motion.button
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: i * 0.05 }}
                                                        key={term}
                                                        onClick={() => setQuery(term)}
                                                        className="px-4 py-2 rounded-full text-xs font-semibold bg-white/5 text-white/60 hover:text-white hover:bg-white/15 transition-all border border-white/5 hover:border-white/20"
                                                    >
                                                        {term}
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Quick links */}
                                        <div className="pt-2">
                                            <p className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-white/40 mb-3">
                                                <Clock size={12} className="text-[var(--color-accent)]" />
                                                Quick Protocols
                                            </p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {[
                                                    { label: "Initialize Map", href: "/map" },
                                                    { label: "Top Rated AI", href: "/trending" },
                                                    { label: "Neural Quiz", href: "/quiz" },
                                                    { label: "View Collections", href: "/collections" },
                                                ].map((link, i) => (
                                                    <motion.div key={link.href} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + (i * 0.05) }}>
                                                        <Link
                                                            href={link.href}
                                                            onClick={() => setSearchOpen(false)}
                                                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:text-white bg-white/5 hover:bg-[var(--color-primary)]/20 hover:border-[var(--color-primary)]/50 border border-transparent transition-all group"
                                                        >
                                                            <div className="w-6 h-6 rounded bg-black/50 flex items-center justify-center group-hover:bg-[var(--color-primary)] transition-colors">
                                                                <ArrowRight size={12} className="text-white/50 group-hover:text-white" />
                                                            </div>
                                                            {link.label}
                                                        </Link>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : !isSearchingWeb ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
                                            <Search size={24} className="text-white/30" />
                                        </div>
                                        <p className="text-base text-white/80 font-medium">
                                            No local entities match &ldquo;{query}&rdquo;
                                        </p>
                                        <p className="text-sm text-white/40 mt-2">
                                            Awaiting link to global neural net...
                                        </p>
                                    </div>
                                ) : null}
                            </div>

                            {/* Footer */}
                            <div className="relative z-10 flex items-center justify-between px-6 py-4 border-t border-white/5 text-[11px] font-mono text-white/30 bg-black/30">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1.5">
                                        <kbd className="px-1.5 py-0.5 bg-white/10 rounded border border-white/10 text-white/50">↵</kbd>
                                        Initiate
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <kbd className="px-1.5 py-0.5 bg-white/10 rounded border border-white/10 text-white/50">esc</kbd>
                                        Abort
                                    </span>
                                </div>
                                <span className="uppercase tracking-widest text-[#00D4AA]/50 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA] animate-pulse" />
                                    System Online
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
