import React, {useEffect, useState} from 'react';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {
  Box,
  Divider,
  Typography,
  Grid,
  CardContent,
  Card,
  Button,
  FormControl,
  TextField,
  IconButton
} from '@mui/material';
import {AuthContext} from '../../components/auth/AuthProvider';
import PasswordChangeDialogBox from '../Common/DialogBoxes/PasswordChangeDialogBox';
import {PhotoCamera} from '@mui/icons-material';
import {getUser, updateUserProfile} from './Services/api';
import EditIcon from '@mui/icons-material/Edit';
import DeactivateAcccountConfirmation from '../Common/DialogBoxes/DeactivateAccountConfirmation';

const defaultTheme = createTheme();

export default function SettingsScreen() {
  const authContext = React.useContext(AuthContext);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeletedialogOpen] = React.useState(false);
  const [user, setUser] = React.useState<any>();
  const token: any = authContext?.token;
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    email: user?.email || ''
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, []);

  const fetchUser = async () => {
    try {
      const result = await getUser(token);
      if (result.data) {
        setUser(result.data);
        setFormData({
          firstName: result?.data?.firstName,
          lastName: result?.data?.lastName,
          phone: result?.data?.phone,
          email: result?.data?.email
        });
      }
    } catch (err) {
      console.log('Failed to fetch predictions');
    }
  };

  const handleChange = (e: any) => {
    const {name, value} = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  function handlePwdChange(): void {
    setDialogOpen(true);
  }

  function handleDeactivateAccount(): void {
    setDeletedialogOpen(true);
  }

  function closeDeactivateAccount(): void {
    setDeletedialogOpen(false);
  }

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setProfileImage(file);
    }
  };

  const renderProfileImage = () => {
    if (profileImage) {
      return (
        <img
          src={URL.createObjectURL(profileImage)}
          alt="Profile"
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            objectFit: 'cover'
          }}
        />
      );
    }

    if (user?.profileImage) {
      return (
        <img
          src={user?.profileImage}
          alt="Profile"
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            objectFit: 'cover'
          }}
        />
      );
    }

    const initials = `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`;
    return (
      <Box
        sx={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          backgroundColor: '#102D4D',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '36px'
        }}
      >
        {initials}
      </Box>
    );
  };

  const handleConfirm = async () => {
    try {
      const response = await updateUserProfile(formData, token);

      if (response.data) {
        authContext?.setIsLoading(true);
        setTimeout(() => {
          authContext?.setIsLoading(false);
          console.log('Profile updated successfully!');
          setUser(formData);
          setIsEditing(false);
        }, 1000);
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box
        sx={{
          backgroundColor: '#F3F3F4',
          minHeight: '100vh',
          width: '100%',
          overflowX: 'hidden',
          overflowY: 'auto'
        }}
      >
        <Grid container spacing={2} sx={{mt: 2, px: {xs: 2, sm: 7}, mb: 5}}>
          <Grid item xs={12}>
            <Card
              sx={{
                width: '100%',
                borderRadius: '12px',
                boxShadow: 3,
                position: 'relative'
              }}
            >
              <IconButton
                onClick={handleEditToggle}
                sx={{position: 'absolute', top: 10, right: 10}}
              >
                <EditIcon sx={{fontSize: 24, color: '#102D4D'}} />
              </IconButton>

              <CardContent sx={{padding: '16px 24px'}}>
                <Typography sx={{fontWeight: 'bold', pb: 2, pt: 2}}>
                  Profile
                </Typography>
                <Divider />
                <Box sx={{pt: 3, marginLeft: '150px', marginRight: '150px'}}>
                  <Box
                    component="form"
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      pt: 2,
                      pb: 1
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mb: 3,
                        pt: 2
                      }}
                    >
                      <IconButton
                        color="primary"
                        aria-label="upload picture"
                        component="span"
                        sx={{
                          border: '2px dashed #ccc',
                          borderRadius: '50%',
                          padding: 2,
                          fontSize: '60px',
                          cursor: isEditing ? 'pointer' : 'not-allowed'
                        }}
                        disabled={!isEditing}
                        onChange={handleImageChange}
                      >
                        <PhotoCamera
                          sx={{fontSize: '60px', color: '#102D4D'}}
                        />
                      </IconButton>
                      {renderProfileImage()}
                    </Box>
                    <Box
                      sx={{
                        width: '100%',
                        display: 'flex',
                        gap: 2,
                        pr: 2,
                        pl: 2
                      }}
                    >
                      <FormControl fullWidth>
                        <TextField
                          name="firstName"
                          variant="outlined"
                          fullWidth
                          value={formData.firstName}
                          onChange={handleChange}
                          disabled={!isEditing}
                          InputProps={{
                            sx: {borderRadius: 3, height: 40, fontSize: '13px'}
                          }}
                        />
                      </FormControl>
                      <FormControl fullWidth>
                        <TextField
                          name="lastName"
                          variant="outlined"
                          fullWidth
                          value={formData.lastName}
                          onChange={handleChange}
                          disabled={!isEditing}
                          InputProps={{
                            sx: {borderRadius: 3, height: 40, fontSize: '13px'}
                          }}
                        />
                      </FormControl>
                    </Box>
                    <FormControl fullWidth sx={{mt: 2, pr: 2, pl: 2}}>
                      <TextField
                        name="phone"
                        variant="outlined"
                        fullWidth
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        InputProps={{
                          sx: {borderRadius: 3, height: 40, fontSize: '13px'}
                        }}
                      />
                    </FormControl>
                    <FormControl fullWidth sx={{mt: 2, pr: 2, pl: 2}}>
                      <TextField
                        name="email"
                        variant="outlined"
                        fullWidth
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        InputProps={{
                          sx: {borderRadius: 3, height: 40, fontSize: '13px'}
                        }}
                      />
                    </FormControl>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 2,
                        mt: 9
                      }}
                    >
                      <Button
                        variant="contained"
                        sx={{
                          fontWeight: 'bold',
                          borderRadius: 2,
                          width: 100,
                          height: 35,
                          backgroundColor: '#617E8C'
                        }}
                        onClick={() => setIsEditing(false)}
                        disabled={!isEditing}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleConfirm}
                        sx={{
                          fontWeight: 'bold',
                          borderRadius: 2,
                          width: 100,
                          height: 35,
                          backgroundColor: '#102D4D'
                        }}
                        disabled={!isEditing}
                      >
                        Save
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card sx={{width: '100%', borderRadius: '12px', boxShadow: 3}}>
              <CardContent sx={{padding: '16px 24px'}}>
                <Box>
                  <Typography sx={{fontWeight: 'bold', pb: 2, pt: 2}}>
                    Security
                  </Typography>
                  <Divider />
                  <Box
                    sx={{
                      pt: 5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Typography sx={{fontWeight: 'bold', fontSize: '13px'}}>
                      Change Password
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={handlePwdChange}
                      sx={{
                        fontWeight: 'bold',
                        borderRadius: 2,
                        width: 100,
                        height: 35,
                        backgroundColor: '#102D4D'
                      }}
                    >
                      Change
                    </Button>
                  </Box>
                </Box>
                <Box
                  sx={{
                    pt: 2,
                    pb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Typography sx={{fontWeight: 'bold', fontSize: '13px'}}>
                    Deactivate Account
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handleDeactivateAccount}
                    sx={{
                      fontWeight: 'bold',
                      borderRadius: 2,
                      width: 100,
                      height: 35,
                      backgroundColor: 'red'
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      <PasswordChangeDialogBox
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
      />
      <DeactivateAcccountConfirmation
        open={deleteDialogOpen}
        onClose={closeDeactivateAccount}
        id={authContext?.user?.id}
      />
    </ThemeProvider>
  );
}