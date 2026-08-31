import { Navigate } from "react-router-dom";
import { getToken } from "../utils/storage";
import { ROUTES } from "../constants/routes";

function ProtectedRoute({children}) {
    const token = getToken();

    if(!token) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    return children;
}

export default ProtectedRoute;