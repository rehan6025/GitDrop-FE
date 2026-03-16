import { api } from "@/api/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/auth";

const Login = () => {
    const navigate = useNavigate();
    const [checking, setChecking] = useState(true);
    const [hovered, setHovered] = useState(false);
    const { status, refresh } = useAuth();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const isAuth = await refresh();
                if (isAuth) navigate("/dashboard", { replace: true });
            } finally {
                setChecking(false);
            }
        };
        checkAuth();
    }, [navigate, refresh]);

    useEffect(() => {
        if (status === "authenticated") {
            navigate("/dashboard", { replace: true });
        }
    }, [status, navigate]);

    const handleLogin = () => {
        api.auth.loginWithGitHub();
    };

    if (checking) return null;

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
            <div className="w-full max-w-md">
                {/* Terminal window */}
                <div className="border border-border rounded-xl overflow-hidden shadow-2xl shadow-black/10 dark:shadow-black/40">
                    {/* Title bar */}
                    <div className="flex items-center gap-2 px-5 py-3.5 bg-muted border-b border-border">
                        <div className="flex gap-2">
                            <div className="w-3.5 h-3.5 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors" />
                            <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors" />
                            <div className="w-3.5 h-3.5 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors" />
                        </div>
                        <span className="mx-auto text-[11px] font-dogica text-muted-foreground tracking-widest uppercase">
                            gitdrop-auth
                        </span>
                    </div>

                    {/* Body */}
                    <div className="px-10 py-12 bg-card">
                        {/* Welcome prompt */}
                        <div className="mb-10">
                            <p className="font-dogica text-xs text-emerald-500 mb-3">
                                $ welcome
                            </p>
                            <h1 className="font-dogica text-3xl tracking-wider text-foreground mb-3">
                                gitdrop
                            </h1>
                            <div className="flex items-center gap-3">
                                <div className="h-px flex-1 bg-border" />
                                <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">
                                    deploy in seconds
                                </span>
                                <div className="h-px flex-1 bg-border" />
                            </div>
                        </div>

                        {/* Features list */}
                        <div className="space-y-3 mb-10 text-sm font-mono text-muted-foreground">
                            <div className="flex items-center gap-3">
                                <span className="text-emerald-500">→</span>
                                <span>deploy react & static sites</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-emerald-500">→</span>
                                <span>real-time build logs</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-emerald-500">→</span>
                                <span>instant preview urls</span>
                            </div>
                        </div>

                        {/* GitHub button */}
                        <button
                            onClick={handleLogin}
                            onMouseEnter={() => setHovered(true)}
                            onMouseLeave={() => setHovered(false)}
                            className="w-full group relative flex items-center justify-center gap-3 px-5 py-4 border border-border bg-background hover:bg-foreground hover:text-background text-foreground text-sm font-dogica transition-all duration-300 rounded-lg overflow-hidden"
                        >
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="shrink-0"
                            >
                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3    -1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                            </svg>
                            <span className="relative z-10 tracking-wider">
                                Continue with GitHub
                            </span>
                        </button>

                        {/* Terms */}
                        <p className="text-center text-muted-foreground text-xs font-mono mt-6">
                            by continuing you agree to our terms
                        </p>
                    </div>

                    {/* Status bar */}
                    <div className="h-8 bg-muted/50 border-t border-border flex items-center justify-between px-4">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[11px] font-mono text-muted-foreground">
                                ready to deploy
                            </span>
                        </div>
                        <span className="text-[11px] font-mono text-muted-foreground">
                            {hovered
                                ? "click to authenticate"
                                : "awaiting input"}
                        </span>
                    </div>
                </div>

                {/* Version/branding */}
                <p className="text-center text-muted-foreground/50 text-xs font-dogica mt-6 tracking-wider">
                    v1.0.0
                </p>
            </div>
        </div>
    );
};

export default Login;
