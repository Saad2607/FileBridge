import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

function ShareStatusCard({
    icon,
    title,
    description,
}) {

    const navigate = useNavigate();

    return (
        <Box
            display="flex"
            justifyContent="center"
            mt={10}
        >
            <Card
                sx={{
                    width: 450,
                    textAlign: "center",
                    borderRadius: 3,
                    boxShadow: 5,
                }}
            >
                <CardContent>

                    {icon}

                    <Typography
                        variant="h5"
                        mt={2}
                        fontWeight="bold"
                    >
                        {title}
                    </Typography>

                    <Typography
                        color="text.secondary"
                        mt={1}
                    >
                        {description}
                    </Typography>

                    <Button
                        sx={{ mt: 4 }}
                        variant="contained"
                        onClick={() => navigate("/")}
                    >
                        Back to Home
                    </Button>

                </CardContent>
            </Card>
        </Box>
    );
}

export default ShareStatusCard;