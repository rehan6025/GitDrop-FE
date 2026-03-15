type Branch = {
    name: string;
    sha?: string;
};

interface BranchSelectorProps {
    branches: Branch[];
    selectedBranch: string | null;
    repoName: string;
    onSelect: (branchName: string) => void;
}

const BranchSelector = ({
    branches,
    selectedBranch,
    repoName,
    onSelect,
}: BranchSelectorProps) => {
    return (
        <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
                <span className="text-white/60 font-mono text-sm">$</span>
                <span className="font-dogica text-xs text-neutral-400">
                    select branch for <span className="text-white">{repoName}</span>
                </span>
            </div>

            <div className="space-y-2">
                {branches.map((branch) => (
                    <button
                        key={branch.name}
                        onClick={() => onSelect(branch.name)}
                        className={`w-full text-left px-4 py-2.5 text-sm border rounded transition-all duration-200 font-mono
                        ${
                            selectedBranch === branch.name
                                ? "border-white/30 bg-white/5 text-white"
                                : "border-neutral-800 text-neutral-400 hover:border-neutral-600 hover:text-neutral-300"
                        }`}
                    >
                        <span className="text-neutral-500">⎇</span>{" "}
                        {branch.name}
                        {branch.sha && (
                            <span className="text-neutral-600 text-xs ml-2">
                                ({branch.sha.slice(0, 7)})
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default BranchSelector;
