import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Paper, Snackbar, Alert } from "@mui/material";
import { createStep, getSteps } from "./server/flow-customisationAPI"; // Adjust the path as needed
import "@fontsource/poppins";
import { AxiosError } from 'axios'; // Import AxiosError if you're using Axios
import { AuthContext } from "../../components/auth/AuthProvider";

const AddStep: React.FC = (): JSX.Element => {
  const [stepName, setStepName] = useState<string>("");
  const [stepOrder, setStepOrder] = useState<number>(0); // Initialize stepOrder as number
  const [stepDescription, setStepDescription] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertSeverity, setAlertSeverity] = useState<"error" | "warning" | "info" | "success">();
  const navigate = useNavigate();

  const authcontext = React.useContext(AuthContext);
  const token: string | undefined = authcontext?.token;
  useEffect(() => {
    const fetchSteps = async () => {
      try {
        const steps = await getSteps(token);
        const maxOrder = steps.reduce((max: number, step: { stepOrder: number }) => 
          step.stepOrder > max ? step.stepOrder : max, 0);
        setStepOrder(maxOrder + 1); 
      } catch (error) {
        console.error("Error fetching steps:", error);
      }
    };

    fetchSteps();
  }, []);

  const handleConfirmClick = async () => {
    if (!stepName || !stepOrder || !stepDescription) {
      setAlertSeverity("error");
      setAlertMessage("Please fill in all fields.");
      setOpenSnackbar(true);
      return;
    }

    const payload = {
      stepName,
      stepOrder, 
      stepDescription,
    };
 
    try {
      // Call the API to create the step
      await createStep(token || "", payload);
      setAlertSeverity("success");
      setAlertMessage("Step added successfully.");
      setOpenSnackbar(true);
      setTimeout(() => navigate(-1), 1500);
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
    
      if (axiosError.response && axiosError.response.data && axiosError.response.data.message) {
        const backendErrorMessage = axiosError.response.data.message;
        if (backendErrorMessage.includes("Step order already exists")) {
          setAlertSeverity("error");
          setAlertMessage("Step order already exists.");
        } else {
          setAlertSeverity("error");
          setAlertMessage("An unexpected error occurred.");
        }
      } else {
        setAlertSeverity("error");
        setAlertMessage("An unexpected error occurred.");
      }
      setOpenSnackbar(true);
    }
  };

  const handleCancelClick = () => {
    navigate(-1);
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
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <Paper
        sx={{
          padding: 4,
          width: 400,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          borderRadius: 2,
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ textAlign: "center", fontFamily: "Poppins, sans-serif" }}
        >
          Add New Stage
        </Typography>

        <TextField
          label="Step Name"
          variant="outlined"
          fullWidth
          value={stepName}
          onChange={(e) => setStepName(e.target.value)}
          sx={{ fontFamily: "Poppins, sans-serif" }}
        />

        <TextField
          label="Step Order"
          variant="outlined"
          fullWidth
          type="number"
          value={stepOrder}
          onChange={(e) => setStepOrder(parseInt(e.target.value))}
          sx={{ fontFamily: "Poppins, sans-serif" }}
          disabled // Disable this field as it is auto-calculated
        />

        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={stepDescription}
          onChange={(e) => setStepDescription(e.target.value)}
          sx={{ fontFamily: "Poppins, sans-serif" }}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#102D4D",
              color: "white",
              fontFamily: "Poppins, sans-serif",
              "&:hover": { backgroundColor: "#154273" },
            }}
            onClick={handleConfirmClick}
          >
            Confirm
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
            onClick={handleCancelClick}
          >
            Cancel
          </Button>
        </Box>
      </Paper>

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

export default AddStep;
