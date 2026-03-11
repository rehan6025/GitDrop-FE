import {
    Navbar,
    NavBody,
    NavItems,
    NavbarButton,
} from "@/components/ui/resizable-navbar";
import { useNavigate } from "react-router-dom";
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
        <Navbar className="border-neutral-800 ">
            <NavBody className="max-w-7xl bg  mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Logo */}
                <div className="font-dogica text-lg">GitDrop</div>

                {/* Navigation */}
                <NavItems
                    items={navItems}
                    className="text-sm text-neutral-400 gap-8"
                />

                {/* Login Button */}
                {loggedIn ? (
                    <NavbarButton
                        onClick={async () => {
                            await logout();
                            navigate("/login");
                        }}
                    >
                        Logout
                    </NavbarButton>
                ) : (
                    <NavbarButton
                        className="bg-white text-black px-4 py-2 text-sm font-medium rounded-md"
                        onClick={() => {
                            navigate("/login");
                        }}
                    >
                        Login With Github
                    </NavbarButton>
                )}
            </NavBody>
        </Navbar>
    );
}
