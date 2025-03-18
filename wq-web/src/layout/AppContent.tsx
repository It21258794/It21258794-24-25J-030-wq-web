import {Outlet} from 'react-router-dom';
import {Box} from '@mui/material';

const AppContent = (): JSX.Element => {
  return (
    <Box sx={{padding: '20px', backgroundColor: '#f1f2f7'}}>
      <Outlet />
    </Box>
  );
};

export default AppContent;
