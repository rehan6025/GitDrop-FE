import { api, type Branch, type Repository } from "@/api/api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DeployTerminal from "@/components/DeployTerminal";
import DeploymentLog from "@/components/DeploymentLog";

const DeployConfig = () => {
    const { repoName } = useParams();

    const [repo, setRepo] = useState<Repository | null>(null);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

    const [projectName, setProjectName] = useState(repoName || "");
    const [projectUrl, setProjectUrl] = useState(repoName || "");
    const [projectType, setProjectType] = useState<"REACT" | "STATIC">("REACT");
    const [buildCommmand, setbuildCommmand] = useState("");

    const [deploying, setDeploying] = useState(false);
    const [deployStep, setDeployStep] = useState(0);

    useEffect(() => {
        const fetchRepoAndBranches = async () => {
            try {
                const repos = await api.github.getRepositories();
                const foundRepo = repos.find((r) => r.name === repoName);

                if (!foundRepo) return;

                setRepo(foundRepo);

                const owner = foundRepo.owner.login;

                const data = await api.github.getBranches(
                    owner,
                    foundRepo.name,
                );

                setBranches(data);

                if (data.length === 1) {
                    setSelectedBranch(data[0].name);
                } else {
                    const defaultBranch = data.find(
                        (b) => b.name === foundRepo.default_branch,
                    );

                    setSelectedBranch(defaultBranch?.name || data[0].name);
                }
            } catch (err) {
                console.error("Failed to fetch repo", err);
            }
        };

        fetchRepoAndBranches();
    }, [repoName]);

    const handleDeploy = async () => {
        if (!repo || !selectedBranch) return;

        try {
            setDeploying(true);
            setDeployStep(1);

            setTimeout(() => setDeployStep(2), 1500);
            setTimeout(() => setDeployStep(3), 3000);
            setTimeout(() => setDeployStep(4), 4500);

            const branchObj = branches.find((b) => b.name === selectedBranch);

            await api.deployments.create({
                name: projectName,
                repoUrl: repo.html_url,
                branch: selectedBranch,
                type: projectType,
                commitHash: branchObj?.sha,
                buildCommand: buildCommmand,
                url: projectUrl,
            });
        } catch (err) {
            console.error("Deployment failed", err);
            setDeploying(false);
        }
    };

    if (!repo) {
        return (
            <div className="max-w-6xl mx-auto px-6 py-10 text-white">
                Loading repository...
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-10">
            <h1 className="text-3xl mb-8 font-dogica tracking-wider">
                Deploy {repo.name}
            </h1>

            <DeployTerminal
                selectedRepo={repo}
                branches={branches}
                selectedBranch={selectedBranch}
                projectName={projectName}
                projectUrl={projectUrl}
                projectType={projectType}
                buildCommmand={buildCommmand}
                onBuildCommandChange={setbuildCommmand}
                onBranchSelect={setSelectedBranch}
                onProjectNameChange={setProjectName}
                onProjectUrlChange={setProjectUrl}
                onProjectTypeChange={setProjectType}
                onDeploy={handleDeploy}
            />

            {deploying && (
                <DeploymentLog
                    deployStep={deployStep}
                    projectUrl={projectUrl}
                />
            )}
        </div>
    );
};

export default DeployConfig;
