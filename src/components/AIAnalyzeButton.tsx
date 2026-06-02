import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Lightbulb, ListChecks, RefreshCw, Sparkles, Wrench, X } from "lucide-react";

import { api } from "@/api/api";

// Recognized response shapes from the backend:
//
//   (1) Structured: { Hints: string[]; "Likely Cause": string; "Suggested fix": string[] }
//       — sometimes wrapped in { result: { ... } } or { analysis: { ... } } etc.
//   (2) Plain lines: string[] / string / { analysis: string } / { insights: string[] }
//   (3) Error:       { error: string } / { errors: string | string[] }
//
// We try to detect (1) first, then (2)/(3). The shape is stored in a tagged
// union so the UI knows how to render it.

interface StructuredAnalysis {
    kind: "structured";
    hints: string[];
    likelyCause: string;
    suggestedFix: string[];
}

interface LinesAnalysis {
    kind: "lines";
    lines: string[];
}

type AnalysisShape = StructuredAnalysis | LinesAnalysis;

// Unwrap a single field into a normalized list of non-empty strings.
// Accepts string | string[] | object (recurses into it) and falls through to [].
function toLines(value: unknown): string[] {
    if (value == null) return [];
    if (typeof value === "string") {
        return value
            .split(/\n+/)
            .map((s) => s.trim())
            .filter(Boolean);
    }
    if (typeof value === "number" || typeof value === "boolean") {
        return [String(value)];
    }
    if (Array.isArray(value)) {
        const out: string[] = [];
        for (const item of value) out.push(...toLines(item));
        return out;
    }
    if (typeof value === "object") {
        // Last-ditch: stringify the object so we never produce "[object Object]".
        try {
            const json = JSON.stringify(value);
            if (json && json !== "{}") return [json];
        } catch {
            /* ignore */
        }
    }
    return [];
}

function findKey(obj: Record<string, unknown>, candidates: string[]): unknown {
    const lowerMap = new Map<string, unknown>();
    for (const k of Object.keys(obj)) lowerMap.set(k.toLowerCase(), obj[k]);
    for (const c of candidates) {
        const v = lowerMap.get(c.toLowerCase());
        if (v != null) return v;
    }
    return undefined;
}

// Try to interpret `res` as the structured { Hints, Likely Cause, Suggested fix }
// shape. Returns null if it doesn't look like that shape.
function asStructured(res: unknown): StructuredAnalysis | null {
    if (res == null || typeof res !== "object" || Array.isArray(res)) return null;
    const obj = res as Record<string, unknown>;

    const hintsRaw = findKey(obj, ["Hints", "hints", "Hint", "hint"]);
    const causeRaw = findKey(obj, [
        "Likely Cause",
        "likely_cause",
        "likelycause",
        "cause",
        "rootCause",
        "root_cause",
    ]);
    const fixRaw = findKey(obj, [
        "Suggested fix",
        "Suggested Fix",
        "suggested_fix",
        "suggestedfix",
        "fix",
        "fixes",
        "solution",
    ]);

    // Need at least hints OR (cause / fix) to call this "structured".
    if (hintsRaw == null && causeRaw == null && fixRaw == null) return null;

    return {
        kind: "structured",
        hints: toLines(hintsRaw),
        likelyCause: toLines(causeRaw).join(" "),
        suggestedFix: toLines(fixRaw),
    };
}

// First unwrap known wrapper keys ({ result: ... }, { analysis: ... }, etc.),
// then try structured, then fall back to a flat list of lines.
const WRAPPER_KEYS = [
    "result",
    "analysis",
    "data",
    "output",
    "response",
    "payload",
    "body",
] as const;

const ERROR_KEYS = ["error", "errors", "reason", "message"] as const;

function unwrapResponse(res: unknown): unknown {
    if (res == null || typeof res !== "object" || Array.isArray(res)) return res;
    const obj = res as Record<string, unknown>;

    for (const key of WRAPPER_KEYS) {
        const v = obj[key];
        if (v != null && typeof v === "object") return unwrapResponse(v);
    }
    return res;
}

