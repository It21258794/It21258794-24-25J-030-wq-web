export interface MenuItem {
  key: string;
  label: string;
  icon: JSX.Element;
  children?: MenuItem[];
}

export const MenuItems: MenuItem[] = [
  {
    key: "waterQualityDashboard",
    label: "Dashboard",
    icon: (
      <img
        src="https://img.icons8.com/?size=100&id=PjBoEkAnwvD6&format=png&color=000000"
        alt="Dashboard Icon"
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
        alt="Prediction Icon"
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
        alt="Chemical Icon"
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
        alt="Flow Icon"
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
        alt="Reports Icon"
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
        alt="Settings Icon"
        style={{ width: "15px" }}
      />
    ),
  },
];
