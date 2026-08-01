import { useEffect, useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
} from "@mui/material";

function RenameDialog({
    open,
    title,
    initialValue,
    onCancel,
    onConfirm,
}) {

    const [value, setValue] = useState("");

    useEffect(() => {
        setValue(initialValue || "");
    }, [initialValue, open]);

    const handleConfirm = () => {

        if (!value.trim()) return;

        onConfirm(value.trim());

    };

    return (
        <Dialog
            open={open}
            onClose={onCancel}
            maxWidth="xs"
            fullWidth
        >

            <DialogTitle>
                {title}
            </DialogTitle>

            <DialogContent>

                <TextField
                    autoFocus
                    fullWidth
                    margin="normal"
                    label="Name"
                    value={value}
                    onChange={(e) =>
                        setValue(e.target.value)
                    }
                />

            </DialogContent>

            <DialogActions>

                <Button onClick={onCancel}>
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleConfirm}
                >
                    Save
                </Button>

            </DialogActions>

        </Dialog>
    );
}

export default RenameDialog;