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
        <div className="mt-10 border border-neutral-800 text-white bg-neutral-950 rounded-lg mb-5">
            <TerminalHeader title="GITDROP-TERMINAL" />

            <div className="p-6">
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
                {selectedBranch && (
                    <button
                        disabled={!canDeploy}
                        onClick={onDeploy}
                        className={`mt-6 px-5 py-2 border font-dogica text-xs transition
                        ${
                            canDeploy
                                ? "border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-black"
                                : "border-neutral-700 text-neutral-600 cursor-not-allowed"
                        }`}
                    >
                        Deploy {selectedRepo.name}
                    </button>
                )}
            </div>
        </div>
    );
};

export default DeployTerminal;
