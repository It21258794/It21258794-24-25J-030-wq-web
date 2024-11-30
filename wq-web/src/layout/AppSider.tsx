import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";

interface MenuItem {
  key: string;
  label: string;
  icon: JSX.Element;
  children?: MenuItem[];
}

interface IProps {
  isCollapsed: boolean;
}

const menuItems: MenuItem[] = [
  {
    key: "waterQualityDashboard",
    label: "Dashboard",
    icon: (
      <img
        src="https://img.icons8.com/?size=100&id=PjBoEkAnwvD6&format=png&color=000000"
        alt="Sensors Icon"
        style={{ width: "15px" }}
      />
    ),
  },
  {
    key: "sensorsDashboard",
    label: "Sensors",
    icon: (
      <img
        src="https://img.icons8.com/?size=100&id=2362&format=png&color=000000"
        alt="Sensors Icon"
        style={{ width: "15px" }}
      />
    ),
  },
  {
    key: "waterQualityPrediction",
    label: "Water Quality Prediction",
    icon: (
      <img
        src="https://img.icons8.com/?size=100&id=86473&format=png&color=000000"
        alt="Sensors Icon"
        style={{ width: "15px" }}
      />
    ),
  },
  {
    key: "chemicalConsumption",
    label: "Chemical Consumption",
    icon: (
      <img
        src="https://img.icons8.com/?size=100&id=lo1VomapBS1L&format=png&color=000000"
        alt="Sensors Icon"
        style={{ width: "15px" }}
      />
    ),
  },
  {
    key: "flowCustomization",
    label: "Flow Customization",
    icon: (
      <img
        src="https://img.icons8.com/?size=100&id=11238&format=png&color=000000"
        alt="Sensors Icon"
        style={{ width: "15px" }}
      />
    ),
  },
  {
    key: "reports",
    label: "Reports",
    icon: (
      <img
        src="https://img.icons8.com/?size=100&id=92652&format=png&color=000000"
        alt="Sensors Icon"
        style={{ width: "15px" }}
      />
    ),
  },
  {
    key: "settings",
    label: "Settings",
    icon: (
      <img
        src="https://img.icons8.com/?size=100&id=14099&format=png&color=000000"
        alt="Sensors Icon"
        style={{ width: "15px" }}
      />
    ),
  },
];

const AppSider = ({ isCollapsed }: IProps): JSX.Element => {
  const [openMenu] = useState<string | null>(null);
  const [selectedKey, setSelectedKey] = React.useState("");
  const navigate = useNavigate();

  const handleSelected = (key: string) => {
    setSelectedKey(key);
    navigate(`/${key}`);
  };

  //Kept for later use
  // const handleClick = (key: string) => {
  //   setOpenMenu(openMenu === key ? null : key);
  // };

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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",

          padding: 2,
        }}
      >
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
        {menuItems.map((item) => (
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
              {item.children &&
                (openMenu === item.key ? <ExpandLess /> : <ExpandMore />)}
            </ListItemButton>
            {item.children && openMenu === item.key && (
              <List component="div" disablePadding>
                {item.children.map((subItem) => (
                  <ListItemButton key={subItem.key}>
                    <ListItemIcon>{subItem.icon}</ListItemIcon>
                    {!isCollapsed && <ListItemText primary={subItem.label} />}
                  </ListItemButton>
                ))}
              </List>
            )}
          </div>
        ))}
      </List>
    </Drawer>
  );
};

export default AppSider;
