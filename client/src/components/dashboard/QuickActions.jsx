import {
    Card,
    CardContent,
    Typography,
    Grid,
    Button,
    Stack,
} from "@mui/material";

import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import ShareIcon from "@mui/icons-material/Share";

function QuickActions({

    onCreateFolder,
    onUploadFile,
    onUploadFolder,
    onSharedFiles,

}) {

    return (

        <Card
            elevation={0}
            sx={{
                borderRadius: 4,
                border: "1px solid #E5E7EB",
                height: "100%",
            }}
        >

            <CardContent>

                <Typography
                    variant="h6"
                    fontWeight={700}
                    mb={3}
                >
                    Quick Actions
                </Typography>

                <Grid
                    container
                    spacing={2}
                >

                    <Grid size={{ xs: 12, sm: 6 }}>

                        <Button
                            fullWidth
                            variant="contained"
                            startIcon={<CreateNewFolderIcon />}
                            onClick={onCreateFolder}
                            sx={{
                                borderRadius: 3,
                                py: 1.5,
                                textTransform: "none",
                                fontWeight: 600,
                            }}
                        >
                            New Folder
                        </Button>

                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>

                        <Button
                            fullWidth
                            variant="contained"
                            color="success"
                            startIcon={<UploadFileIcon />}
                            onClick={onUploadFile}
                            sx={{
                                borderRadius: 3,
                                py: 1.5,
                                textTransform: "none",
                                fontWeight: 600,
                            }}
                        >
                            Upload File
                        </Button>

                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>

                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<DriveFolderUploadIcon />}
                            onClick={onUploadFolder}
                            sx={{
                                borderRadius: 3,
                                py: 1.5,
                                textTransform: "none",
                                fontWeight: 600,
                            }}
                        >
                            Upload Folder
                        </Button>

                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>

                        <Button
                            fullWidth
                            variant="outlined"
                            color="secondary"
                            startIcon={<ShareIcon />}
                            onClick={onSharedFiles}
                            sx={{
                                borderRadius: 3,
                                py: 1.5,
                                textTransform: "none",
                                fontWeight: 600,
                            }}
                        >
                            Shared Files
                        </Button>

                    </Grid>

                </Grid>

            </CardContent>

        </Card>

    );

}

export default QuickActions;