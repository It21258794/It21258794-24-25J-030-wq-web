import { AppBar, Toolbar, Box, Typography } from "@mui/material";

interface IProps {
  currentTab: string;
}

const AppHeader = ({ currentTab }: IProps): JSX.Element => {
  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "#F1F2F7", boxShadow: "none" }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1, color: "black" }}>
          <Typography
            variant="body2"
            sx={{ marginTop: 1, fontSize: 20, fontWeight: 750 }}
          >
            {currentTab}
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontSize: 15, color: "#8E8B98", fontWeight: 750 }}
          >
            Welcome Shamry
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
