import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Deploy from "./pages/Deploy";
import DeployConfig from "./pages/DeployConfig";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* pages with navbar */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/deploy" element={<Deploy />} />

                    <Route
                        path="/deploy/:repoName"
                        element={<DeployConfig />}
                    />
                </Route>

                {/* route to catch other routes which dont exist */}
                <Route path="*" element={<div>404 - Page Not Found</div>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
