import { api, type Repository } from "@/api/api";
import { useEffect, useState } from "react";
import RepoCard from "@/components/RepoCard";
import { useNavigate } from "react-router-dom";

const Deploy = () => {
    const [repos, setRepos] = useState<Repository[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await api.github.getRepositories();
                setRepos(data);
            } catch (error) {
                console.error("Error fetching repositories:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="max-w-6xl mx-auto px-6 py-10">
            <h1 className="text-3xl mb-8 font-dogica tracking-wider">Deploy</h1>

            <div className="grid md:grid-cols-2 gap-4 text-white">
                {repos.map((repo) => (
                    <RepoCard
                        key={repo.id}
                        repo={repo}
                        onSelect={() => navigate(`/deploy/${repo.name}`)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Deploy;
