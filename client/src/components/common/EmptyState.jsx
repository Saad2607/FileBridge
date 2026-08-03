import {
    Box,
    Typography,
    Button,
} from "@mui/material";



function EmptyState({

    icon,

    title,

    description,

    buttonText,

    onClick,

}) {

    return (

        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 8,
                px: 3,
                textAlign: "center",
            }}
        >

            <Box
                sx={{
                    fontSize: 80,
                    color: "#90CAF9",
                    mb: 2,
                }}
            >
                {icon}
            </Box>

            <Typography
                variant="h5"
                fontWeight={700}
                gutterBottom
            >
                {title}
            </Typography>

            <Typography
                color="text.secondary"
                sx={{
                    maxWidth: 450,
                    mb: 4,
                }}
            >
                {description}
            </Typography>

            {

                buttonText && (

                    <Button
                        variant="contained"
                        size="large"
                        onClick={onClick}
                    >
                        {buttonText}
                    </Button>

                )

            }

        </Box>

    );

}

export default EmptyState;