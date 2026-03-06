import { motion } from "framer-motion";
import { Star, GitBranch, ArrowUpRight, Github } from "lucide-react";

interface RepoProps {
    repo: {
        id: number;
        name: string;
        fullName: string;
        description: string;
        url: string;
        stars: number;
        language: string;
        ownerAvatar: string;
        ownerName: string;
        updatedAt: string;
        topics: string[];
    };
    index: number;
}

export function RepoCard({ repo, index }: RepoProps) {
    // Format large numbers like 14500 to 14.5k
    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
        if (num >= 1000) return (num / 1000).toFixed(1) + "k";
        return num.toString();
    };

    return (
        <motion.a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            className="group block relative overflow-visible"
        >
            {/* Liquid mesh glow on hover - simplified */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0A66C2]/0 via-[#0A66C2]/0 to-[#0A66C2]/0 group-hover:from-[#0A66C2]/10 group-hover:to-transparent rounded-3xl blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100" />

            {/* Card Content - Glassmorphism */}
            <div className="relative h-full flex flex-col p-6 rounded-3xl bg-[var(--bg-card)]/50 backdrop-blur-xl border border-[var(--border-default)] group-hover:border-[#0A66C2]/30 transition-all duration-300 shadow-xl shadow-black/5 overflow-hidden">

                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <img
                            src={repo.ownerAvatar}
                            alt={repo.ownerName}
                            className="w-10 h-10 rounded-full border border-[var(--border-default)] bg-[var(--bg-surface)]"
                        />
                        <div>
                            <p className="text-xs text-[var(--text-tertiary)] hover:underline">
                                {repo.ownerName}
                            </p>
                            <h3 className="font-semibold text-lg text-[var(--text-primary)] leading-tight group-hover:text-[#0A66C2] transition-colors">
                                {repo.name}
                            </h3>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 bg-[#1a1b1e] border border-white/5 px-2.5 py-1 rounded-full text-xs font-medium text-amber-400">
                        <Star size={12} className="fill-current" />
                        <span>{formatNumber(repo.stars)}</span>
                    </div>
                </div>

                {/* Description */}
                <p className="text-sm text-[var(--text-secondary)] mb-6 line-clamp-3 flex-grow">
                    {repo.description}
                </p>

                {/* Footer metrics */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--border-default)]/50">
                    <div className="flex items-center gap-4 text-xs font-medium text-[var(--text-muted)]">
                        {repo.language && (
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#0A66C2]" />
                                {repo.language}
                            </div>
                        )}
                        {repo.topics.length > 0 && (
                            <div className="flex items-center gap-1.5 overflow-hidden max-w-[120px]">
                                <span className="truncate">#{repo.topics[0]}</span>
                            </div>
                        )}
                    </div>

                    <div className="w-8 h-8 rounded-full bg-[var(--bg-surface)] border border-[var(--border-default)] flex items-center justify-center text-[var(--text-muted)] group-hover:bg-[#0A66C2] group-hover:border-[#0A66C2] group-hover:text-white transition-all transform group-hover:scale-110 shadow-lg shader-[#0A66C2]/20">
                        <ArrowUpRight size={16} />
                    </div>
                </div>
            </div>
        </motion.a>
    );
}
