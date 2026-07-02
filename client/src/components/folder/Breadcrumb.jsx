import { useContext } from "react";
import { FolderContext } from "../../context/FolderContext";

function Breadcrumb() {
    const {
        breadcrumbs,
        setCurrentFolder,
        setBreadcrumbs,
    } = useContext(FolderContext);

    const handleClick = (index) => {
        const selected = breadcrumbs[index];

        setCurrentFolder(
            selected._id
                ? selected
                : null
        );

        setBreadcrumbs(
            breadcrumbs.slice(0, index + 1)
        );
    };

    return (
        <div
            style={{
                display: "flex",
                gap: "8px",
                marginBottom: "20px"
            }}
        >
            {breadcrumbs.map((item, index) => (
                <span
                    key={item._id ?? "home"}
                    style={{
                        cursor: "pointer",
                    }}
                    onClick={() => handleClick(index)}
                >
                    {item.name}

                    {index !== breadcrumbs.length - 1 && " > "}
                </span>
            ))}
        </div>
    );
}

export default Breadcrumb;