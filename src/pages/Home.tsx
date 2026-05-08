// src/pages/Home.tsx
import { useAuth } from "@/auth/auth";
import AppNavbar from "@/components/MainNavbar";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import DeployDome from "@/components/DeployDome";

const Home = () => {
    const { status } = useAuth();
    const navigate = useNavigate();

    const handleStart = () => {
        if (status === "authenticated") navigate("/dashboard");
        else navigate("/login");
    };

    const DeployOrbit = () => {
        const cx = 200,
            cy = 200,
            R = 130;

        const nodes = [
            { label: "GitHub", sub: "source", angle: -90 },
            { label: "Install", sub: "deps", angle: -18 },
            { label: "Build", sub: "bundle", angle: 54 },
            { label: "Test", sub: "verify", angle: 126 },
            { label: "Deploy", sub: "live", angle: 198 },
        ];

        const polar = (deg: number, radius: number) => ({
            x: cx + radius * Math.cos((deg * Math.PI) / 180),
            y: cy + radius * Math.sin((deg * Math.PI) / 180),
        });

        // Full circle path for animateMotion
        const orbitPath = `
            M ${polar(-90, R).x} ${polar(-90, R).y}
            A ${R} ${R} 0 1 1 ${polar(-90, R).x - 0.001} ${polar(-90, R).y}
        `;

        return (
            <div className="w-full flex justify-center bg-background">
                <style>{`
                    @keyframes dash-spin {
                        to { stroke-dashoffset: -56; }
                    }
                    @keyframes dot-pulse {
                        0%, 100% { opacity: .55; }
                        50%       { opacity: 1;   }
                    }
                    .ring-dash   { stroke-dasharray: 6 8; animation: dash-spin 5s linear infinite; }
                    .ring-dash-r { stroke-dasharray: 4 12; animation: dash-spin 9s linear infinite reverse; }
                    .center-dot  { animation: dot-pulse 2s ease-in-out infinite; }
                `}</style>

                <svg
                    viewBox="0 0 400 400"
                    width="360"
                    height="360"
                    style={{ overflow: "visible" }}
                >
                    {/* ── outermost halo rings ── */}
                    <circle
                        cx={cx}
                        cy={cy}
                        r={R + 46}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.35"
                        strokeOpacity="0.07"
                    />
                    <circle
                        cx={cx}
                        cy={cy}
                        r={R + 26}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.35"
                        strokeOpacity="0.1"
                        strokeDasharray="2 10"
                    />

                    {/* ── main orbit ring (animated dashes) ── */}
                    <circle
                        cx={cx}
                        cy={cy}
                        r={R}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.6"
                        strokeOpacity="0.2"
                        className="ring-dash"
                    />
                    {/* static base ring underneath */}
                    <circle
                        cx={cx}
                        cy={cy}
                        r={R}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.35"
                        strokeOpacity="0.1"
                    />

                    {/* ── inner rings ── */}
                    <circle
                        cx={cx}
                        cy={cy}
                        r={32}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.6"
                        strokeOpacity="0.2"
                        className="ring-dash-r"
                    />
                    <circle
                        cx={cx}
                        cy={cy}
                        r={18}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.8"
                        strokeOpacity="0.3"
                    />

                    {/* ── spoke lines ── */}
                    {nodes.map((n, i) => {
                        const outer = polar(n.angle, R);
                        const inner = polar(n.angle, 32);
                        return (
                            <line
                                key={i}
                                x1={inner.x}
                                y1={inner.y}
                                x2={outer.x}
                                y2={outer.y}
                                stroke="currentColor"
                                strokeWidth="0.4"
                                strokeOpacity="0.13"
                            />
                        );
                    })}

                    {/* ── center hub ── */}
                    <circle
                        cx={cx}
                        cy={cy}
                        r={7}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeOpacity="0.5"
                    />
                    <circle
                        cx={cx}
                        cy={cy}
                        r={2.5}
                        fill="currentColor"
                        strokeOpacity="0.7"
                        className="center-dot"
                    />
                    {/* crosshair */}
                    <line
                        x1={cx - 20}
                        y1={cy}
                        x2={cx + 20}
                        y2={cy}
                        stroke="currentColor"
                        strokeWidth="0.5"
                        strokeOpacity="0.2"
                    />
                    <line
                        x1={cx}
                        y1={cy - 20}
                        x2={cx}
                        y2={cy + 20}
                        stroke="currentColor"
                        strokeWidth="0.5"
                        strokeOpacity="0.2"
                    />

                    {/* ── orbit nodes ── */}
                    {nodes.map((n, i) => {
                        const pos = polar(n.angle, R);
                        const isRight = pos.x > cx + 24;
                        const isLeft = pos.x < cx - 24;
                        const isTop = pos.y < cy - 24;
                        const isBot = pos.y > cy + 24;

                        let lx = pos.x,
                            ly = pos.y,
                            anchor = "middle";
                        if (isRight) {
                            lx = pos.x + 18;
                            anchor = "start";
                        } else if (isLeft) {
                            lx = pos.x - 18;
                            anchor = "end";
                        }
                        if (isTop) ly = pos.y - 16;
                        else if (isBot) ly = pos.y + 16;
                        else ly = pos.y + (i % 2 === 0 ? -14 : 16);

                        return (
                            <g key={i}>
                                {/* dashed halo */}
                                <circle
                                    cx={pos.x}
                                    cy={pos.y}
                                    r={14}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="0.4"
                                    strokeOpacity="0.18"
                                    strokeDasharray="2 5"
                                />
                                {/* node ring */}
                                <circle
                                    cx={pos.x}
                                    cy={pos.y}
                                    r={7}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                    strokeOpacity="0.55"
                                />
                                {/* inner dot */}
                                <circle
                                    cx={pos.x}
                                    cy={pos.y}
                                    r={2}
                                    fill="currentColor"
                                    opacity="0.45"
                                />
                                {/* label */}
                                <text
                                    x={lx}
                                    y={ly}
                                    textAnchor={anchor as any}
                                    fontSize="9.5"
                                    fontFamily="monospace"
                                    fill="currentColor"
                                    opacity="0.6"
                                    fontWeight="600"
                                    letterSpacing="0.04em"
                                >
                                    {n.label}
                                </text>
                                <text
                                    x={lx}
                                    y={ly + 11}
                                    textAnchor={anchor as any}
                                    fontSize="7.5"
                                    fontFamily="monospace"
                                    fill="currentColor"
                                    opacity="0.28"
                                >
                                    {n.sub}
                                </text>
                            </g>
                        );
                    })}

                    {/* ── travelling particle + ghost ── */}
                    <circle r="4" fill="currentColor" opacity="0.75">
                        <animateMotion
                            dur="9s"
                            repeatCount="indefinite"
                            path={orbitPath}
                        />
                    </circle>
                    <circle r="2.5" fill="currentColor" opacity="0.3">
                        <animateMotion
                            dur="9s"
                            begin="-0.55s"
                            repeatCount="indefinite"
                            path={orbitPath}
                        />
                    </circle>
                    <circle r="1.5" fill="currentColor" opacity="0.15">
                        <animateMotion
                            dur="9s"
                            begin="-1s"
                            repeatCount="indefinite"
                            path={orbitPath}
                        />
                    </circle>

                    {/* ── blueprint corner marks ── */}
                    {(
                        [
                            [16, 16, 1, 1],
                            [384, 16, -1, 1],
                            [16, 384, 1, -1],
                            [384, 384, -1, -1],
                        ] as [number, number, number, number][]
                    ).map(([x, y, sx, sy], i) => (
                        <g
                            key={i}
                            stroke="currentColor"
                            strokeOpacity="0.18"
                            strokeWidth="0.7"
                        >
                            <line x1={x} y1={y} x2={x + sx * 12} y2={y} />
                            <line x1={x} y1={y} x2={x} y2={y + sy * 12} />
                            <circle
                                cx={x}
                                cy={y}
                                r="1.2"
                                fill="currentColor"
                                opacity="0.25"
                            />
                        </g>
                    ))}

                    {/* ── blueprint micro-labels ── */}
                    <text
                        x="16"
                        y="396"
                        fontSize="7"
                        fontFamily="monospace"
                        fill="currentColor"
                        opacity="0.18"
                    >
                        GITDROP / DEPLOY-PIPELINE
                    </text>
                    <text
                        x="384"
                        y="396"
                        fontSize="7"
                        fontFamily="monospace"
                        fill="currentColor"
                        opacity="0.18"
                        textAnchor="end"
                    >
                        ∅ 260px
                    </text>
                </svg>
            </div>
        );
    };

    /* ── Pipeline stepper (unchanged logic) ── */
    const CheckIcon = () => (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );

    const DeploymentFlow = () => {
        const [activeStep, setActiveStep] = useState(0);
        const [completedSteps, setCompletedSteps] = useState<number[]>([]);

        const steps = [
            { label: "GitHub", description: "Connect repository" },
            { label: "Install", description: "Install dependencies" },
            { label: "Build", description: "Compile & bundle" },
            { label: "Deploy", description: "Go live instantly" },
        ];

        useEffect(() => {
            const id = setInterval(() => {
                setActiveStep((prev) => {
                    const next = (prev + 1) % steps.length;
                    setCompletedSteps((c) => [...new Set([...c, prev])]);
                    if (next === 0)
                        setTimeout(() => setCompletedSteps([]), 100);
                    return next;
                });
            }, 2000);
            return () => clearInterval(id);
        }, [steps.length]);

        return (
            <div className="relative w-full max-w-xs">
                <div className="absolute inset-0 bg-muted/80 rounded-2xl border border-border/50" />
                <div className="relative p-8">
                    <div className="text-center mb-6">
                        <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                            Deployment Pipeline
                        </span>
                    </div>
                    <div className="relative">
                        {steps.map((step, index) => {
                            const isActive = activeStep === index;
                            const isCompleted = completedSteps.includes(index);
                            const isLast = index === steps.length - 1;
                            return (
                                <div key={index} className="relative">
                                    {!isLast && (
                                        <div
                                            className={`absolute left-[19px] top-10 w-0.5 h-6 transition-colors duration-500 ${isCompleted ? "bg-emerald-500" : "bg-border"}`}
                                        />
                                    )}
                                    <div className="flex items-start gap-4 pb-6">
                                        <div
                                            className={`relative flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isActive ? "border-emerald-500 bg-emerald-500/10" : isCompleted ? "border-emerald-500 bg-emerald-500" : "border-border bg-background"}`}
                                        >
                                            {isCompleted ? (
                                                <span className="text-white">
                                                    <CheckIcon />
                                                </span>
                                            ) : isActive ? (
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            ) : (
                                                <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                                            )}
                                            {isActive && (
                                                <div className="absolute inset-0 rounded-full border-2 border-emerald-500 animate-ping opacity-20" />
                                            )}
                                        </div>
                                        <div className="flex-1 pt-1">
                                            <h4
                                                className={`font-medium transition-colors duration-300 ${isActive || isCompleted ? "text-foreground" : "text-muted-foreground"}`}
                                            >
                                                {step.label}
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    const LightningIcon = ({ className }: { className?: string }) => (
        <svg
            className={className}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
    );
    const TerminalIcon = ({ className }: { className?: string }) => (
        <svg
            className={className}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="4 17 10 11 4 5" />
            <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
    );
    const ContainerIcon = ({ className }: { className?: string }) => (
        <svg
            className={className}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="7.5 4.21 12 6.81 16.5 4.21" />
            <polyline points="7.5 19.79 7.5 14.6 3 12" />
            <polyline points="21 12 16.5 14.6 16.5 19.79" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
    );
    const GlobeIcon = ({ className }: { className?: string }) => (
        <svg
            className={className}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
    );

    return (
        <div className="relative  min-h-screen w-full bg-background">
            <AppNavbar />

            {/* Dot pattern fixed — covers entire viewport always */}
            <div
                className="fixed inset-0 pointer-events-none z-0"
                style={{
                    backgroundImage:
                        "radial-gradient(#696969 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                }}
            />

            {/* ── HERO ── */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full text-center gap-6 px-4 ">
                <h1 className="text-5xl md:text-8xl font-bold tracking-widest text-foreground">
                    GITDROP
                </h1>
                <p className="backdrop-blur-sm text-muted-foreground max-w-xl">
                    Deploy your GitHub projects instantly. Like Vercel — but
                    with no limits.
                </p>
                <div className="flex gap-4">
                    <button
                        className="px-6 py-2 bg-primary text-primary-foreground backdrop-blur-md cursor-pointer rounded-md"
                        onClick={handleStart}
                    >
                        Start Deploying
                    </button>
                    <button className="px-6 py-2 border border-border cursor-pointer rounded-md backdrop-blur-md">
                        Learn More
                    </button>
                </div>
            </div>

            {/* ── FEATURE SECTION ── */}
            <section className="relative z-10 max-w-6xl mx-auto px-6 py-24 md:py-32">
                <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
                    {/* LEFT */}
                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
                            From repository to production — instantly.
                        </h2>
                        <p className="text-muted-foreground text-base md:text-lg">
                            GitDrop is a complete deployment pipeline. Clone
                            repositories, build projects, and deploy to
                            production with real-time logs — all in one place.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                            {[
                                {
                                    Icon: LightningIcon,
                                    title: "Instant Deployments",
                                    desc: "Deploy any GitHub repository in seconds.",
                                },
                                {
                                    Icon: TerminalIcon,
                                    title: "Live Build Logs",
                                    desc: "Watch your deployment process in real-time.",
                                },
                                {
                                    Icon: ContainerIcon,
                                    title: "Isolated Builds",
                                    desc: "Secure Docker-based build environments.",
                                },
                                {
                                    Icon: GlobeIcon,
                                    title: "Instant URLs",
                                    desc: "Get live links instantly after deployment.",
                                },
                            ].map(({ Icon, title, desc }, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="shrink-0 w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                                        <Icon className="text-foreground" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium mb-1">
                                            {title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT — orbit + pipeline */}
                    <div className="flex flex-row items-center gap-9 p-16  ">
                        <DeployOrbit />
                        {/* <DeploymentFlow /> */}
                    </div>
                </div>
            </section>

            <section className="relative z-10 max-w-6xl mx-auto px-6 py-24 md:py-32">
                <DeployDome />
            </section>

            <Footer />
        </div>
    );
};

export default Home;
