// src/pages/Home.tsx
import { useAuth } from "@/auth/auth";
import AppNavbar from "@/components/MainNavbar";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const { status } = useAuth();
    const navigate = useNavigate();

    const handleStart = () => {
        if (status === "authenticated") {
            navigate("/dashboard");
        } else {
            navigate("/auth/github");
        }
    };

    return (
        <div className="relative h-screen w-full bg-background">
            <AppNavbar />
            <div className="absolute inset-0 h-full w-full bg-[radial-gradient(#b6bcc8_1px,transparent_1px)] bg-size-[28px_28px] "></div>

            <div className="flex flex-col items-center justify-center h-full text-center gap-6 z-10">
                <h1 className="text-7xl md:text-9xl font-bold tracking-widest z-10 text-foreground">
                    GITDROP
                </h1>

                <p className="bg-transparent backdrop-blur-lg text-muted-foreground max-w-xl">
                    Deploy your GitHub projects instantly. Like Vercel — but
                    built by you.
                </p>

                <div className="flex gap-4">
                    <button
                        className="px-6 py-2 bg-primary text-primary-foreground backdrop-blur-md cursor-pointer rounded-md"
                        onClick={handleStart}
                    >
                        Start Deploying
                    </button>

                    <button className="px-6 py-2 border border-border cursor-pointer rounded-md z-10 backdrop-blur-md">
                        Learn More
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
