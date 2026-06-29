import { getToken } from "../../utils/storage";
import { ROUTES } from "../../constants/routes";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Splash() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (getToken()) {
                navigate(ROUTES.DASHBOARD);
            } else {
                navigate(ROUTES.LOGIN);
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div>
            <h1>FileBridge</h1>
            <p>Loading...</p>
        </div>
    );
}

export default Splash;