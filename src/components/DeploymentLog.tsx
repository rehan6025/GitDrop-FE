interface DeploymentLogProps {
    deployStep: number;
    projectUrl: string;
}

const DeploymentLog = ({ deployStep, projectUrl }: DeploymentLogProps) => {
    const isDone = deployStep >= 4;

    return (
        <div className="mt-6 border border-border text-foreground bg-card rounded-xl overflow-hidden shadow-xl shadow-black/10 dark:shadow-black/40">
            {/* Terminal Header */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-muted border-b border-border">
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
                        className={`w-1.5 h-1.5 rounded-full ${isDone ? "bg-emerald-400" : "bg-yellow-400 animate-pulse"}`}
                    />
                    {isDone ? "done" : "running"}
                </span>
            </div>

            {/* Log Body */}
            <div className="p-5 font-dogica text-xs space-y-3">
                {/* Step 1 */}
                <div>
                    <p className="text-neutral-400">
                        <span className="text-emerald-500">$</span> git clone
                        repo...
                    </p>
                    <div className="mt-1.5 h-1 w-full bg-border rounded-full overflow-hidden">
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
                            <span className="text-emerald-500">$</span> npm
                            install...
                        </p>
                        <div className="mt-1.5 h-1 w-full bg-border rounded-full overflow-hidden">
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
                            <span className="text-emerald-500">$</span> npm run
                            build...
                        </p>
                        <div className="mt-1.5 h-1 w-full bg-border rounded-full overflow-hidden">
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
                {isDone && (
                    <div className="animate-in fade-in slide-in-from-bottom-1 duration-500 pt-2 border-t border-border">
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
    );
};

export default DeploymentLog;
