import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Deploy from "./pages/Deploy";
import Login from "./pages/Login";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* pages with navbar */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/deploy" element={<Deploy />} />
                </Route>

                {/* pages without navbar */}
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
