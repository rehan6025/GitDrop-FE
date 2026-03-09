interface ProjectConfigFormProps {
    projectName: string;
    projectUrl: string;
    projectType: "REACT" | "STATIC";
    onProjectNameChange: (name: string) => void;
    onProjectUrlChange: (url: string) => void;
    onProjectTypeChange: (type: "REACT" | "STATIC") => void;
}

const ProjectConfigForm = ({
    projectName,
    projectUrl,
    projectType,
    onProjectNameChange,
    onProjectUrlChange,
    onProjectTypeChange,
}: ProjectConfigFormProps) => {
    return (
        <>
            {/* Project Name */}
            <span className="text-sm text-emerald-400">$ </span>
            <p className="inline font-dogica text-xs text-emerald-400">
                project name
            </p>

            <input
                value={projectName}
                onChange={(e) => onProjectNameChange(e.target.value)}
                placeholder="my-project"
                className="mt-2 w-full bg-black border border-neutral-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />

            {/* Project URL */}
            <span className="text-sm text-emerald-400">$ </span>
            <p className="inline font-dogica text-xs text-emerald-400">
                project url
            </p>

            <div className="flex items-center mt-2">
                <input
                    value={projectUrl}
                    onChange={(e) => onProjectUrlChange(e.target.value)}
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
                            onClick={() => onProjectTypeChange(type)}
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
                                {type === "REACT" ? "Vite" : "HTML / vanilla"}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
};

export default ProjectConfigForm;
