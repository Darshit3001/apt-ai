"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { searchTools, categories } from "@/data/tools";
import { ToolGrid } from "@/components/tools/ToolGrid";
import { RepoGrid } from "@/components/tools/RepoGrid";
import { Search, X, SlidersHorizontal, Tag, Github, Loader2, Sparkles } from "lucide-react";
import { useFilterStore } from "@/stores/filterStore";

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const { freeMode, toggleFreeMode } = useFilterStore();

    // Tab State
    const [activeTab, setActiveTab] = useState<"tools" | "github">("tools");

    // Web Discovery State (Infinite AI)
    const [webResults, setWebResults] = useState<any[]>([]);
    const [isSearchingWeb, setIsSearchingWeb] = useState(false);

    // GitHub State
    const [githubRepos, setGithubRepos] = useState<any[]>([]);
    const [isSearchingGithub, setIsSearchingGithub] = useState(false);
    const [githubError, setGithubError] = useState<string | null>(null);

    // Debounce query for GitHub API to prevent rate limits
    useEffect(() => {
        if (activeTab !== "github" || query.length < 2) {
            setGithubRepos([]);
            setGithubError(null);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearchingGithub(true);
            setGithubError(null);
            try {
                const res = await fetch(`/api/github/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();

                if (!res.ok) throw new Error(data.error || "Failed to search GitHub");

                setGithubRepos(data.repos || []);
            } catch (err: any) {
                setGithubError(err.message);
                setGithubRepos([]);
            } finally {
                setIsSearchingGithub(false);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [query, activeTab]);

    // Debounce query for Infinite AI Web Search
    useEffect(() => {
        if (activeTab !== "tools" || query.length < 2) {
            setWebResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearchingWeb(true);
            try {
                const res = await fetch(`/api/web-tools/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                if (res.ok && data.tools) {
                    setWebResults(data.tools);
                }
            } catch (err) {
                console.error("Web discovery failed:", err);
            } finally {
                setIsSearchingWeb(false);
            }
        }, 600); // 600ms debounce

        return () => clearTimeout(timer);
    }, [query, activeTab]);

    const localResults = useMemo(() => {
        let filtered = query.length >= 1 ? searchTools(query) : [];
        if (selectedCategory) {
            filtered = filtered.filter((t) => t.category.slug === selectedCategory);
        }
        if (freeMode) {
            filtered = filtered.filter((t) => t.pricingModel === "FREE");
        }
        return filtered;
    }, [query, selectedCategory, freeMode]);

    // Combine local and web results dynamically
    const combinedResults = useMemo(() => {
        // We filter out any web results that remarkably share the same name as local results to prevent duplicates
        const localNames = new Set(localResults.map(r => r.name.toLowerCase()));
        const uniqueWebResults = webResults.filter(w => !localNames.has(w.name.toLowerCase()));
        return [...localResults, ...uniqueWebResults];
    }, [localResults, webResults]);

    return (
        <div className="pb-24 lg:pb-8 px-4 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-8 pb-4"
            >
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl lg:text-3xl font-bold text-[var(--text-primary)]">
                        Discovery Engine
                    </h1>
                </div>

                {/* Tabs */}
                <div className="flex bg-[var(--bg-surface)] p-1 rounded-2xl w-full max-w-sm mb-6 border border-[var(--border-default)]">
                    <button
                        onClick={() => setActiveTab("tools")}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === "tools"
                            ? "bg-[var(--color-primary)] text-white shadow-lg shader-[var(--color-primary)]/20"
                            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]"
                            }`}
                    >
                        <Sparkles size={16} className={activeTab === "tools" ? "fill-current opacity-20" : ""} />
                        APT AI Tools
                    </button>
                    <button
                        onClick={() => setActiveTab("github")}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === "github"
                            ? "bg-[#24292e] text-white shadow-lg shadow-black/20"
                            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]"
                            }`}
                    >
                        <Github size={16} />
                        Open Source
                    </button>
                </div>

                {/* Search input */}
                <div className="relative mb-4">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={activeTab === "tools" ? "Search AI tools, categories, tasks..." : "Search millions of GitHub repositories..."}
                        className="w-full pl-11 pr-10 py-4 font-medium rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all text-sm shadow-xl shadow-black/5"
                        autoFocus
                        id="search-page-input"
                    />
                    {query && (
                        <button
                            onClick={() => setQuery("")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 bg-[var(--bg-card)] rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--border-default)] transition-colors"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* Filters (Only show on Tools Tab) */}
                {activeTab === "tools" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 flex-wrap mb-6">
                        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                            <SlidersHorizontal size={12} />
                            Filters:
                        </div>
                        <button
                            onClick={toggleFreeMode}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${freeMode
                                ? "bg-[var(--color-free)]/15 text-[var(--color-free)] border-[var(--color-free)]/30"
                                : "bg-[var(--bg-surface)] text-[var(--text-tertiary)] border-[var(--border-default)] hover:text-[var(--text-secondary)]"
                                }`}
                        >
                            🆓 Free Only
                        </button>
                        {categories.slice(0, 8).map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(selectedCategory === cat.slug ? null : cat.slug)}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${selectedCategory === cat.slug
                                    ? "bg-[var(--color-primary)]/15 text-[var(--color-primary-light)] border-[var(--color-primary)]/30"
                                    : "bg-[var(--bg-surface)] text-[var(--text-tertiary)] border-[var(--border-default)] hover:text-[var(--text-secondary)]"
                                    }`}
                            >
                                {cat.icon} {cat.name}
                            </button>
                        ))}
                    </motion.div>
                )}
            </motion.div>

            {/* Results */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="min-h-[400px]"
                >
                    {activeTab === "tools" ? (
                        /* TOOLS TAB */
                        query.length >= 1 ? (
                            <div>
                                <p className="text-sm font-medium text-[var(--text-secondary)] mb-6 bg-[var(--bg-surface)] inline-flex px-3 py-1 rounded-full border border-[var(--border-default)] items-center gap-2">
                                    <span>
                                        <span className="text-[var(--color-primary)] mr-1">{combinedResults.length}</span> tools found for &ldquo;{query}&rdquo;
                                        {selectedCategory && <span> in {selectedCategory}</span>}
                                    </span>
                                    {isSearchingWeb && (
                                        <Loader2 className="w-3 h-3 animate-spin text-[var(--color-primary)] ml-2" />
                                    )}
                                </p>
                                <ToolGrid tools={combinedResults} />
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-[var(--bg-card)]/30 rounded-3xl border border-[var(--border-default)] border-dashed">
                                <div className="w-16 h-16 rounded-2xl bg-[var(--bg-surface)] flex items-center justify-center text-3xl mx-auto mb-4 border border-[var(--border-default)] shadow-lg shadow-black/5">
                                    <Sparkles className="text-[var(--color-primary)]" />
                                </div>
                                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                                    Curated AI Discovery
                                </h3>
                                <p className="text-sm text-[var(--text-tertiary)] max-w-sm mx-auto">
                                    Type a workflow, category, or generic term. We'll find the best AI for the job.
                                </p>
                            </div>
                        )
                    ) : (
                        /* GITHUB TAB */
                        query.length >= 2 ? (
                            isSearchingGithub ? (
                                <div className="py-24 flex flex-col items-center justify-center">
                                    <Loader2 className="w-8 h-8 animate-spin text-[#0A66C2] mb-4" />
                                    <p className="text-[var(--text-secondary)] text-sm animate-pulse">Scanning open source repositories...</p>
                                </div>
                            ) : githubError ? (
                                <div className="text-center py-16">
                                    <div className="text-red-400 mb-2">⚠️ Error occurred</div>
                                    <p className="text-sm text-[var(--text-secondary)]">{githubError}</p>
                                </div>
                            ) : githubRepos.length > 0 ? (
                                <div>
                                    <p className="text-sm font-medium text-[var(--text-secondary)] mb-6 bg-[var(--bg-surface)] inline-flex px-3 py-1 rounded-full border border-[var(--border-default)]">
                                        <span className="text-[#0A66C2] mr-1">Top results</span> for &ldquo;{query}&rdquo;
                                    </p>
                                    <RepoGrid repos={githubRepos} />
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <p className="text-[var(--text-secondary)]">No repositories found matching "{query}"</p>
                                </div>
                            )
                        ) : (
                            <div className="text-center py-20 bg-[var(--bg-card)]/30 rounded-3xl border border-[var(--border-default)] border-dashed">
                                <div className="w-16 h-16 rounded-2xl bg-[#24292e] flex items-center justify-center text-3xl mx-auto mb-4 border border-white/10 shadow-lg shadow-black/20">
                                    <Github className="text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                                    Open Source Intelligence
                                </h3>
                                <p className="text-sm text-[var(--text-tertiary)] max-w-sm mx-auto">
                                    Search across millions of GitHub repositories. Perfect for finding frameworks, libraries, and open-source models.
                                </p>
                            </div>
                        )
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
