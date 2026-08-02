import { useState, useEffect } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    InputAdornment,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";

function ShareDialog({ open, link, onClose }) {

    const [copied, setCopied] = useState(false);
    const [expiry, setExpiry] = useState("never");

    useEffect(() => {

        if (!open) {
            setCopied(false);
        }
    }, [open]);

    const handleCopy = async () => {

        try {
            await navigator.clipboard.writeText(link);

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >

            <DialogTitle>
                Share File
            </DialogTitle>

            <DialogContent>
                <TextField
                    fullWidth
                    margin="normal"
                    value={link}
                    InputProps={{
                        readOnly: true,
                        endAdornment: (
                            <InputAdornment position="end">

                                <IconButton
                                    onClick={handleCopy}
                                >
                                    {copied ? <CheckIcon color="success" /> : <ContentCopyIcon />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <FormControl
                    fullWidth
                    margin="normal"
                >
                    <InputLabel>
                        Link Expiry
                    </InputLabel>

                    <Select
                        value={expiry}
                        labeel="Link Expiry"
                        onChange={(e) => setExpiry(e.target.value)}
                    >
                        <MenuItem value="never">
                            Never
                        </MenuItem>

                        <MenuItem value="1h">
                            1 Hour
                        </MenuItem>

                        <MenuItem value="24h">
                            24 Hours
                        </MenuItem>

                        <MenuItem value="7d">
                            7 Days
                        </MenuItem>

                        <MenuItem value="30d">
                            30 Days
                        </MenuItem>
                    </Select>
                </FormControl>
                
            </DialogContent>

            <DialogActions>

                <Button
                    onClick={onClose}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ShareDialog;