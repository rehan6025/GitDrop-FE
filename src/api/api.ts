const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface Repository {
    id: number;
    name: string;
    full_name: string;
    html_url: string;
    description: string | null;
    private: boolean;
    default_branch: string;
    owner: {
        login: string;
        avatar_url: string;
    };
}

export interface Branch {
    name: string;
    sha: string;
}

export interface DeploymentData {
    name: string;
    repoUrl: string;
    branch: string;
    type: "STATIC" | "REACT";
    commitHash?: string;
    buildCommand?: string;
}

export interface DeploymentResponse {
    deploymentId: number;
    status: string;
}

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const response = await fetch(url, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    if (response.status === 401) {
        window.location.href = "/";
        throw new Error("Unauthorized");
    }

    return response;
};

export const api = {
    auth: {
        loginWithGitHub: () => {
            window.location.href = `${API_BASE_URL}/auth/github`;
        },
        checkAuth: async (): Promise<boolean> => {
            try {
                const response = await fetch(`${API_BASE_URL}/github/repos`, {
                    credentials: "include",
                });
                return response.ok;
            } catch {
                return false;
            }
        },
    },

    github: {
        getRepositories: async (): Promise<Repository[]> => {
            const response = await fetchWithAuth(
                `${API_BASE_URL}/github/repos`,
            );
            if (!response.ok) {
                throw new Error("Failed to fetch repositories");
            }
            return response.json();
        },

        getBranches: async (owner: string, repo: string): Promise<Branch[]> => {
            const response = await fetchWithAuth(
                `${API_BASE_URL}/github/repos/${owner}/${repo}/branches`,
            );
            if (!response.ok) {
                throw new Error("Failed to fetch branches");
            }
            return response.json();
        },
    },

    deployments: {
        create: async (data: DeploymentData): Promise<DeploymentResponse> => {
            const response = await fetchWithAuth(`${API_BASE_URL}/deployment`, {
                method: "POST",
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error("Failed to create deployment");
            }
            return response.json();
        },
    },
};
