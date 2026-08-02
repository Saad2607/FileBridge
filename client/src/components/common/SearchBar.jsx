import { TextField, InputAdornment } from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

function SearchBar({ value, onChange }) {
    return (
        <TextField
            fullWidth
            placeholder="Search files and folders..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>
                ),
            }}
        />
    );
}

export default SearchBar;