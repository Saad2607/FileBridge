import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Splash from "../pages/Splash/Splash";

import { ROUTES } from "../constants/routes";
import ProtectedRoute from "./ProtectedRoutes";

function AppRoutes() {
    return (
        <Routes>
            <Route path={ROUTES.SPLASH} element={<Splash />} />
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route
                path={ROUTES.DASHBOARD}
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default AppRoutes;