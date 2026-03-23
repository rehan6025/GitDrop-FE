import {
    Navbar,
    NavBody,
    NavItems,
    NavbarButton,
} from "@/components/ui/resizable-navbar";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/auth";
import { useTheme } from "@/theme/ThemeProvider";
import { IconDeviceDesktop, IconMoon, IconSun } from "@tabler/icons-react";
import Logo from "@/components/Logo";

const navItems = [
    { name: "Dashboard", link: "/dashboard" },
    { name: "Deploy", link: "/deploy" },
];

export default function AppNavbar() {
    const navigate = useNavigate();
    const { status, logout } = useAuth();
    const loggedIn = status === "authenticated";
    const { preference, cyclePreference } = useTheme();

    const ThemeIcon =
        preference === "dark"
            ? IconMoon
            : preference === "light"
              ? IconSun
              : IconDeviceDesktop;

    return (
        <Navbar className="border-border">
            <NavBody className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center selection:bg-gray-300 justify-between">
                <Link
                    to="/"
                    className="font-dogica text-lg text-foreground tracking-wider hover:text-foreground/80 transition-colors flex items-center gap-2"
                >
                    <Logo className="w-12 h-12 text-emerald-500" />
                    GitDrop
                </Link>
                {/* Logo */}

                {/* Navigation */}
                <NavItems
                    items={navItems}
                    className="text-muted-foreground gap-6"
                />

                {/* Login/Logout Button */}
                <div className="flex items-center gap-2">
                    <NavbarButton
                        variant="secondary"
                        onClick={cyclePreference}
                        className="flex select-none items-center gap-2"
                    >
                        <ThemeIcon size={16} />
                    </NavbarButton>

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
                </div>
            </NavBody>
        </Navbar>
    );
}
