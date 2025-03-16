import React from 'react';
import {
  Dialog,
  DialogContent,
  Button,
  Box,
  Typography
} from '@mui/material';
import timeout from '../../../assets/timeOut.jpg';

interface SessionExpiredDialogProps {
  open: boolean;
  onClose: () => void;
}

const SessionExpiredDialog: React.FC<SessionExpiredDialogProps> = ({
  open,
  onClose
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          width: '550px',
          height: '360px',
          maxWidth: '100%',
          borderRadius: 12
        }
      }}
    >
      <DialogContent>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{mt: 1}}
        >
          <img
            src={timeout}
            alt="Session Expired"
            style={{width: '200px', height: '150px', marginBottom: '16px'}}
          />
          <Typography variant="h5" align="center" sx={{fontWeight: 'bold'}}>
            Whoops, Your session has expired
          </Typography>
          <Typography
            variant="body1"
            align="center"
            sx={{mb: 2, color: '#9C9C9C'}}
          >
            Don't worry, just sign in again and pick up <br />
            where you left off!
          </Typography>
        </Box>
        <Box sx={{display: 'flex', justifyContent: 'center', pt: 1}}>
          <Button
            variant="contained"
            onClick={onClose}
            sx={{
              width: 100,
              borderRadius: 3,
              fontWeight: 'bold',
              backgroundColor: "#102D4D",
            }}
          >
            OK
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SessionExpiredDialog;