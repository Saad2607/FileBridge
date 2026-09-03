import { useEffect, useState } from "react";
import {
    Box,
    CircularProgress,
    Typography,
} from "@mui/material";
import { getFileText } from "../../services/fileService";

function TextPreview({ fileUrl, fileId }) {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        const load = async () => {
            try {
                let text = "";
                if (fileId) {
                    text = await getFileText(fileId);
                } else if (fileUrl) {
                    const response = await fetch(fileUrl);
                    text = await response.text();
                }
                if (active) {
                    setContent(typeof text === "string" ? text : JSON.stringify(text, null, 2));
                }
            } catch {
                if (fileUrl) {
                    try {
                        const response = await fetch(fileUrl);
                        const text = await response.text();
                        if (active) {
                            setContent(typeof text === "string" ? text : JSON.stringify(text, null, 2));
                            return;
                        }
                    } catch {}
                }
                if (active) {
                    setContent("Unable to load preview.");
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        load();

        return () => {
            active = false;
        };
    }, [fileUrl, fileId]);

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