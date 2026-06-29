import CloudIcon from "@mui/icons-material/Cloud";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function Navbar() {
    const { user } = useContext(AuthContext);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "15px 25px",
                borderBottom: "1px solid #ddd",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                }}
            >
                <CloudIcon />
                <h2>FileBridge</h2>
            </div>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                }}
            >
                <AccountCircleIcon />
                <span>{user?.username}</span>
            </div>
        </div>
    );
}

export default Navbar;