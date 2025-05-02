import * as React from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import {
  Box,
  DialogContent,
  IconButton,
  TextField,
  Divider,
  InputAdornment,
  FormControl,
  FormHelperText
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import {changeCurrentPass} from '../Services/api';
import {AuthContext} from '../../../components/auth/AuthProvider';

export interface SimpleDialogProps {
  dialogOpen: boolean;
  setDialogOpen: any;
}

export default function PasswordChangeDialogBox(props: SimpleDialogProps) {
  const authContext = React.useContext(AuthContext);
  const {dialogOpen, setDialogOpen} = props;
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [currentPassword, setCurrentPassword] = React.useState('');

  const [newPasswordError, setNewPasswordError] = React.useState('');
  const [confirmPasswordError, setConfirmPasswordError] = React.useState('');

  const handleClose = () => {
    setDialogOpen(false);
  };

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
        authContext?.user?.email,
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

  return (
    <Dialog
      onClose={handleClose}
      open={dialogOpen}
      maxWidth="sm"
      sx={{
        width: '100%',
        '& .MuiPaper-root': {
          borderRadius: '12px'
        }
      }}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(8px)'
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          paddingRight: 5,
          fontWeight: 'bold',
          pb: 3
        }}
      >
        <Typography
          variant="h6"
          sx={{marginRight: 'auto', fontSize: '16px', fontWeight: 'bold'}}
        >
          Change Password
        </Typography>
        <IconButton
          onClick={handleClose}
          aria-label="close"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{padding: 0, margin: 0, maxWidth: 500}}>
        <Box sx={{pt: 2, pr: 3, pl: 3, pb: 6, backgroundColor: '#F3F3F4'}}>
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
                      onClick={handleShowPasswordToggle}
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
              InputLabelProps={{
                shrink: true
              }}
            />
            <FormHelperText>
              {' '}
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
              <span style={{fontWeight: 'bold'}}>{confirmPasswordError} </span>
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
              InputLabelProps={{
                shrink: true
              }}
            />
          </FormControl>
        </Box>

        <Divider />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
            pt: 3,
            pb: 3,
            pr: 3
          }}
        >
          <Button
            variant="contained"
            onClick={handleClose}
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
        </Box>
      </DialogContent>
    </Dialog>
  );
}
