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
                <span className="text-muted-foreground/80 font-mono text-sm">
                    $
                </span>
                <span className="font-dogica text-xs text-neutral-400">
                    select branch for{" "}
                    <span className="text-foreground">{repoName}</span>
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
                                ? "border-border bg-muted text-foreground"
                                : "border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        }`}
                    >
                        <span className="text-muted-foreground">⎇</span>{" "}
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
