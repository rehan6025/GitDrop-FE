// src/components/DeployDome.tsx
import { useState, useEffect } from "react";
import Logo from "@/components/Logo";

const W = 500;
const HUB = { x: 250, y: 290 };
const R = 190;
const NODE_R = 24;
const HUB_R = NODE_R + 6;

const TOOLS = [
    {
        id: "cra",
        label: "Create React App",
        short: "CRA",
        angle: -155,
        color: "#61DAFB",
        bg: "#E8F9FE",
        darkBg: "#0c2d38",
        icon: (
            <g stroke="#61DAFB" strokeWidth="1.8" fill="none">
                <ellipse cx="0" cy="0" rx="12" ry="5" />
                <ellipse cx="0" cy="0" rx="12" ry="5" transform="rotate(60)" />
                <ellipse cx="0" cy="0" rx="12" ry="5" transform="rotate(-60)" />
                <circle cx="0" cy="0" r="2.2" fill="#61DAFB" stroke="none" />
            </g>
        ),
    },
    {
        id: "vite",
        label: "Vite",
        short: "Vite",
        angle: -115,
        color: "#646CFF",
        bg: "#EDEDFF",
        darkBg: "#1a1a3e",
        icon: (
            <g transform="scale(0.18)">
                <defs>
                    <linearGradient
                        id="viteA"
                        x1="6"
                        x2="235"
                        y1="33"
                        y2="344"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#41d1ff" />
                        <stop offset="1" stopColor="#bd34fe" />
                    </linearGradient>
                    <linearGradient
                        id="viteB"
                        x1="194.651"
                        x2="236.076"
                        y1="8.818"
                        y2="292.989"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#ffea83" />
                        <stop offset=".083" stopColor="#ffdd35" />
                        <stop offset="1" stopColor="#ffa800" />
                    </linearGradient>
                </defs>
                <g transform="translate(-64,-64)">
                    <path
                        fill="url(#viteA)"
                        d="M124.766 19.52 67.324 122.238c-1.187 2.121-4.234 2.133-5.437.024L3.305 19.532c-1.313-2.302.652-5.087 3.261-4.622L64.07 25.187a3.09 3.09 0 0 0 1.11 0l56.3-10.261c2.598-.473 4.575 2.289 3.286 4.594Z"
                    />
                    <path
                        fill="url(#viteB)"
                        d="M91.46 1.43 48.954 9.758a1.56 1.56 0 0 0-1.258 1.437l-2.617 44.168a1.563 1.563 0 0 0 1.91 1.614l11.836-2.735a1.562 1.562 0 0 1 1.88 1.836l-3.517 17.219a1.562 1.562 0 0 0 1.985 1.805l7.308-2.223c1.133-.344 2.223.652 1.985 1.812l-5.59 27.047c-.348 1.692 1.902 2.614 2.84 1.164l.625-.968 34.64-69.13c.582-1.16-.421-2.48-1.69-2.234l-12.185 2.352a1.558 1.558 0 0 1-1.793-1.965l7.95-27.562A1.56 1.56 0 0 0 91.46 1.43Z"
                    />
                </g>
            </g>
        ),
    },
    {
        id: "html",
        label: "HTML",
        short: "HTML",
        angle: -75,
        color: "#E34C26",
        bg: "#FDF0EC",
        darkBg: "#2e1208",
        icon: (
            <g transform="scale(0.18) translate(-64,-64)">
                <path
                    fill="#E44D26"
                    d="M19.037 113.876L9.032 1.661h109.936l-10.016 112.198-45.019 12.48z"
                />
                <path
                    fill="#F16529"
                    d="M64 116.8l36.378-10.086 8.559-95.878H64z"
                />
                <path
                    fill="#EBEBEB"
                    d="M64 52.455H45.788L44.53 38.361H64V24.599H29.489l.33 3.692 3.382 37.927H64zm0 35.743l-.061.017-15.327-4.14-.979-10.975H33.816l1.928 21.609 28.193 7.826.063-.017z"
                />
                <path
                    fill="#fff"
                    d="M63.952 52.455v13.763h16.947l-1.597 17.849-15.35 4.143v14.319l28.215-7.82.207-2.325 3.234-36.233.335-3.696h-3.708zm0-27.856v13.762h33.244l.276-3.092.628-6.978.329-3.692z"
                />
            </g>
        ),
    },
    {
        id: "css",
        label: "CSS",
        short: "CSS",
        angle: -35,
        color: "#264DE4",
        bg: "#EBF0FD",
        darkBg: "#0d1633",
        icon: (
            <g transform="scale(0.18) translate(-64,-64)">
                <path
                    fill="#1572B6"
                    d="M18.814 114.123L8.76 1.352h110.48l-10.064 112.754-45.243 12.543-45.119-12.526z"
                />
                <path
                    fill="#33A9DC"
                    d="M64.001 117.062l36.559-10.136 8.601-96.354h-45.16v106.49z"
                />
                <path
                    fill="#fff"
                    d="M64.001 51.429h18.302l1.264-14.163H64.001V23.435h34.682l-.332 3.711-3.4 38.114h-30.95V51.429z"
                />
                <path
                    fill="#EBEBEB"
                    d="M64.083 87.349l-.061.018-15.403-4.159-.985-11.031H33.752l1.937 21.717 28.331 7.863.063-.018v-14.39z"
                />
                <path
                    fill="#fff"
                    d="M81.127 64.675l-1.666 18.522-15.426 4.164v14.39l28.354-7.858.208-2.337 2.406-26.881H81.127z"
                />
                <path
                    fill="#EBEBEB"
                    d="M64.048 23.435v13.831H30.64l-.277-3.108-.63-7.012-.331-3.711h34.646zm-.047 27.996v13.831H48.792l-.277-3.108-.631-7.012-.33-3.711h16.447z"
                />
            </g>
        ),
    },
    {
        id: "js",
        label: "JavaScript",
        short: "JS",
        angle: 5,
        color: "#F7DF1E",
        bg: "#FEFDE8",
        darkBg: "#2a2600",
        icon: (
            <g transform="scale(0.18) translate(-64,-64)">
                <path fill="#F0DB4F" d="M1.408 1.408h125.184v125.185H1.408z" />
                <path
                    fill="#323330"
                    d="M116.347 96.736c-.917-5.711-4.641-10.508-15.672-14.981-3.832-1.761-8.104-3.022-9.377-5.926-.452-1.69-.512-2.642-.226-3.665.821-3.32 4.784-4.355 7.925-3.403 2.023.678 3.938 2.237 5.093 4.724 5.402-3.498 5.391-3.475 9.163-5.879-1.381-2.141-2.118-3.129-3.022-4.045-3.249-3.629-7.676-5.498-14.756-5.355l-3.688.477c-3.534.893-6.902 2.748-8.877 5.235-5.926 6.724-4.236 18.492 2.975 23.335 7.104 5.332 17.54 6.545 18.873 11.531 1.297 6.104-4.486 8.08-10.234 7.378-4.236-.881-6.592-3.034-9.139-6.949-4.688 2.713-4.688 2.713-9.508 5.485 1.143 2.499 2.344 3.63 4.26 5.795 9.068 9.198 31.76 8.746 35.83-5.176.165-.478 1.261-3.666.38-8.581zM69.462 58.943H57.753l-.048 30.272c0 6.438.333 12.34-.714 14.149-1.713 3.558-6.152 3.117-8.175 2.427-2.059-1.012-3.106-2.451-4.319-4.485-.333-.584-.583-1.036-.667-1.071l-9.52 5.83c1.583 3.249 3.915 6.069 6.902 7.901 4.462 2.678 10.459 3.499 16.731 2.059 4.082-1.189 7.604-3.652 9.448-7.401 2.666-4.915 2.094-10.864 2.07-17.444.06-10.735.001-21.468.001-32.237z"
                />
            </g>
        ),
    },
];

