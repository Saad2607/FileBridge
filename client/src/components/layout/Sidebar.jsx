import FolderIcon from "@mui/icons-material/Folder";
import StarIcon from "@mui/icons-material/Star";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";

function Sidebar() {
    const menu = [
        "Documents",
        "Projects",
        "Favorites",
        "Recycle Bin",
        "Settings",
    ];

    const icons = [
        <FolderIcon />,
        <FolderIcon />,
        <StarIcon />,
        <DeleteIcon />,
        <SettingsIcon />,
    ];

    return (
        <div
            style={{
                width: "250px",
                borderRight: "1px solid #ddd",
                padding: "20px",
            }}
        >
            {menu.map((item, index) => (
                <div
                    key={index}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "25px",
                        cursor: "pointer",
                    }}
                >
                    {icons[index]}
                    <span>{item}</span>
                </div>
            ))}
        </div>
    );
}

export default Sidebar;