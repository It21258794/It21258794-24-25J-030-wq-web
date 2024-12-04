import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Paper, Snackbar, Alert } from "@mui/material";

export default function AddChemical() {
  const [chemicalName, setChemicalName] = useState<string>(""); // Define types for state variables
  const [chemicalValue, setChemicalValue] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertSeverity, setAlertSeverity] = useState<"error" | "warning" | "info" | "success">(); // Restrict severity values
  const navigate = useNavigate();

  // Handle form submission
  const handleConfirmClick = () => {
    if (!chemicalName || !chemicalValue) {
      setAlertSeverity("error");
      setAlertMessage("Please fill in both fields.");
      setOpenSnackbar(true);
      return;
    }

    console.log("Chemical added:", { chemicalName, chemicalValue });

    setAlertSeverity("success");
    setAlertMessage("Chemical added successfully.");
    setOpenSnackbar(true);

    setTimeout(() => {
      navigate(-1);
    }, 1500);
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
        height:"450px",
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
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", // Add shadow
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ textAlign: "center" }}>
          Add New Chemical
        </Typography>

        <TextField
          label="Chemical Name"
          variant="outlined"
          fullWidth
          value={chemicalName}
          onChange={(e) => setChemicalName(e.target.value)}
        />

        <TextField
          label="Chemical Value"
          variant="outlined"
          fullWidth
          value={chemicalValue}
          onChange={(e) => setChemicalValue(e.target.value)}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#102D4D",
              color: "white",
              "&:hover": {
                backgroundColor: "#154273", // Darker shade on hover
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
                backgroundColor: "#E0E0E0", // Lighter shade on hover
                borderColor: "#6F6F6F", // Darker border on hover
              },
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
        <Alert onClose={handleSnackbarClose} severity={alertSeverity} sx={{ width: "100%" }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
