import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import {Box, Typography} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

interface RemoveUserDialogProps {
  open: boolean;
  onClose: (data?: any) => void;
  row: any;
}

export default function UserAddedConfirmation({
  open,
  onClose,
  row
}: RemoveUserDialogProps) {

  const handleSubmit = async () => {
    onClose();

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
          <CheckCircleOutlineIcon sx={{color: 'green', fontSize: 60}} />
        </Box>
        <Typography
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: 18,
            color: '#102D4D'
          }}
        >
          {row?.firstName + ' ' + row?.lastName}
        </Typography>
        <Typography
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: 18,
            fontStyle: 'italic',
            color: '#',
            marginTop: '10px'
          }}
        >
          Successfully added and sent an invitation.
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
          onClick={handleSubmit}
          sx={{
            fontWeight: 'bold',
            borderRadius: 2,
            width: 100,
            height: 35,
            backgroundColor: '#102D4D'
          }}
        >
          Ok
        </Button>
      </Box>
    </Dialog>
  );
}
