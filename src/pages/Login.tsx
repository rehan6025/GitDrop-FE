import { api } from "@/api/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/auth";

const Login = () => {
    const navigate = useNavigate();
    const [checking, setChecking] = useState(true);
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
        // the redirect goes to the backend -> GitHub -> callback; we don't
        // navigate locally because the page will unload anyway. when the
        // user returns (or if they were already logged in) the useEffect
        // above will send them to the dashboard.
        api.auth.loginWithGitHub();
    };

    if (checking) return null;

    return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-6">
            <div className="w-full max-w-sm">
                {/* Terminal window */}
                <div className="border border-neutral-800 rounded-xl overflow-hidden shadow-2xl shadow-black/60">
                    {/* Title bar */}
                    <div className="flex items-center gap-2 px-4 py-3 bg-neutral-900 border-b border-neutral-800">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/90" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/90" />
                            <div className="w-3 h-3 rounded-full bg-green-500/90" />
                        </div>
                        <span className="mx-auto text-[11px] font-dogica text-neutral-500 tracking-widest">
                            GITDROP-AUTH
                        </span>
                    </div>

                    {/* Body */}
                    <div className="p-8 bg-neutral-950">
                        <p className="font-dogica text-xs text-emerald-400 mb-1">
                            $ welcome to
                        </p>
                        <h1 className="font-dogica text-2xl text-white tracking-wider mb-1">
                            gitdrop
                        </h1>
                        <p className="text-neutral-600 text-xs font-mono mb-8">
                            deploy your projects in seconds
                        </p>

                        <button
                            onClick={handleLogin}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-neutral-700 text-white text-sm font-dogica hover:border-emerald-500 hover:text-emerald-400 transition-all duration-200 rounded-lg group"
                        >
                            {/* GitHub icon */}
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="shrink-0"
                            >
                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3    -1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                            </svg>
                            Continue with GitHub
                        </button>

                        <p className="text-center text-neutral-700 text-[10px] font-mono mt-6">
                            by continuing you agree to our terms
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
