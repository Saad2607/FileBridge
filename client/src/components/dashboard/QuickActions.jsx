import {
    Card,
    CardContent,
    Typography,
    Grid,
    Button,
} from "@mui/material";

import CreateNewFolderRoundedIcon from "@mui/icons-material/CreateNewFolderRounded";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import DriveFolderUploadRoundedIcon from "@mui/icons-material/DriveFolderUploadRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";

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
                borderRadius: "14px",
                border: "1px solid #E2E8F0",
                height: "100%",
            }}
        >
            <CardContent sx={{ p: 2.5 }}>
                <Typography
                    variant="subtitle1"
                    fontWeight={800}
                    color="#0F172A"
                    mb={2}
                >
                    Quick Actions
                </Typography>

                <Grid container spacing={1.5}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            startIcon={<CreateNewFolderRoundedIcon />}
                            onClick={onCreateFolder}
                            sx={{
                                borderRadius: "8px",
                                py: 1.25,
                                fontWeight: 700,
                                fontSize: "0.85rem",
                            }}
                        >
                            New Folder
                        </Button>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="secondary"
                            startIcon={<UploadFileRoundedIcon />}
                            onClick={onUploadFile}
                            sx={{
                                borderRadius: "8px",
                                py: 1.25,
                                fontWeight: 700,
                                fontSize: "0.85rem",
                            }}
                        >
                            Upload File
                        </Button>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<DriveFolderUploadRoundedIcon />}
                            onClick={onUploadFolder}
                            sx={{
                                borderRadius: "8px",
                                py: 1.25,
                                fontWeight: 600,
                                fontSize: "0.85rem",
                                color: "#334155",
                            }}
                        >
                            Upload Folder
                        </Button>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<ShareRoundedIcon />}
                            onClick={onSharedFiles}
                            sx={{
                                borderRadius: "8px",
                                py: 1.25,
                                fontWeight: 600,
                                fontSize: "0.85rem",
                                color: "#334155",
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