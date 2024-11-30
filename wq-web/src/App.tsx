import { Box, CssBaseline } from "@mui/material";
import AppFooter from "./layout/AppFooter";
import AppHeader from "./layout/AppHeader";
import AppSider from "./layout/AppSider";
import AppContent from "./layout/AppContent";
import "./app.css";

function App() {
  return (
    <>
      <CssBaseline />
      <Box
        sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f0f0f0" }}
      >
        <AppSider isCollapsed={false} />
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <AppHeader />
          <Box sx={{ flexGrow: 1 }}>
            <AppContent />
          </Box>
          <AppFooter />
        </Box>
      </Box>
    </>
  );
}

export default App;
