interface TerminalHeaderProps {
    title: string;
    status?: "running" | "done";
}

const TerminalHeader = ({ title, status }: TerminalHeaderProps) => {
    return (
        <div className="flex items-center gap-2 px-4 py-2 border-b border-neutral-800">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>

            <span className="ml-4 text-xs text-neutral-400 font-dogica">
                {title}
            </span>

            {status && (
                <span className="ml-auto flex items-center gap-1.5 text-[10px] font-dogica text-neutral-500">
                    <span
                        className={`w-1.5 h-1.5 rounded-full ${status === "done" ? "bg-emerald-400" : "bg-yellow-400 animate-pulse"}`}
                    />
                    {status === "done" ? "done" : "running"}
                </span>
            )}
        </div>
    );
};

export default TerminalHeader;