import React, { useState } from "react";
import {
  Box,
  Card,
  Chip,
  FormControl,
  Grid,
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
import "./Chemical_Consumption.css";

const Chemical_Consumption = (): JSX.Element => {
  const [chemical, setChemical] = useState("lime");
  const [timePeriod, setTimePeriod] = useState("today");
  const [multiGraphTime, setMultiGraphTime] = useState("today");

  const handleChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    if (name === "chemical") setChemical(value);
    else if (name === "timePeriod") setTimePeriod(value);
    else if (name === "multiGraphTime") setMultiGraphTime(value);
  };

  // Sample data for today’s prediction
  const todayPrediction = {
    lime: { value: 5.2, threshold: 6.0, unit: "mg/L" },
    pac: { value: 3.8, threshold: 5.0, unit: "mg/L" },
    chlorine: { value: 2.5, threshold: 4.0, unit: "mg/L" },
  };

  // Function to determine status based on threshold
  const getStatus = (value: number, threshold: number) => {
    if (value < threshold * 0.7) return { label: "Safe", color: "#28a745" };
    if (value < threshold) return { label: "Caution", color: "#ffc107" };
    return { label: "Danger", color: "#dc3545" };
  };

  // Sample historical and future prediction data
  const timeSeriesData: Record<string, number[]> = {
    lime: [4.5, 5.2, 5.8, 5.1, 4.9, 5.3],
    pac: [3.2, 3.8, 4.1, 3.7, 3.6, 3.9],
    chlorine: [2.1, 2.5, 2.8, 2.4, 2.3, 2.6],
  };

  return (
    <Grid container spacing={2} justifyContent="center" sx={{ marginTop: "20px" }}>
      {/* Today's Prediction */}
      <Card className="predictionCard">
        <Typography className="headerText">Today's Prediction</Typography>
        <Box className="predictionBox">
          {Object.entries(todayPrediction).map(([chem, data]) => {
            const status = getStatus(data.value, data.threshold);
            return (
              <Chip
                key={chem}
                label={`${chem.toUpperCase()}: ${data.value} ${data.unit} (${status.label})`}
                style={{ backgroundColor: status.color, color: "white", fontWeight: "bold" }}
              />
            );
          })}
        </Box>
      </Card>

      {/* Individual Chemical Graph */}
      <Card className="graphCard">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography className="headerText">Chemical Prediction Trend</Typography>
          <Box display="flex" gap={2}>
            <FormControl sx={{ minWidth: 150 }} size="small">
              <InputLabel>Chemical</InputLabel>
              <Select name="chemical" value={chemical} onChange={handleChange}>
                <MenuItem value="lime">Lime</MenuItem>
                <MenuItem value="pac">Poly Aluminium Chloride</MenuItem>
                <MenuItem value="chlorine">Chlorine</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 150 }} size="small">
              <InputLabel>Time Period</InputLabel>
              <Select name="timePeriod" value={timePeriod} onChange={handleChange}>
                <MenuItem value="past">Past Week</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="future">Next Week</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
        <LineChart
          xAxis={[{ data: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6"], scaleType: "point" }]}
          series={[{ data: timeSeriesData[chemical], color: chemical === "lime" ? "green" : chemical === "pac" ? "blue" : "red" }]}
          width={700}
          height={300}
        />
      </Card>

      {/* Multi-Chemical Graph */}
      <Card className="graphCard">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography className="headerText">Overall Chemical Trends</Typography>
          <FormControl sx={{ minWidth: 150 }} size="small">
            <InputLabel>Time Period</InputLabel>
            <Select name="multiGraphTime" value={multiGraphTime} onChange={handleChange}>
              <MenuItem value="past">Past Week</MenuItem>
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="future">Next Week</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <LineChart
          xAxis={[{ data: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6"], scaleType: "point" }]}
          series={[
            { data: timeSeriesData["lime"], color: "green", label: "Lime" },
            { data: timeSeriesData["pac"], color: "blue", label: "PAC" },
            { data: timeSeriesData["chlorine"], color: "red", label: "Chlorine" },
          ]}
          width={700}
          height={300}
        />
      </Card>

      {/* Data Table */}
      <Card className="tableCard">
        <Typography className="headerText">Threshold and Prediction Data</Typography>
        <Table className="table">
          <TableHead>
            <TableRow>
              {["Chemical", "Predicted Value", "Threshold Value", "Status"].map((header) => (
                <TableCell key={header} className="table-header">{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(todayPrediction).map(([chem, data]) => {
              const status = getStatus(data.value, data.threshold);
              return (
                <TableRow key={chem}>
                  <TableCell>{chem.toUpperCase()}</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>{data.value} {data.unit}</TableCell>
                  <TableCell>{data.threshold} {data.unit}</TableCell>
                  <TableCell>
                    <Chip label={status.label} style={{ backgroundColor: status.color, color: "white" }} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </Grid>
  );
};

export default Chemical_Consumption;
