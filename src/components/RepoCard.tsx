import type { Repository } from "@/api/api";

interface RepoCardProps {
    repo: Repository;
    onSelect: (repo: Repository) => void;
}

const RepoCard = ({ repo, onSelect }: RepoCardProps) => {
    return (
        <button
            onClick={() => onSelect(repo)}
            className="w-full text-left border border-border bg-card rounded-lg px-5 py-4 hover:bg-muted/50 transition-all duration-200 group"
        >
            <div className="flex items-center justify-between">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground transition-colors">
                            {repo.name}
                        </span>
                        {repo.private && (
                            <span className="text-[9px] font-dogica px-1.5 py-0.5 rounded border border-border text-foreground">
                                PRIVATE
                            </span>
                        )}
                    </div>
                    <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                        {repo.owner.login}
                    </p>
                </div>

                <span className="text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-mono">
                    select →
                </span>
            </div>
        </button>
    );
};

export default RepoCard;