import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import {
    IconBrandGithub,
    IconBrandLinkedin,
    IconBrandTwitter,
} from "@tabler/icons-react";

const footerLinks = [
    { name: "Home", link: "/" },
    { name: "Features", link: "#features" },
    { name: "Dashboard", link: "/dashboard" },
    { name: "Deploy", link: "/deploy" },
    // { name: "Docs", link: "/docs" },
];

export default function Footer() {
    return (
        <footer className="border-t border-border bg-background/95 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <Link
                            to="/"
                            className="font-dogica text-lg text-foreground tracking-wider hover:text-foreground/80 transition-colors flex items-center gap-2"
                        >
                            <Logo className="w-10 h-10 text-emerald-500" />
                            GitDrop
                        </Link>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            Deploy your GitHub projects instantly. From
                            repository to production in seconds.
                        </p>
                    </div>

                    {/* Links Section */}
                    <div>
                        <h3 className="font-dogica text-sm uppercase tracking-wider text-foreground mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            {footerLinks.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        to={item.link}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social Links Section - TODO: Fill in your social links */}
                    <div>
                        <h3 className="font-dogica text-sm uppercase tracking-wider text-foreground mb-4">
                            Connect
                        </h3>
                        <div className="flex items-center gap-4 text-muted-foreground">
                            {/* TODO: Add your social links here */}

                            <a
                                href="https://github.com/rehan6025"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-foreground transition-colors"
                            >
                                <IconBrandGithub size={20} />
                            </a>
                            <a
                                href="https://x.com/rehan6025"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-foreground transition-colors"
                            >
                                <IconBrandTwitter size={20} />
                            </a>
                            <a
                                href="https://linkedin.com/in/rehan6025"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-foreground transition-colors"
                            >
                                <IconBrandLinkedin size={20} />
                            </a>
                        </div>
                        <div className=" mt-2 text-muted-foreground">
                            <a
                                href="https://rehan-ahmed.netlify.app"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-foreground transition-colors"
                            >
                                Portfolio
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-muted-foreground">
                        &copy; {new Date().getFullYear()} GitDrop. All rights
                        reserved.
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <Link
                            to="/privacy"
                            className="hover:text-foreground transition-colors"
                        >
                            Privacy
                        </Link>
                        <Link
                            to="/terms"
                            className="hover:text-foreground transition-colors"
                        >
                            Terms
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
