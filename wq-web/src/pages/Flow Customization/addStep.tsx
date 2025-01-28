import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Paper, Snackbar, Alert } from "@mui/material";
import { createStep } from "../../server/flow-customisation/flow-customisationAPI"; // Adjust the path as needed
import "@fontsource/poppins";
import { AxiosError } from 'axios'; // Import AxiosError if you're using Axios


const AddStep: React.FC = (): JSX.Element => {
  const [stepName, setStepName] = useState<string>("");
  const [stepOrder, setStepOrder] = useState<string>("");
  const [stepDescription, setStepDescription] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertSeverity, setAlertSeverity] = useState<"error" | "warning" | "info" | "success">();
  const navigate = useNavigate();

  const token = localStorage.getItem("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiU1VQRVJfQURNSU4iLCJzdWIiOiI0ZjlhYTIxOS0yMjY4LTQxYWEtYTU5MC1lZjVlM2QyMGU2NzMiLCJleHAiOjE3Mzc5OTQzNjN9.-jQ6lp1Z4MJhWcY8t6OqZQQGylf_ISkCSYHlvafjrRM"); // Retrieve token from localStorage

  const handleConfirmClick = async () => {
    if (!stepName || !stepOrder || !stepDescription) {
      setAlertSeverity("error");
      setAlertMessage("Please fill in all fields.");
      setOpenSnackbar(true);
      return;
    }


    const payload = {
      stepName,
      stepOrder: parseInt(stepOrder), // Ensure stepOrder is stored as a number
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
      // Type assertion to AxiosError
      const axiosError = error as AxiosError;
    
      // Check if the error has a response and message
      if (axiosError.response && axiosError.response.data && axiosError.response.data.message) {
        const backendErrorMessage = axiosError.response.data.message;
    
        // Check if the backend error message indicates step order conflict
        if (backendErrorMessage.includes("Step order already exists")) {
          setAlertSeverity("error");
          setAlertMessage("Step order already exists.");
        } else {
          setAlertSeverity("error");
          setAlertMessage("Step order already exists.");
        }
      } else {
        // Handle unexpected errors
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
          Add New Step
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
          onChange={(e) => setStepOrder(e.target.value)}
          sx={{ fontFamily: "Poppins, sans-serif" }}
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