function shapeAnalysis(res: unknown): AnalysisShape | null {
    const unwrapped = unwrapResponse(res);
    if (unwrapped == null) return null;

    // First, try the structured shape.
    const structured = asStructured(unwrapped);
    if (structured) return structured;

    // Then, try a flat list of lines.
    if (typeof unwrapped === "string" || Array.isArray(unwrapped)) {
        const lines = toLines(unwrapped);
        return lines.length > 0 ? { kind: "lines", lines } : null;
    }

    if (typeof unwrapped === "object") {
        const obj = unwrapped as Record<string, unknown>;

        // Look for content-style keys first.
        const contentKeys = [
            "Hints",
            "hints",
            "insights",
            "lines",
            "items",
            "messages",
        ];
        for (const k of contentKeys) {
            const v = obj[k];
            if (v == null) continue;
            const lines = toLines(v);
            if (lines.length > 0) return { kind: "lines", lines };
        }

        // Then error keys (so backend errors are readable, not [object Object]).
        for (const k of ERROR_KEYS) {
            const v = obj[k];
            if (v == null) continue;
            const lines = toLines(v);
            if (lines.length > 0) return { kind: "lines", lines };
        }
    }

    return null;
}

interface AIAnalyzeButtonProps {
    deploymentId: number;
    className?: string;
}

