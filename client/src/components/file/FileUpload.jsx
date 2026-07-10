import Button from "@mui/material/Button";
import UploadFileIcon from "@mui/icons-material/UploadFile";

function FileUpload({ onSelect }) {

    const handleChange = (e) => {
        if (e.target.files.length > 0) {
            onSelect(e.target.files[0]);

            // Reset the input so selecting the same file again works
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
                    startIcon={<UploadFileIcon />}
                >
                    Upload File
                </Button>
            </label>
        </>
    );
}

export default FileUpload;