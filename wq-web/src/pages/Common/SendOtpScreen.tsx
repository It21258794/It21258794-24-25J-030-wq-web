import React, {useContext} from 'react';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  TextField,
  Typography,
  Grid
} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import OtpSendConfirmation from './DialogBoxes/OtpSendConfirmation';
import {forgetPasswordSendOtp, forgetPasswordToken} from './Services/api';
import {AuthContext} from '../../components/auth/AuthProvider';

const defaultTheme = createTheme();
export default function SendOtpScreen() {
  const authContext = useContext(AuthContext);
  const [email, setEmail] = React.useState('');
  const [emailError, setEmailError] = React.useState('');
  const [showOtpText, setshowOtpText] = React.useState(false);
  const [serverRef, setServerRef] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [showResend, setShowResend] = React.useState(true);
  const [otp, setOtp] = React.useState('');
  const [otpError, setOtpError] = React.useState('');
  const [countdown, setCountdown] = React.useState(60);
  const navigate = useNavigate();

  React.useEffect(() => {
    let timer: any;
    if (!showResend && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setShowResend(true);
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [countdown, showResend]);

  const handleSubmit = async () => {
    if (!email) {
      setEmailError('Email is required');
    } else {
      try {
        authContext?.setIsLoading(true);
        const res: any = await forgetPasswordSendOtp(email);
        console.log(res);
        if (res.data.serverRef) {
          setTimeout(() => {
            authContext?.setIsLoading(false);
            setServerRef(res.data.serverRef);
            setshowOtpText(true);
            setDialogOpen(true);
            setShowResend(false);
            setCountdown(60);
          }, 1000);
        }
      } catch (err: any) {
        console.log(err);
        setEmailError(err.response?.data?.message);
      }
    }
  };

  const handleResend = async () => {
    try {
      const res = await forgetPasswordSendOtp(email);
      console.log(res);
      if (res.data.serverRef) {
        setServerRef(res.data.serverRef);
        setDialogOpen(true);
        setShowResend(false);
        setCountdown(60);
      }
    } catch (err: any) {
      if (err.status == 401) {
        setOtpError('OTP sending limit exceeded, please try again later');
      }
    }
  };

  const handleOtpConfirm = async () => {
    if (!otp) {
      setOtpError('OTP required');
    } else {
      try {
        authContext?.setIsLoading(true);
        const res = await forgetPasswordToken(serverRef, otp);
        if (res) {
          setTimeout(() => {
            authContext?.setIsLoading(false);
            sessionStorage.setItem('passwordResetEmail', email);
            sessionStorage.setItem(
              'passwordResetToken',
              res.data.passwordResetToken
            );
            navigate('/reset-password');
          }, 1000);
        }
      } catch (err: any) {
        console.log(err);
        setOtpError(err.response?.data?.message);
      }
    }
  };

  const handleGoBack = () => {
    navigate('/');
  };

  const onClose = () => {
    setDialogOpen(false);
  };

  const validateEmail = (email: String) => {
    if (!email) {
      setEmailError('Email is required');
    } else {
      setEmailError('');
    }
  };

  const validateOtp = (otp: string) => {
    if (!otp) {
      setOtpError('OTP is required');
    } else {
      setOtpError('');
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{backgroundColor: '#F3F3F4', height: '100vh', width: '100%'}}>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{pt: 15}}
        >
          <Grid item xs={12} sm={8} md={6} lg={4}>
            <Box sx={{textAlign: 'center', pb: 4}}>
              <Typography
                variant="h6"
                sx={{
                  fontSize: '22px',
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}
              >
                Forgot your password?
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontSize: '13px',
                  color: '#9C9C9C',
                  textAlign: 'center',
                  marginTop: '10px'
                }}
              >
                Enter your email address below to receive an OTP.
              </Typography>
            </Box>
            <Box sx={{pt: 4, ml: 7, mr: 7}}>
              <FormControl
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!emailError}
              >
                <TextField
                  required
                  autoComplete="off"
                  placeholder="example@gmail.com"
                  id="email"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateEmail(e.target.value);
                  }}
                  InputProps={{
                    readOnly: showOtpText,
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
                      },
                      backgroundColor: showOtpText ? '#E6E6E6' : 'white'
                    }
                  }}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
                <FormHelperText>
                  {' '}
                  <span style={{fontWeight: 'bold'}}>{emailError}</span>
                </FormHelperText>
              </FormControl>
              {showOtpText ? (
                <FormControl
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={!!otpError}
                >
                  <Typography sx={{pb: 1, pt: 3, fontSize: 13}}>
                    Enter Your OTP here
                  </Typography>
                  <TextField
                    required
                    placeholder="55555"
                    id="otp"
                    onChange={(e) => {
                      setOtp(e.target.value);
                      validateOtp(e.target.value);
                    }}
                    InputProps={{
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
                    <span style={{fontWeight: 'bold'}}>{otpError}</span>
                  </FormHelperText>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 3,
                      mb: 2,
                      borderRadius: 4,
                      fontWeight: 'bold',
                      backgroundColor: '#102D4D'
                    }}
                    onClick={handleOtpConfirm}
                  >
                    Confirm
                  </Button>
                  <Typography sx={{fontSize: '12px', color: '#9C9C9C'}}>
                    Your OTP will expire in 10 minutes. If you haven't received
                    it or need a new one.{' '}
                    {showResend ? (
                      <span
                        style={{
                          color: '#3874CE',
                          cursor: 'pointer'
                        }}
                        onClick={handleResend}
                      >
                        send again
                      </span>
                    ) : (
                      <span style={{color: '#9C9C9C'}}>
                        {`Resend in ${countdown} seconds`}
                      </span>
                    )}
                  </Typography>
                </FormControl>
              ) : (
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    borderRadius: 4,
                    fontWeight: 'bold',
                    backgroundColor: '#102D4D'
                  }}
                  onClick={handleSubmit}
                >
                  Send OTP
                </Button>
              )}
              <Typography sx={{fontSize: '12px', color: '#9C9C9C'}}>
                Remember your password?{' '}
                <span
                  onClick={handleGoBack}
                  style={{color: '#102D4D', cursor: 'pointer'}}
                >
                  Back to Login
                </span>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <OtpSendConfirmation open={dialogOpen} onClose={onClose} email={email} />
    </ThemeProvider>
  );
}
