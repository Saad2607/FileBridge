import { useState } from "react";

import {
    Button,
    Menu,
    MenuItem,
} from "@mui/material";

import SortRoundedIcon from "@mui/icons-material/SortRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

function SortMenu({ value, onChange }) {

    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);

    const options = [
        "Newest",
        "Oldest",
        "Name (A-Z)",
        "Name (Z-A)",
        "Largest",
        "Smallest",
    ];

    const handleSelect = (option) => {
        onChange(option);
        setAnchorEl(null);
    };

    return (
        <>
            <Button
                variant="outlined"
                startIcon={<SortRoundedIcon />}
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

export default SortMenu;