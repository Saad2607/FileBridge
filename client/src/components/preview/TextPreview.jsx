import { useEffect, useState } from "react";

import {
    Box,
    CircularProgress,
    Typography,
} from "@mui/material";

function TextPreview({ fileUrl }) {

    const [content, setContent] = useState("");

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const load = async () => {

            try {

                const response = await fetch(fileUrl);

                const text = await response.text();

                setContent(text);

            }

            catch {

                setContent("Unable to load preview.");

            }

            finally {

                setLoading(false);

            }

        };

        load();

    }, [fileUrl]);

    if (loading) {

        return (

            <Box
                py={10}
                textAlign="center"
            >

                <CircularProgress />

            </Box>

        );

    }

    return (

        <Box
            sx={{
                bgcolor: "#fff",
                p: 3,
                borderRadius: 3,
                maxHeight: "70vh",
                overflow: "auto",
                whiteSpace: "pre-wrap",
                fontFamily: "monospace",
            }}
        >

            <Typography>

                {content}

            </Typography>

        </Box>

    );

}

export default TextPreview;