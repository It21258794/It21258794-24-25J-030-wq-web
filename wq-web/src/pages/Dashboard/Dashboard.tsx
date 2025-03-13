import { WaterDrop, AcUnit, DeviceHub, Settings } from "@mui/icons-material";
import {
  Card,
  CardContent,
  Chip,
  Drawer,
  Grid2,
  Grow,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from "@mui/material";
import { LineChart } from "@mui/x-charts";
import React, { useState } from "react";
import "./Dashboard.css";

interface SelectedOptions {
  turbidity: boolean;
  ph: boolean;
  conductivity: boolean;
  chart: boolean;
  totalAnalysis: boolean;
  conductivityGraph: boolean;
  chartGraph: boolean;
  totalAnalysisGraph: boolean;
}

function AreaGradient({ color, id }: { color: string; id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

const Dashboard = (): JSX.Element => {
  const [alignment, setAlignment] = React.useState("web");
  const [openSettings, setOpenSettings] = React.useState(false);
  const [selectedOptions, setSelectedOptions] = useState({
    turbidity: true,
    ph: true,
    conductivity: true,
    turbidityGraph: true,
    phGraph: true,
    conductivityGraph: true,
    chart: true,
    totalAnalysis: true,
  });

  const [selectedOptionsTimeout, setSelectedOptionsTimeout] = useState({
    turbidity: true,
    ph: true,
    conductivity: true,
    turbidityGraph: true,
    phGraph: true,
    conductivityGraph: true,
    chart: true,
    totalAnalysis: true,
  });

  const theme = useTheme();
  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    setAlignment(newAlignment);
  };

  const handleToggle = (option: keyof SelectedOptions) => {
    setSelectedOptionsTimeout((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
    setTimeout(() => {
      setSelectedOptions((prev) => ({
        ...prev,
        [option]: !prev[option],
      }));
    }, 400);
  };

  const stats = [
    {
      title: "Turbidity",
      value: "11.15",
      change: 25,
      color: "green",
      data: [2, 3, 3, 4, 5, 7],
    },
    {
      title: "pH",
      value: "7.12",
      change: -25,
      color: "red",
      data: [6, 5, 4, 3, 3, 2],
    },
    {
      title: "Conductivity",
      value: "34.54",
      change: 5,
      color: "blue",
      data: [4, 4, 4, 5, 5, 5],
    },
  ];

  const colorPalette = [
    theme.palette.primary.light,
    theme.palette.primary.main,
    theme.palette.primary.dark,
  ];

  return (
    <>
      <Drawer
        anchor="bottom"
        open={openSettings}
        onClose={() => setOpenSettings(false)}
      >
        <span
          style={{
            marginTop: "20px",
            display: "inline-block",
            textAlign: "center",
            fontSize: "30px",
            fontWeight: "bold",
            letterSpacing: "1px",
            color: "#333",
            textTransform: "uppercase",
            padding: "10px 20px",
            borderRadius: "5px",
            backgroundColor: "#f4f4f4",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease",
          }}
        >
          Customize Dashboard
        </span>

        <div
          role="presentation"
          style={{
            padding: 30,
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "15px",
            textAlign: "center",
          }}
        >
          <div>
            <Chip
              label="Turbidity"
              clickable
              color={selectedOptions.turbidity ? "primary" : "default"}
              onClick={() => handleToggle("turbidity")}
              style={{ borderRadius: "20px", width: "120px" }}
            />
          </div>
          <div>
            <Chip
              label="PH"
              clickable
              color={selectedOptions.ph ? "primary" : "default"}
              onClick={() => handleToggle("ph")}
              style={{ borderRadius: "20px", width: "120px" }}
            />
          </div>
          <div>
            <Chip
              label="Conductivity"
              clickable
              color={selectedOptions.conductivity ? "primary" : "default"}
              onClick={() => handleToggle("conductivity")}
              style={{ borderRadius: "20px", width: "120px" }}
            />
          </div>
          <div>
            <Chip
              label="Turbidity Chart"
              clickable
              color={selectedOptions.turbidityGraph ? "primary" : "default"}
              onClick={() => handleToggle("turbidityGraph")}
              style={{ borderRadius: "20px", width: "150px" }}
            />
          </div>
          <div>
            <Chip
              label="PH Chart"
              clickable
              color={selectedOptions.phGraph ? "primary" : "default"}
              onClick={() => handleToggle("phGraph")}
              style={{ borderRadius: "20px", width: "150px" }}
            />
          </div>
          <div>
            <Chip
              label="Conductivity Chart"
              clickable
              color={selectedOptions.conductivityGraph ? "primary" : "default"}
              onClick={() => handleToggle("conductivityGraph")}
              style={{ borderRadius: "20px", width: "150px" }}
            />
          </div>
          <div>
            <Chip
              label="Chart"
              clickable
              color={selectedOptions.chart ? "primary" : "default"}
              onClick={() => handleToggle("chart")}
              style={{ borderRadius: "20px", width: "120px" }}
            />
          </div>
          <div>
            <Chip
              label="Total Analysis"
              clickable
              color={selectedOptions.totalAnalysis ? "primary" : "default"}
              onClick={() => handleToggle("totalAnalysis")}
              style={{ borderRadius: "20px", width: "120px" }}
            />
          </div>
        </div>
      </Drawer>

      <ToggleButtonGroup
        color="primary"
        value={alignment}
        exclusive
        onChange={handleChange}
        aria-label="Platform"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "0.875rem",
        }}
      >
        <ToggleButton
          value="rawWater"
          sx={{
            fontSize: "0.6rem",
            textAlign: "center",
            fontWeight: 800,
          }}
        >
          Raw Water
        </ToggleButton>
        <ToggleButton
          value="treatedWater"
          sx={{
            fontSize: "0.6rem",
            textAlign: "center",
            fontWeight: 800,
          }}
        >
          Treated Water
        </ToggleButton>
      </ToggleButtonGroup>

      <IconButton
        sx={{ position: "absolute", top: 16, right: 16 }}
        onClick={() => setOpenSettings(true)}
      >
        <Settings />
      </IconButton>

      <Grid2
        container
        spacing={2}
        justifyContent="center"
        sx={{ marginTop: "20px" }}
      >
        {selectedOptions.turbidity && (
          <Grow in={selectedOptionsTimeout.turbidity} timeout={500}>
            <Card
              sx={{
                textAlign: "center",
                padding: 2,
                borderRadius: 2,
                boxShadow: 3,
                width: "30%",
              }}
            >
              <CardContent>
                <WaterDrop sx={{ fontSize: 20, color: "teal" }} />
                <Typography
                  variant="h5"
                  sx={{ fontSize: 15, fontWeight: "bold", marginTop: 1 }}
                >
                  Turbidity
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontSize: 24, fontWeight: "bold", marginTop: 1 }}
                >
                  11.15
                </Typography>
                <Typography sx={{ fontSize: 10, marginTop: 1, color: "gray" }}>
                  Last Updated: 4 days ago
                </Typography>
              </CardContent>
            </Card>
          </Grow>
        )}
        {selectedOptions.ph && (
          <Grow in={selectedOptionsTimeout.ph} timeout={500}>
            <Card
              sx={{
                textAlign: "center",
                padding: 2,
                borderRadius: 2,
                boxShadow: 3,
                width: "30%",
              }}
            >
              <CardContent>
                <AcUnit sx={{ fontSize: 20, color: "teal" }} />
                <Typography
                  variant="h5"
                  sx={{ fontSize: 15, fontWeight: "bold", marginTop: 1 }}
                >
                  pH
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontSize: 24, fontWeight: "bold", marginTop: 1 }}
                >
                  7.12
                </Typography>
                <Typography sx={{ fontSize: 10, marginTop: 1, color: "gray" }}>
                  Last Updated: 4 days ago
                </Typography>
              </CardContent>
            </Card>
          </Grow>
        )}
        {selectedOptions.conductivity && (
          <Grow in={selectedOptionsTimeout.conductivity} timeout={500}>
            <Card
              sx={{
                textAlign: "center",
                padding: 2,
                borderRadius: 2,
                boxShadow: 3,
                width: "30%",
              }}
            >
              <CardContent>
                <DeviceHub sx={{ fontSize: 20, color: "teal" }} />
                <Typography
                  variant="h5"
                  sx={{ fontSize: 15, fontWeight: "bold", marginTop: 1 }}
                >
                  Conductivity
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontSize: 24, fontWeight: "bold", marginTop: 1 }}
                >
                  34.54
                </Typography>
                <Typography sx={{ fontSize: 10, marginTop: 1, color: "gray" }}>
                  Last Updated: 4 days ago
                </Typography>
              </CardContent>
            </Card>
          </Grow>
        )}
      </Grid2>
      <Grid2
        container
        spacing={2}
        justifyContent="center"
        sx={{ marginTop: "20px" }}
      >
        {stats.map(({ title, value, change, color, data }) => (
          <Card
            key={title}
            sx={{
              textAlign: "center",
              borderRadius: 2,
              boxShadow: 3,
              width: "30%",
              height: "300px",
            }}
          >
            <CardContent>
              <Typography sx={{ fontWeight: 700, fontSize: 14, color: "gray" }}>
                {title}
              </Typography>
              <Typography sx={{ fontWeight: 700, fontSize: 24, marginTop: 1 }}>
                {value}
              </Typography>
              <Typography
                sx={{
                  fontSize: 14,
                  color: change > 0 ? "green" : "red",
                }}
              >
                {change > 0 ? `+${change}%` : `${change}%`}
              </Typography>
              <LineChart
                colors={colorPalette}
                xAxis={[{ data: [1, 2, 3, 4, 5, 6] }]}
                series={[
                  {
                    id: title.toLowerCase().replace(/\s/g, ""),
                    color: color,
                    data: data,
                    showMark: false,
                    area: true,
                    stack: "total",
                    stackOrder: "ascending",
                    curve: "linear",
                  },
                ]}
                grid={{ horizontal: false, vertical: false }}
                height={200}
                sx={{
                  [`& .MuiAreaElement-series-${title
                    .toLowerCase()
                    .replace(/\s/g, "")}`]: {
                    fill: `url('#${title.toLowerCase().replace(/\s/g, "")}')`,
                  },
                }}
              >
                <AreaGradient
                  color={color}
                  id={title.toLowerCase().replace(/\s/g, "")}
                />
              </LineChart>
            </CardContent>
          </Card>
        ))}
      </Grid2>

      <Grid2
        container
        spacing={2}
        justifyContent="center"
        sx={{
          marginTop: "20px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        {selectedOptions.chart && (
          <Grow in={selectedOptionsTimeout.chart} timeout={500}>
            <Card
              sx={{
                padding: 2,
                borderRadius: 2,
                boxShadow: 3,
                width: "45%",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 750,
                  fontSize: 15,
                  marginTop: 1,
                  color: "gray",
                }}
              >
                Chart
              </Typography>
              <LineChart
                xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                series={[{ data: [2, 5.5, 2, 8.5, 1.5, 5] }]}
                height={300}
                sx={{ width: "100%" }}
              />
            </Card>
          </Grow>
        )}

        {selectedOptions.totalAnalysis && (
          <Grow in={selectedOptionsTimeout.totalAnalysis} timeout={500}>
            <Card
              sx={{
                padding: 2,
                borderRadius: 2,
                boxShadow: 3,
                width: "46%",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 750,
                  fontSize: 15,
                  marginTop: 1,
                  color: "gray",
                }}
              >
                Total Analysis
              </Typography>
              <LineChart
                xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                series={[
                  { color: "green", data: [0, 5, 2, 6, 3, 9.3] },
                  { color: "red", data: [6, 3, 7, 9.5, 4, 2] },
                  { color: "blue", data: [3, 1, 3, 6, 2, 1] },
                ]}
                height={300}
                sx={{ width: "100%" }}
              />
            </Card>
          </Grow>
        )}
      </Grid2>
    </>
  );
};

export default Dashboard;
