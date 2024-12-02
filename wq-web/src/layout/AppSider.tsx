import {
  Drawer,
  Box,
  Typography,
  List,
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { MenuItems } from "../components/System/MenuItems";

interface IProps {
  isCollapsed: boolean;
  onTabSelect: (key: string) => void;
}

const AppSider = ({ isCollapsed, onTabSelect }: IProps): JSX.Element => {
  const [selectedKey, setSelectedKey] = React.useState("");
  const navigate = useNavigate();

  const handleSelected = (key: string) => {
    setSelectedKey(key);
    onTabSelect(key);
    navigate(`/${key}`);
  };

  return (
    <Drawer
      variant="permanent"
      open={!isCollapsed}
      sx={{
        width: isCollapsed ? 60 : 270,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isCollapsed ? 60 : 270,
          boxSizing: "border-box",
          transition: "width 0.3s",
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", padding: 2 }}>
        <Typography
          sx={{
            marginTop: 1,
            fontSize: 30,
            paddingLeft: "20px",
            fontWeight: 1000,
            color: "#4072AF",
          }}
        >
          JRDC.
        </Typography>
        {!isCollapsed && (
          <Typography
            variant="body2"
            sx={{ marginTop: 1, fontSize: 10, paddingLeft: "20px" }}
          >
            Joint Research & Development Center
          </Typography>
        )}
      </Box>
      <List>
        {MenuItems.map((item) => (
          <div key={item.key}>
            {item.key === "settings" && <Divider sx={{ marginY: 1 }} />}
            <ListItemButton
              onClick={() => handleSelected(item.key)}
              sx={{
                fontSize: "0.1rem",
                paddingLeft: "30px",
                backgroundColor:
                  selectedKey === item.key ? "#e8f4ff" : "transparent",
                borderLeft:
                  selectedKey === item.key ? "2px solid #4072AF" : "none",
                "&:hover": {
                  backgroundColor: "#e8f4ff",
                },
              }}
            >
              <ListItemIcon sx={{ fontSize: "1rem" }}>{item.icon}</ListItemIcon>
              {!isCollapsed && (
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: "0.7rem" }}
                />
              )}
            </ListItemButton>
          </div>
        ))}
      </List>
    </Drawer>
  );
};

export default AppSider;
