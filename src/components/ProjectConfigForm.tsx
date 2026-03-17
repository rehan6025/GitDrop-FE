interface ProjectConfigFormProps {
    projectName: string;
    projectUrl: string;
    projectType: "REACT" | "STATIC";
    buildCommand: string;
    onBuildCommandChange: (command: string) => void;
    onProjectNameChange: (name: string) => void;
    onProjectUrlChange: (url: string) => void;
    onProjectTypeChange: (type: "REACT" | "STATIC") => void;
}

const ProjectConfigForm = ({
    projectName,
    projectUrl,
    projectType,
    buildCommand,
    onBuildCommandChange,
    onProjectNameChange,
    onProjectUrlChange,
    onProjectTypeChange,
}: ProjectConfigFormProps) => {
    return (
        <div className="space-y-6">
            {/* Project Name */}
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-muted-foreground/80 font-mono text-sm">
                        $
                    </span>
                    <span className="font-dogica text-xs text-neutral-400">
                        project name
                    </span>
                </div>
                <input
                    value={projectName}
                    onChange={(e) => onProjectNameChange(e.target.value)}
                    placeholder="my-project"
                    className="w-full bg-background border border-border rounded px-3 py-2.5 text-sm text-foreground font-mono focus:outline-none focus:border-ring transition-colors"
                />
            </div>

            {/* Project URL */}
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-muted-foreground/80 font-mono text-sm">
                        $
                    </span>
                    <span className="font-dogica text-xs text-neutral-400">
                        project url
                    </span>
                </div>
                <div className="flex items-center">
                    <input
                        value={projectUrl}
                        onChange={(e) => onProjectUrlChange(e.target.value)}
                        placeholder="my-project"
                        className="flex-1 bg-background border border-border border-r-0 rounded-l px-3 py-2.5 text-sm text-foreground font-mono focus:outline-none focus:border-ring transition-colors"
                    />
                    <span className="px-3 py-2.5 border border-border rounded-r text-xs font-mono text-muted-foreground bg-muted">
                        .gitdrop.dev
                    </span>
                </div>
                {projectUrl && (
                    <p className="text-[10px] text-neutral-600 font-mono mt-2">
                        → https://{projectUrl}.gitdrop.dev
                    </p>
                )}
            </div>

            {/* Project Type */}
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-muted-foreground/80 font-mono text-sm">
                        $
                    </span>
                    <span className="font-dogica text-xs text-neutral-400">
                        project type
                    </span>
                </div>
                <div className="flex gap-3">
                    {(["REACT", "STATIC"] as const).map((type) => (
                        <button
                            key={type}
                            onClick={() => onProjectTypeChange(type)}
                            className={`flex-1 px-4 py-3 border rounded transition-all duration-200
                            ${
                                projectType === type
                                    ? "border-border bg-muted"
                                    : "border-border hover:bg-muted/50"
                            }`}
                        >
                            <span className="block text-lg mb-1">
                                {type === "REACT" ? "⚛️" : "📄"}
                            </span>
                            <span
                                className={`block text-xs font-dogica ${
                                    projectType === type
                                        ? "text-foreground"
                                        : "text-muted-foreground"
                                }`}
                            >
                                {type === "REACT" ? "React" : "Static"}
                            </span>
                            <span
                                className={`block text-[9px] mt-0.5 ${
                                    projectType === type
                                        ? "text-neutral-400"
                                        : "text-neutral-600"
                                }`}
                            >
                                {type === "REACT"
                                    ? "Vite / CRA"
                                    : "HTML / vanilla"}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Build Command (React only) */}
            {projectType === "REACT" && (
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-muted-foreground/80 font-mono text-sm">
                            $
                        </span>
                        <span className="font-dogica text-xs text-neutral-400">
                            build command
                        </span>
                    </div>
                    <input
                        value={buildCommand}
                        onChange={(e) => onBuildCommandChange(e.target.value)}
                        placeholder="npm run build"
                        className="w-full bg-background border border-border rounded px-3 py-2.5 text-sm text-foreground font-mono focus:outline-none focus:border-ring transition-colors"
                    />
                    <p className="text-[10px] text-neutral-600 font-mono mt-2">
                        command executed during deployment
                    </p>
                </div>
            )}
        </div>
    );
};

export default ProjectConfigForm;
