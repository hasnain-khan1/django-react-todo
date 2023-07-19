import { AppBar, Box, Toolbar, Typography, Button } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { getToken, removeToken } from '../services/LocalStorageService';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { unSetUserToken } from '../features/authSlice';
import { unsetUserInfo } from '../features/userSlice';

const Navbar = () => {
  const handleLogout = () => {
    dispatch(unsetUserInfo({ name: "", email: "" }))
    dispatch(unSetUserToken({ access_token: null }))
    removeToken()
    navigate('/login')
  }
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { access_token } = getToken()
  return <>
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="secondary">
        <Toolbar>
          <Typography variant='h5' component="div" sx={{ flexGrow:1 }}>Todo App</Typography>
          {access_token ? <Button component={NavLink} onClick={handleLogout} to='/login' style={({ isActive }) =>
            { return { backgroundColor: isActive ? '#6d1b7b' : '' } }}
            sx={{ color: 'white', textTransform: 'none' }}>Logout</Button>
            :
            <Button component={NavLink} to='/login' style={({ isActive }) => 
            { return { backgroundColor: isActive ? '#6d1b7b' : '' } }}
              sx={{ color: 'white', textTransform: 'none' }}>Login/Registration</Button>}

        </Toolbar>
      </AppBar>
    </Box>
  </>;
};

export default Navbar;
