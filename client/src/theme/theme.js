import { createTheme } from "@mui/material/styles";

const theme = createTheme({

    palette: {

        primary: {
            main: "#1976d2",
        },

        secondary: {
            main: "#7B61FF",
        },

        background: {
            default: "#F7F9FC",
            paper: "#FFFFFF",
        },

    },

    shape: {
        borderRadius: 16,
    },

    typography: {

        fontFamily: [
            "Inter",
            "Roboto",
            "sans-serif",
        ].join(","),

        h3: {
            fontWeight: 700,
        },

        h4: {
            fontWeight: 700,
        },

        h5: {
            fontWeight: 700,
        },

        h6: {
            fontWeight: 700,
        },

        button: {
            textTransform: "none",
            fontWeight: 600,
        },

    },

    components: {

        MuiCard: {

            styleOverrides: {

                root: {

                    borderRadius: 16,

                    border: "1px solid #E5E7EB",

                    boxShadow: "none",

                    transition: ".25s",

                    "&:hover": {

                        boxShadow:
                            "0 12px 30px rgba(0,0,0,.10)",

                    },

                },

            },

        },

        MuiButton: {

            styleOverrides: {

                root: {

                    borderRadius: 12,

                    paddingLeft: 18,

                    paddingRight: 18,

                },

            },

        },

        MuiTextField: {

            styleOverrides: {

                root: {

                    "& .MuiOutlinedInput-root": {

                        borderRadius: 12,

                    },

                },

            },

        },

        MuiChip: {

            styleOverrides: {

                root: {

                    borderRadius: 8,

                },

            },

        },

    },

});

export default theme;