import { useState } from "react";
import axios from "axios";
import "./App.css";

type branch = {
    name: string;
    sha: string;
};

function App() {
    const [data, setData] = useState<branch[]>([]);
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState<branch>();
    // const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check login status by calling backend
    // useEffect(() => {
    //     axios
    //         .get("http://localhost:3000/auth/me", {
    //             withCredentials: true,
    //         })
    //         .then(() => setIsAuthenticated(true))
    //         .catch(() => setIsAuthenticated(false));
    // }, []);

    const getRepos = async () => {
        const res = await axios.get("http://localhost:3000/github/repos", {
            withCredentials: true,
        });

        setData(res.data);
        console.log(res.data);
    };

    const getBranch = async (repo: any) => {
        const res = await axios.get(
            `http://localhost:3000/github/repos/${repo.owner.login}/${repo.name}/branches`,
            {
                withCredentials: true,
            }
        );
        setBranches(res.data);
    };

    return (
        <div className="bg-zinc-700 w-full h-full">
            <button
                className="p-4 border-zinc-200 border-2 bg-zinc-400 rounded-2xl m-2 cursor-pointer"
                onClick={() => {
                    window.location.href = "http://localhost:3000/auth/github";
                }}
            >
                Login with GitHub
            </button>

            <button
                className="p-4 border-zinc-200 border-2 bg-zinc-400 rounded-2xl m-2 cursor-pointer"
                onClick={getRepos}
            >
                Get Repos
            </button>

            {data.map((repo: any) => (
                <div key={repo.id} className="flex items-center bg-green-900">
                    <h3 className="text-white">{repo.name}</h3>

                    <a
                        href={repo.html_url}
                        className="text-cyan-600"
                        target="_blank"
                        rel="noreferrer"
                    >
                        View Repo
                    </a>
                    <button
                        onClick={() => getBranch(repo)}
                        className="block cursor-pointer"
                    >
                        select
                    </button>
                </div>
            ))}

            <select
                id="branch"
                onChange={(e) => {
                    setSelectedBranch(JSON.parse(e.target.value));
                }}
            >
                {branches &&
                    branches.map((b: branch) => (
                        <option value={JSON.stringify(b)}>{b.name}</option>
                    ))}
            </select>
        </div>
    );
}

export default App;
