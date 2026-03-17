import AppNavbar from "@/components/MainNavbar";
import { Outlet } from "react-router-dom";

function MainLayout() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <AppNavbar />
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                <Outlet />
            </main>
        </div>
    );
}

export default MainLayout;
