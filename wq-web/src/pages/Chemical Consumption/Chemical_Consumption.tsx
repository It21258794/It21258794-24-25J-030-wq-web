import {
  Button,
  Card,
  CardContent,
  Grid,
  Grid2,
  TextField,
  Typography,
} from "@mui/material";
import { LineChart } from "@mui/x-charts";
import axios from "axios";
import { useEffect, useState } from "react";
import { Divider } from "@mui/material";

const Chemical_Consumption = () => {
  interface UsageData {
    Turbidity: number;
    PH: number;
    Conductivity: number;
  }

  const [lastUsage, setLastUsage] = useState<UsageData[]>([]);
  const [chlorine_usage, setchlorine_usage] = useState("");
  const [lime_usage, setlime_usage] = useState("");
  const [pac_usage, setpac_usage] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [temp_c, settemp_c] = useState(0);
  const [humidity, sethumidity] = useState(0);
  const [precip_mm, setprecip_mm] = useState(0);
  const [cloud, setcloud] = useState(0);
  interface FuturePredictionData {
    predicted_water_production: number;
    predicted_conductivity: number;
    predicted_ph: number;
    predicted_turbidity: number;
    chlorine_usage: number;
    pac_usage: number;
    lime_usage: number;
  }

  const [futurePrediction, setfuturePrediction] = useState<FuturePredictionData | null>(null);
  const [viewbtn, setviewbtn] = useState(false);
  const [futureview, setfutureview] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/predict")
      .then((res) => {
        setchlorine_usage(res.data.chlorine_usage);
        setlime_usage(res.data.lime_usage);
        setpac_usage(res.data.pac_usage);

        axios
          .get("http://localhost:8080/api/lastdaysusages")
          .then((res) => {
            setLastUsage(res.data);
            console.log(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [chlorine_usage]);

  // Extracting data for charts
  const xAxisData = lastUsage.map((_, index) => index + 1);
  const turbidityData = lastUsage.map((item) => item.Turbidity);
  const phData = lastUsage.map((item) => item.PH);
  const conductivityData = lastUsage.map((item) => item.Conductivity);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };
  console.log(weatherData);
  const fetchWeatherData = () => {
    if (!selectedDate) return;
    const apiKey = import.meta.env.VITE_APP_WEATHER_API_KEY;

    const location = import.meta.env.VITE_LOCATION; // Example coordinates (Paris)
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&dt=${selectedDate}`;

    axios
      .get(url)
      .then((res) => {
        setWeatherData(res.data.forecast.forecastday[0]);
        console.log(res.data.forecast.forecastday[0].day);
        settemp_c(res.data.forecast.forecastday[0].day.avgtemp_c);
        sethumidity(res.data.forecast.forecastday[0].day.avghumidity);
        setprecip_mm(res.data.forecast.forecastday[0].day.totalprecip_mm);
        setcloud(res.data.forecast.forecastday[0].hour[0].cloud);
        setviewbtn(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const SubmitData = () => {
    // Split the date into parts
    const [year, month, day] = selectedDate.split("-");

    const ob = {
      day,
      month,
      year,
      temp_c,
      humidity,
      precip_mm,
      cloud,
    };

    axios
      .post("http://localhost:8080/api/future-predict", ob)
      .then((res) => {
        setfuturePrediction(res.data);
        console.log(res.data);
        setfutureview(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Card
        sx={{
          textAlign: "center",
          borderRadius: 2,
          boxShadow: 3,
          width: "93%",
          margin: "0 auto",
        }}
      >
        <CardContent>
          <Typography variant="h5" sx={{ fontSize: 15, fontWeight: "bold" }}>
            Historical Data
          </Typography>
        </CardContent>
      </Card>
      <Grid2
        container
        spacing={2}
        justifyContent="center"
        sx={{ marginTop: "20px", marginBottom: "20px" }}
      >
        <Card
          sx={{
            textAlign: "center",

            boxShadow: 3,
            width: "30%",
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              sx={{
                fontSize: 15,
                fontWeight: "bold",
                marginTop: 1,
                color: "#efcc00",
              }}
            >
              Turbidity
            </Typography>
            <LineChart
              xAxis={[{ data: xAxisData }]}
              series={[{ data: turbidityData, color: "#efcc00" }]}
              width={300}
              height={200}
            />
            <Typography sx={{ fontSize: 10, color: "gray" }}>
              Last 5 days
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            textAlign: "center",

            boxShadow: 3,
            width: "30%",
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              sx={{
                fontSize: 15,
                fontWeight: "bold",
                marginTop: 1,
                color: "#c71585",
              }}
            >
              PH
            </Typography>
            <LineChart
              xAxis={[{ data: xAxisData }]}
              series={[{ data: phData, color: "#c71585" }]}
              width={300}
              height={200}
            />
            <Typography sx={{ fontSize: 10, color: "gray" }}>
              Last 5 days
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            textAlign: "center",

            boxShadow: 3,
            width: "30%",
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              sx={{
                fontSize: 15,
                fontWeight: "bold",
                marginTop: 1,
                color: "#4169e1",
              }}
            >
              Conductivity
            </Typography>
            <LineChart
              xAxis={[{ data: xAxisData }]}
              series={[{ data: conductivityData, color: "#4169e1" }]}
              width={300}
              height={200}
            />
            <Typography sx={{ fontSize: 10, color: "gray" }}>
              Last 5 days
            </Typography>
          </CardContent>
        </Card>
      </Grid2>

      {/* <Card
        sx={{
          textAlign: "center",
          borderRadius: 2,
          boxShadow: 0,
          width: "93%",
          margin: "0 auto",
        }}
      >
        <CardContent> */}
          <Typography variant="h5" sx={{ fontSize: 15, fontWeight: "bold", textAlign: "center" }}>
            Daily Prediction Data
          </Typography>
        {/* </CardContent>
      </Card> */}

      <Grid2
        container
        spacing={2}
        justifyContent="center"
        sx={{ marginTop: "20px", marginBottom: "20px" }}
      >
        <Card
          sx={{
            textAlign: "center",
            borderRadius: 2,
            boxShadow: 3,
            width: "30%",
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              sx={{
                fontSize: 15,
                fontWeight: "bold",
                marginTop: 1,
                color: "#efcc00",
              }}
            >
              {" "}
              Chlorine{" "}
            </Typography>
            <Typography variant="h5" sx={{ fontSize: 15, fontWeight: "bold",marginTop: 3 }}>
              {chlorine_usage}
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            textAlign: "center",
            borderRadius: 2,
            boxShadow: 3,
            width: "30%",
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              sx={{
                fontSize: 15,
                fontWeight: "bold",
                marginTop: 1,
                color: "#c71585",
              }}
            >
              {" "}
              PAC{" "}
            </Typography>
            <Typography variant="h5" sx={{ fontSize: 15, fontWeight: "bold", marginTop: 3 }}>
              {pac_usage}
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            textAlign: "center",
            borderRadius: 2,
            boxShadow: 3,
            width: "30%",
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              sx={{
                fontSize: 15,
                fontWeight: "bold",
                marginTop: 1,
                color: "#4169e1",
              }}
            >
              {" "}
              Lime{" "}
            </Typography>

            <Typography variant="h5" sx={{ fontSize: 15, fontWeight: "bold", marginTop: 3 }}>
              {lime_usage}
            </Typography>
          </CardContent>
        </Card>
      </Grid2>

      <Typography variant="h5" sx={{ fontSize: 15, fontWeight: "bold", textAlign: "center", mb: 4, mt: 4 }}>   
            Future Prediction Data
          </Typography>
      <Card
        sx={{
          textAlign: "center",
          borderRadius: 2,
          boxShadow: 3,
          width: "93%",
          margin: "0 auto",
        }}
      >
        <CardContent>

      <Grid2
         container
         spacing={2}
         justifyContent="center"
         sx={{ marginTop: "20px", marginBottom: "20px" }}
        >
            <TextField
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            sx={{
              height: "30px",
              "& .MuiInputBase-root": {
                height: "40px",
                fontSize: "12px",
                padding: "4px 8px",
              }
            }}
            />
  
        <Button
          variant="contained"
          size="small"
          onClick={fetchWeatherData}
          sx={{ fontSize: 10, padding: "2px 8px", minWidth: "auto",height: "40px", backgroundColor: "#102D4D", fontWeight: "bold" }}
        >
              Get Weather
        </Button>

          {viewbtn && (
        <Button
         variant="contained"
         size="small"
         onClick={SubmitData}
         sx={{ fontSize: 10, padding: "2px 8px", minWidth: "auto", height: "40px", backgroundColor: "#102D4D", fontWeight: "bold" }}
        >
           Future Predict
        </Button>
                   )}
      </Grid2>

          {viewbtn ? (
            <>
              <Typography
                variant="h5"
                sx={{ fontSize: 15, fontWeight: "bold", marginTop:'40px', textAlign: "center" }}
              >
                Weather API Data
              </Typography>

              <Grid
                container
                spacing={2}
                sx={{ marginTop: "10px", marginBottom: "30px" }}
              >
                <Grid item xs={3}>
                  <Typography
                    variant="h3"
                    sx={{ fontSize: 13, fontWeight: "bold", color: "#8b0000" }}
                  >
                    Temperature
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontSize: 15, fontWeight: "bold", color: "#8b0000" }}
                  >
                    {temp_c}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography
                    variant="h3"
                    sx={{ fontSize: 13, fontWeight: "bold", color: "#b8860b" }}
                  >
                    Humidity
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontSize: 15, fontWeight: "bold", color: "#b8860b" }}
                  >
                    {humidity}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography
                    variant="h3"
                    sx={{ fontSize: 13, fontWeight: "bold", color: "#0047ab" }}
                  >
                    Precipitation
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontSize: 15, fontWeight: "bold", color: "#0047ab" }}
                  >
                    {precip_mm}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography
                    variant="h3"
                    sx={{ fontSize: 13, fontWeight: "bold", color: "#555555" }}
                  >
                    Cloud
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontSize: 15, fontWeight: "bold", color: "#555555" }}
                  >
                    {cloud}
                  </Typography>
                </Grid>
              </Grid>
            </>
          ) : null}

          <Divider sx={{ width: "100%", backgroundColor: "#ededed", marginY: 2 }} />
          {futureview ? <>
            <Typography
                variant="h5"
                sx={{ fontSize: 15, fontWeight: "bold", marginTop:'40px', textAlign: "center" }}
              >
                Water Quality
              </Typography>
            <Grid
              container
              spacing={2}
              sx={{ marginTop: "10px", marginBottom: "30px" }}
            >
              <Grid item xs={3}>
                <Typography
                variant="h3"
                sx={{ fontSize: 13, fontWeight: "bold", color: "black" }}
                >
                  Predicted Water Production
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ fontSize: 15, fontWeight: "bold", color: "black" }}
                >
                  {futurePrediction && futurePrediction.predicted_water_production.toFixed(2)}
                </Typography>
              </Grid>

              <Grid item xs={3}>
                <Typography
                  variant="h3"
                  sx={{ fontSize: 13, fontWeight: "bold", color: "black" }}
                >
                  Predicted Conductivity
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ fontSize: 15, fontWeight: "bold", color: "black" }}
                >
                  {futurePrediction ? futurePrediction.predicted_conductivity.toFixed(2) : 'N/A'}
                </Typography>
              </Grid>

              <Grid item xs={3}>
                <Typography
                  variant="h3"
                  sx={{ fontSize: 13, fontWeight: "bold", color: "black" }}
                >
                  Predicted PH
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ fontSize: 15, fontWeight: "bold", color: "black" }}
                >
                  {futurePrediction ? futurePrediction.predicted_ph.toFixed(2) : 'N/A'}
                </Typography>
              </Grid>

              <Grid item xs={3}>
                <Typography
                  variant="h3"
                  sx={{ fontSize: 13, fontWeight: "bold", color: "black" }}
                >
                  Predicted Turbidity
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ fontSize: 15, fontWeight: "bold", color: "black" }}
                >
                  {futurePrediction ? futurePrediction.predicted_turbidity.toFixed(2) : 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          </> : null}

          <Divider sx={{ width: "100%", backgroundColor: "#ededed", marginY: 2 }} />


          {futureview ? <>
            <Typography
                variant="h5"
                sx={{ fontSize: 15, fontWeight: "bold", marginTop:'40px', textAlign: "center" }}
              >
                Future Chemical Prediction
              </Typography>
            <Grid
              container
              spacing={2}
              sx={{ marginTop: "10px", marginBottom: "30px" }}
            >
              <Grid item xs={4}>
                <Typography
                  variant="h3"
                  sx={{ fontSize: 13, fontWeight: "bold", color: "#efcc00" }}
                >
                  Chlorine
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ fontSize: 15, fontWeight: "bold", color: "#efcc00" }}
                >
                  {futurePrediction ? futurePrediction.chlorine_usage.toFixed(4) : 'N/A'}
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <Typography
                  variant="h3"
                  sx={{ fontSize: 13, fontWeight: "bold", color: "#c71585" }}
                >
                  PAC
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ fontSize: 15, fontWeight: "bold", color: "#c71585" }}
                >
                  {futurePrediction ? futurePrediction.pac_usage.toFixed(4) : 'N/A'}
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <Typography
                  variant="h3"
                  sx={{ fontSize: 13, fontWeight: "bold", color: "#4169e1" }}
                >
                  Lime
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ fontSize: 15, fontWeight: "bold", color: "#4169e1" }}
                >
                  {futurePrediction ? futurePrediction.lime_usage.toFixed(4) : 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          </> : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default Chemical_Consumption;
