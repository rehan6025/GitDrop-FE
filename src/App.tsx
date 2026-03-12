import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Deploy from "./pages/Deploy";
import DeployConfig from "./pages/DeployConfig";
import Login from "./pages/Login";
import Home from "./pages/Home";
import RequireAuth from "./components/RequireAuth";
import { AuthProvider } from "./auth/auth";
import { useEffect } from "react";
import Deployment from "./pages/Deployment";

function UnauthorizedListener() {
    const navigate = useNavigate();

    useEffect(() => {
        const onUnauthorized = () => {
            navigate("/login", { replace: true });
        };

        window.addEventListener("gitdrop:unauthorized", onUnauthorized);
        return () =>
            window.removeEventListener("gitdrop:unauthorized", onUnauthorized);
    }, [navigate]);

    return null;
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <UnauthorizedListener />
                <Routes>
                    {/* pages with navbar (public + authed) */}
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<Home />} />
                        <Route
                            path="dashboard"
                            element={
                                <RequireAuth>
                                    <Dashboard />
                                </RequireAuth>
                            }
                        />
                        <Route
                            path="deploy"
                            element={
                                <RequireAuth>
                                    <Deploy />
                                </RequireAuth>
                            }
                        />
                        <Route
                            path="deploy/:repoName"
                            element={
                                <RequireAuth>
                                    <DeployConfig />
                                </RequireAuth>
                            }
                        />
                        <Route
                            path="deployments/:deploymentId"
                            element={
                                <RequireAuth>
                                    <Deployment />
                                </RequireAuth>
                            }
                        />
                    </Route>

                    {/* authentication page */}
                    <Route path="/login" element={<Login />} />

                    {/* route to catch other routes which dont exist */}
                    <Route path="*" element={<div>404 - Page Not Found</div>} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