export default function AIAnalyzeButton({
    deploymentId,
    className,
}: AIAnalyzeButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [analysis, setAnalysis] = useState<AnalysisShape | null>(null);
    const [rawResponse, setRawResponse] = useState<unknown>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAnalysis = useCallback(async () => {
        setLoading(true);
        setError(null);
        setAnalysis(null);
        setRawResponse(null);
        try {
            const res = await api.deployments.getDeploymentAnalysis(
                deploymentId,
            );
            setRawResponse(res);
            setAnalysis(shapeAnalysis(res));
        } catch (err) {
            console.error("Failed to analyze deployment:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Could not analyze the build logs. Please try again.",
            );
        } finally {
            setLoading(false);
        }
    }, [deploymentId]);

    useEffect(() => {
        if (isOpen && !analysis && !loading && !error) {
            fetchAnalysis();
        }
    }, [isOpen, analysis, loading, error, fetchAnalysis]);

    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen]);

    return (
        <>
            {/* Trigger — sits inside the terminal footer on the deployment page. */}
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className={
                    "inline-flex items-center gap-1.5 text-[11px] font-dogica " +
                    "text-emerald-400 hover:text-emerald-300 transition-colors " +
                    (className ?? "")
                }
            >
                <Sparkles className="w-3 h-3" />
                <span>analyze with ai</span>
            </button>

            {isOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="ai-analyze-title"
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-2xl max-h-[80vh] flex flex-col border border-border bg-card rounded-xl overflow-hidden shadow-xl shadow-black/40"
                    >
                        {/* Terminal header — matches DeploymentLog / Deployment */}
                        <div className="h-8 bg-muted flex items-center px-3 gap-1.5 border-b border-border shrink-0">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                            <span className="ml-3 text-[11px] text-neutral-500 font-dogica tracking-widest">
                                ai-analysis.log
                            </span>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                aria-label="Close"
                                className="ml-auto inline-flex items-center justify-center w-6 h-6 rounded text-neutral-400 hover:text-foreground hover:bg-white/5 transition-colors"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {/* Heading */}
                        <div className="px-5 pt-5 pb-3 border-b border-border shrink-0">
                            <div className="flex items-center gap-2 mb-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-[10px] font-dogica tracking-widest text-emerald-400 uppercase">
                                    AI Build Analysis
                                </span>
                            </div>
                            <h2
                                id="ai-analyze-title"
                                className="text-lg font-dogica tracking-wide text-foreground"
                            >
                                why did this build fail?
                            </h2>
                            <p className="mt-1 text-xs text-neutral-500 font-dogica">
                                build logs read · root cause surfaced · fix &
                                redeploy
                            </p>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-5">
                            {loading && (
                                <div className="flex items-center gap-3 py-6 text-neutral-500 justify-center">
                                    <span className="loader" />
                                    <span className="text-[11px] font-dogica">
                                        analyzing build logs...
                                    </span>
                                </div>
                            )}

                            {error && !loading && (
                                <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3 flex flex-col gap-2">
                                    <div className="flex items-start gap-2 text-red-300">
                                        <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                        <p className="text-xs">{error}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={fetchAnalysis}
                                        className="self-start inline-flex items-center gap-1.5 text-[11px] font-dogica text-red-200 hover:text-white transition-colors"
                                    >
                                        <RefreshCw className="w-3 h-3" />
                                        retry
                                    </button>
                                </div>
                            )}

                            {!loading &&
                                !error &&
                                analysis?.kind === "structured" && (
                                    <StructuredView data={analysis} />
                                )}

                            {!loading &&
                                !error &&
                                analysis?.kind === "lines" && (
                                    <LinesView lines={analysis.lines} />
                                )}

                            {!loading &&
                                !error &&
                                !analysis &&
                                rawResponse != null && (
                                    <div>
                                        <p className="text-[10px] font-dogica text-neutral-600 uppercase tracking-widest mb-2">
                                            raw response
                                        </p>
                                        <pre className="text-[12px] font-mono text-neutral-300 bg-background border border-border rounded p-3 overflow-x-auto whitespace-pre-wrap break-words">
                                            {JSON.stringify(
                                                rawResponse,
                                                null,
                                                2,
                                            )}
                                        </pre>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function SectionLabel({
    icon,
    children,
}: {
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-center gap-1.5 text-[10px] font-dogica tracking-widest text-neutral-500 uppercase">
            <span className="text-emerald-400">{icon}</span>
            <span>{children}</span>
        </div>
    );
}

function StructuredView({ data }: { data: StructuredAnalysis }) {
    const { hints, likelyCause, suggestedFix } = data;
    const hasAny =
        hints.length > 0 || likelyCause.length > 0 || suggestedFix.length > 0;
    if (!hasAny) {
        return (
            <p className="text-xs font-dogica text-neutral-500 italic">
                no insights returned.
            </p>
        );
    }

    return (
        <div className="space-y-5">
            {hints.length > 0 && (
                <section>
                    <SectionLabel icon={<Lightbulb className="w-3 h-3" />}>
                        Hints
                    </SectionLabel>
                    <ol className="mt-2 space-y-1.5 font-mono text-[13px] leading-relaxed">
                        {hints.map((line, idx) => (
                            <li
                                key={idx}
                                className="text-foreground whitespace-pre-wrap break-words flex gap-2"
                            >
                                <span className="text-neutral-600 select-none shrink-0">
                                    [
                                    {String(idx + 1).padStart(2, "0")}
                                    ]
                                </span>
                                <span>{line}</span>
                            </li>
                        ))}
                    </ol>
                </section>
            )}

            {likelyCause && (
                <section>
                    <SectionLabel
                        icon={<ListChecks className="w-3 h-3" />}
                    >
                        Likely Cause
                    </SectionLabel>
                    <p className="mt-2 text-[13px] leading-relaxed text-foreground whitespace-pre-wrap break-words">
                        {likelyCause}
                    </p>
                </section>
            )}

            {suggestedFix.length > 0 && (
                <section>
                    <SectionLabel icon={<Wrench className="w-3 h-3" />}>
                        Suggested Fix
                    </SectionLabel>
                    <ol className="mt-2 space-y-1.5 font-mono text-[13px] leading-relaxed">
                        {suggestedFix.map((line, idx) => (
                            <li
                                key={idx}
                                className="text-foreground whitespace-pre-wrap break-words flex gap-2"
                            >
                                <span className="text-emerald-400 select-none shrink-0">
                                    $
                                </span>
                                <span>{line}</span>
                            </li>
                        ))}
                    </ol>
                </section>
            )}
        </div>
    );
}

function LinesView({ lines }: { lines: string[] }) {
    return (
        <ol className="space-y-1.5 font-mono text-[13px] leading-relaxed">
            {lines.map((line, idx) => (
                <li
                    key={idx}
                    className="text-foreground whitespace-pre-wrap break-words flex gap-2"
                >
                    <span className="text-neutral-600 select-none shrink-0">
                        [{String(idx + 1).padStart(2, "0")}]
                    </span>
                    <span>{line}</span>
                </li>
            ))}
        </ol>
    );
}
