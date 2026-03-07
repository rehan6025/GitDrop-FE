const Navbar = () => {
    return (
        <header
            style={{
                background: "#ffffff",
                borderBottom: "1.5px solid #000000",
                fontFamily: "'Dogica', monospace",
                width: "100%",
                height: "64px",
                position: "relative",
                zIndex: 50,
                overflow: "visible",
            }}
        >
            <div
                style={{
                    maxWidth: "80rem",
                    margin: "0 auto",
                    padding: "0 2.5rem",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                {/* Left: brand + divider + pill nav */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1.5rem",
                    }}
                >
                    {/* Brand */}
                    <a
                        href="/"
                        style={{
                            fontFamily: "'Dogica', monospace",
                            fontWeight: 700,
                            fontSize: "11px",
                            letterSpacing: "0.1em",
                            color: "#000000",
                            textDecoration: "none",
                            textTransform: "uppercase",
                            whiteSpace: "nowrap",
                            lineHeight: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: "0.45rem",
                        }}
                    >
                        <span
                            style={{
                                display: "inline-block",
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                background: "#000",
                                flexShrink: 0,
                            }}
                        />
                        GIT-Drop
                    </a>

                    {/* Divider */}
                    <div
                        style={{
                            width: "1px",
                            height: "20px",
                            background: "#ccc",
                            flexShrink: 0,
                        }}
                    />
                </div>

                {/* Right: status badge */}
                <div
                    className="hidden md:flex"
                    style={{
                        alignItems: "center",
                        gap: "6px",
                        fontFamily: "'Dogica', monospace",
                        fontSize: "8px",
                        fontWeight: 700,
                        letterSpacing: "0.13em",
                        color: "#888",
                        textTransform: "uppercase",
                    }}
                >
                    <span
                        style={{
                            display: "inline-block",
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: "#22c55e",
                            boxShadow: "0 0 0 2px rgba(34,197,94,0.25)",
                            flexShrink: 0,
                        }}
                    />
                    All systems operational
                </div>
            </div>
        </header>
    );
};

export default Navbar;
