import { api } from "@/api/api";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

type DeploymentStatus = "NOT_STARTED" | "QUEUED" | "IN_PROGRESS" | "READY" | "FAIL";

const statusColor: Record<DeploymentStatus, string> = {
    NOT_STARTED: "text-neutral-400 bg-neutral-800/60 border-neutral-700/60",
    QUEUED: "text-sky-400 bg-sky-400/10 border-sky-400/20",
    IN_PROGRESS: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    READY: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    FAIL: "text-red-400 bg-red-400/10 border-red-400/20",
};

const statusIcon: Record<DeploymentStatus, string> = {
    NOT_STARTED: "○",
    QUEUED: "◷",
    IN_PROGRESS: " ◷",
    READY: "✓",
    FAIL: "✗",
};

const Deployment = () => {
    const { deploymentId } = useParams();
    const logContainerRef = useRef<HTMLDivElement>(null);

    const [logs, setLogs] = useState<string[]>([]);
    const [status, setStatus] = useState<DeploymentStatus>("QUEUED");
    const [loading, setLoading] = useState(true);

    // Auto-scroll logs to bottom
    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const depLogs = await api.deployments.getLogs(Number(deploymentId));
                const normalizedLogs = depLogs.map((log: unknown) =>
                    typeof log === "string"
                        ? log
                        : typeof (log as { message?: string })?.message === "string"
                          ? (log as { message: string }).message
                          : JSON.stringify(log),
                );
                setLogs(normalizedLogs);
            } catch (err) {
                console.error("Failed to fetch logs:", err);
            }
        };

        const fetchStatus = async () => {
            try {
                const depStatus = await api.deployments.getStatus(Number(deploymentId));
                setStatus(depStatus as DeploymentStatus);
            } catch (err) {
                console.error("Failed to fetch status:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
        fetchStatus();
    }, [deploymentId]);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:3000/ws/deployments");

        ws.onopen = () => {
            ws.send(
                JSON.stringify({
                    type: "subscribe",
                    deploymentId,
                }),
            );
        };

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);

            if (msg.event === "deployment-update") {
                const data = msg.data;

                if (data.type === "log") {
                    setLogs((prev) => [...prev, data.log]);
                }

                if (data.type === "status") {
                    setStatus(data.status);
                }
            }
        };

        return () => ws.close();
    }, [deploymentId]);

    return (
        <div className="text-white max-w-6xl mx-auto px-6 py-10">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl font-dogica tracking-wider">
                            deployment #{deploymentId}
                        </h1>
                        <span
                            className={`text-[10px] font-dogica px-1.5 py-0.5 rounded border ${
                                statusColor[status] ?? "text-neutral-400 bg-neutral-800 border-neutral-700"
                            }`}
                        >
                            {statusIcon[status] ?? "○"} {status}
                        </span>
                    </div>
                    <p className="text-neutral-500 text-xs font-dogica">
                        live build logs and deployment status
                    </p>
                </div>

                <Link
                    to="/dashboard"
                    className="text-xs font-dogica text-neutral-500 hover:text-white transition-colors"
                >
                    ← back to dashboard
                </Link>
            </div>

            {/* Loading state */}
            {loading && (
                <div className="border border-neutral-800 rounded-lg overflow-hidden">
                    <div className="h-8 bg-neutral-900 flex items-center px-3 gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-neutral-700 animate-pulse" />
                        <div className="w-2.5 h-2.5 rounded-full bg-neutral-700 animate-pulse" />
                        <div className="w-2.5 h-2.5 rounded-full bg-neutral-700 animate-pulse" />
                    </div>
                    <div className="bg-neutral-950 p-4 space-y-2">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="h-4 bg-neutral-900 rounded animate-pulse"
                                style={{ width: `${60 + Math.random() * 40}%` }}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Terminal window */}
            {!loading && (
                <div className="border border-neutral-800 rounded-lg overflow-hidden">
                    {/* Terminal header bar */}
                    <div className="h-8 bg-neutral-900 flex items-center px-3 gap-1.5 border-b border-neutral-800">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                        <span className="ml-3 text-[11px] text-neutral-500 font-mono">
                            build.log
                        </span>
                    </div>

                    {/* Terminal body */}
                    <div
                        ref={logContainerRef}
                        className="bg-neutral-950 p-4 h-[500px] overflow-y-auto font-mono text-[13px] leading-relaxed"
                    >
                        {/* Initial prompt */}
                        <div className="text-emerald-500 mb-3">
                            <span className="text-emerald-400">$</span>{" "}
                            <span className="text-neutral-400">gitdrop deploy --id {deploymentId}</span>
                        </div>

                        {/* Logs */}
                        {logs.length === 0 && (
                            <div className="text-neutral-600 italic">
                                waiting for logs...
                            </div>
                        )}

                        {logs.map((log, i) => (
                            <div
                                key={i}
                                className="text-neutral-300 whitespace-pre-wrap break-all"
                            >
                                <span className="text-neutral-600 select-none mr-2">
                                    [{String(i + 1).padStart(3, "0")}]
                                </span>
                                {log}
                            </div>
                        ))}

                        {/* Cursor when in progress */}
                        {status === "IN_PROGRESS" && (
                            <div className="mt-2 flex items-center gap-1">
                                <span className="text-emerald-400">$</span>
                                <span className="w-2 h-4 bg-emerald-400 animate-pulse" />
                            </div>
                        )}

                        {/* Completion message */}
                        {status === "READY" && (
                            <div className="mt-3 text-emerald-400">
                                ✓ build completed successfully
                            </div>
                        )}

                        {/* Failure message */}
                        {status === "FAIL" && (
                            <div className="mt-3 text-red-400">
                                ✗ build failed — check logs above for details
                            </div>
                        )}
                    </div>

                    {/* Status bar */}
                    <div className="h-7 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between px-3">
                        <div className="flex items-center gap-2">
                            <span
                                className={`w-2 h-2 rounded-full ${
                                    status === "READY"
                                        ? "bg-emerald-500"
                                        : status === "FAIL"
                                          ? "bg-red-500"
                                          : status === "IN_PROGRESS"
                                            ? "bg-yellow-500 animate-pulse"
                                            : "bg-neutral-600"
                                }`}
                            />
                            <span className="text-[11px] text-neutral-500 font-mono">
                                {status === "IN_PROGRESS"
                                    ? "building..."
                                    : status === "READY"
                                      ? "ready"
                                      : status === "FAIL"
                                        ? "failed"
                                        : "queued"}
                            </span>
                        </div>
                        <span className="text-[11px] text-neutral-600 font-mono">
                            {logs.length} log entries
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Deployment;
