import { createContext, useState } from "react";

export const FolderContext = createContext();

function FolderProvider({children}) {
    const [currentFolder, setCurrentFolder] = useState(null);

    const [breadcrumbs, setBreadcrumbs] = useState([
        {
            _id: null,
            name: "Home",
        },
    ]);

    const [folders, setFolders] = useState([]);

    return (
        <FolderContext.Provider
            value={{
                currentFolder,
                setCurrentFolder,
                folders,
                setFolders,
                breadcrumbs,
                setBreadcrumbs,
            }}
        >
            {children}
        </FolderContext.Provider>
    );
}

export default FolderProvider;