import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#4F46E5", // Modern Electric Indigo
            light: "#6366F1",
            dark: "#4338CA",
            contrastText: "#FFFFFF",
        },
        secondary: {
            main: "#0284C7", // Sky Blue
            light: "#38BDF8",
            dark: "#0369A1",
            contrastText: "#FFFFFF",
        },
        success: {
            main: "#10B981", // Emerald
            light: "#34D399",
            dark: "#059669",
        },
        warning: {
            main: "#F59E0B", // Amber
            light: "#FBBF24",
            dark: "#D97706",
        },
        error: {
            main: "#EF4444", // Rose Red
            light: "#F87171",
            dark: "#DC2626",
        },
        info: {
            main: "#6366F1",
            light: "#818CF8",
            dark: "#4F46E5",
        },
        text: {
            primary: "#0F172A",
            secondary: "#64748B",
            disabled: "#94A3B8",
        },
        background: {
            default: "#F8FAFC",
            paper: "#FFFFFF",
        },
        divider: "#E2E8F0",
    },

    shape: {
        borderRadius: 14,
    },

    typography: {
        fontFamily: [
            "Inter",
            "-apple-system",
            "BlinkMacSystemFont",
            "Segoe UI",
            "Roboto",
            "sans-serif",
        ].join(","),
        h1: { fontWeight: 800, letterSpacing: "-0.03em" },
        h2: { fontWeight: 800, letterSpacing: "-0.025em" },
        h3: { fontWeight: 700, letterSpacing: "-0.02em" },
        h4: { fontWeight: 700, letterSpacing: "-0.015em" },
        h5: { fontWeight: 700, letterSpacing: "-0.01em" },
        h6: { fontWeight: 700, letterSpacing: "-0.01em" },
        subtitle1: { fontWeight: 600, fontSize: "1rem" },
        subtitle2: { fontWeight: 600, fontSize: "0.875rem" },
        body1: { fontSize: "0.9375rem", lineHeight: 1.6 },
        body2: { fontSize: "0.875rem", lineHeight: 1.5 },
        button: {
            textTransform: "none",
            fontWeight: 600,
            letterSpacing: "0.01em",
        },
    },

    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    border: "1px solid #E2E8F0",
                    backgroundColor: "#FFFFFF",
                    boxShadow: "0 1px 3px rgba(15, 23, 42, 0.03), 0 4px 12px rgba(15, 23, 42, 0.02)",
                    transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                    "&:hover": {
                        borderColor: "#CBD5E1",
                        boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.06), 0 8px 10px -6px rgba(15, 23, 42, 0.03)",
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    padding: "8px 16px",
                    fontWeight: 600,
                    boxShadow: "none",
                    transition: "all 0.15s ease",
                    "&:hover": {
                        boxShadow: "0 4px 12px rgba(79, 70, 229, 0.2)",
                        transform: "translateY(-1px)",
                    },
                },
                containedPrimary: {
                    background: "linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)",
                },
                containedSecondary: {
                    background: "linear-gradient(135deg, #0284C7 0%, #0369A1 100%)",
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        borderRadius: 10,
                        backgroundColor: "#F8FAFC",
                        transition: "all 0.15s ease",
                        "& fieldset": {
                            borderColor: "#E2E8F0",
                        },
                        "&:hover fieldset": {
                            borderColor: "#94A3B8",
                        },
                        "&.Mui-focused": {
                            backgroundColor: "#FFFFFF",
                            "& fieldset": {
                                borderColor: "#4F46E5",
                                borderWidth: 1.5,
                            },
                        },
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 6,
                    fontWeight: 600,
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 18,
                    boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
                    border: "1px solid #E2E8F0",
                },
            },
        },
        MuiMenu: {
            styleOverrides: {
                paper: {
                    borderRadius: 12,
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.05)",
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: "#0F172A",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    borderRadius: 6,
                    padding: "5px 10px",
                },
            },
        },
    },
});

export default theme;