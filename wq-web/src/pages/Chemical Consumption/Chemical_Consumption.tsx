import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import axios from "axios";
import Biotech from '@mui/icons-material/Biotech';
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Opacity, Science } from "@mui/icons-material";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const Chemical_Consumption = () => {
  interface FuturePredictionData {
    chlorine_usage: number;
    pac_usage: number;
    lime_usage: number;
  }

  const [chemicalUsage, setChemicalUsage] = useState<FuturePredictionData>({
    chlorine_usage: 0,
    pac_usage: 0,
    lime_usage: 0
  });

  const [selectedDate, setSelectedDate] = useState("");
  const [title, setTitle] = useState("Daily Predicted Chemical Usage");
  const [history, setHistory] = useState<(FuturePredictionData & { date: string })[]>([]);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    axios.get("http://localhost:8080/api/predict")
      .then((res) => {
        setChemicalUsage({
          chlorine_usage: res.data.chlorine_usage,
          pac_usage: res.data.pac_usage,
          lime_usage: res.data.lime_usage
        });
      })
      .catch((err) => console.log(err));
  }, []);


  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const handleSubmit = () => {
    if (!selectedDate) return;

    const apiKey = import.meta.env.VITE_APP_WEATHER_API_KEY;
    const location = import.meta.env.VITE_LOCATION;
    const weatherURL = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&dt=${selectedDate}`;

    axios.get(weatherURL).then((res) => {
      const dayData = res.data.forecast.forecastday[0].day;
      const cloudData = res.data.forecast.forecastday[0].hour[0].cloud;

      const [year, month, day] = selectedDate.split("-");
      const dataToSend = {
        day,
        month,
        year,
        temp_c: dayData.avgtemp_c,
        humidity: dayData.avghumidity,
        precip_mm: dayData.totalprecip_mm,
        cloud: cloudData
      };

      axios.post("http://localhost:8080/api/future-predict", dataToSend)
        .then((res) => {
          const newPrediction = {
            chlorine_usage: res.data.chlorine_usage,
            pac_usage: res.data.pac_usage,
            lime_usage: res.data.lime_usage
          };
          setChemicalUsage(newPrediction);
          setTitle(`Chemical Usage for\n${selectedDate}`);
          setHistory(prev => [
            ...prev,
            {
              date: selectedDate,
              ...newPrediction
            }
          ]);
        })
        .catch((err) => console.log(err));
    }).catch((err) => console.log(err));
  };

  const handlePrint = () => {
    if (reportRef.current) {
      const printContents = reportRef.current.innerHTML;
      const win = window.open("", "_blank");
      win?.document.write(`
        <html>
          <head>
            <title>Chemical Usage Report</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #888; padding: 8px; text-align: center; }
              th { background-color: #f0f0f0; }
              h2 { text-align: center; }
            </style>
          </head>
          <body>
            ${printContents}
          </body>
        </html>
      `);
      win?.document.close();
      win?.print();
    }
  };

  const chemicalData = [
    {
      label: "Chlorine Usage (Kg)",
      value: chemicalUsage.chlorine_usage,
      icon: <Biotech sx={{ fontSize: 20, color: "teal" }} />
    },
    {
      label: "PAC Usage (Kg)",
      value: chemicalUsage.pac_usage,
      icon: <Science sx={{ fontSize: 20, color: "teal" }} />
    },
    {
      label: "Lime Usage (Kg)",
      value: chemicalUsage.lime_usage,
      icon: <Opacity sx={{ fontSize: 20, color: "teal" }} />
    }
  ];

  return (
    <Box sx={{ px: 4, py: 3 }}>
      <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
        <Typography
          variant="h5"
          sx={{
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
            mt: 5,
            whiteSpace: "pre-line"
          }}
        >
          {title}
        </Typography>
      </motion.div>

      <Grid container spacing={2} justifyContent="left" alignItems="center" sx={{ mt: 6 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            label="Select Date"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm="auto">
          <Button
            disabled={!selectedDate}
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ height: 56, minWidth: 160 }}
          >
            Predict Usage
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={3} justifyContent="center" sx={{ mt: 2 }}>
        {chemicalData.map((item, i) => (
          <Grid item key={i} xs={12} sm={6} md={4}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Card sx={{ width: "100%", textAlign: "center", p: 2, borderRadius: 3, boxShadow: 4 }}>
                <CardContent>
                  {item.icon}
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 1 }}>
                    {item.label}
                  </Typography>
                  <Typography variant="h6" sx={{ fontSize: 24, fontWeight: "bold" }}>
                    {Number(item.value).toFixed(2)} Kg
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {history.length > 0 && (
        <Box ref={reportRef}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, mt: 5, textAlign: "center" }}>
            Prediction Search Report
          </Typography>

          <Grid container justifyContent="flex-end" sx={{ mb: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={handlePrint}
            >
              Report
            </Button>
          </Grid>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Chlorine (Kg)</strong></TableCell>
                  <TableCell><strong>PAC (Kg)</strong></TableCell>
                  <TableCell><strong>Lime (Kg)</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.chlorine_usage.toFixed(2)}</TableCell>
                    <TableCell>{row.pac_usage.toFixed(2)}</TableCell>
                    <TableCell>{row.lime_usage.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default Chemical_Consumption;
