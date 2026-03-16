import { api, type Project } from "@/api/api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const statusColor: Record<string, string> = {
    CREATED: "text-neutral-400 bg-neutral-800/60 border-neutral-700/60",
    IN_PROGRESS: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    READY: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    FAIL: "text-red-400 bg-red-400/10 border-red-400/20",
};

const typeIcon: Record<string, string> = {
    REACT: "⚛️",
    STATIC: "📄",
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

const Dashboard = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    // 1) Initial fetch of all projects for this user
    useEffect(() => {
        const getData = async () => {
            try {
                const data = await api.projects.getAllProjects();
                setProjects(data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        getData();
    }, []);

    // 2) Live status updates over WebSocket – subscribe to each project's updates
    useEffect(() => {
        if (projects.length === 0) return;

        const ws = new WebSocket("ws://localhost:3000/ws/deployments");

        ws.onopen = () => {
            // subscribe this dashboard client to each project's status updates
            projects.forEach((project) => {
                ws.send(
                    JSON.stringify({
                        type: "subscribe",
                        projectId: project.id,
                    }),
                );
            });
        };

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);

            if (msg.event === "project-update") {
                const { projectId, data } = msg;

                if (!data || typeof data.status !== "string") return;

                setProjects((prev) =>
                    prev.map((project) =>
                        project.id === projectId
                            ? { ...project, status: data.status }
                            : project,
                    ),
                );
            }
        };

        return () => {
            ws.close();
        };
    }, [projects]);

    return (
        <div className="text-foreground max-w-6xl mx-auto px-6 py-10">
            {/* Header */}
            <div className="flex items-end justify-between mb-10">
                <div>
                    <h1 className="text-3xl font-dogica tracking-wider">
                        Dashboard
                    </h1>
                    <p className="text-neutral-500 text-xs mt-1 font-dogica">
                        {projects.length} project
                        {projects.length !== 1 ? "s" : ""} deployed
                    </p>
                </div>

                <Link
                    to="/deploy"
                    className="px-4 py-2 border border-border text-foreground font-dogica text-xs hover:bg-accent hover:text-accent-foreground transition-all duration-200"
                >
                    + New Deploy
                </Link>
            </div>

            {/* Loading skeletons */}
            {loading && (
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="h-20 rounded-lg border border-border bg-card animate-pulse"
                        />
                    ))}
                </div>
            )}

            {/* Empty state */}
            {!loading && projects.length === 0 && (
                <div className="border border-dashed border-border rounded-lg p-16 text-center">
                    <p className="text-neutral-600 font-dogica text-xs">
                        no projects yet — deploy one
                    </p>
                </div>
            )}

            {/* Project list */}
            {!loading && projects.length > 0 && (
                <div className="space-y-3">
                    {projects.map((project) => {
                        const repoName = project.repoUrl
                            .replace(/\.git$/, "")
                            .split("/")
                            .pop();

                        const hasValidUrl =
                            project.url && project.url !== "undefined";

                        return (
                            <div
                                key={project.id}
                                className="border border-border bg-card rounded-lg px-5 py-4 flex items-center justify-between hover:bg-muted/50 transition-all duration-200"
                            >
                                {/* Left side */}
                                <Link
                                    to={`/projects/${project.id}`}
                                    className="flex items-center gap-4 min-w-0 group"
                                >
                                    <span className="text-xl shrink-0">
                                        {typeIcon[project.type]}
                                    </span>

                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-foreground text-sm font-medium transition-colors">
                                                {project.name}
                                            </span>

                                            <span
                                                className={`text-[10px] font-dogica px-1.5 py-0.5 rounded border ${
                                                    statusColor[
                                                        project.status
                                                    ] ??
                                                    "text-neutral-400 bg-neutral-800 border-neutral-700"
                                                }`}
                                            >
                                                {project.status}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-500 font-mono">
                                            <span>⎇ {project.branch}</span>
                                            <span className="text-neutral-700">
                                                ·
                                            </span>
                                            <span>{repoName}</span>
                                            <span className="text-neutral-700">
                                                ·
                                            </span>
                                            <span>
                                                {timeAgo(project.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </Link>

                                {/* Right side */}
                                <div className="flex items-center gap-3 shrink-0 ml-4">
                                    {hasValidUrl && (
                                        <Link
                                            to={`https://${project.url}.localhost`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[11px] font-mono text-neutral-500 hover:text-foreground transition-colors"
                                        >
                                            {project.url} ↗
                                        </Link>
                                    )}

                                    <span className="text-[10px] font-dogica px-2 py-0.5 border border-border text-neutral-600 rounded">
                                        {project.type}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
