import { Box } from "@mui/material";

function PdfPreview({ fileUrl }) {

    return (

        <Box
            sx={{
                height: "70vh",
            }}
        >

            <iframe
                src={fileUrl}
                title="PDF Preview"
                width="100%"
                height="100%"
                style={{
                    border: "none",
                    borderRadius: 12,
                }}
            />

        </Box>

    );

}

export default PdfPreview;