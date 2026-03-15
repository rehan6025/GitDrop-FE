import {
    Navbar,
    NavBody,
    NavItems,
    NavbarButton,
} from "@/components/ui/resizable-navbar";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/auth";

const navItems = [
    { name: "Dashboard", link: "/dashboard" },
    { name: "Deploy", link: "/deploy" },
];

export default function AppNavbar() {
    const navigate = useNavigate();
    const { status, logout } = useAuth();
    const loggedIn = status === "authenticated";

    return (
        <Navbar className="border-neutral-800">
            <NavBody className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/dashboard" className="font-dogica text-lg text-white tracking-wider hover:text-neutral-300 transition-colors">
                    GitDrop
                </Link>

                {/* Navigation */}
                <NavItems
                    items={navItems}
                    className="text-neutral-400 gap-6"
                />

                {/* Login/Logout Button */}
                {loggedIn ? (
                    <NavbarButton
                        variant="secondary"
                        onClick={async () => {
                            await logout();
                            navigate("/login");
                        }}
                    >
                        Logout
                    </NavbarButton>
                ) : (
                    <NavbarButton
                        variant="primary"
                        onClick={() => {
                            navigate("/login");
                        }}
                    >
                        Login
                    </NavbarButton>
                )}
            </NavBody>
        </Navbar>
    );
}
