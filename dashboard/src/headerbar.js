import React, {useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import LoginIcon from '@mui/icons-material/Login';
import IconButton from '@mui/material/IconButton'
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import TwitterIcon from '@mui/icons-material/Twitter';
import GoogleIcon from '@mui/icons-material/Google';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import LogoutIcon from '@mui/icons-material/Logout';
import { Navigate } from "react-router-dom";
import SpotifyLogin from 'react-spotify-login'; 
import { RaiseError } from './login/Signin';

const HeaderBar = () => {
    const [open, setOpen] = useState(false);
    const [logout, setLogout] = useState(false);
    const [error, setError] = React.useState("Error");
    const [connected, setConnected] = useState({
      google: false,
      twitter: false,
      spotify: false
    })
    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }
        if (event.target.innerHTML === "Logout") {
          setLogout(true)
          console.log('logged out')
        }
        console.log(event)
        setOpen(open);
    };

    const LoginSpotify = () => {
      return (
        <div>
          <SpotifyLogin
            clientId={'1fb88675208449d6bc9c31d2fcc3dc93'}
            buttonText="Login"
            cookiePolicy={'single_host_origin'}
            onSuccess={onSuccessSpotify}
            onFailure={onFailure}
            redirectUri={'http://localhost:8080/callback'}
            scope={"user-read-private user-read-email user-modify-playback-state streaming user-read-playback-state"}
          />
        </div>
      )
    }
    
    const onSuccessSpotify = async (res) => {
    
      let result;
      const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': window.localStorage.token,
        },
        body: JSON.stringify({
          token: res.access_token
        })
      };
      await fetch('http://localhost:8081/auth/spotify', requestOptions)
          .then(response => response.json())
          .then(data => result = data);
      if (result !== undefined) {
        
          window.localStorage.spotifyToken = res.access_token;
          setConnected({spotify: true});
      } else {
          setError(res.access_token);
          console.log(res.access_token)
        }
    }
  
    const onFailure = (res) => {
      setError(res.error)
      setOpen(true);
    }
    

    const ListInfo = () => (
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            <ListItem button key="Spotify">
              <ListItemIcon>
                <MusicNoteIcon/>
              </ListItemIcon>
              <ListItemText primary="Spotify"/>
              <LoginSpotify/>
              {connected.spotify === true ? <CheckIcon/> : <ClearIcon/>}
            </ListItem>
            <Divider/>
            <ListItem button key="Twitter">
              <ListItemIcon>
                <TwitterIcon/>
              </ListItemIcon>
              <ListItemText primary="Twitter"/>
              {connected.twitter === true ? <CheckIcon/> : <ClearIcon/>}
            </ListItem>
            <Divider/>
            <ListItem button key="Gmail">
              <ListItemIcon>
                <GoogleIcon/>
              </ListItemIcon>
              <ListItemText primary="Gmail"/>
              {connected.google === true ? <CheckIcon/> : <ClearIcon/>}
            </ListItem>
            <Divider/>
            <ListItem style={{position: "fixed", bottom: 0, paddingBottom: 10}} button key="Logout">
              <ListItemIcon>
                <LogoutIcon/>
              </ListItemIcon>
              <ListItemText primary="Logout"/>
            </ListItem>
          </List>
        </Box>
      );

    return(
        <>
        {logout === true ? (<Navigate push to='/logout'/>) : (<></>)}

        <AppBar position="static">
            <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                DashBoarded
            </Typography>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{ mr: 2 }}
                onClick={() => setOpen(true)}
                >
                <LoginIcon/>
            </IconButton>
            </Toolbar>
        </AppBar>
        <Drawer
            anchor='right'
            open={open}
            onClose={toggleDrawer(false)}
          >
            <ListInfo/>
          </Drawer>
      </>
    )
}



export default HeaderBar