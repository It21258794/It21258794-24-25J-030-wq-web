import React, { useContext, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Select,
  MenuItem,
  Button,
  SelectChangeEvent,
} from "@mui/material";
import { registerUser } from "../Services/api";
import { AuthContext } from "../../../components/auth/AuthProvider";

const CreateUserDialog = ({ open, onClose }: { open: boolean; onClose: (user?: any) => void }) => {
  const authContext = useContext(AuthContext);
  const token: any = authContext?.token;
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    status: "PENDING_VERIFICATION",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name!]: value }));
  };

  const handleSubmit = async () => {
    console.log("User Created:", formData);
    const response = await registerUser(formData, token);
    console.log(response);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "",
      status: "PENDING_VERIFICATION",
    });
    setIsSubmitted(true);
    if (response?.data) {
      onClose(response.data);
    }
  };

  const handleCloseDialog = (e: React.SyntheticEvent, reason: string) => {
    console.log(e);
    if (reason !== "backdropClick" && isSubmitted) {
      onClose();
    } else {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseDialog}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 4,
        },
        "& .MuiDialogContent-root": {
          minHeight: "450px",
          paddingLeft: "24px",
          paddingRight: "24px",
          width: "400px",
        },
      }}
    >
      <DialogTitle sx={{ marginLeft: "50px", marginTop: "20px" }}>User Registration</DialogTitle>
      <DialogContent sx={{ marginLeft: "50px", marginRight: "50px" }}>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              fullWidth
              required
              InputProps={{
                sx: {
                  borderRadius: 3,
                  height: 40,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "13px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#757575",
                  },
                },
              }}
              InputLabelProps={{
                sx: {
                  fontSize: "12px",
                  top: "-7px",
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              fullWidth
              required
              InputProps={{
                sx: {
                  borderRadius: 3,
                  height: 40,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "13px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#757575",
                  },
                },
              }}
              InputLabelProps={{
                sx: {
                  fontSize: "12px",
                  top: "-7px",
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
              InputProps={{
                sx: {
                  borderRadius: 3,
                  height: 40,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "13px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#757575",
                  },
                },
              }}
              InputLabelProps={{
                sx: {
                  fontSize: "12px",
                  top: "-7px",
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
              required
              InputProps={{
                sx: {
                  borderRadius: 3,
                  height: 40,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "13px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#757575",
                  },
                },
              }}
              InputLabelProps={{
                sx: {
                  fontSize: "12px",
                  top: "-7px",
                },
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              displayEmpty
              fullWidth
              sx={{
                height: 40,
                fontSize: "12px",
                borderRadius: 3,
                "& .MuiSelect-select": {
                  padding: "10px",
                },
              }}
            >
              <MenuItem value="">Select Role</MenuItem>
              <MenuItem value="ADMIN">Admin</MenuItem>
              <MenuItem value="USER">User</MenuItem>
              <MenuItem value="SUPER_ADMIN">Super Admin</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={6}>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              fullWidth
              sx={{
                height: 40,
                fontSize: "12px",
                borderRadius: 3,
                "& .MuiSelect-select": {
                  padding: "10px",
                },
              }}
            >
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="PENDING_VERIFICATION">Pending</MenuItem>
              <MenuItem value="INACTIVE">Inactive</MenuItem>
            </Select>
          </Grid>
        </Grid>
        <DialogActions sx={{ marginTop: "30px" }}>
          <Button
            variant="contained"
            onClick={() => onClose()}
            sx={{
              fontWeight: "bold",
              borderRadius: 2,
              width: 100,
              height: 35,
              backgroundColor: "#617E8C",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              fontWeight: "bold",
              borderRadius: 2,
              width: 100,
              height: 35,
              backgroundColor: "#102D4D",
            }}
          >
            Create
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;
