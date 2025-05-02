import React, { useState, useContext } from "react";
import { TextField, Button, Typography, Grid, Box, Snackbar, Alert, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { predictTreatedWater } from "./server/flow-customisationAPI";
import { AuthContext } from "../../components/auth/AuthProvider";

const PredictionForm: React.FC = () => {
  const [inputValues, setInputValues] = useState({
    ph: "",
    turbidity: "",
    conductivity: "",
  });
  const [predictedValues, setPredictedValues] = useState<{ 
    treated_ph: number; 
    treated_turbidity: number; 
    treated_conductivity: number 
  } | null>(null);
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
      const response = await predictTreatedWater(
        {
          raw_turbidity: parseFloat(inputValues.turbidity),
          raw_ph: parseFloat(inputValues.ph),
          raw_conductivity: parseFloat(inputValues.conductivity),
        },
        token
      );

      setPredictedValues({
        treated_ph: response.treated_ph,
        treated_turbidity: response.treated_turbidity,
        treated_conductivity: response.treated_conductivity,
      });

      setAlertMessage("Prediction successful!");
      setAlertSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
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
    <Grid container spacing={2} sx={{ padding: 2, backgroundColor: "#F1F2F7" }}>
      <Grid item xs={12} md={8}>
        <Paper 
          sx={{ 
            padding: 2, 
            height: "96%",
            backgroundColor: "white",
            borderRadius: 3,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ 
              fontWeight: "bold", 
              fontSize: "1.2rem",
              textAlign: "center" 
            }}
          >
            Last Stage Values Prediction
          </Typography>
          
          
          
          <Box sx={{
            gap: 2,
            padding: 2,
            borderRadius: "8px",
            width: "50%",
            margin: "0 auto",
          }}>
            <Box sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              padding: 2,
              borderRadius: "8px",
            }}>
              {["ph", "turbidity", "conductivity"].map((key) => (
                <Box
                  key={key}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      width: "45%",
                      textAlign: "left",
                      textTransform: "capitalize"
                    }}
                  >
                    {key}
                  </Typography>

                  <TextField
                    variant="outlined"
                    size="small"
                    name={key}
                    type="number"
                    sx={{ width: "30%" }}
                    value={inputValues[key as keyof typeof inputValues]}
                    onChange={handleChange}
                    required
                  />
                </Box>
              ))}
              
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 ,gap: 2}}>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  sx={{
                    backgroundColor: "#102D4D",
                    color: "white",
                    fontSize: "12px",
                    height: "30px",
                  }}
                >
                  Predict
                </Button>
            <Button
              variant="contained"
              onClick={handleBack}
              sx={{
                backgroundColor: "#102D4D",
                fontSize: "12px",
                height: "30px",
              }}
            >
              Back
            </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Grid>

      {/* Predicted Values Section */}
      {predictedValues && (
        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              padding: 2, 
              height: "96%",
              backgroundColor: "white",
              borderRadius: 3,
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                fontWeight: "bold", 
                fontSize: "1.2rem",
                textAlign: "center" 
              }}
            >
              Predicted Values
            </Typography>
            
            <Box sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              padding: 2,
              marginTop: 2
            }}>
              {Object.entries(predictedValues).map(([key, value]) => {
                const label = key.replace('treated_', '').replace(/_/g, ' ');
                return (
                  <Box 
                    key={key}
                    sx={{
                      backgroundColor: "#F1F2F7",
                      borderRadius: 2,
                      padding: 2,
                      textAlign: "center"
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      {label.charAt(0).toUpperCase() + label.slice(1)}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 1 }}>
                      {value.toFixed(2)}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Paper>
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
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default PredictionForm;