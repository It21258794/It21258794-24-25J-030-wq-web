import { WaterDrop, AcUnit, DeviceHub, Settings } from "@mui/icons-material";
import {
  Card,
  CardContent,
  Chip,
  Drawer,
  FormControl,
  Grid2,
  Grow,
  IconButton,
  MenuItem,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from "@mui/material";
import { LineChart } from "@mui/x-charts";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../components/auth/AuthProvider";

interface SelectedOptions {
  turbidity: boolean;
  ph: boolean;
  conductivity: boolean;
  chart: boolean;
  totalAnalysis: boolean;
  turbidityGraph: boolean;
  phGraph: boolean;
  conductivityGraph: boolean;
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
  const [selectedOption, handleSelectChange] = useState<string>("Turbidity");
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
  const authContext = useContext(AuthContext);
  const token: string | undefined = authContext?.token;

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

  const colorPalette = [
    theme.palette.primary.light,
    theme.palette.primary.main,
    theme.palette.primary.dark,
  ];

  const [turbidityData, setTurbidityData] = useState<number[]>([]);
  const [phData, setPhData] = useState<number[]>([]);
  const [conductivityData, setConductivityData] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8090/api/dashboard/fetchModbusData",
          {
            method: "GET",
            headers: {
              Authorization: `${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();

        if (data) {
          setTurbidityData((prev) => [...prev.slice(-9), data[5001] || 0]);
          setPhData((prev) => [...prev.slice(-9), data[5002] || 0]);
          setConductivityData((prev) => [...prev.slice(-9), data[5003] || 0]);
        }
      } catch (error) {
        console.error("Error fetching Modbus data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);

    return () => clearInterval(interval);
  }, []);

  const getChartData = () => {
    switch (selectedOption) {
      case "Turbidity":
        return { data: turbidityData, color: "green" };
      case "Ph":
        return { data: phData, color: "blue" };
      case "Conductivity":
        return { data: conductivityData, color: "red" };
      default:
        return { data: turbidityData, color: "green" };
    }
  };

  const { data, color } = getChartData();

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
                flex: "1 1 30%",
                minWidth: "200px",
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
                  {turbidityData[turbidityData.length - 1]?.toFixed(2) || "N/A"}
                </Typography>
                <Typography sx={{ fontSize: 10, marginTop: 1, color: "gray" }}>
                  Last Updated:{" "}
                  {conductivityData.length > 0
                    ? new Date().toLocaleString()
                    : "No recent data"}
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
                flex: "1 1 30%",
                minWidth: "200px",
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
                  {phData[phData.length - 1]?.toFixed(2) || "N/A"}
                </Typography>
                <Typography sx={{ fontSize: 10, marginTop: 1, color: "gray" }}>
                  Last Updated:{" "}
                  {conductivityData.length > 0
                    ? new Date().toLocaleString()
                    : "No recent data"}
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
                flex: "1 1 30%",
                minWidth: "200px",
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
                  {conductivityData[conductivityData.length - 1]?.toFixed(2) ||
                    "N/A"}
                </Typography>
                <Typography sx={{ fontSize: 10, marginTop: 1, color: "gray" }}>
                  Last Updated:{" "}
                  {conductivityData.length > 0
                    ? new Date().toLocaleString()
                    : "No recent data"}
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
        {[
          {
            title: "Turbidity",
            key: 5001,
            data: turbidityData,
            color: "green",
          },
          { title: "pH", key: 5002, data: phData, color: "red" },
          {
            title: "Conductivity",
            key: 5003,
            data: conductivityData,
            color: "blue",
          },
        ].map(({ title, data, color }) => {
          const latestValue = data[data.length - 1] || 0;
          const previousValue =
            data.length > 1 ? data[data.length - 2] : latestValue;
          const change = previousValue
            ? ((latestValue - previousValue) / previousValue) * 100
            : 0;

          return (
            <Card
              key={title}
              sx={{
                textAlign: "center",
                borderRadius: 2,
                boxShadow: 3,
                flex: "1 1 30%",
                minWidth: "200px",
              }}
            >
              <CardContent>
                <Typography
                  sx={{ fontWeight: 700, fontSize: 14, color: "gray" }}
                >
                  {title}
                </Typography>
                <Typography
                  sx={{ fontWeight: 700, fontSize: 24, marginTop: 1 }}
                >
                  {latestValue.toFixed(2)}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 14,
                    color: change > 0 ? "green" : "red",
                  }}
                >
                  {change > 0
                    ? `+${change.toFixed(2)}%`
                    : `${change.toFixed(2)}%`}
                </Typography>
                <LineChart
                  colors={colorPalette}
                  xAxis={[
                    {
                      data: Array.from(
                        { length: data.length },
                        (_, i) => i + 1
                      ),
                    },
                  ]}
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
          );
        })}
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
                flex: "1 1 30%",
                minWidth: "200px",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                position: "relative",
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
                {selectedOption} Overview
              </Typography>

              <div style={{ position: "absolute", top: 10, right: 10 }}>
                <FormControl sx={{ m: 2, minWidth: 60 }} size="small">
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedOption}
                    onChange={(event) =>
                      handleSelectChange(event.target.value as string)
                    }
                    sx={{
                      width: "110px",
                      height: "30px",
                      fontSize: "12px",
                      borderRadius: 3,
                      "& .MuiSelect-select": {
                        padding: "10px",
                      },
                    }}
                  >
                    <MenuItem value="Turbidity">Turbidity</MenuItem>
                    <MenuItem value="Ph">Ph</MenuItem>
                    <MenuItem value="Conductivity">Conductivity</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <LineChart
                series={[{ color, data }]}
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
                flex: "1 1 30%",
                minWidth: "200px",
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
                Water Quality Parameters Overview
              </Typography>
              <LineChart
                series={[
                  { label: "Turbidity", color: "green", data: turbidityData },
                  { label: "PH", color: "red", data: phData },
                  { label: "Turbidity", color: "blue", data: conductivityData },
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
