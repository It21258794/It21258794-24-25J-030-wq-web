import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  TextField,
  Typography
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import PasswordResetConfirmation from './DialogBoxes/PasswordResetConfirmation.tsx.tsx';
import { useNavigate } from 'react-router-dom';
import { forgetPassword } from './Services/api.ts';

const defaultTheme = createTheme();

export default function ResetPassword() {
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [newPasswordError, setNewPasswordError] = React.useState('');
  const [confirmPasswordError, setConfirmPasswordError] = React.useState('');
  const email:any = sessionStorage.getItem('passwordResetEmail');
  const passwordResetToken:any = sessionStorage.getItem('passwordResetToken');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!newPasswordError && !confirmPasswordError) {
      try {
        const res : any= await forgetPassword(email,newPassword, passwordResetToken);
        console.log(res)
        if (res.status === 200) {
          setDialogOpen(true);
        }
      } catch (err:any) {
        setConfirmPasswordError(
          err.response?.data?.message || 'Cannot change password. Please try again.'
        );
      }
    }
  };

  const handleGoBack = () => {
    navigate('/');
  };

  const handleShowNewPasswordToggle = () => {
    setShowNewPassword((prev) => !prev);
  };

  const handleShowConfirmPasswordToggle = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const validateNewPassword = (password:any) => {
    if (password.length < 8) {
      setNewPasswordError(
        'New password must be at least 8 characters long and include a letter, a number, and a special character.'
      );
    } else if (!/[A-Z]/.test(password)) {
      setNewPasswordError('Password must contain at least one uppercase letter.');
    } else if (!/[0-9]/.test(password)) {
      setNewPasswordError('Password must contain at least one number.');
    } else {
      setNewPasswordError('');
    }
  };

  const validateConfirmPassword = (password:any) => {
    if (password !== newPassword) {
      setConfirmPasswordError('Passwords do not match.');
    } else {
      setConfirmPasswordError('');
    }
  };

  const onClose = () => {
    setDialogOpen(false);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box
        sx={{
          backgroundColor: '#F3F3F4',
          minHeight: '100vh',
          width: '100%',
          padding: { xs: 2, sm: 4, md: 8 }
        }}
      >
        <Box
          sx={{
            maxWidth: 600,
            margin: 'auto',
            padding: { xs: 2, sm: 3, md: 5 },
            backgroundColor: '#F3F3F4',
            borderRadius: 2
          }}
        >
          <Typography
            variant="h6"
            sx={{
              display: 'flex',
              justifyContent: 'center',
              fontSize: { xs: '18px', sm: '22px' },
              fontWeight: 'bold'
            }}
          >
            Change Your Password
          </Typography>
          <Typography
            variant="h6"
            sx={{
              pt: 1,
              display: 'flex',
              justifyContent: 'center',
              fontSize: { xs: '11px', sm: '13px' },
              color: '#9C9C9C'
            }}
          >
            Please create a strong and secure password to protect your account.
          </Typography>

          <Box sx={{ pt: 4, ml:10, mr:10 }}>
            <FormControl variant="outlined" fullWidth margin="normal" error={!!newPasswordError}>
              <TextField
                required
                placeholder="*New Password"
                type={showNewPassword ? 'text' : 'password'}
                id="new-password"
                autoComplete="new-password"
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  validateNewPassword(e.target.value);
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleShowNewPasswordToggle}
                        edge="end"
                      >
                        {showNewPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    height: 40,
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    paddingTop: '8px',
                    paddingBottom: '8px',
                    borderRadius: 3,
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#757575'
                    }
                  }
                }}
                InputLabelProps={{
                  shrink: true
                }}
              />
              <FormHelperText>
                <span style={{ fontWeight: 'bold' }}>{newPasswordError}</span>
              </FormHelperText>
            </FormControl>

            <FormControl variant="outlined" fullWidth margin="normal" error={!!confirmPasswordError}>
              <TextField
                required
                placeholder="*Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirm-password"
                autoComplete="confirm-password"
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  validateConfirmPassword(e.target.value);
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleShowConfirmPasswordToggle}
                        edge="end"
                      >
                        {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    height: 40,
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    paddingTop: '8px',
                    paddingBottom: '8px',
                    borderRadius: 3,
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#757575'
                    }
                  }
                }}
                InputLabelProps={{
                  shrink: true
                }}
              />
              <FormHelperText>
                <span style={{ fontWeight: 'bold' }}>{confirmPasswordError}</span>
              </FormHelperText>
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, borderRadius: 4, fontWeight: 'bold',backgroundColor:"#102D4D" }}
              onClick={handleSubmit}
            >
              Reset Password
            </Button>

            <Typography
              sx={{
                fontSize: '12px',
                color: '#9C9C9C',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              Go back to&nbsp;
              <span
                style={{
                  color: '#102D4D',
                  cursor: 'pointer'
                }}
                onClick={handleGoBack}
              >
                Log in
              </span>
            </Typography>
          </Box>
        </Box>
      </Box>
      <PasswordResetConfirmation open={dialogOpen} onClose={onClose} />
    </ThemeProvider>
  );
}