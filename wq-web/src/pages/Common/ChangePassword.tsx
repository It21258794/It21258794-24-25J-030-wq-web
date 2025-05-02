import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {
  Box,
  Divider,
  IconButton,
  TextField,
  InputAdornment,
  FormControl,
  FormHelperText
} from '@mui/material';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import {changeCurrentPass} from './Services/api';
import {useLocation, useNavigate} from 'react-router-dom';
import {AuthContext} from '../../components/auth/AuthProvider';
import PasswordResetConfirmation from './DialogBoxes/PasswordResetConfirmation.tsx';

export default function PasswordChangePage() {
  const authContext = React.useContext(AuthContext);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const [newPasswordError, setNewPasswordError] = React.useState('');
  const [confirmPasswordError, setConfirmPasswordError] = React.useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';

  console.log(email);

  const handleShowPasswordToggle = () => {
    setShowPassword((prev) => !prev);
  };

  const handleShowConfirmPasswordToggle = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleShowCurrentPasswordToggle = () => {
    setShowCurrentPassword((prev) => !prev);
  };

  const validateNewPassword = (password: string) => {
    if (password.length < 8) {
      setNewPasswordError(
        'New password must be at least 8 characters long and include a letter, a number, and a special character.'
      );
    } else if (!/[A-Z]/.test(password)) {
      setNewPasswordError(
        'Password must contain at least one uppercase letter.'
      );
    } else if (!/[0-9]/.test(password)) {
      setNewPasswordError('Password must contain at least one number.');
    } else {
      setNewPasswordError('');
    }
  };

  const validateConfirmPassword = (password: string) => {
    if (password !== newPassword) {
      setConfirmPasswordError('Passwords do not match.');
    } else {
      setConfirmPasswordError('');
    }
  };

  const isChangeButtonDisabled = () => {
    return (
      !!newPasswordError ||
      !!confirmPasswordError ||
      !newPassword ||
      !confirmPassword ||
      !currentPassword
    );
  };

  const handleConfirm = async () => {
    if (!newPasswordError && !confirmPasswordError) {
      authContext?.setIsLoading(true);
      const response: any = await changeCurrentPass(
        email,
        newPassword,
        currentPassword
      );
      console.log('Password change confirmed');
      setTimeout(() => {
        authContext?.setIsLoading(false);
        if (response?.status === 200) {
          setDialogOpen(true);
        }
      }, 1000);
    }
  };

  const handleCancel = async () => {
    navigate('/');
  };

  const onClose = () => {
    setDialogOpen(false);
  };

  return (
    <Box sx={{maxWidth: 600, margin: '0 auto', padding: 2}}>
      <Typography variant="h6" sx={{fontWeight: 'bold', textAlign: 'center'}}>
        Change Password
      </Typography>

      <Divider sx={{my: 2}} />

      <FormControl
        variant="outlined"
        fullWidth
        margin="normal"
        error={!!newPasswordError}
      >
        <TextField
          required
          placeholder="*New Password"
          type={showPassword ? 'text' : 'password'}
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
                  onClick={handleShowConfirmPasswordToggle}
                  edge="end"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
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
        />
        <FormHelperText>
          <span style={{fontWeight: 'bold'}}>{newPasswordError}</span>
        </FormHelperText>
      </FormControl>

      <FormControl
        variant="outlined"
        fullWidth
        margin="normal"
        error={!!confirmPasswordError}
      >
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
                  onClick={handleShowPasswordToggle}
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
        />
        <FormHelperText>
          <span style={{fontWeight: 'bold'}}>{confirmPasswordError}</span>
        </FormHelperText>
      </FormControl>

      <Typography sx={{fontSize: '13px', color: '#757575', pt: 3}}>
        Please enter your current password to verify your password change.
      </Typography>

      <FormControl variant="outlined" fullWidth margin="normal">
        <TextField
          required
          placeholder="*Current Password"
          type={showCurrentPassword ? 'text' : 'password'}
          id="current-password"
          autoComplete="current-password"
          onChange={(e) => setCurrentPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleShowCurrentPasswordToggle}
                  edge="end"
                >
                  {showCurrentPassword ? <Visibility /> : <VisibilityOff />}
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
        />
      </FormControl>

      <Divider sx={{my: 2}} />

      <Box sx={{display: 'flex', justifyContent: 'flex-end', gap: 2}}>
        <Button
          variant="contained"
          onClick={handleCancel}
          sx={{
            fontWeight: 'bold',
            borderRadius: 2,
            width: 100,
            height: 45,
            backgroundColor: '#617E8C'
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={isChangeButtonDisabled()}
          sx={{
            fontWeight: 'bold',
            borderRadius: 2,
            width: 'auto',
            height: 45,
            backgroundColor: '#102D4D'
          }}
        >
          Change
        </Button>
        <PasswordResetConfirmation open={dialogOpen} onClose={onClose} />
      </Box>
    </Box>
  );
}
