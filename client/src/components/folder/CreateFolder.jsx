import { useState } from "react";

import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from "@mui/material";

import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";

function CreateFolder({ onCreate }) {

    const [open, setOpen] = useState(false);
    const [folderName, setFolderName] = useState("");

    const handleCreate = () => {

        if (!folderName.trim()) return;

        onCreate(folderName);

        setFolderName("");
        setOpen(false);
    };

    const handleClose = () => {

        setFolderName("");
        setOpen(false);

    };

    return (
        <>

            <Button
                variant="contained"
                startIcon={<CreateNewFolderIcon />}
                onClick={() => setOpen(true)}
            >
                New Folder
            </Button>

            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="xs"
            >

                <DialogTitle>
                    Create New Folder
                </DialogTitle>

                <DialogContent>

                    <TextField
                        autoFocus
                        margin="dense"
                        label="Folder Name"
                        fullWidth
                        variant="outlined"
                        value={folderName}
                        onChange={(e) =>
                            setFolderName(e.target.value)
                        }
                        onKeyDown={(e) => {

                            if (e.key === "Enter") {

                                handleCreate();

                            }

                        }}
                    />

                </DialogContent>

                <DialogActions>

                    <Button
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleCreate}
                    >
                        Create
                    </Button>

                </DialogActions>

            </Dialog>

        </>
    );
}

export default CreateFolder;