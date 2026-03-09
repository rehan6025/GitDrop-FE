import { api, type Branch, type Repository } from "@/api/api";
import { useEffect, useState } from "react";
import RepoCard from "@/components/RepoCard";
import DeployTerminal from "@/components/DeployTerminal";
import DeploymentLog from "@/components/DeploymentLog";

const Deploy = () => {
    const [repos, setRepos] = useState<Repository[]>([]);
    const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

    const [projectName, setProjectName] = useState("");
    const [projectUrl, setProjectUrl] = useState("");
    const [projectType, setProjectType] = useState<"REACT" | "STATIC">("REACT");

    const [deploying, setDeploying] = useState(false);
    const [deployStep, setDeployStep] = useState(0);

    const handleDeploy = async () => {
        if (!selectedRepo || !selectedBranch) return;

        setDeploying(true);
        setDeployStep(1);

        setTimeout(() => setDeployStep(2), 1500);
        setTimeout(() => setDeployStep(3), 3000);
        setTimeout(() => setDeployStep(4), 4500);

        // later you will call backend here

        await api.deployments.create({
            name: projectName,
            repoUrl: projectUrl,
            branch: selectedBranch,
            type: "REACT",
        });
    };

    const handleSelectRepo = async (repo: Repository) => {
        setSelectedRepo(repo);

        // autofill project name + url
        setProjectName(repo.name);
        setProjectUrl(repo.name);

        try {
            const owner = repo.owner.login;
            const name = repo.name;

            const data = await api.github.getBranches(owner, name);
            setBranches(data);

            if (data.length === 1) {
                setSelectedBranch(data[0].name);
            } else {
                const defaultBranch = data.find(
                    (b) => b.name === repo.default_branch,
                );

                if (defaultBranch) {
                    setSelectedBranch(defaultBranch.name);
                } else {
                    setSelectedBranch(data[0].name);
                }
            }
        } catch (err) {
            console.error("Failed to fetch branches", err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await api.github.getRepositories();
                setRepos(data);
            } catch (error) {
                console.error("Error fetching repositories:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="max-w-6xl mx-auto px-6 py-10">
            {/* Title */}
            <h1 className="text-3xl mb-8 font-dogica tracking-wider">Deploy</h1>

            {/* Branch + Project Config Terminal */}
            {selectedRepo && (
                <DeployTerminal
                    selectedRepo={selectedRepo}
                    branches={branches}
                    selectedBranch={selectedBranch}
                    projectName={projectName}
                    projectUrl={projectUrl}
                    projectType={projectType}
                    onBranchSelect={setSelectedBranch}
                    onProjectNameChange={setProjectName}
                    onProjectUrlChange={setProjectUrl}
                    onProjectTypeChange={setProjectType}
                    onDeploy={handleDeploy}
                />
            )}

            {/* Deployment Animation */}
            {deploying && (
                <DeploymentLog
                    deployStep={deployStep}
                    projectUrl={projectUrl}
                />
            )}

            {/* Repo Grid */}
            <div className="grid md:grid-cols-2 gap-4 text-white mt-10">
                {repos.map((repo) => (
                    <RepoCard
                        key={repo.id}
                        repo={repo}
                        onSelect={handleSelectRepo}
                    />
                ))}
            </div>
        </div>
    );
};

export default Deploy;
