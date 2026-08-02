import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Splash from "../pages/Splash/Splash";
import Favorites from "../pages/Favorites";

import { ROUTES } from "../constants/routes";
import ProtectedRoute from "./ProtectedRoutes";
import AppLayout from "../components/layout/AppLayout";
import RecycleBin from "../pages/RecycleBin";

function AppRoutes() {
    return (
        <Routes>
            <Route path={ROUTES.SPLASH} element={<Splash />} />
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route element={<AppLayout />}>
                <Route
                    path={ROUTES.DASHBOARD}
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path={ROUTES.FAVORITES}
                    element={<Favorites />}
                />

                <Route
                    path={ROUTES.RECYCLE_BIN}
                    element={<RecycleBin />}
                />
            </Route>
        </Routes>
    );
}

export default AppRoutes;