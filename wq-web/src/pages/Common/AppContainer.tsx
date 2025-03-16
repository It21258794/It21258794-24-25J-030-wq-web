import { Box, CircularProgress, Typography } from "@mui/material";

const AppContainer: React.FC<{ isLoading: boolean; children: React.ReactNode }> = ({ isLoading, children }) => (
    <Box
      sx={{
        position: 'relative',
        height: '100vh',
        overflowY: 'auto',
      }}
    >
      <Box
        sx={{
          filter: isLoading ? 'blur(5px)' : 'none',
          transition: 'filter 0.3s ease',
          height: '100%',
        }}
      >
        {children}
      </Box>
 
      {isLoading && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            zIndex: 10,
          }}
        >
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Loading...</Typography>
        </Box>
      )}
    </Box>
  );

  export default AppContainer;
  