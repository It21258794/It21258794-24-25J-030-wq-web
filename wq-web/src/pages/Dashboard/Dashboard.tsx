import {
  WaterDrop,
  AcUnit,
  DeviceHub,
  Settings,
  Biotech,
  Science,
  Opacity,
} from "@mui/icons-material";
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
  Slide,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from "@mui/material";
import { LineChart } from "@mui/x-charts";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../components/auth/AuthProvider";
import DASHBOARD_API_ENDPOINTS from "./services/config";
import { apiRequest } from "./services/api";

interface SelectedOptions {
  turbidity: boolean;
  ph: boolean;
  conductivity: boolean;
  chart: boolean;
  totalAnalysis: boolean;
  turbidityGraph: boolean;
  phGraph: boolean;
  conductivityGraph: boolean;
  totalTreatedAnalysis: boolean;
  treatedChart: boolean;
  limeUsageChart: boolean;
  pacChart: boolean;
  chlorineUsageChart: boolean;
  limeUsage: boolean;
  pacUsage: boolean;
  chlorineUsage: boolean;
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
  const theme = useTheme();
  const authContext = useContext(AuthContext);
  const userId = authContext?.user?.id;
  const token: string | undefined = authContext?.token;

  const colorPalette = [
    theme.palette.primary.light,
    theme.palette.primary.main,
    theme.palette.primary.dark,
  ];

  const [openSettings, setOpenSettings] = React.useState(false);
  const [selectedOption, handleSelectChange] = useState<string>("Turbidity");
  const [selectedTreatedOption, handleTreatedSelectChange] =
    useState<string>("ChlorineUsage");
  const [alignment, setAlignment] = useState<"rawWater" | "treatedWater">(
    "rawWater"
  );

  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({
    turbidity: true,
    ph: true,
    conductivity: true,
    turbidityGraph: true,
    phGraph: true,
    conductivityGraph: true,
    chart: true,
    totalAnalysis: true,
    totalTreatedAnalysis: true,
    treatedChart: true,
    limeUsageChart: true,
    pacChart: true,
    chlorineUsageChart: true,
    limeUsage: true,
    pacUsage: true,
    chlorineUsage: true,
  });

  const [selectedOptionsTimeout, setSelectedOptionsTimeout] =
    useState(selectedOptions);

  const [turbidityData, setTurbidityData] = useState<number[]>([]);
  const [phData, setPhData] = useState<number[]>([]);
  const [conductivityData, setConductivityData] = useState<number[]>([]);
  const [chlorineData, setChlorineData] = useState<number[]>([]);
  const [pacData, setPacData] = useState<number[]>([]);
  const [limeData, setLimeData] = useState<number[]>([]);

