import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import {Box, Typography} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

interface SessionExpiryWarningDialogProps {
  open: boolean;
  onClose: () => void;
  email: string;
}

export default function OtpSendConfirmation({
  open,
  onClose,
  email
}: SessionExpiryWarningDialogProps) {
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
            fontSize: 18
          }}
        >
          Your OTP has been sent to
        </Typography>
        <Typography
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: 16,
            fontStyle: 'italic',
            color: '#9C9C9C'
          }}
        >
          {email}
        </Typography>
        {/* <Typography sx={{display:'flex', alignItems:'center' , justifyContent:'center',fontSize:14}} >
            Please check above.
        </Typography> */}
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
          onClick={onClose}
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
