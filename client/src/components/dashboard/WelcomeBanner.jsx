import {
    Paper,
    Typography,
    Box,
} from "@mui/material";

import WavingHandIcon from "@mui/icons-material/WavingHand";

import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function WelcomeBanner() {

    const { user } = useContext(AuthContext);

    return (

        <Paper
            elevation={0}
            sx={{
                mb: 4,
                p: 4,
                borderRadius: 4,
                background:
                    "linear-gradient(135deg,#1976d2,#42a5f5)",
                color: "#fff",
            }}
        >

            <Box
                display="flex"
                alignItems="center"
                gap={1}
            >

                <WavingHandIcon />

                <Typography
                    variant="h4"
                    fontWeight={700}
                >
                    Welcome back,
                    {" "}
                    {user?.username}
                </Typography>

            </Box>

            <Typography
                sx={{
                    mt: 1,
                    opacity: .9,
                }}
            >
                Manage your files, folders and shared documents
                from one secure workspace.
            </Typography>

        </Paper>

    );

}

export default WelcomeBanner;