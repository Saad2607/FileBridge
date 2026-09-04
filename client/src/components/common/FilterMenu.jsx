import { useState } from "react";

import {
    Button,
    Menu,
    MenuItem,
} from "@mui/material";

import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

function FilterMenu({ value, onChange }) {

    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);

    const options = [
        "All",
        "Folders",
        "Files",
        "Favorites",
        "Tagged Files",
        "Code & Text",
        "Images",
        "PDF",
        "Archives",
        "Videos",
        "Audio",
    ];

    const handleSelect = (option) => {
        onChange(option);
        setAnchorEl(null);
    };

    return (
        <>
            <Button
                variant="outlined"
                startIcon={<FilterAltRoundedIcon />}
                endIcon={<KeyboardArrowDownRoundedIcon />}
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 600,
                    minWidth: 150,
                }}
            >
                {value}
            </Button>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
            >
                {options.map((option) => (
                    <MenuItem
                        key={option}
                        selected={value === option}
                        onClick={() => handleSelect(option)}
                    >
                        {option}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
}

export default FilterMenu;