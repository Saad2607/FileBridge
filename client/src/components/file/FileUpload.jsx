import Button from "@mui/material/Button";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";

function FileUpload({ onSelect }) {
    const handleChange = (e) => {
        if (e.target.files.length > 0) {
            onSelect(e.target.files[0]);
            e.target.value = "";
        }
    };

    return (
        <>
            <input
                id="file-upload"
                type="file"
                hidden
                onChange={handleChange}
            />

            <label htmlFor="file-upload">
                <Button
                    variant="contained"
                    component="span"
                    startIcon={<UploadFileRoundedIcon />}
                    sx={{
                        borderRadius: "10px",
                        fontWeight: 700,
                        px: 2.25,
                        py: 0.85,
                        background: "linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)",
                        boxShadow: "0 4px 12px rgba(79, 70, 229, 0.25)",
                    }}
                >
                    Upload File
                </Button>
            </label>
        </>
    );
}

export default FileUpload;