import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Stack } from "@mui/material";

function PropertiesDialog({ open, title, properties, onClose }) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                {title}
            </DialogTitle>

            <DialogContent>

                <Stack spacing={2} mt={1}>

                    {properties.map((property, index) => (
                        <Typography key={index}>
                            <strong>{property.label}:</strong>{" "}
                            {property.value}
                        </Typography>
                    ))}
                </Stack>
            </DialogContent>

            <DialogActions>

                <Button
                    onClick={onClose}
                    variant="contained"
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
    
}

export default PropertiesDialog;