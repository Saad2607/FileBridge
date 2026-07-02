import { useContext, useState } from "react";
import { login } from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";
import { saveToken, saveUser } from "../../utils/storage";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const { setToken, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const data = await login(username, password);

            saveToken(data.token);
            saveUser(data.user);

            setToken(data.token);
            setUser(data.user);

            navigate(ROUTES.DASHBOARD);

            console.log("Login Successful:", data);

            // We'll add navigation to the dashboard in the next step.
        } catch (error) {
            console.error(
                error.response?.data?.message || "Login failed."
            );
        }
    };

    return (
        <div>
            <h1>FileBridge</h1>

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <br />
            <br />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <br />
            <br />

            <button
                onClick={handleLogin}
                disabled={!username || !password}
            >
                Login
            </button>
        </div>
    );
}

export default Login;