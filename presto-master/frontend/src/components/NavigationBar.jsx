import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { handleSignOut } from '../utils/helper';
import { useNavigate } from 'react-router-dom';

// Creates the navigation bar at the top for going to dash or logging out
function NavigationBar ( {setLoginStatus} ) {
  const navigate = useNavigate()
  function handleLogOut() {
    handleSignOut()
    navigate('/')
    setLoginStatus(false)
  }

  function handleDashboardClick() {
    navigate('/dashboard');
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: 'grey.800' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Button onClick={handleDashboardClick}  sx={{ color: 'inherit', textTransform: 'none' }}>
            <Typography variant="h6" component="div">
              presto.
            </Typography>
          </Button>
          <Button onClick={handleLogOut} 
            className="border border-red-500 text-red-500 hover:bg-red-100 hover:border-red-600 hover:text-red-600 font-semibold py-2 px-4 rounded transition duration-300 ease-in-out"
            variant="outlined" color="inherit"
          >
            Log out
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );

}

export default NavigationBar