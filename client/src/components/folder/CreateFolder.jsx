import { useState } from "react";

function CreateFolder({ onCreate }) {
    const [folderName, setFolderName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!folderName.trim()) return;

        onCreate(folderName);

        setFolderName("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Folder Name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
            />

            <button type="submit">
                Create Folder
            </button>
        </form>
    );
}

export default CreateFolder;