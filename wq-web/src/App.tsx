import { Box, CssBaseline } from "@mui/material";
import AppFooter from "./layout/AppFooter";
import AppHeader from "./layout/AppHeader";
import AppSider from "./layout/AppSider";
import AppContent from "./layout/AppContent";
import "./App.css";
import "./app.css";
import { useState } from "react";
import { MenuItems } from "./components/System/MenuItems";

function App() {
  const [selectedTab, setSelectedTab] = useState("Dashboard");

  const handleTabChange = (key: string) => {
    const menuItem = MenuItems.find((item) => item.key === key);
    setSelectedTab(menuItem?.label || "Dashboard");
  };
  return (
    <>
      <CssBaseline />
      <Box
        sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f0f0f0" }}
      >
        <AppSider isCollapsed={false} onTabSelect={handleTabChange} />
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <AppHeader currentTab={selectedTab} />
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
