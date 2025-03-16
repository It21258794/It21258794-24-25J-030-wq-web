import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import backgroundImage from '../../assets/Login.jpg';
import axios from 'axios';
import {useSnackbar} from 'notistack';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { AuthContext } from '../../components/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { signIn } from './Services/api';

const defaultTheme = createTheme();

export default function SignIn() {
  const authContext = React.useContext(AuthContext);
  const {enqueueSnackbar} = useSnackbar();
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [emailError, setEmailError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const navigate = useNavigate();

  const handleShowPasswordToggle = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleClickOpen = (event:any) => {
    event.preventDefault()
    authContext?.setIsLoading(true);

      setTimeout(() => {
        authContext?.setIsLoading(false);
      }, 1000);
    navigate('/send-reset-otp');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmailError('');
    setPasswordError('');

    let valid = true;

    if (!email || !password) {
      if (!email) {
        setEmailError('Email is required');
      }
      if (!password) {
        setPasswordError('Password is required');
      }
      valid = false;
    } else {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
      // if (!emailPattern.test(email)) {
      //   setEmailError('Invalid email. Please use a valid email address');
      //   valid = false;
      // }

      if (password.length < 8) {
        setPasswordError('Password must be at least 8 characters long');
        valid = false;
      }
    }

    if (!valid) return;

    try {
        const response :any = await signIn(email, password);
        authContext?.login(response.data, response.authToken, response.timeout);
      navigate("/user");
    } catch (err: any) {
      if(err.response?.data?.type == "TEMP_USER_ACCOUNT"){
        navigate("/change-password", { state: { email } });
      }else{
        setEmailError(
          err.response?.data?.message
        );
      }
      
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{height: '100vh'}}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            backgroundPosition: 'center'
          }}
        />
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          elevation={0}
          square
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Card
            sx={{
              width: '100%',
              maxWidth: {xs: '100%', sm: 400},
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
              boxShadow: '0px 8px 24px #102D4D',
              height: 'auto',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              p: {xs: 2, sm: 3}
            }}
          >
            <CardContent
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '10%'
              }}
            >
              <Typography
                component="h1"
                variant="h4"
                fontWeight="bold"
                paddingBottom="10px"
              >
                Sign in
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{mt: 1, width: '100%', maxWidth: '100%'}}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!emailError}
                  helperText={emailError}
                  InputProps={{
                    sx: {
                      borderRadius: 4,
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      "&.Mui-focused": {
                        color: "#102D4D",
                      },
                    },
                  }}
                  focused
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: "#102D4D",
                      },
                    },
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!passwordError}
                  helperText={passwordError}
                  InputProps={{
                    sx: {borderRadius: 4},
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle passwor  d visibility"
                          onClick={handleShowPasswordToggle}
                          edge="end"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  InputLabelProps={{
                    sx: {
                      "&.Mui-focused": {
                        color: "#102D4D",
                      },
                    },
                  }}
                  focused
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: "#102D4D",
                      },
                    },
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{mt: 3, mb: 2, borderRadius: 4, fontWeight: 'bold',backgroundColor:"#102D4D"}}
                >
                  Sign In
                </Button>
                <Box sx={{display: 'flex', justifyContent: 'center'}}>
                  <a onClick={handleClickOpen} style={{cursor: 'pointer'}}>
                    <Typography fontSize={13} color="#102D4D">
                      Forget Password?
                    </Typography>
                  </a>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}