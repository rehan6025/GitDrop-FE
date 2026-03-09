import type { Repository } from "@/api/api";

interface RepoCardProps {
    repo: Repository;
    onSelect: (repo: Repository) => void;
}

const RepoCard = ({ repo, onSelect }: RepoCardProps) => {
    return (
        <div className="border border-neutral-800 bg-neutral-950 rounded-lg p-4 flex items-center justify-between hover:border-emerald-500 transition">
            <div>
                <p className="font-medium text-sm">{repo.name}</p>
                <p className="text-xs text-neutral-400">{repo.owner.login}</p>
            </div>

            <button
                onClick={() => onSelect(repo)}
                className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6 text-white inline-block"
            >
                <span className="absolute inset-0 overflow-hidden rounded-full">
                    <span className="absolute inset-0 rounded-full bg-[radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </span>

                <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10">
                    <span>Select</span>
                </div>
            </button>
        </div>
    );
};

export default RepoCard;