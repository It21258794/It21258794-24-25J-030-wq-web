import React, { useState, useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert
} from "@mui/material";
import { createChemical } from "./server/flow-customisationAPI";
import { AuthContext } from "../../components/auth/AuthProvider";

interface AddChemicalDialogProps {
  open: boolean;
  onClose: () => void;
  onChemicalAdded: () => void; // Callback to refresh chemicals list
}

const AddChemicalDialog: React.FC<AddChemicalDialogProps> = ({ 
  open, 
  onClose, 
  onChemicalAdded 
}) => {
  const [chemicalName, setChemicalName] = useState<string>("");
  const [chemicalType, setChemicalType] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertSeverity, setAlertSeverity] = useState<
    "error" | "warning" | "info" | "success"
  >("info");

  const authcontext = useContext(AuthContext);
  const token: string | undefined = authcontext?.token;

  const handleConfirmClick = async () => {
    if (!chemicalName || !chemicalType) {
      setAlertSeverity("error");
      setAlertMessage("Please fill in all fields.");
      setOpenSnackbar(true);
      return;
    }

    try {
      await createChemical(chemicalName, chemicalType, token || "");
      setAlertSeverity("success");
      setAlertMessage("Chemical added successfully.");
      setOpenSnackbar(true);
      
      // Clear form and close dialog after success
      setChemicalName("");
      setChemicalType("");
      onChemicalAdded(); // Refresh the chemicals list
      setTimeout(onClose, 1500);
    } catch (error: any) {
      setAlertSeverity("error");
      setAlertMessage(
        error.message || "An unexpected error occurred. Please try again."
      );
      setOpenSnackbar(true);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontFamily: "Poppins, sans-serif", textAlign: "center" }}>
        Add New Chemical
      </DialogTitle>
      <DialogContent sx={{ fontFamily: "Poppins, sans-serif" }}>
        <TextField
          label="Chemical Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={chemicalName}
          onChange={(e) => setChemicalName(e.target.value)}
        />
        <TextField
          label="Measure Type"
          variant="outlined"
          fullWidth
          margin="normal"
          value={chemicalType}
          onChange={(e) => setChemicalType(e.target.value)}
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

export default AddChemicalDialog;