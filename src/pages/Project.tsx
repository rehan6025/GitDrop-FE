import { api } from "@/api/api";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

type DeploymentStatus = "NOT_STARTED" | "QUEUED" | "IN_PROGRESS" | "READY" | "FAIL";

interface Deployment {
    id: number;
    status: DeploymentStatus;
    commitHash: string | null;
    createdAt: string;
    updatedAt: string;
    project_id: number;
}

const deploymentStatusColor: Record<DeploymentStatus, string> = {
    NOT_STARTED: "text-neutral-400 bg-neutral-800/60 border-neutral-700/60",
    QUEUED: "text-sky-400 bg-sky-400/10 border-sky-400/20",
    IN_PROGRESS: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    READY: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    FAIL: "text-red-400 bg-red-400/10 border-red-400/20",
};

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);
    if (days > 0) return `${days}d ago`;
    if (hrs > 0) return `${hrs}h ago`;
    if (mins > 0) return `${mins}m ago`;
    return "just now";
}

const Project = () => {
    const { projectId } = useParams();
    const [deployments, setDeployments] = useState<Deployment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!projectId) return;

        const fetchDeployments = async () => {
            try {
                const data = await api.projects.getProjectDeployments(
                    Number(projectId),
                );
                setDeployments(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDeployments();
    }, [projectId]);

    return (
        <div className="text-white max-w-6xl mx-auto px-6 py-10">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-dogica tracking-wider">
                        Project deployments
                    </h1>
                    <p className="text-neutral-500 text-xs mt-1 font-dogica">
                        all deploys for this project
                    </p>
                </div>

                <Link
                    to="/dashboard"
                    className="text-xs font-dogica text-neutral-500 hover:text-white transition-colors"
                >
                    ← back to dashboard
                </Link>
            </div>

            {loading && (
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="h-16 rounded-lg border border-neutral-800 bg-neutral-950 animate-pulse"
                        />
                    ))}
                </div>
            )}

            {!loading && deployments.length === 0 && (
                <div className="border border-dashed border-neutral-800 rounded-lg p-12 text-center">
                    <p className="text-neutral-600 font-dogica text-xs">
                        no deployments yet for this project
                    </p>
                </div>
            )}

            {!loading && deployments.length > 0 && (
                <div className="space-y-3">
                    {deployments.map((deployment) => (
                        <Link
                            key={deployment.id}
                            to={`/deployments/${deployment.id}`}
                            className="flex items-center justify-between border border-neutral-800 bg-neutral-950 rounded-lg px-5 py-3 hover:border-neutral-600 hover:bg-neutral-900/50 transition-all duration-200"
                        >
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-mono text-neutral-300">
                                        deployment #{deployment.id}
                                    </span>
                                    <span
                                        className={`text-[10px] font-dogica px-1.5 py-0.5 rounded border ${
                                            deploymentStatusColor[
                                                deployment.status
                                            ]
                                        }`}
                                    >
                                        {deployment.status}
                                    </span>
                                </div>
                                <span className="text-[11px] text-neutral-500 font-mono">
                                    created {timeAgo(deployment.createdAt)}
                                </span>
                            </div>

                            {deployment.commitHash && (
                                <span className="text-[11px] font-mono text-neutral-500 truncate max-w-[160px]">
                                    {deployment.commitHash}
                                </span>
                            )}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Project;
