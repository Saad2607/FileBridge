import { createContext, useState } from "react";

export const UploadContext = createContext();

function UploadProvider({ children }) {

    const [uploading, setUploading] = useState(false);

    const [progress, setProgress] = useState(0);

    const [currentFile, setCurrentFile] = useState("");

    const value = {

        uploading,
        setUploading,

        progress,
        setProgress,

        currentFile,
        setCurrentFile,

    };

    return (

        <UploadContext.Provider value={value}>

            {children}

        </UploadContext.Provider>

    );

}

export default UploadProvider;