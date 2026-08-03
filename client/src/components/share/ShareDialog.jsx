import { useState, useEffect } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    InputAdornment,
    IconButton,
    Divider,
    Typography,
} from "@mui/material";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";

function ShareDialog({
    open,
    link,
    onClose,
    onGenerate,
    onDisable,
}) {

    const [expiry, setExpiry] = useState("never");

    const [password, setPassword] = useState("");

    const [copied, setCopied] = useState(false);

    useEffect(() => {

        if (!open) {

            setExpiry("never");
            setPassword("");
            setCopied(false);

        }

    }, [open]);

    const handleCopy = async () => {

        if (!link) return;

        await navigator.clipboard.writeText(link);

        setCopied(true);

        setTimeout(() => {

            setCopied(false);

        }, 2000);

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

                <Stack spacing={3} mt={1}>

                    <FormControl fullWidth>

                        <InputLabel>
                            Link Expiry
                        </InputLabel>

                        <Select
                            value={expiry}
                            label="Link Expiry"
                            onChange={(e) =>
                                setExpiry(e.target.value)
                            }
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

                    <TextField
                        label="Password (Optional)"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        fullWidth
                    />

                    <Button
                        variant="contained"
                        onClick={() =>
                            onGenerate(expiry, password)
                        }
                    >
                        Generate Share Link
                    </Button>

                    <Divider />

                    <Typography variant="subtitle2">
                        Generated Link
                    </Typography>

                    <TextField
                        fullWidth
                        value={link}
                        InputProps={{
                            readOnly: true,
                            endAdornment: (
                                <InputAdornment position="end">

                                    <IconButton
                                        onClick={handleCopy}
                                    >

                                        {
                                            copied
                                                ? <CheckIcon color="success" />
                                                : <ContentCopyIcon />
                                        }

                                    </IconButton>

                                </InputAdornment>
                            ),
                        }}
                    />

                </Stack>

            </DialogContent>

            <DialogActions>

                <Button
                    color="error"
                    disabled={!link}
                    onClick={onDisable}
                >
                    Disable Sharing
                </Button>

                <Button onClick={onClose}>
                    Close
                </Button>

            </DialogActions>

        </Dialog>

    );

}

export default ShareDialog;