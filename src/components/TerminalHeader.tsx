interface TerminalHeaderProps {
    title: string;
    status?: "running" | "done" | "error";
}

const TerminalHeader = ({ title, status }: TerminalHeaderProps) => {
    return (
        <div className="h-9 flex items-center gap-1.5 px-3 border-b border-border bg-muted">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />

            <span className="ml-3 text-[11px] text-muted-foreground font-mono">
                {title}
            </span>

            {status && (
                <span className="ml-auto flex items-center gap-1.5 text-[10px] font-dogica">
                    <span
                        className={`w-1.5 h-1.5 rounded-full ${
                            status === "done"
                                ? "bg-emerald-400"
                                : status === "error"
                                  ? "bg-red-400"
                                  : "bg-yellow-400 animate-pulse"
                        }`}
                    />
                    <span
                        className={
                            status === "done"
                                ? "text-emerald-400"
                                : status === "error"
                                  ? "text-red-400"
                                  : "text-yellow-400"
                        }
                    >
                        {status === "done" ? "complete" : status === "error" ? "error" : "running"}
                    </span>
                </span>
            )}
        </div>
    );
};

export default TerminalHeader;