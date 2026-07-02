function FileUpload({ onSelect }) {
    return (
        <input
            type="file"
            onChange={(e) => {
                if (e.target.files.length > 0) {
                    onSelect(e.target.files[0]);
                }
            }}
        />
    );
}

export default FileUpload