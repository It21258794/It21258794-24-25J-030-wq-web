import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import {Box, Typography} from '@mui/material';
import {AuthContext} from '../../../components/auth/AuthProvider';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import {useNavigate} from 'react-router-dom';

interface SessionExpiryWarningDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function PasswordChangeConfirmation({
  open,
  onClose
}: SessionExpiryWarningDialogProps) {
  const authContext = React.useContext(AuthContext);
  const navigate = useNavigate();

  const handelSubmitButton = () => {
    authContext?.setIsLoading(true);

    setTimeout(() => {
      authContext?.setIsLoading(false);
      navigate('/');
    }, 1000);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          width: '500px',
          height: '300px',
          maxWidth: '100%',
          borderRadius: 12
        }
      }}
    >
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pt: 4,
            pb: 2
          }}
        >
          <CheckCircleOutlineIcon sx={{color: 'green', fontSize: 60}} />
        </Box>
        <Typography
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: 19
          }}
        >
          Your password has been updated successfully!
        </Typography>
        <Typography
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14
          }}
        >
          Please use your new password to sign in next time.
        </Typography>
      </DialogContent>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          pt: 3,
          pb: 4
        }}
      >
        <Button
          variant="contained"
          onClick={handelSubmitButton}
          sx={{
            fontWeight: 'bold',
            borderRadius: 2,
            width: 100,
            height: 45,
            backgroundColor: '#102D4D'
          }}
        >
          Ok
        </Button>
      </Box>
    </Dialog>
  );
}
