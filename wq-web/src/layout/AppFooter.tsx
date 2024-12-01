import { Box, Typography } from "@mui/material";

const AppFooter = (): JSX.Element => {
  return (
    <Box
      component="footer"
      sx={{
        textAlign: "center",
        padding: "16px",
        backgroundColor: "#f0f0f0",
        color: "#333",
        marginTop: "auto",
      }}
    >
      <Typography
        variant="body2"
        component="p"
        sx={{ fontSize: 10, color: "#8E8B98", fontWeight: 750 }}
      >
        © 2024 Joint Research & Development Center, Meewatura
      </Typography>
    </Box>
  );
};

export default AppFooter;
