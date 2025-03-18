import React, { useState, useContext } from "react";
import { TextField, Button, Card, CardContent, Typography, Grid, Box, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "@fontsource/poppins"; // Import Poppins font
import { predictTreatedWater } from "../../server/flow-customisation/flow-customisationAPI";// Import the API function
import { AuthContext } from "../../components/auth/AuthProvider";

const PredictionForm: React.FC = () => {
  const [inputValues, setInputValues] = useState({
    ph: "",
    turbidity: "",
    conductivity: "",
  });
  const [predictedValues, setPredictedValues] = useState<{ treated_ph: number; treated_turbidity: number; treated_conductivity: number } | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertSeverity, setAlertSeverity] = useState<"error" | "warning" | "info" | "success">();

const authcontext = React.useContext(AuthContext);
  const token: string | undefined = authcontext?.token;
    const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValues({ ...inputValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Call the API to predict treated water values
      const response = await predictTreatedWater(
        {
          raw_turbidity: parseFloat(inputValues.turbidity),
          raw_ph: parseFloat(inputValues.ph),
          raw_conductivity: parseFloat(inputValues.conductivity),
        },
        token // Pass the token here
      );

      // Set the predicted values
      setPredictedValues({
        treated_ph: response.treated_ph,
        treated_turbidity: response.treated_turbidity,
        treated_conductivity: response.treated_conductivity,
      });

      // Show success message
      setAlertMessage("Prediction successful!");
      setAlertSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      // Handle errors
      setAlertMessage("Failed to predict values. Please try again.");
      setAlertSeverity("error");
      setOpenSnackbar(true);
      console.error("Error:", error);
    }
  };

  const handleBack = () => {
    navigate(`/user/flowCustomization/`);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
        backgroundColor: "#F1F2F7",
        width: "full",
        maxWidth: "full",
        boxSizing: "border-box",
        fontFamily: "Poppins, sans-serif", // Set font for Box
        flexDirection: "column", // Align items vertically
      }}
    >
      <Card
        sx={{
          padding: 4,
          width: 400,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          borderRadius: 2,
          fontFamily: "Poppins, sans-serif", // Set font for Card
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ textAlign: "center", fontFamily: "Poppins, sans-serif" }}
        >
          Last Stage Values Prediction
        </Typography>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="pH Value"
              name="ph"
              type="number"
              variant="outlined"
              fullWidth
              margin="normal"
              value={inputValues.ph}
              onChange={handleChange}
              required
              sx={{ fontFamily: "Poppins, sans-serif" }}
            />
            <TextField
              label="Turbidity Value"
              name="turbidity"
              type="number"
              variant="outlined"
              fullWidth
              margin="normal"
              value={inputValues.turbidity}
              onChange={handleChange}
              required
              sx={{ fontFamily: "Poppins, sans-serif" }}
            />
            <TextField
              label="Conductivity Value"
              name="conductivity"
              type="number"
              variant="outlined"
              fullWidth
              margin="normal"
              value={inputValues.conductivity}
              onChange={handleChange}
              required
              sx={{ fontFamily: "Poppins, sans-serif" }}
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "#102D4D",
                  color: "white",
                  fontFamily: "Poppins, sans-serif",
                  "&:hover": { backgroundColor: "#154273" },
                }}
              >
                Predict
              </Button>
              <Button
                variant="outlined"
                sx={{
                  backgroundColor: "#F1F2F7",
                  color: "#8F8F8F",
                  borderColor: "#8F8F8F",
                  fontFamily: "Poppins, sans-serif",
                  "&:hover": { backgroundColor: "#E0E0E0", borderColor: "#6F6F6F" },
                }}
                onClick={handleBack}
              >
                Back
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>

      {/* Predicted Values Cards */}
      {predictedValues && (
        <Grid container spacing={2} sx={{ marginTop: 4, width: "100%", maxWidth: 600 }}>
          {["pH", "Turbidity", "Conductivity"].map((key, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6" align="center">
                    {key} (Predicted)
                  </Typography>
                  <Typography variant="h4" align="center" color="primary">
                    {predictedValues[`treated_${key.toLowerCase()}` as keyof typeof predictedValues].toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Snackbar for Alerts */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={alertSeverity}
          sx={{ width: "100%", fontFamily: "Poppins, sans-serif" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PredictionForm;