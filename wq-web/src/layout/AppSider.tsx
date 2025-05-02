import React from 'react';
import {
  Drawer,
  Box,
  List,
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {MenuItems} from '../components/System/MenuItems';
import mainIcon from '../images/common/main-icon.png';
import {AuthContext} from '../components/auth/AuthProvider';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

interface IProps {
  isCollapsed: boolean;
  onTabSelect: (key: string) => void;
}

const AppSider = ({isCollapsed, onTabSelect}: IProps): JSX.Element => {
  const authContext = React.useContext(AuthContext);
  const [selectedKey, setSelectedKey] = React.useState('');
  const navigate = useNavigate();
  const userRole: any = authContext?.user?.role;

  const handleSelected = (key: string) => {
    setSelectedKey(key);
    onTabSelect(key);
    navigate(`/user/${key}`);
  };

  const handleLogout = () => {
    authContext?.setIsLoading(true);
    setTimeout(() => {
      authContext?.logout();
      authContext?.setIsLoading(false);
      navigate('/login');
    }, 1000);
  };

  return (
    <Drawer
      variant="permanent"
      open={!isCollapsed}
      sx={{
        width: isCollapsed ? 60 : 270,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isCollapsed ? 60 : 270,
          boxSizing: 'border-box',
          transition: 'width 0.3s'
        }
      }}
    >
      <Box sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        <Box sx={{padding: 2}}>
          <img
            src={mainIcon}
            alt="Main Icon"
            style={{width: '100%', height: 'auto'}}
          />
        </Box>
        <List sx={{flexGrow: 1}}>
          {MenuItems.filter(
            (item) => !item.roles || item.roles.includes(userRole)
          ).map((item) => (
            <div key={item.key}>
              {item.key === 'settings' && <Divider sx={{marginY: 1}} />}
              <ListItemButton
                onClick={() => handleSelected(item.key)}
                sx={{
                  fontSize: '0.1rem',
                  paddingLeft: '30px',
                  backgroundColor:
                    selectedKey === item.key ? '#e8f4ff' : 'transparent',
                  borderLeft:
                    selectedKey === item.key ? '2px solid #4072AF' : 'none',
                  '&:hover': {
                    backgroundColor: '#e8f4ff'
                  }
                }}
              >
                <ListItemIcon sx={{fontSize: '1rem'}}>{item.icon}</ListItemIcon>
                {!isCollapsed && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{fontSize: '14px'}}
                  />
                )}
              </ListItemButton>
            </div>
          ))}
        </List>
        <Box sx={{paddingBottom: '16px'}}>
          <Divider sx={{marginY: 1}} />
          <ListItemButton
            onClick={handleLogout}
            sx={{
              '&:hover': {
                backgroundColor: '#e8f4ff'
              }
            }}
          >
            <ListItemIcon>
              <ExitToAppIcon sx={{fontSize: '17px'}} />
            </ListItemIcon>
            {!isCollapsed && (
              <ListItemText
                primary="Log Out"
                primaryTypographyProps={{fontSize: '14px'}}
              />
            )}
          </ListItemButton>
        </Box>
      </Box>
    </Drawer>
  );
};

export default AppSider;
