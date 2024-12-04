import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Paper, Snackbar, Alert } from "@mui/material";

export default function AddStep() {
  const [stepName, setStepName] = useState(""); // Renamed to stepName
  const [openSnackbar, setOpenSnackbar] = useState(false); // State for Snackbar visibility
  const [alertMessage, setAlertMessage] = useState(""); // State for alert message
  const [alertSeverity, setAlertSeverity] = useState<"error" | "warning" | "info" | "success">(); // Restrict severity values
  const navigate = useNavigate();

  // Handle form submission
  const handleConfirmClick = () => {
    // Check if input is empty
    if (!stepName) {
      setAlertSeverity("error");
      setAlertMessage("Please enter the step name.");
      setOpenSnackbar(true);
      return;
    }

    // Add logic to save the step name (e.g., send to backend or update state)
    console.log("Step added:", { stepName });

    // Show success message
    setAlertSeverity("success");
    setAlertMessage("Step added successfully.");
    setOpenSnackbar(true);

    // Navigate back to the previous page after confirming
    setTimeout(() => {
      navigate(-1); // Goes back to the previous page
    }, 1500); // Wait 1.5 seconds before navigating
  };

  // Handle cancel action
  const handleCancelClick = () => {
    // Navigate back to the previous page without saving
    navigate(-1);
  };

  // Close the snackbar
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
        height:"450px",
        backgroundColor: "#F1F2F7",
        width: "full",
        maxWidth: "full",
        boxSizing: "border-box",
        marginRight:"150px",
      }}
    >
      <Paper
        sx={{
          padding: 4,
          width: 400,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", // Shadow for Paper
          borderRadius: 2, // Rounded corners
        }}
      >
        {/* Title centered */}
        <Typography variant="h5" gutterBottom sx={{ textAlign: "center" }}>
          Add New Step
        </Typography>

        {/* Step Name Input */}
        <TextField
          label="Step Name"
          variant="outlined"
          fullWidth
          value={stepName}
          onChange={(e) => setStepName(e.target.value)}
        />

        {/* Buttons */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#102D4D",
              color: "white",
              "&:hover": {
                backgroundColor: "#154273", // Darker blue on hover
              },
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
              "&:hover": {
                backgroundColor: "#E0E0E0", // Light gray on hover
                borderColor: "#6F6F6F", // Darker border on hover
              },
            }}
            onClick={handleCancelClick}
          >
            Cancel
          </Button>
        </Box>
      </Paper>

      {/* Snackbar for success/error messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000} // Close after 3 seconds
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity={alertSeverity} sx={{ width: "100%" }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