  const handleToggle = (option: keyof SelectedOptions) => {
    setSelectedOptionsTimeout((prev) => ({ ...prev, [option]: !prev[option] }));
    setTimeout(() => {
      setSelectedOptions((prev) => ({ ...prev, [option]: !prev[option] }));
    }, 400);
  };

  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newAlignment: "rawWater" | "treatedWater" | null
  ) => {
    if (newAlignment !== null) setAlignment(newAlignment);
  };

  const fetchDashboardConfig = async () => {
    try {
      const data = await apiRequest<SelectedOptions>(
        "GET",
        DASHBOARD_API_ENDPOINTS.GET_DASHBOARD_CONFIG,
        token,
        { userId }
      );

      const defaultOptions = {
        turbidity: true,
        ph: true,
        conductivity: true,
        turbidityGraph: true,
        phGraph: true,
        conductivityGraph: true,
        chart: true,
        totalAnalysis: true,
        totalTreatedAnalysis: true,
        treatedChart: true,
        limeUsageChart: true,
        pacChart: true,
        chlorineUsageChart: true,
        limeUsage: true,
        pacUsage: true,
        chlorineUsage: true,
      };

      const updatedData = { ...defaultOptions, ...data };

      setSelectedOptions(updatedData);
      setSelectedOptionsTimeout(updatedData);
    } catch (error) {
      console.error("Error fetching dashboard configuration:", error);
    }
  };

  const saveDashboardConfig = async () => {
    try {
      await apiRequest(
        "POST",
        DASHBOARD_API_ENDPOINTS.SAVE_DASHBOARD_CONFIG,
        token,
        {
          userId,
          ...selectedOptions,
        }
      );
      setSelectedOptionsTimeout(selectedOptions);
    } catch (error) {
      console.error("Error saving dashboard configuration:", error);
    }
  };

  const fetchData = async () => {
    try {
      const data = await apiRequest<Record<number, number>>(
        "GET",
        DASHBOARD_API_ENDPOINTS.FETCH_MODBUS_DATA,
        token
      );

      if (data) {
        setTurbidityData((prev) => [...prev.slice(-9), data[5001] || 0]);
        setPhData((prev) => [...prev.slice(-9), data[5002] || 0]);
        setConductivityData((prev) => [...prev.slice(-9), data[5003] || 0]);
        setChlorineData((prev) => [...prev.slice(-9), data[5004] || 0]);
        setPacData((prev) => [...prev.slice(-9), data[5005] || 0]);
        setLimeData((prev) => [...prev.slice(-9), data[5006] || 0]);
      }
    } catch (error) {
      console.error("Error fetching Modbus data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardConfig();
  }, [userId]);

  useEffect(() => {
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

  const getTreatedChartData = () => {
    switch (selectedTreatedOption) {
      case "ChlorineUsage":
        return { treatedData: chlorineData, treatedColor: "gold" };
      case "PACUsage":
        return { treatedData: pacData, treatedColor: "brown" };
      case "LimeUsage":
        return { treatedData: limeData, treatedColor: "lightgreen" };
      default:
        return { treatedData: chlorineData, treatedColor: "gold" };
    }
  };

  const { data, color } = getChartData();
  const { treatedData, treatedColor } = getTreatedChartData();

  return (
    <>
      <Drawer
        anchor="bottom"
        open={openSettings}
        onClose={() => {
          setOpenSettings(false);
          saveDashboardConfig();
        }}
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
        {alignment === "rawWater" && (
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
                color={
                  selectedOptions.conductivityGraph ? "primary" : "default"
                }
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
        )}
        {alignment !== "rawWater" && (
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
                label="Chlorine Usage"
                clickable
                color={selectedOptions.chlorineUsage ? "primary" : "default"}
                onClick={() => handleToggle("chlorineUsage")}
                style={{ borderRadius: "20px", width: "120px" }}
              />
            </div>
            <div>
              <Chip
                label="PAC Usage"
                clickable
                color={selectedOptions.pacUsage ? "primary" : "default"}
                onClick={() => handleToggle("pacUsage")}
                style={{ borderRadius: "20px", width: "120px" }}
              />
            </div>
            <div>
              <Chip
                label="Lime Usage"
                clickable
                color={selectedOptions.limeUsage ? "primary" : "default"}
                onClick={() => handleToggle("limeUsage")}
                style={{ borderRadius: "20px", width: "120px" }}
              />
            </div>
            <div>
              <Chip
                label="Chlorine Usage Chart"
                clickable
                color={
                  selectedOptions.chlorineUsageChart ? "primary" : "default"
                }
                onClick={() => handleToggle("chlorineUsageChart")}
                style={{ borderRadius: "20px", width: "150px" }}
              />
            </div>
            <div>
              <Chip
                label="PAC Usage Chart"
                clickable
                color={selectedOptions.pacChart ? "primary" : "default"}
                onClick={() => handleToggle("pacChart")}
                style={{ borderRadius: "20px", width: "150px" }}
              />
            </div>
            <div>
              <Chip
                label="Lime Usage Chart"
                clickable
                color={selectedOptions.limeUsageChart ? "primary" : "default"}
                onClick={() => handleToggle("limeUsageChart")}
                style={{ borderRadius: "20px", width: "150px" }}
              />
            </div>
            <div>
              <Chip
                label="Chart"
                clickable
                color={selectedOptions.treatedChart ? "primary" : "default"}
                onClick={() => handleToggle("treatedChart")}
                style={{ borderRadius: "20px", width: "120px" }}
              />
            </div>
            <div>
              <Chip
                label="Total Analysis"
                clickable
                color={
                  selectedOptions.totalTreatedAnalysis ? "primary" : "default"
                }
                onClick={() => handleToggle("totalTreatedAnalysis")}
                style={{ borderRadius: "20px", width: "120px" }}
              />
            </div>
          </div>
        )}
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

      <Slide
        direction="right"
        in={alignment === "rawWater"}
        mountOnEnter
        unmountOnExit
      >
        <div>
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
                      {turbidityData[turbidityData.length - 1]?.toFixed(2) ||
                        "N/A"}
                    </Typography>
                    <Typography
                      sx={{ fontSize: 10, marginTop: 1, color: "gray" }}
                    >
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
                    <Typography
                      sx={{ fontSize: 10, marginTop: 1, color: "gray" }}
                    >
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
                      {conductivityData[conductivityData.length - 1]?.toFixed(
                        2
                      ) || "N/A"}
                    </Typography>
                    <Typography
                      sx={{ fontSize: 10, marginTop: 1, color: "gray" }}
                    >
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
                display: selectedOptions.turbidityGraph,
              },
              {
                title: "pH",
                key: 5002,
                data: phData,
                color: "red",
                display: selectedOptions.phGraph,
              },
              {
                title: "Conductivity",
                key: 5003,
                data: conductivityData,
                color: "blue",
                display: selectedOptions.conductivityGraph,
              },
            ].map(({ title, data, color, display }) => {
              if (display === false) return null;
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
                          fill: `url('#${title
                            .toLowerCase()
                            .replace(/\s/g, "")}')`,
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
                      {
                        label: "Turbidity",
                        color: "green",
                        data: turbidityData,
                      },
                      { label: "PH", color: "red", data: phData },
                      {
                        label: "Turbidity",
                        color: "blue",
                        data: conductivityData,
                      },
                    ]}
                    height={300}
                    sx={{ width: "100%" }}
                  />
                </Card>
              </Grow>
            )}
          </Grid2>
        </div>
      </Slide>
      <Slide
        direction="left"
        in={alignment !== "rawWater"}
        mountOnEnter
        unmountOnExit
      >
        <div>
          <Grid2
            container
            spacing={2}
            justifyContent="center"
            sx={{ marginTop: "20px" }}
          >
            {selectedOptions.chlorineUsage && (
              <Grow in={selectedOptionsTimeout.chlorineUsage} timeout={500}>
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
                    <Biotech sx={{ fontSize: 20, color: "teal" }} />
                    <Typography
                      variant="h5"
                      sx={{ fontSize: 15, fontWeight: "bold", marginTop: 1 }}
                    >
                      Chlorine Usage
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ fontSize: 24, fontWeight: "bold", marginTop: 1 }}
                    >
                      {chlorineData[chlorineData.length - 1]?.toFixed(2) ||
                        "N/A"}
                    </Typography>
                    <Typography
                      sx={{ fontSize: 10, marginTop: 1, color: "gray" }}
                    >
                      Last Updated:{" "}
                      {chlorineData.length > 0
                        ? new Date().toLocaleString()
                        : "No recent data"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grow>
            )}
            {selectedOptions.pacUsage && (
              <Grow in={selectedOptionsTimeout.pacUsage} timeout={500}>
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
                    <Science sx={{ fontSize: 20, color: "teal" }} />
                    <Typography
                      variant="h5"
                      sx={{ fontSize: 15, fontWeight: "bold", marginTop: 1 }}
                    >
                      PAC Usage
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ fontSize: 24, fontWeight: "bold", marginTop: 1 }}
                    >
                      {pacData[pacData.length - 1]?.toFixed(2) || "N/A"}
                    </Typography>
                    <Typography
                      sx={{ fontSize: 10, marginTop: 1, color: "gray" }}
                    >
                      Last Updated:{" "}
                      {pacData.length > 0
                        ? new Date().toLocaleString()
                        : "No recent data"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grow>
            )}
            {selectedOptions.limeUsage && (
              <Grow in={selectedOptionsTimeout.limeUsage} timeout={500}>
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
                    <Opacity sx={{ fontSize: 20, color: "teal" }} />
                    <Typography
                      variant="h5"
                      sx={{ fontSize: 15, fontWeight: "bold", marginTop: 1 }}
                    >
                      Lime Usage
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ fontSize: 24, fontWeight: "bold", marginTop: 1 }}
                    >
                      {limeData[conductivityData.length - 1]?.toFixed(2) ||
                        "N/A"}
                    </Typography>
                    <Typography
                      sx={{ fontSize: 10, marginTop: 1, color: "gray" }}
                    >
                      Last Updated:{" "}
                      {limeData.length > 0
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
                title: "Chlorine Usage",
                key: 5004,
                data: chlorineData,
                color: "gold ",
                display: selectedOptions.chlorineUsageChart,
              },
              {
                title: "PAC Usage",
                key: 5005,
                data: pacData,
                color: "brown",
                display: selectedOptions.pacChart,
              },
              {
                title: "Lime Usage",
                key: 5006,
                data: limeData,
                color: "lightgreen",
                display: selectedOptions.limeUsageChart,
              },
            ].map(({ title, data, color, display }) => {
              if (display === false) return null;
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
                          fill: `url('#${title
                            .toLowerCase()
                            .replace(/\s/g, "")}')`,
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
            {selectedOptions.treatedChart && (
              <Grow in={selectedOptionsTimeout.treatedChart} timeout={500}>
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
                    {selectedTreatedOption} Overview
                  </Typography>

                  <div style={{ position: "absolute", top: 10, right: 10 }}>
                    <FormControl sx={{ m: 2, minWidth: 60 }} size="small">
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedTreatedOption}
                        onChange={(event) =>
                          handleTreatedSelectChange(
                            event.target.value as string
                          )
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
                        <MenuItem value="ChlorineUsage">
                          Chlorine Usage
                        </MenuItem>
                        <MenuItem value="PACUsage">PAC Usage</MenuItem>
                        <MenuItem value="LimeUsage">Lime Usage</MenuItem>
                      </Select>
                    </FormControl>
                  </div>

                  <LineChart
                    series={[{ data: treatedData, color: treatedColor }]}
                    height={300}
                    sx={{ width: "100%" }}
                  />
                </Card>
              </Grow>
            )}

            {selectedOptions.totalTreatedAnalysis && (
              <Grow
                in={selectedOptionsTimeout.totalTreatedAnalysis}
                timeout={500}
              >
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
                    Chemical Parameters Overview
                  </Typography>
                  <LineChart
                    series={[
                      {
                        label: "Chlorine Usage",
                        data: chlorineData,
                        color: "gold ",
                      },
                      {
                        label: "PAC Usage",
                        data: pacData,
                        color: "brown",
                      },
                      {
                        label: "Lime Usage",
                        data: limeData,
                        color: "lightgreen",
                      },
                    ]}
                    height={300}
                    sx={{ width: "100%" }}
                  />
                </Card>
              </Grow>
            )}
          </Grid2>
        </div>
      </Slide>
    </>
  );
};

export default Dashboard;
