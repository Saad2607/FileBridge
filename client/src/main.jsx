import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import "@fontsource/inter";

import App from "./App";

import "./styles/global.css";

import AuthProvider from "./context/AuthContext";
import FolderProvider from "./context/FolderContext";
import UploadProvider from "./context/UploadContext";

import theme from "./theme/theme";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>

            <CssBaseline />

            <BrowserRouter>

                <AuthProvider>

                    <FolderProvider>

                        <UploadProvider>

                            <App />

                        </UploadProvider>

                    </FolderProvider>

                </AuthProvider>

            </BrowserRouter>

        </ThemeProvider>
    </React.StrictMode>
);