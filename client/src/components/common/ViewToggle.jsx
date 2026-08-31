import {
    ToggleButton,
    ToggleButtonGroup,
} from "@mui/material";

import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import ViewListRoundedIcon from "@mui/icons-material/ViewListRounded";

function ViewToggle({
    view,
    onChange,
}) {

    const handleChange = (_, newView) => {

        if (newView) {
            onChange(newView);
        }

    };

    return (

        <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleChange}
            size="small"
            sx={{
                bgcolor: "#F5F7FA",
                borderRadius: 3,
            }}
        >

            <ToggleButton value="grid">
                <GridViewRoundedIcon />
            </ToggleButton>

            <ToggleButton value="list">
                <ViewListRoundedIcon />
            </ToggleButton>

        </ToggleButtonGroup>

    );

}

export default ViewToggle;