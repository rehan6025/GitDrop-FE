import { api } from "@/api/api";
import {
    Navbar,
    NavBody,
    NavItems,
    NavbarButton,
} from "@/components/ui/resizable-navbar";
import { Link } from "react-router-dom";

const navItems = [
    { name: "Dashboard", link: "/" },
    { name: "Deploy", link: "/deploy" },
];

export default function AppNavbar() {
    return (
        <Navbar className="border-neutral-800 ">
            <NavBody className="max-w-7xl   mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Logo */}
                <div className="font-dogica text-lg">GitDrop</div>

                {/* Navigation */}
                <NavItems
                    items={navItems}
                    className="text-sm text-neutral-400 gap-8"
                />

                {/* Deploy Button */}
                <NavbarButton
                    as={Link}
                    className="bg-white text-black px-4 py-2 text-sm font-medium rounded-md"
                    onClick={() => {
                        api.auth.loginWithGitHub();
                    }}
                >
                    Login With Github
                </NavbarButton>
            </NavBody>
        </Navbar>
    );
}
