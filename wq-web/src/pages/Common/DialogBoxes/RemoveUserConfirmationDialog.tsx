import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import {Box, Typography} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {changeUserStatus} from '../Services/api';
import {useContext} from 'react';
import {AuthContext} from '../../../components/auth/AuthProvider';

interface RemoveUserDialogProps {
  open: boolean;
  onClose: (data?: any) => void;
  row: any;
}

export default function RemoveUserConfirmation({
  open,
  onClose,
  row
}: RemoveUserDialogProps) {
  const authContext = useContext(AuthContext);
  const token: any = authContext?.token;

  const handleSubmit = async () => {
    const response = await changeUserStatus(row.id, 'REMOVED', token);
    if (response?.data) {
      onClose(response.data);
    } else {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => onClose()}
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
          <WarningAmberIcon sx={{color: 'red', fontSize: 60}} />
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
          Are you sure you want to remove
        </Typography>
        <Typography
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: 18,
            fontStyle: 'italic',
            color: 'red',
            marginTop: '10px'
          }}
        >
          {row?.firstName + ' ' + row?.lastName}
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
          onClick={() => onClose()}
          sx={{
            fontWeight: 'bold',
            borderRadius: 2,
            width: 100,
            height: 35,
            backgroundColor: '#617E8C'
          }}
        >
          No
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            fontWeight: 'bold',
            borderRadius: 2,
            width: 100,
            height: 35,
            backgroundColor: '#102D4D'
          }}
        >
          Yes
        </Button>
      </Box>
    </Dialog>
  );
}
