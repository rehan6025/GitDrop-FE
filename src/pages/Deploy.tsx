import { api, type Repository } from "@/api/api";
import { useEffect, useState } from "react";
import RepoCard from "@/components/RepoCard";
import { useNavigate, Link } from "react-router-dom";

const Deploy = () => {
    const [repos, setRepos] = useState<Repository[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await api.github.getRepositories();
                setRepos(data);
            } catch (error) {
                console.error("Error fetching repositories:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="text-white max-w-6xl mx-auto px-6 py-10">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-dogica tracking-wider">
                        Select Repository
                    </h1>
                    <p className="text-neutral-500 text-xs mt-1 font-dogica">
                        choose a github repo to deploy
                    </p>
                </div>

                <Link
                    to="/dashboard"
                    className="text-xs font-dogica text-neutral-500 hover:text-white transition-colors"
                >
                    ← back to dashboard
                </Link>
            </div>

            {/* Loading state */}
            {loading && (
                <div className="grid md:grid-cols-2 gap-3">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="h-20 rounded-lg border border-neutral-800 bg-neutral-950 animate-pulse"
                        />
                    ))}
                </div>
            )}

            {/* Empty state */}
            {!loading && repos.length === 0 && (
                <div className="border border-dashed border-neutral-800 rounded-lg p-12 text-center">
                    <p className="text-neutral-600 font-dogica text-xs">
                        no repositories found — connect your github account
                    </p>
                </div>
            )}

            {/* Repo grid */}
            {!loading && repos.length > 0 && (
                <div className="grid md:grid-cols-2 gap-3">
                    {repos.map((repo) => (
                        <RepoCard
                            key={repo.id}
                            repo={repo}
                            onSelect={() => navigate(`/deploy/${repo.name}`)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Deploy;
