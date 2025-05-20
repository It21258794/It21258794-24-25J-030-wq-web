import React, { useState, useEffect, useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Snackbar,
  Alert
} from "@mui/material";
import { createStep, getSteps } from "./server/flow-customisationAPI";
import { AuthContext } from "../../components/auth/AuthProvider";
import { AxiosError } from 'axios';

interface AddStepDialogProps {
  open: boolean;
  onClose: () => void;
  onStepAdded: () => void; // Callback to refresh steps list
}

const AddStepDialog: React.FC<AddStepDialogProps> = ({ 
  open, 
  onClose, 
  onStepAdded 
}) => {
  const [stepName, setStepName] = useState<string>("");
  const [stepOrder, setStepOrder] = useState<number>(0);
  const [stepDescription, setStepDescription] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertSeverity, setAlertSeverity] = useState<
    "error" | "warning" | "info" | "success"
  >("info");

  const authcontext = useContext(AuthContext);
  const token = authcontext?.token || ""; // Provide empty string as fallback

  useEffect(() => {
    const fetchSteps = async () => {
      try {
        if (!token) {
          setAlertSeverity("error");
          setAlertMessage("Authentication token is missing.");
          setOpenSnackbar(true);
          return;
        }
        
        const steps = await getSteps(token);
        const maxOrder = steps.reduce((max: number, step: { stepOrder: number }) => 
          step.stepOrder > max ? step.stepOrder : max, 0);
        setStepOrder(maxOrder + 1); 
      } catch (error) {
        console.error("Error fetching steps:", error);
        setAlertSeverity("error");
        setAlertMessage("Failed to fetch existing steps.");
        setOpenSnackbar(true);
      }
    };

    if (open) {
      fetchSteps();
    }
  }, [open, token]);

  const handleConfirmClick = async () => {
    if (!stepName || !stepOrder || !stepDescription) {
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

    const payload = {
      stepName,
      stepOrder, 
      stepDescription,
    };

    try {
      await createStep(token, payload);
      setAlertSeverity("success");
      setAlertMessage("Step added successfully.");
      setOpenSnackbar(true);
      
      // Clear form and close dialog after success
      setStepName("");
      setStepDescription("");
      onStepAdded();
      setTimeout(onClose, 1500);
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
    
      if (axiosError.response && (axiosError.response as any).data?.message) {
        const backendErrorMessage = (axiosError.response as any).data.message;
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

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontFamily: "Poppins, sans-serif", textAlign: "center" }}>
        Add New Stage
      </DialogTitle>
      <DialogContent sx={{ fontFamily: "Poppins, sans-serif" }}>
        <TextField
          label="Step Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={stepName}
          onChange={(e) => setStepName(e.target.value)}
        />
        <TextField
          label="Step Order"
          variant="outlined"
          fullWidth
          type="number"
          margin="normal"
          value={stepOrder}
          onChange={(e) => setStepOrder(parseInt(e.target.value))}
          disabled
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          margin="normal"
          value={stepDescription}
          onChange={(e) => setStepDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ padding: 3 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            color: "#8F8F8F",
            borderColor: "#8F8F8F",
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirmClick}
          sx={{
            backgroundColor: "#102D4D",
          }}
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
          sx={{ width: "100%", fontFamily: "Poppins, sans-serif" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default AddStepDialog;