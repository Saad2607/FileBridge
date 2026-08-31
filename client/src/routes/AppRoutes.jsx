import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Splash from "../pages/Splash/Splash";
import Favorites from "../pages/Favorites";

import { ROUTES } from "../constants/routes";
import ProtectedRoute from "./ProtectedRoutes";
import AppLayout from "../components/layout/AppLayout";
import RecycleBin from "../pages/RecycleBin";
import SharePage from "../pages/SharePage";
import SharedFiles from "../pages/SharedFiles";
import Statistics from "../pages/Statistics";
import Settings from "../pages/Settings/Settings";

function AppRoutes() {
    return (
        <Routes>
            <Route path={ROUTES.SPLASH} element={<Splash />} />
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.SHARE} element={<SharePage />} />

            <Route
                element={
                    <ProtectedRoute>
                        <AppLayout />
                    </ProtectedRoute>
                }
            >
                <Route
                    path={ROUTES.DASHBOARD}
                    element={<Dashboard />}
                />

                <Route
                    path={ROUTES.FAVORITES}
                    element={<Favorites />}
                />

                <Route
                    path={ROUTES.RECYCLE_BIN}
                    element={<RecycleBin />}
                />

                <Route
                    path={ROUTES.SHARED_FILES}
                    element={<SharedFiles />}
                />

                <Route
                    path={ROUTES.STATISTICS}
                    element={<Statistics />}
                />

                <Route
                    path={ROUTES.SETTINGS}
                    element={<Settings />}
                />
            </Route>
        </Routes>
    );
}

export default AppRoutes;