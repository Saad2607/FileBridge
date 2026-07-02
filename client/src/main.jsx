import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.css";
import AuthProvider from "./context/AuthContext";
import { BrowserRouter } from "react-router-dom";
import FolderProvider from "./context/FolderContext";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <FolderProvider>
                    <App />
                </FolderProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);