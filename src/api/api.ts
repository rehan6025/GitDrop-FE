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

export interface User {
    id: string;
    githubId: string;
    username: string;
}

export interface Branch {
    name: string;
    sha: string;
}

export type ProjectStatus = "PENDING" | "BUILDING" | "SUCCESS" | "FAILED";

export interface Project {
    id: string;
    name: string;
    user_id: string;
    repoUrl: string;
    url: string;
    branch: string;
    type: "STATIC" | "REACT";
    status: ProjectStatus;
    createdAt: string;
    updatedAt: string;
}

export interface DeploymentData {
    name: string;
    repoUrl: string;
    branch: string;
    type: "STATIC" | "REACT";
    commitHash?: string;
    buildCommand?: string;
    url: string;
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
        // Let the SPA decide how to handle this (navigate to /login, show toast, etc.)
        window.dispatchEvent(new CustomEvent("gitdrop:unauthorized"));
        throw new Error("Unauthorized");
    }

    return response;
};

export const api = {
    auth: {
        loginWithGitHub: () => {
            window.location.href = `${API_BASE_URL}/auth/github`;
        },
        // checkAuth: async (): Promise<boolean> => {
        //     try {
        //         const response = await fetch(`${API_BASE_URL}/github/repos`, {
        //             credentials: "include",
        //         });
        //         return response.ok;
        //     } catch {
        //         return false;
        //     }
        // },
        // returns `true` if the current session is authenticated, otherwise `false`
        me: async (): Promise<boolean> => {
            try {
                const res = await fetch(`${API_BASE_URL}/auth/me`, {
                    credentials: "include",
                });
                return res.ok;
            } catch {
                return false;
            }
        },
        logout: async () => {
            await fetch(`${API_BASE_URL}/auth/logout`, {
                method: "POST",
                credentials: "include",
            });
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

    projects: {
        getAllProjects: async () => {
            const res = await fetchWithAuth(`${API_BASE_URL}/projects`);

            if (!res.ok) {
                throw new Error("Failed to get projects");
            }

            return res.json();
        },

        getProjectDeployments: async (projectId: number) => {
            const res = await fetchWithAuth(
                `${API_BASE_URL}/projects/${projectId}/deployments`,
            );

            if (!res.ok) {
                throw new Error("Failed to get deployments of project");
            }

            return res.json();
        },
    },
};
