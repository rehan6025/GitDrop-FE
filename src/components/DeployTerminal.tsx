import type { Repository } from "@/api/api";
import TerminalHeader from "./TerminalHeader";
import BranchSelector from "./BranchSelector";
import ProjectConfigForm from "./ProjectConfigForm";

type Branch = {
    name: string;
    sha: string;
};

interface DeployTerminalProps {
    selectedRepo: Repository;
    branches: Branch[];
    selectedBranch: string | null;
    projectName: string;
    projectUrl: string;
    projectType: "REACT" | "STATIC";
    buildCommmand: string;
    onBuildCommandChange: (command: string) => void;

    onBranchSelect: (branchName: string) => void;
    onProjectNameChange: (name: string) => void;
    onProjectUrlChange: (url: string) => void;
    onProjectTypeChange: (type: "REACT" | "STATIC") => void;
    onDeploy: () => void;
}

const DeployTerminal = ({
    selectedRepo,
    branches,
    selectedBranch,
    projectName,
    projectUrl,
    projectType,
    buildCommmand,
    onBuildCommandChange,
    onBranchSelect,
    onProjectNameChange,
    onProjectUrlChange,
    onProjectTypeChange,
    onDeploy,
}: DeployTerminalProps) => {
    const canDeploy = selectedBranch && projectName && projectUrl;

    return (
        <div className="border border-border rounded-lg overflow-hidden bg-card">
            <TerminalHeader title={`gitdrop deploy ${selectedRepo.name}`} />

            <div className="p-6">
                {/* Repo info bar */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                    <span className="text-lg">
                        {selectedRepo.private ? "🔒" : "📦"}
                    </span>
                    <div>
                        <p className="text-sm text-foreground font-mono">
                            {selectedRepo.owner.login}/{selectedRepo.name}
                        </p>
                        <p className="text-[10px] text-neutral-500 font-dogica">
                            {branches.length} branch{branches.length !== 1 ? "es" : ""} available
                        </p>
                    </div>
                </div>

                <BranchSelector
                    branches={branches}
                    selectedBranch={selectedBranch}
                    repoName={selectedRepo.name}
                    onSelect={onBranchSelect}
                />

                <ProjectConfigForm
                    projectName={projectName}
                    projectUrl={projectUrl}
                    projectType={projectType}
                    buildCommand={buildCommmand}
                    onBuildCommandChange={onBuildCommandChange}
                    onProjectNameChange={onProjectNameChange}
                    onProjectUrlChange={onProjectUrlChange}
                    onProjectTypeChange={onProjectTypeChange}
                />

                {/* Deploy Button */}
                <div className="mt-8 pt-4 border-t border-border">
                    <button
                        disabled={!canDeploy}
                        onClick={onDeploy}
                        className={`px-5 py-2.5 border font-dogica text-xs transition-all duration-200 rounded
                        ${
                            canDeploy
                                ? "border-border text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer"
                                : "border-border text-muted-foreground cursor-not-allowed opacity-60"
                        }`}
                    >
                        <span className="mr-2">▶</span>
                        deploy {selectedRepo.name}
                    </button>

                    {!canDeploy && (
                        <p className="text-[10px] text-neutral-600 font-dogica mt-2">
                            fill in all fields to deploy
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DeployTerminal;
