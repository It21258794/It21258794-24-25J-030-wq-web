import {
  Box,
  Card,
  Chip,
  FormControl,
  Grid2,
  InputLabel,
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
import { LineChart } from "@mui/x-charts";
import "./WaterQualityPrediction.css";
import React from "react";

const WaterQualityPrediction = (): JSX.Element => {
  const [Turbidity, setTurbidity] = React.useState("");
  const [Week, setWeek] = React.useState("");
  const [predictions, setPredictions] = React.useState([]);
  const [dates, setDates] = React.useState([]);

  React.useEffect(() => {
    const fetchPredictions = async () => {
      const requestData = {
        last_known_data: [
          3.5, 3.6, 3.7, 3.8, 3.6, 3.5, 3.4, 3.3, 3.2, 3.1,
          3.0, 2.9, 2.8, 2.7, 2.6, 2.5, 2.4, 2.3, 2.2, 2.1,
          2.0, 1.9, 1.8, 1.7, 1.6, 1.5, 1.4, 1.3, 1.2, 1.1,
        ], 
        days: 7,
      };

      try {
        const response = await fetch("http://127.0.0.1:5000/predict", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        const data = await response.json();

        if (response.ok) {
          console.log(data.dates);
          setDates(data.dates);
          setPredictions(data.predictions);
        } else {
          throw new Error(data.error || "Failed to fetch predictions");
        }
      } catch (err:any) {
        console.log(err.message);
      }
    };

    fetchPredictions();
  }, []);

  const handleChange = (event: SelectChangeEvent) => {
    if (event.target.name === "week") {
      setWeek(event.target.value);
    } else if (event.target.name === "turbidity") {
      setTurbidity(event.target.value);
    }
  };

  const rows = [
    {
      date: "2024-02-04",
      parameter: "Turbidity",
      predictedValue: 5.4,
      rainfall: 12,
      flowRate: 3.2,
      depth: 1.5,
      threshold: 7,
      status: "Active",
    },
    {
      date: "2024-02-05",
      parameter: "pH",
      predictedValue: 7.2,
      rainfall: 8,
      flowRate: 2.9,
      depth: 1.3,
      threshold: 6.5,
      status: "Inactive",
    },
  ];

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
        spacing={10}
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
              Turbidity Prediction
            </Typography>
            <Box display="flex" gap={2}>
              <FormControl sx={{ m: 1, minWidth: 130 }} size="small">
                <InputLabel id="demo-select-small-label">Turbidity</InputLabel>
                <Select
                  name="turbidity"
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  value={Turbidity}
                  label="Turbidity"
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ m: 1, minWidth: 130 }} size="small">
                <InputLabel id="demo-select-small-label">Next Week</InputLabel>
                <Select
                  name="week"
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  value={Week}
                  label="Last Week"
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
          <></>
          <LineChart
  xAxis={[{ scaleType: "point", data: dates }]} // Ensure scaleType is set correctly
  series={[{ data: predictions }]} // Ensure predictions align with dates
  width={720}
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
              Turbidity Analysis
            </Typography>
            <Box display="flex" gap={2}>
              <FormControl sx={{ m: 1, minWidth: 130 }} size="small">
                <InputLabel id="demo-select-small-label">Turbidity</InputLabel>
                <Select
                  name="turbidity"
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  value={Turbidity}
                  label="Turbidity"
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ m: 1, minWidth: 130 }} size="small">
                <InputLabel id="demo-select-small-label">Last Week</InputLabel>
                <Select
                  name="week"
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  value={Week}
                  label="Last Week"
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
          <></>
          <LineChart
            xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
            series={[
              { color: "green", data: [0, 5, 2, 6, 3, 9.3] },
              { color: "red", data: [6, 3, 7, 9.5, 4, 2] },
              { color: "blue", data: [3, 1, 3, 6, 2, 1] },
            ]}
            width={720}
            height={300}
          />
        </Card>
        <Card className="cardContainer">
          <Table className="table">
            <TableHead>
              <TableRow>
                {[
                  "Date",
                  "Parameter",
                  "Predicted Value",
                  "Rainfall (mm)",
                  "Flow Rate (m³/s)",
                  "Depth (m)",
                  "Threshold Value",
                  "Status",
                ].map((header) => (
                  <TableCell key={header} className="table-header">
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="table-cell">{row.date}</TableCell>
                  <TableCell className="table-cell">{row.parameter}</TableCell>
                  <TableCell className="table-cell">
                    {row.predictedValue}
                  </TableCell>
                  <TableCell className="table-cell">{row.rainfall}</TableCell>
                  <TableCell className="table-cell">{row.flowRate}</TableCell>
                  <TableCell className="table-cell">{row.depth}</TableCell>
                  <TableCell className="table-cell">{row.threshold}</TableCell>
                  <TableCell className="table-cell">
                    <Chip
                      label={row.status}
                      sx={{
                        fontSize: "0.6rem",
                        height: "20px",
                        width: "80px",
                        backgroundColor:
                          row.status === "Active" ? "#a8f1d4" : "#fdd5d5",
                        color: row.status === "Active" ? "#008000" : "#ff0000",
                        border: `1px solid ${
                          row.status === "Active" ? "#008000" : "#ff0000"
                        }`,
                        borderRadius: "5px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </Grid2>
    </>
  );
};

export default WaterQualityPrediction;
