import Footer from "@/components/Footer";
import AppNavbar from "@/components/MainNavbar";
import { Outlet } from "react-router-dom";

function MainLayout() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <AppNavbar />
            <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 w-full">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default MainLayout;
