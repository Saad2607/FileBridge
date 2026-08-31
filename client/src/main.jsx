import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import "@fontsource/inter";

import { Toaster } from "react-hot-toast";

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

                            <Toaster
                                position="top-right"
                                toastOptions={{
                                    duration: 3500,
                                    style: {
                                        fontFamily: "'Inter', sans-serif",
                                        borderRadius: "12px",
                                        background: "#1E293B",
                                        color: "#fff",
                                        fontSize: "14px",
                                        fontWeight: 500,
                                        boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                                    },
                                    success: {
                                        iconTheme: {
                                            primary: "#10B981",
                                            secondary: "#fff",
                                        },
                                    },
                                    error: {
                                        iconTheme: {
                                            primary: "#EF4444",
                                            secondary: "#fff",
                                        },
                                    },
                                }}
                            />

                        </UploadProvider>

                    </FolderProvider>

                </AuthProvider>

            </BrowserRouter>

        </ThemeProvider>
    </React.StrictMode>
);