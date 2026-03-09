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
        <div>
            <span className="text-sm text-emerald-400">$ </span>
            <p className="inline font-dogica text-xs text-emerald-400 mb-4">
                select branch for {repoName}
            </p>

            <div className="space-y-2 mb-6">
                {branches.map((branch) => (
                    <button
                        key={branch.name}
                        onClick={() => onSelect(branch.name)}
                        className={`w-full text-left px-3 py-2 text-sm border rounded
                        ${
                            selectedBranch === branch.name
                                ? "border-emerald-500 bg-emerald-500/10"
                                : "border-neutral-800 hover:bg-neutral-900"
                        }`}
                    >
                        🌿 {branch.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default BranchSelector;
