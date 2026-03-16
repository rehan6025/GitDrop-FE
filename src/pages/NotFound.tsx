import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
            <div className="w-full max-w-md">
                {/* Terminal window */}
                <div className="border border-border rounded-xl overflow-hidden shadow-2xl shadow-black/10 dark:shadow-black/40">
                    {/* Title bar */}
                    <div className="flex items-center gap-2 px-5 py-3.5 bg-muted border-b border-border">
                        <div className="flex gap-2">
                            <div className="w-3.5 h-3.5 rounded-full bg-red-500" />
                            <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/80" />
                            <div className="w-3.5 h-3.5 rounded-full bg-green-500/80" />
                        </div>
                        <span className="mx-auto text-[11px] font-dogica text-muted-foreground tracking-widest uppercase">
                            error
                        </span>
                    </div>

                    {/* Body */}
                    <div className="px-10 py-12 bg-card">
                        {/* Error prompt */}
                        <div className="mb-8">
                            <p className="font-dogica text-xs text-red-500 mb-3">
                                $ navigate --to="{location.pathname}"
                            </p>
                            <div className="flex items-start gap-3">
                                <span className="text-red-500 font-mono text-sm">✗</span>
                                <div>
                                    <h1 className="font-dogica text-4xl tracking-wider text-foreground mb-2">
                                        404
                                    </h1>
                                    <p className="text-muted-foreground font-mono text-sm">
                                        page not found
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Error details */}
                        <div className="border border-border rounded-lg p-4 mb-8 bg-background">
                            <p className="font-mono text-xs text-muted-foreground mb-2">
                                <span className="text-red-400">error:</span> the requested resource could not be located
                            </p>
                            <p className="font-mono text-xs text-muted-foreground">
                                <span className="text-yellow-400">hint:</span> check the url or navigate home
                            </p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col gap-3">
                            <Link
                                to="/"
                                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-dogica rounded-lg hover:bg-emerald-500/20 transition-all duration-200"
                            >
                                <span>→</span>
                                <span>return home</span>
                            </Link>
                            <Link
                                to="/dashboard"
                                className="w-full flex items-center justify-center gap-2 px-5 py-3 border border-border text-foreground text-sm font-dogica rounded-lg hover:bg-muted transition-all duration-200"
                            >
                                <span>→</span>
                                <span>go to dashboard</span>
                            </Link>
                        </div>
                    </div>

                    {/* Status bar */}
                    <div className="h-8 bg-muted/50 border-t border-border flex items-center justify-between px-4">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500" />
                            <span className="text-[11px] font-mono text-muted-foreground">
                                navigation failed
                            </span>
                        </div>
                        <span className="text-[11px] font-mono text-muted-foreground">
                            exit code: 1
                        </span>
                    </div>
                </div>

                {/* Version */}
                <p className="text-center text-muted-foreground/50 text-xs font-dogica mt-6 tracking-wider">
                    gitdrop v1.0.0
                </p>
            </div>
        </div>
    );
};

export default NotFound;