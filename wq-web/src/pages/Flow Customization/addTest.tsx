import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Paper, Snackbar, Alert } from "@mui/material";

const AddTest: React.FC = () => {
  const [testName, setTestName] = useState<string>("");
  const [testValue, setTestValue] = useState<string>("");
  const [testDescription, setTestDescription] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertSeverity, setAlertSeverity] = useState<"error" | "warning" | "info" | "success">();
  const navigate = useNavigate();

  // Handle form submission
  const handleConfirmClick = () => {
    // Validate input fields
    if (!testName || !testValue || !testDescription) {
      setAlertSeverity("error");
      setAlertMessage("Please fill in all fields.");
      setOpenSnackbar(true);
      return;
    }

    // Add logic to save the test (e.g., send to backend or update state)
    console.log("Test added:", { testName, testValue, testDescription });

    // Show success message
    setAlertSeverity("success");
    setAlertMessage("Test added successfully.");
    setOpenSnackbar(true);

    // Navigate back to the previous page after confirming
    setTimeout(() => {
      navigate(-1); // Goes back to the previous page
    }, 1500);
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
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", // Added shadow for Paper
          borderRadius: 2, // Rounded corners
        }}
      >
        {/* Title centered */}
        <Typography variant="h5" gutterBottom sx={{ textAlign: "center" }}>
          Add New Test
        </Typography>

        {/* Test Name Input */}
        <TextField
          label="Test Name"
          variant="outlined"
          fullWidth
          value={testName}
          onChange={(e) => setTestName(e.target.value)}
        />

        {/* Test Value Input */}
        <TextField
          label="Value"
          variant="outlined"
          fullWidth
          value={testValue}
          onChange={(e) => setTestValue(e.target.value)}
        />

        {/* Test Description Input */}
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={testDescription}
          onChange={(e) => setTestDescription(e.target.value)}
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
};

export default AddTest;
