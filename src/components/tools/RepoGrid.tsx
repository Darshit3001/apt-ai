import { RepoCard } from "./RepoCard";

interface RepoGridProps {
    repos: any[];
}

export function RepoGrid({ repos }: RepoGridProps) {
    if (!repos || repos.length === 0) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {repos.map((repo, idx) => (
                <RepoCard key={repo.id} repo={repo} index={idx} />
            ))}
        </div>
    );
}
