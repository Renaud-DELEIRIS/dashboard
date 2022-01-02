import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { Link, Navigate } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import {GoogleLogin, GoogleLogout} from 'react-google-login';
import SpotifyLogin from 'react-spotify-login'; 

const theme = createTheme();

export default function SignIn() {
    const [open, setOpen] = React.useState(false);
    const [error, setError] = React.useState("Error");
    const [redirect, setRedirect] = React.useState(false)
  const handleSubmit = async (event) => {
    event.preventDefault();
    let result;
    const data = new FormData(event.currentTarget);
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: data.get('email'),
            password: data.get('password')
          })
    };
    await fetch('http://localhost:8081/auth/vanilla/signin', requestOptions)
        .then(response => response.json())
        .then(data => result = data);
    if (result.success !== undefined) {
        window.localStorage.token = result.success;
        setRedirect(true)
    } else {
        setError(result.error.message)
        setOpen(true);
    }
  };
  const onSuccessGoogle = async (res) => {
    let result;
    const requestOptions = {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Bearer': res.tokenId,
      },
    };
    await fetch('http://localhost:8081/auth/google', requestOptions)
        .then(response => response.json())
        .then(data => result = data);
    if (result.success !== undefined) {
        window.localStorage.token = result.success;
        setRedirect(true)
    } else {
        setError(result.error.message)
        setOpen(true);
    }
  }
  //const onSuccessSpotify = response => console.log(response);
  
  const onSuccessSpotify = async (res) => {
    let result;
    const requestOptions = {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Bearer': res.access_token  ,
      },
    };
    await fetch('http://localhost:8081/user/spotify', requestOptions)
        .then(response => response.json())
        .then(data => result = data);
    if (result.success !== undefined) {
        window.localStorage.token = result.success;
        setRedirect(true)
    } else {
//      setError(res.access_token);
      //        setError(res)
        setError(result.error.message)
        setOpen(true);
    }
  }
  
  const onFailure = (res) => {
    setError(res.error)
    setOpen(true);
  }

  return (
    <ThemeProvider theme={theme}>
        <RaiseError value={open} setOpen={setOpen} msg={error}/>
        { redirect ? (<Navigate push to="/"/>) : null }
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <LoginGoogle onSuccessGoogle={onSuccessGoogle} onFailure={onFailure}/>
            <Grid container>
              <Grid item>
                <Link to="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

export function RaiseError(props) {
    const {value: open, setOpen, msg} = props;

    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpen(false);
    };
    return (
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            {msg}
          </Alert>
        </Snackbar>
      </Stack>
    );
  }


const LoginSpotify = ({onSuccessSpotify, onFailure}) => {
  return (
    <div>
      <SpotifyLogin
        clientId={'1fb88675208449d6bc9c31d2fcc3dc93'}
        buttonText="JUIF"
        cookiePolicy={'single_host_origin'}
        onSuccess={onSuccessSpotify}
        onFailure={onFailure}
        redirectUri={'http://localhost:8080/callback'}
      />
    </div>
  )
}

const LoginGoogle = ({onSuccessGoogle, onFailure}) => {
  return (
    <div>
      <GoogleLogin
        clientId={'62135896722-pvlotgl8dp4dua90m71h1na87ou4hm3g.apps.googleusercontent.com'}
        buttonText="Login"
        cookiePolicy={'single_host_origin'}
        onSuccess={onSuccessGoogle}
        onFailure={onFailure}
      />
    </div>
  )
}