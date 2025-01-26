import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Paper, Snackbar, Alert } from "@mui/material";
import "@fontsource/poppins"; // Import Poppins font

const AddChemical: React.FC = (): JSX.Element => {
  const [chemicalName, setChemicalName] = useState<string>("");
  const [chemicalType, setchemicalType] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertSeverity, setAlertSeverity] = useState<"error" | "warning" | "info" | "success">();
  const navigate = useNavigate();

  const API_URL = "http://localhost:8085/api/chemicals/create";
  const token = localStorage.getItem("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiU1VQRVJfQURNSU4iLCJzdWIiOiI0ZjlhYTIxOS0yMjY4LTQxYWEtYTU5MC1lZjVlM2QyMGU2NzMiLCJleHAiOjE3MzczMTA2NTZ9.ZyYBPfqydeYIJinJUQhvedYZfCGT7rwC2s1jTMG-35E");

  const handleConfirmClick = async () => {
    if (!chemicalName || !chemicalType) {
      setAlertSeverity("error");
      setAlertMessage("Please fill in all fields.");
      setOpenSnackbar(true);
      return;
    }

    const payload = {
      chemicalName: chemicalName,
      chemicalType: chemicalType,
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiU1VQRVJfQURNSU4iLCJzdWIiOiI0ZjlhYTIxOS0yMjY4LTQxYWEtYTU5MC1lZjVlM2QyMGU2NzMiLCJleHAiOjE3MzczOTUzNzZ9.VuCUB36rHx2PrTo1I908CLK5yvjd3D9SsURhBFV9VPo`, // Use the token stored in localStorage
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setAlertSeverity("success");
        setAlertMessage("Chemical added successfully.");
        setOpenSnackbar(true);
        setTimeout(() => navigate(-1), 1500);
      } else {
        const errorData = await response.json();
        setAlertSeverity("error");
        setAlertMessage(errorData.message || "Failed to add the chemical.");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setAlertSeverity("error");
      setAlertMessage("An unexpected error occurred. Please try again.");
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
        marginRight: "150px",
        fontFamily: "Poppins, sans-serif", // Set font for Box
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
          fontFamily: "Poppins, sans-serif", // Set font for Paper
        }}
      >
        <TextField
          label="Chemical Name"
          variant="outlined"
          fullWidth
          value={chemicalName}
          onChange={(e) => setChemicalName(e.target.value)}
          sx={{ fontFamily: "Poppins, sans-serif" }}
        />

        <TextField
          label="Measure Type"
          variant="outlined"
          fullWidth
          value={chemicalType}
          onChange={(e) => setchemicalType(e.target.value)}
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

export default AddChemical;
