import {
  Box,
  Card,
  Chip,
  FormControl,
  Grid2,
  MenuItem,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { LineChart } from "@mui/x-charts";
import "./WaterQualityPrediction.css";
import React from "react";
import { PredictionParameter } from "./types/api";
import { getFuturePredictions, getPredictions } from "./services/api";
import { AuthContext } from "../../components/auth/AuthProvider";

const WaterQualityPrediction = (): JSX.Element => {
  const authContext = React.useContext(AuthContext);
  const [predictionPeriod, setPredictionPeriod] = React.useState<number>(7);
  const [parameter, setParameter] = React.useState<PredictionParameter>("ph");
  const [predictions, setPredictions] = React.useState<number[]>([]);
  const [dates, setDates] = React.useState<string[]>([]);
  const [pastPredictionPeriod, setPastPredictionPeriod] =
    React.useState<number>(7);
  const [pastParameter, setPastParameter] =
    React.useState<PredictionParameter>("ph");
  const [futureParameter, setFutureParameter] = React.useState<any>("ph");
  const [pastPredictions, setPastPredictions] = React.useState<number[]>([]);
  const [pastDates, setPastDates] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [isPast, setIsPast] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);

  const token: any = authContext?.token;

  React.useEffect(() => {
    fetchPredictions(predictionPeriod, parameter, isPast);
  }, [predictionPeriod, parameter, isPast]);

  React.useEffect(() => {
    fetchPastPredictions(pastPredictionPeriod, pastParameter, isPast);
  }, [pastPredictionPeriod, pastParameter, isPast]);

  React.useEffect(() => {
    fetchFuturePredictions(futureParameter, page);
  }, [futureParameter, page]);

  const fetchPredictions = async (
    days: number,
    parameter: PredictionParameter,
    isPast: boolean
  ) => {
    authContext?.setIsLoading(true);
    setError(null);
    try {
      const result = await getPredictions(days, parameter, isPast, token);
      const formattedDates = result.dates.map((dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
      });
      setPredictions(result.values);
      setDates(formattedDates);
      setTimeout(() => {
        authContext?.setIsLoading(false);
      }, 1000);
    } catch (err) {
      setError("Failed to fetch predictions");
    } finally {
      // setLoading(false);
      console.log(error);
    }
  };

  const fetchPastPredictions = async (
    days: number,
    parameter: PredictionParameter,
    isPast: boolean
  ) => {
    // setLoading(true);
    setError(null);
    isPast = true;
    try {
      const result = await getPredictions(days, parameter, isPast, token);
      const formattedDates = result.dates.map((dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
      });
      setPastPredictions(result.values);
      setPastDates(formattedDates);
      console.log(pastDates);
      console.log(pastPredictions);
      console.log(setIsPast);
    } catch (err) {
      setError("Failed to fetch predictions");
    } finally {
      // setLoading(false);
    }
  };

  const fetchFuturePredictions = async (
    parameter: PredictionParameter,
    page: number
  ) => {
    // setLoading(true);
    setError(null);
    try {
      const pageSize = 10;
      const result: any = await getFuturePredictions(
        parameter,
        page,
        pageSize,
        token
      );
      console.log(result);
      if (result && Array.isArray(result.content)) {
        setRows(result.content);
        setTotalPages(result.pagination.totalPages);
      } else {
        setRows([]);
        setError("No valid data found");
      }
    } catch (err) {
      setError("Failed to fetch predictions");
    } finally {
      // setLoading(false);
    }
  };

  const handlePeriodChange = (event: SelectChangeEvent) => {
    if (event.target.name != null) {
      setPredictionPeriod(Number(event.target.value));
    }
  };

  const handleParameterChange = (event: SelectChangeEvent) => {
    if (event.target.name != null) {
      setParameter(event.target.value as PredictionParameter);
    }
  };

  const handlePastPeriodChange = (event: SelectChangeEvent) => {
    if (event.target.name != null) {
      setPastPredictionPeriod(Number(event.target.value));
    }
  };

  const handlePastParameterChange = (event: SelectChangeEvent) => {
    if (event.target.name != null) {
      setPastParameter(event.target.value as PredictionParameter);
    }
  };

  const handleFutureParameterChange = (event: SelectChangeEvent) => {
    if (event.target.name != null) {
      setFutureParameter(event.target.value as any);
    }
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    setPage(newPage - 1);
  };

  return (
    <>
      <Grid2
        container
        spacing={2}
        justifyContent="center"
        sx={{ marginTop: "20px" }}
      ></Grid2>
      <Grid2
        container
        spacing={2}
        justifyContent="center"
        sx={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
      >
        <Card className="lineChartCard">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
          >
            <Typography className="typographyStyles">
              {parameter.charAt(0).toUpperCase() + parameter.slice(1)}{" "}
              Prediction
            </Typography>
            <Box display="flex" gap={1}>
              <FormControl sx={{ m: 1, minWidth: 60 }} size="small">
                <Select
                  name="parameter"
                  id="demo-select-small"
                  value={parameter}
                  onChange={handleParameterChange}
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
                  <MenuItem value={"ph"}>Ph</MenuItem>
                  <MenuItem value={"turbidity"}>Turbidity</MenuItem>
                  <MenuItem value={"conductivity"}>Conductivity</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ m: 1, minWidth: 130 }} size="small">
                <Select
                  name="predictionPeriod"
                  id="demo-select-small"
                  value={String(predictionPeriod)}
                  onChange={handlePeriodChange}
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
                  <MenuItem value={7}>Next Week</MenuItem>
                  <MenuItem value={14}>Next Two Weeks</MenuItem>
                  <MenuItem value={30}>Next Month</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
          <></>
          <LineChart
            xAxis={[{ scaleType: "point", data: dates }]}
            series={[{ data: predictions }]}
            height={300}
          />
        </Card>
        <Card className="lineChartCard">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
          >
            <Typography className="typographyStyles">
              {pastParameter.charAt(0).toUpperCase() + pastParameter.slice(1)}{" "}
              Analysis
            </Typography>
            <Box display="flex" gap={1}>
              <FormControl sx={{ m: 1, minWidth: 60 }} size="small">
                <Select
                  name="turbidity"
                  id="demo-select-small"
                  value={String(pastParameter)}
                  onChange={handlePastParameterChange}
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
                  <MenuItem value={"ph"}>Ph</MenuItem>
                  <MenuItem value={"turbidity"}>Turbidity</MenuItem>
                  <MenuItem value={"conductivity"}>Conductivity</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ m: 1, minWidth: 130 }} size="small">
                <Select
                  name="week"
                  id="demo-select-small"
                  value={String(pastPredictionPeriod)}
                  onChange={handlePastPeriodChange}
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
                  <MenuItem value={7}>Last Week</MenuItem>
                  <MenuItem value={14}>Last Two Weeks</MenuItem>
                  <MenuItem value={30}>Last Month</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
          <></>
          <LineChart
            xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
            series={[
              { color: "red", data: [6, 3, 7, 9.5, 4, 2] },
              { color: "blue", data: [3, 1, 3, 6, 2, 1] },
            ]}
            height={300}
          />
        </Card>
        <Card className="cardContainer">
          <Box
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <Select
              name="parameter"
              id="demo-select-small"
              value={futureParameter}
              onChange={handleFutureParameterChange}
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
              <MenuItem value={"ph"}>Ph</MenuItem>
              <MenuItem value={"Turbidity"}>Turbidity</MenuItem>
              <MenuItem value={"Conductivity"}>Conductivity</MenuItem>
            </Select>
          </Box>
          <Table className="table">
            <TableHead>
              <TableRow>
                {[
                  "Date",
                  "Parameter",
                  "Predicted Value",
                  "Rainfall (mm)",
                  "Humidity (g/m³)",
                  "Temperature (°C)",
                  "Threshold Value",
                  "Status",
                ].map((header) => (
                  <TableCell
                    key={header}
                    className="table-header"
                    sx={header === "Date" ? { width: "110px" } : {}}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row: any, index) => {
                const predictedValue = futureParameter.includes("ph")
                  ? parseFloat(row.avgPh.toFixed(3))
                  : futureParameter.includes("Conductivity")
                  ? parseFloat(row.avgConductivity.toFixed(3))
                  : futureParameter.includes("Turbidity")
                  ? parseFloat(row.avgTurbidity.toFixed(3))
                  : 0;
                const status =
                  predictedValue > row.threshold ? "Exceeds" : "Good";
                const isActive = status === "Good";

                return (
                  <TableRow key={index}>
                    <TableCell className="table-cell">
                      {row.date.split("T")[0]}
                    </TableCell>
                    <TableCell className="table-cell">
                      {" "}
                      {futureParameter}{" "}
                    </TableCell>
                    <TableCell className="table-cell">
                      {predictedValue}
                    </TableCell>
                    <TableCell className="table-cell">
                      {row.weatherReadings[0]?.rainfall}
                    </TableCell>
                    <TableCell className="table-cell">
                      {row.weatherReadings[0]?.humidity}
                    </TableCell>
                    <TableCell className="table-cell">
                      {row.weatherReadings[0]?.temp}
                    </TableCell>
                    <TableCell className="table-cell">
                      {row.threshold}
                    </TableCell>
                    <TableCell className="table-cell">
                      <Chip
                        sx={{
                          fontSize: "0.6rem",
                          height: "20px",
                          width: "80px",
                          backgroundColor: isActive ? "#a8f1d4" : "#fdd5d5",
                          color: isActive ? "#008000" : "#ff0000",
                          border: `1px solid ${
                            isActive ? "#008000" : "#ff0000"
                          }`,
                          borderRadius: "5px",
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                        label={status}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <Stack spacing={2} sx={{ marginTop: "10px" }}>
            <Pagination
              count={totalPages}
              page={page + 1}
              onChange={handlePageChange}
            />
          </Stack>
        </Card>
      </Grid2>
    </>
  );
};

export default WaterQualityPrediction;
