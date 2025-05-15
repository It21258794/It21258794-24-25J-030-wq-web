import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Divider,
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
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Opacity, Science } from "@mui/icons-material";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const Chemical_Consumption = () => {
  interface UsageData {
    Turbidity: number;
    PH: number;
    Conductivity: number;
  }

  interface FuturePredictionData {
    predicted_water_production: number;
    predicted_conductivity: number;
    predicted_ph: number;
    predicted_turbidity: number;
    chlorine_usage: number;
    pac_usage: number;
    lime_usage: number;
  }

  const [setLastUsage] = useState<UsageData[]>([]);
  const [chlorine_usage, setchlorine_usage] = useState("");
  const [lime_usage, setlime_usage] = useState("");
  const [pac_usage, setpac_usage] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [futurePrediction, setfuturePrediction] = useState<FuturePredictionData | null>(null);
  const [futureview, setfutureview] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:8080/api/predict").then((res) => {
      setchlorine_usage(res.data.chlorine_usage);
      setlime_usage(res.data.lime_usage);
      setpac_usage(res.data.pac_usage);

      axios.get("http://localhost:8080/api/lastdaysusages")
        .then((res) => setLastUsage(res.data))
        .catch((err) => console.log(err));
    }).catch((err) => console.log(err));
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
          setfuturePrediction(res.data);
          setfutureview(true);
        })
        .catch((err) => console.log(err));
    }).catch((err) => console.log(err));
  };

  return (
    <Box sx={{ px: 4, py: 3 }}>
      <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
        <Typography variant="h5" sx={{ fontSize: 18, fontWeight: "bold", textAlign: "center", mt: 5 }}>
        Daily Predicted Chemical Usage
        </Typography>
      </motion.div>

      <Grid container spacing={3} justifyContent="center" sx={{ mt: 2 }}>
        {[{
          label: "Chlorine Usage",
          value: chlorine_usage,
          icon: <Biotech sx={{ fontSize: 20, color: "teal" }} />
        }, {
          label: "PAC Usage",
          value: pac_usage,
          icon: <Science sx={{ fontSize: 20, color: "teal" }} />
        }, {
          label: "Lime Usage",
          value: lime_usage,
          icon: <Opacity sx={{ fontSize: 20, color: "teal" }} />
        }].map((item, i) => (
          <Grid item key={i} xs={12} sm={6} md={4}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Card sx={{ width: "100%", textAlign: "center", p: 2, borderRadius: 3, boxShadow: 4 }}>
                <CardContent>
                  {item.icon}
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 1 }}>
                    {item.label}
                  </Typography>
                  <Typography variant="h6" sx={{ fontSize: 24, fontWeight: "bold" }}>
                    {Number(item.value).toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 5 }} />

      {/* Date Picker and Submit */}
      <Grid container spacing={2} justifyContent="center" alignItems="center">
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
            Predict Chemical Usage
          </Button>
        </Grid>
      </Grid>

      {/* Future Prediction Cards and Table */}
      {futureview && futurePrediction && (
        <>
          <Typography variant="h5" sx={{ fontSize: 18, textAlign: "center", mt: 5, fontWeight: "bold" }}>
            Chemical Usage for {selectedDate}
          </Typography>

          <Grid container spacing={3} justifyContent="center" sx={{ mt: 2 }}>
            {[{
              label: "Chlorine Usage",
              value: futurePrediction.chlorine_usage,
              icon: <Biotech sx={{ fontSize: 20, color: "teal" }} />
            }, {
              label: "PAC Usage",
              value: futurePrediction.pac_usage,
              icon: <Science sx={{ fontSize: 20, color: "teal" }} />
            }, {
              label: "Lime Usage",
              value: futurePrediction.lime_usage,
              icon: <Opacity sx={{ fontSize: 20, color: "teal" }} />
            }].map((item, i) => (
              <Grid item key={i} xs={12} sm={6} md={4}>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Card sx={{ textAlign: "center", p: 2, borderRadius: 3, boxShadow: 4 }}>
                    <CardContent>
                      {item.icon}
                      <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 1 }}>
                        {item.label}
                      </Typography>
                      <Typography variant="h6" sx={{ fontSize: 24, fontWeight: "bold" }}>
                        {Number(item.value).toFixed(2)}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Table for predicted parameters */}
          <Typography
  variant="h6"
  sx={{ fontSize: 18, textAlign: "center", mt: 4, fontWeight: "bold", display: "flex" }}
>
  Predicted Treated Water Quality Parameters
</Typography>

<TableContainer component={Paper} sx={{ mt: 2, mx: "auto", width: "100%", maxWidth: "100%" }}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell align="center" sx={{ width: "50%" }}>
          <b>Parameter</b>
        </TableCell>
        <TableCell align="center" sx={{ width: "50%" }}>
          <b>Value</b>
        </TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell align="center" sx={{ width: "50%" }}>
          Water Production
        </TableCell>
        <TableCell align="center" sx={{ width: "50%" }}>
          {futurePrediction.predicted_water_production.toFixed(2)}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell align="center" sx={{ width: "50%" }}>
          Conductivity
        </TableCell>
        <TableCell align="center" sx={{ width: "50%" }}>
          {futurePrediction.predicted_conductivity.toFixed(2)}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell align="center" sx={{ width: "50%" }}>
          pH
        </TableCell>
        <TableCell align="center" sx={{ width: "50%" }}>
          {futurePrediction.predicted_ph.toFixed(2)}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell align="center" sx={{ width: "50%" }}>
          Turbidity
        </TableCell>
        <TableCell align="center" sx={{ width: "50%" }}>
          {futurePrediction.predicted_turbidity.toFixed(2)}
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</TableContainer>
        </>
      )}
    </Box>
  );
};

export default Chemical_Consumption;
