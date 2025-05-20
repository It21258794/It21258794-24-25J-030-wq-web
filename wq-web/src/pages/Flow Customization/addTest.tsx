import React, { useState, useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Snackbar
} from "@mui/material";
import { addTest } from "./server/flow-customisationAPI";
import { AuthContext } from "../../components/auth/AuthProvider";
import { AxiosError } from 'axios';

interface AddTestDialogProps {
  open: boolean;
  onClose: () => void;
  onTestAdded: () => void;
}

const AddTestDialog: React.FC<AddTestDialogProps> = ({ open, onClose, onTestAdded }) => {
  const [testName, setTestName] = useState("");
  const [testValue, setTestValue] = useState("");
  const [testDescription, setTestDescription] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"error" | "warning" | "info" | "success">("info");

  const authcontext = useContext(AuthContext);
  const token = authcontext?.token || ""; // Provide fallback empty string

  const handleConfirmClick = async () => {
    if (!testName || !testValue || !testDescription) {
      setAlertSeverity("error");
      setAlertMessage("Please fill in all fields.");
      setOpenSnackbar(true);
      return;
    }

    if (!token) {
      setAlertSeverity("error");
      setAlertMessage("Authentication token is missing.");
      setOpenSnackbar(true);
      return;
    }

    try {
      await addTest(testName, testValue, testDescription, token);
      setAlertSeverity("success");
      setAlertMessage("Test added successfully.");
      setOpenSnackbar(true);
      
      setTestName("");
      setTestValue("");
      setTestDescription("");
      onTestAdded();
      setTimeout(onClose, 1500);
    } catch (error) {
      const axiosError = error as AxiosError;
      setAlertSeverity("error");
      setAlertMessage(
        axiosError.response?.data?.message || 
        axiosError.message || 
        "An unexpected error occurred."
      );
      setOpenSnackbar(true);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: "center", fontFamily: "Poppins, sans-serif" }}>
        Add New Reading
      </DialogTitle>
      <DialogContent sx={{ fontFamily: "Poppins, sans-serif" }}>
        <TextField
          label="Reading Name"
          fullWidth
          margin="normal"
          value={testName}
          onChange={(e) => setTestName(e.target.value)}
        />
        <TextField
          label="Value"
          fullWidth
          margin="normal"
          value={testValue}
          onChange={(e) => setTestValue(e.target.value)}
        />
        <TextField
          label="Description"
          fullWidth
          multiline
          rows={4}
          margin="normal"
          value={testDescription}
          onChange={(e) => setTestDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ padding: 3 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{ color: "#8F8F8F", borderColor: "#8F8F8F" }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirmClick}
          sx={{ backgroundColor: "#102D4D" }}
        >
          Confirm
        </Button>
      </DialogActions>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={alertSeverity}
          sx={{ fontFamily: "Poppins, sans-serif" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default AddTestDialog;