const pt = (angle: number, r: number) => ({
    x: HUB.x + r * Math.cos((angle * Math.PI) / 180),
    y: HUB.y + r * Math.sin((angle * Math.PI) / 180),
});

const curvePath = (nx: number, ny: number) => {
    const mx = (nx + HUB.x) / 2;
    const my = (ny + HUB.y) / 2 + 20;
    return `M${nx},${ny} Q${mx},${my} ${HUB.x},${HUB.y}`;
};

export default function DeployDome() {
    const [active, setActive] = useState<string | null>(null);
    const [tick, setTick] = useState(0);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const id = setInterval(() => setTick((t) => t + 1), 2000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        const update = () =>
            setIsDark(document.documentElement.classList.contains("dark"));
        update();
        const observer = new MutationObserver(update);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });
        return () => observer.disconnect();
    }, []);

    const highlighted = active ?? TOOLS[tick % TOOLS.length].id;
    const hubBg = isDark ? "#1a1a1a" : "#ffffff";
    const hubStroke = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)";

    const badgeBg = (tool: (typeof TOOLS)[0], isOn: boolean) => {
        if (!isOn) return isDark ? "#1f1f1f" : "#ffffff";
        return isDark ? tool.darkBg : tool.bg;
    };

    return (
        <section className="w-full flex flex-col items-center py-16 px-4 bg-background border border-border rounded-2xl">
            <style>{`
                @keyframes gd-float-0 { 0%,100%{transform:translateY(0px)}   50%{transform:translateY(-7px)} }
                @keyframes gd-float-1 { 0%,100%{transform:translateY(-2px)}  50%{transform:translateY(-9px)} }
                @keyframes gd-float-2 { 0%,100%{transform:translateY(0px)}   50%{transform:translateY(-6px)} }
                @keyframes gd-float-3 { 0%,100%{transform:translateY(-3px)}  50%{transform:translateY(-8px)} }
                @keyframes gd-float-4 { 0%,100%{transform:translateY(0px)}   50%{transform:translateY(-5px)} }
                @keyframes gd-dash    { to { stroke-dashoffset: -20; } }
                @keyframes gd-hub-pulse {
                    0%   { r: 32; opacity: .12; }
                    100% { r: 54; opacity: 0;  }
                }
                .gd-node { cursor: pointer; }
            `}</style>

            <div className="relative w-full" style={{ maxWidth: 520 }}>
                <svg
                    viewBox={`0 0 ${W} 390`}
                    width="100%"
                    style={{ overflow: "visible", display: "block" }}
                >
                    <defs>
                        <radialGradient id="gd-dome" cx="50%" cy="95%" r="60%">
                            <stop
                                offset="0%"
                                stopColor="currentColor"
                                stopOpacity="0.06"
                            />
                            <stop
                                offset="100%"
                                stopColor="currentColor"
                                stopOpacity="0"
                            />
                        </radialGradient>
                        <filter
                            id="gd-shadow"
                            x="-30%"
                            y="-30%"
                            width="160%"
                            height="160%"
                        >
                            <feDropShadow
                                dx="0"
                                dy="2"
                                stdDeviation="4"
                                floodColor="currentColor"
                                floodOpacity="0.07"
                            />
                        </filter>
                        <filter
                            id="gd-hub-shadow"
                            x="-50%"
                            y="-50%"
                            width="200%"
                            height="200%"
                        >
                            <feDropShadow
                                dx="0"
                                dy="3"
                                stdDeviation="8"
                                floodColor="currentColor"
                                floodOpacity="0.1"
                            />
                        </filter>
                    </defs>

                    {/* Dome arcs */}
                    <path
                        d={`M ${pt(-168, R + 18).x} ${pt(-168, R + 18).y} A ${R + 18} ${R + 18} 0 0 1 ${pt(-12, R + 18).x} ${pt(-12, R + 18).y}`}
                        fill="url(#gd-dome)"
                        stroke="currentColor"
                        strokeWidth="0.5"
                        strokeOpacity="0.12"
                    />
                    <path
                        d={`M ${pt(-155, R * 0.55).x} ${pt(-155, R * 0.55).y} A ${R * 0.55} ${R * 0.55} 0 0 1 ${pt(-25, R * 0.55).x} ${pt(-25, R * 0.55).y}`}
                        fill="url(#gd-dome)"
                        stroke="currentColor"
                        strokeWidth="0.4"
                        strokeOpacity="0.08"
                    />

                    {/* Connection lines */}
                    {TOOLS.map((tool) => {
                        const pos = pt(tool.angle, R);
                        const isOn = highlighted === tool.id;
                        return (
                            <path
                                key={tool.id + "-line"}
                                d={curvePath(pos.x, pos.y)}
                                fill="none"
                                stroke={isOn ? tool.color : "currentColor"}
                                strokeWidth={isOn ? 1.5 : 0.7}
                                strokeOpacity={isOn ? 0.65 : 0.13}
                                strokeDasharray={isOn ? "5 4" : undefined}
                                style={
                                    isOn
                                        ? {
                                              animation:
                                                  "gd-dash 1s linear infinite",
                                          }
                                        : undefined
                                }
                            />
                        );
                    })}

                    {/* Hub pulse ring */}
                    <circle
                        cx={HUB.x}
                        cy={HUB.y}
                        r="32"
                        fill="none"
                        stroke="currentColor"
                        strokeOpacity="0.1"
                        style={{
                            animation: "gd-hub-pulse 2.6s ease-out infinite",
                        }}
                    />

                    {/* Hub background circle */}
                    <g filter="url(#gd-hub-shadow)">
                        <circle
                            cx={HUB.x}
                            cy={HUB.y}
                            r={HUB_R}
                            fill={hubBg}
                            stroke={hubStroke}
                            strokeWidth="1"
                        />
                        <circle
                            cx={HUB.x}
                            cy={HUB.y}
                            r={HUB_R - 4}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="0.4"
                            strokeOpacity="0.07"
                        />
                    </g>

                    {/* Tool nodes */}
                    {TOOLS.map((tool, i) => {
                        const pos = pt(tool.angle, R);
                        const isOn = highlighted === tool.id;

                        const labelLeft = pos.x < HUB.x - 80;
                        const labelRight = pos.x > HUB.x + 80;
                        const labelBelow = pos.y > HUB.y - 60;

                        let lx = pos.x,
                            ly = pos.y,
                            anchor = "middle";
                        if (labelLeft) {
                            lx = pos.x - NODE_R - 10;
                            anchor = "end";
                            ly = pos.y + 4;
                        } else if (labelRight) {
                            lx = pos.x + NODE_R + 10;
                            anchor = "start";
                            ly = pos.y + 4;
                        } else if (labelBelow) {
                            ly = pos.y + NODE_R + 18;
                        } else {
                            ly = pos.y - NODE_R - 10;
                        }

                        return (
                            <g
                                key={tool.id}
                                className="gd-node"
                                onMouseEnter={() => setActive(tool.id)}
                                onMouseLeave={() => setActive(null)}
                                style={{
                                    animation: `gd-float-${i} ${3.6 + i * 0.35}s ease-in-out infinite`,
                                    animationDelay: `${i * 0.28}s`,
                                    transformOrigin: `${pos.x}px ${pos.y}px`,
                                    transformBox: "fill-box",
                                }}
                            >
                                {isOn && (
                                    <circle
                                        cx={pos.x}
                                        cy={pos.y}
                                        r={NODE_R + 9}
                                        fill={isDark ? tool.darkBg : tool.bg}
                                        fillOpacity="0.5"
                                        stroke={tool.color}
                                        strokeWidth="1"
                                        strokeOpacity="0.35"
                                    />
                                )}
                                <circle
                                    cx={pos.x}
                                    cy={pos.y}
                                    r={NODE_R}
                                    fill={badgeBg(tool, isOn)}
                                    stroke={
                                        isOn
                                            ? tool.color
                                            : isDark
                                              ? "rgba(255,255,255,0.12)"
                                              : "rgba(0,0,0,0.1)"
                                    }
                                    strokeWidth={isOn ? "1.5" : "0.8"}
                                    filter="url(#gd-shadow)"
                                    style={{ transition: "all 0.25s ease" }}
                                />
                                <g transform={`translate(${pos.x}, ${pos.y})`}>
                                    {tool.icon}
                                </g>
                                <text
                                    x={lx}
                                    y={ly}
                                    textAnchor={anchor as any}
                                    fontSize="10.5"
                                    fontFamily="monospace"
                                    fontWeight="600"
                                    fill="currentColor"
                                    fillOpacity={isOn ? 0.85 : 0.38}
                                    letterSpacing="0.02em"
                                    style={{
                                        transition: "fill-opacity 0.2s ease",
                                    }}
                                >
                                    {tool.short}
                                </text>
                            </g>
                        );
                    })}
                </svg>

                {/* Logo overlay — centred over hub circle */}
                <div
                    className="absolute pointer-events-none"
                    style={{
                        left: "50%",
                        top: `${(HUB.y / 390) * 100}%`,
                        transform: "translate(-50%, -50%)",
                        width: HUB_R * 2,
                        height: HUB_R * 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Logo className="w-8 h-8 text-emerald-500" />
                </div>
            </div>

            {/* Copy */}
            <div className="text-center mt-4 space-y-2 max-w-sm">
                <h3
                    className="text-2xl md:text-3xl font-bold tracking-tight text-foreground"
                    style={{ fontFamily: "monospace" }}
                >
                    Deploy any stack
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                    GitDrop builds and deploys your projects — CRA, Vite, plain
                    HTML/CSS/JS, or anything that runs in a browser.
                </p>
            </div>
        </section>
    );
}
