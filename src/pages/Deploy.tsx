import { api, type Repository } from "@/api/api";
import { useEffect, useState } from "react";

type Branch = {
    name: string;
    sha: string;
};

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
        /*
        await api.deployment.create({
            name: projectName,
            url: projectUrl,
            repoUrl: selectedRepo?.html_url,
            branch: selectedBranch,
            type: "REACT"
        })
        */
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
                <div className="mt-10 border border-neutral-800 text-white bg-neutral-950 rounded-lg mb-5">
                    {/* Terminal Header */}
                    <div className="flex items-center gap-2 px-4 py-2 border-b border-neutral-800">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>

                        <span className="ml-4 text-xs text-neutral-400 font-dogica">
                            GITDROP-TERMINAL
                        </span>
                    </div>

                    <div className="p-6">
                        {/* Branch Selection */}
                        <span className="text-sm text-emerald-400">$ </span>
                        <p className="inline font-dogica text-xs text-emerald-400 mb-4">
                            select branch for {selectedRepo.name}
                        </p>

                        <div className="space-y-2 mb-6">
                            {branches.map((branch) => (
                                <button
                                    key={branch.name}
                                    onClick={() =>
                                        setSelectedBranch(branch.name)
                                    }
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

                        {/* Project Name */}
                        <span className="text-sm text-emerald-400">$ </span>
                        <p className="inline font-dogica text-xs text-emerald-400">
                            project name
                        </p>

                        <input
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            placeholder="my-project"
                            className="mt-2 w-full bg-black border border-neutral-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                        />

                        {/* Project URL */}
                        {/* Project Name */}
                        <span className="text-sm text-emerald-400">$ </span>
                        <p className="inline font-dogica text-xs text-emerald-400">
                            project url
                        </p>

                        <div className="flex items-center mt-2">
                            <input
                                value={projectUrl}
                                onChange={(e) => setProjectUrl(e.target.value)}
                                placeholder="my-project"
                                className="flex-1 bg-black border border-neutral-800 rounded-l px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                            />

                            <span className="px-3 py-2 border border-l-0 border-neutral-800 text-xs text-neutral-400">
                                .gitdrop.dev
                            </span>
                        </div>

                        {/* URL Preview */}
                        {projectUrl && (
                            <p className="text-xs text-neutral-400 mt-2">
                                preview: https://{projectUrl}.gitdrop.dev
                            </p>
                        )}

                        {/* Project Type */}
                        <div className="mt-6">
                            <span className="text-sm text-emerald-400">$ </span>
                            <p className="inline font-dogica text-xs text-emerald-400">
                                project type
                            </p>

                            <div className="flex gap-3 mt-2">
                                {(["REACT", "STATIC"] as const).map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setProjectType(type)}
                                        className={`flex-1 px-3 py-2.5 border rounded text-xs font-dogica transition-all duration-200
                    ${
                        projectType === type
                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                            : "border-neutral-800 text-neutral-500 hover:border-neutral-600 hover:text-neutral-400"
                    }`}
                                    >
                                        <span className="block text-base mb-1">
                                            {type === "REACT" ? "⚛️" : "📄"}
                                        </span>
                                        {type === "REACT" ? "React" : "Static"}
                                        <span className="block text-[9px] mt-0.5 opacity-60">
                                            {type === "REACT"
                                                ? "Vite"
                                                : "HTML / vanilla"}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Deploy Button */}
                        {selectedBranch && (
                            <button
                                disabled={!projectName || !projectUrl}
                                onClick={handleDeploy}
                                className={`mt-6 px-5 py-2 border font-dogica text-xs transition
                                ${
                                    projectName && projectUrl
                                        ? "border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-black"
                                        : "border-neutral-700 text-neutral-600 cursor-not-allowed"
                                }`}
                            >
                                Deploy {selectedRepo.name}
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Deployment Animation */}
            {deploying && (
                <div className="mt-6 border border-neutral-800 text-white bg-neutral-950 rounded-xl overflow-hidden shadow-xl shadow-black/40">
                    {/* Terminal Header */}
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900/80 border-b border-neutral-800">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 bg-red-500 rounded-full" />
                            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                            <div className="w-3 h-3 bg-green-500 rounded-full" />
                        </div>
                        <span className="mx-auto text-xs text-neutral-500 font-dogica tracking-widest">
                            DEPLOYMENT-LOG
                        </span>
                        <span className="flex items-center gap-1.5 text-[10px] font-dogica text-neutral-500">
                            <span
                                className={`w-1.5 h-1.5 rounded-full ${deployStep >= 4 ? "bg-emerald-400" : "bg-yellow-400 animate-pulse"}`}
                            />
                            {deployStep >= 4 ? "done" : "running"}
                        </span>
                    </div>

                    {/* Log Body */}
                    <div className="p-5 font-dogica text-xs space-y-3">
                        {/* Step 1 */}
                        <div>
                            <p className="text-neutral-400">
                                <span className="text-emerald-500">$</span> git
                                clone repo...
                            </p>
                            <div className="mt-1.5 h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full bg-emerald-500 rounded-full transition-all duration-700 ease-out ${deployStep >= 1 ? "w-full" : "w-0"}`}
                                />
                            </div>
                            {deployStep >= 1 && (
                                <p className="text-emerald-500/60 text-[10px] mt-0.5">
                                    ✓ cloned
                                </p>
                            )}
                        </div>

                        {/* Step 2 */}
                        {deployStep >= 2 && (
                            <div className="animate-in fade-in slide-in-from-bottom-1 duration-300">
                                <p className="text-neutral-400">
                                    <span className="text-emerald-500">$</span>{" "}
                                    npm install...
                                </p>
                                <div className="mt-1.5 h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out ${deployStep >= 3 ? "w-full" : "w-2/3"}`}
                                    />
                                </div>
                                {deployStep >= 3 && (
                                    <p className="text-emerald-500/60 text-[10px] mt-0.5">
                                        ✓ installed
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Step 3 */}
                        {deployStep >= 3 && (
                            <div className="animate-in fade-in slide-in-from-bottom-1 duration-300">
                                <p className="text-neutral-400">
                                    <span className="text-emerald-500">$</span>{" "}
                                    npm run build...
                                </p>
                                <div className="mt-1.5 h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out ${deployStep >= 4 ? "w-full" : "w-1/3"}`}
                                    />
                                </div>
                                {deployStep >= 4 && (
                                    <p className="text-emerald-500/60 text-[10px] mt-0.5">
                                        ✓ built
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Success */}
                        {deployStep >= 4 && (
                            <div className="animate-in fade-in slide-in-from-bottom-1 duration-500 pt-2 border-t border-neutral-800">
                                <p className="text-emerald-400 flex items-center mt-2 gap-2">
                                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400">
                                        ✓
                                    </span>
                                    deployment queued successfully
                                </p>
                                <p className="text-neutral-600 font-sans text-[16px] mt-1">
                                    your project will be live at{" "}
                                    <span className="text-neutral-400">
                                        {projectUrl}.gitdrop.dev
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Repo Grid */}
            <div className="grid md:grid-cols-2 gap-4 text-white mt-10">
                {repos.map((repo) => (
                    <div
                        key={repo.id}
                        className="border border-neutral-800 bg-neutral-950 rounded-lg p-4 flex items-center justify-between hover:border-emerald-500 transition"
                    >
                        <div>
                            <p className="font-medium text-sm">{repo.name}</p>
                            <p className="text-xs text-neutral-400">
                                {repo.owner.login}
                            </p>
                        </div>

                        <button
                            onClick={() => handleSelectRepo(repo)}
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
                ))}
            </div>
        </div>
    );
};

export default Deploy;
