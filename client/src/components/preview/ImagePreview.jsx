import { Box } from "@mui/material";

function ImagePreview({ fileUrl }) {

    return (

        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
                width: "100%",
                minHeight: 500,
            }}
        >

            <img
                src={fileUrl}
                alt="Preview"
                style={{
                    maxWidth: "100%",
                    maxHeight: "500px",
                    borderRadius: 12,
                    objectFit: "contain",
                    boxShadow: "0 10px 30px rgba(0,0,0,.15)",
                }}
            />

        </Box>

    );

}

export default ImagePreview;