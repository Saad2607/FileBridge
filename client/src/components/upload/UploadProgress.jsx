import {
    Paper,
    Typography,
    LinearProgress,
    Box,
    Fade,
} from "@mui/material";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";

function UploadProgress({

    uploading,

    progress,

    currentFile,

}) {

    return (

        <Fade
            in={uploading}
            timeout={300}
        >

            <Paper
                elevation={8}
                sx={{

                    position: "fixed",

                    bottom: 24,

                    right: 24,

                    width: 360,

                    p: 3,

                    borderRadius: 3,

                    zIndex: 2000,

                }}
            >

                <Box

                    display="flex"

                    alignItems="center"

                    gap={2}

                >

                    <CloudUploadIcon
                        color="primary"
                        sx={{
                            fontSize: 40,
                        }}
                    />

                    <Box flex={1}>

                        <Typography
                            fontWeight="bold"
                        >
                            Uploading...
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                        >
                            {currentFile}
                        </Typography>

                    </Box>

                </Box>

                <LinearProgress

                    variant="determinate"

                    value={progress}

                    sx={{

                        mt: 3,

                        height: 10,

                        borderRadius: 10,

                    }}

                />

                <Box

                    mt={1}

                    display="flex"

                    justifyContent="space-between"

                >

                    <Typography
                        variant="caption"
                    >
                        Uploading to FileBridge
                    </Typography>

                    <Typography
                        fontWeight={600}
                    >
                        {progress}%
                    </Typography>

                </Box>

            </Paper>

        </Fade>

    );

}

export default UploadProgress;