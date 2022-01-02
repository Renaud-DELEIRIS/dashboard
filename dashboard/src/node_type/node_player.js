import React, { memo, useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import DialogConfig from './DialogConfig'
import Settings from '@mui/icons-material/Settings';
import TextField from '@mui/material/TextField';
import axios from "axios"
import SpotifyPlayer from 'react-spotify-web-playback';

const PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/me/playlists";
const PREVIOUS = "https://api.spotify.com/v1/me/player/previous";
const NEXT = "https://api.spotify.com/v1/me/player/next";

export default memo((nodeData) => {

  const [data, setData] = useState({});
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState(window.localStorage.spotifyToken);
  const [playlist, setPlaylist] = useState("");

  useEffect(() => {  
    (async () => { 
      const token = await getSpotifyToken();
      setToken(token);
      handleToClose();
    })()
  }, [])
  const getSpotifyToken = async () => {
    if (window.localStorage.token === undefined)
      return;
    console.log(window.localStorage.token)
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': window.localStorage.token,
        },
        body: JSON.stringify({ query: `
          query {
              getUser {
                email
                firstName
                lastName
                spotifyToken
                error {
                  message
                }
            }
          }`
        })
    };
    let result
    await fetch('http://localhost:8081/graphql', requestOptions)
        .then(response => response.json())
        .then(data => result = data);
        setToken(result.data.getUser.spotifyToken);
        return (result.data.getUser.spotifyToken);
      }
  const handleToClose = async () => {
    const token = await getSpotifyToken();
    setToken(token);
    setOpen(false);
    console.log(token)
    let result
    axios({
      url: PLAYLISTS_ENDPOINT,
      method: 'get',
      headers: {
        'Accept':'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        "Authorization": "Bearer " + token
      },
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error)
        nodeData.data.setAlert({
          msg: "Error loading spotify",
          open: true,
          severity: 'error'
        });
      })
      return (result);

    }
    const handleClickNext = async () => {
      const token = await getSpotifyToken();
      axios({
        url: NEXT,
        method: 'post',
        headers: {
          'Accept':'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          "Authorization": "Bearer " + token
        },
      }).then(function(response) {
          console.log(response);
      }).catch(function(error) {
        nodeData.data.setAlert({
          msg: "Error loading spotify",
          open: true,
          severity: 'error'
        });
      });
    }
    const handleClickPrevious = async () => {
      const token = await getSpotifyToken();
      axios({
        url: PREVIOUS,
        method: 'post',
        headers: {
          'Accept':'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          "Authorization": "Bearer " + token
        },
      }).then(function(response) {
          console.log(response);
      }).catch(function(error) {
        nodeData.data.setAlert({
          msg: "Error loading spotify",
          open: true,
          severity: 'error'
        });
      });
    }
    const handleClickToOpen = () => {
      setOpen(true);
    };
    const onUpdate = (e) => {
      try{ 
        setPlaylist(data.items[e.target.value].uri)
      } catch (error) {
    }

    }
    return (  
    <div className='player'>
      <DialogConfig
        open={open}
        handleClose={handleToClose}
        title="Select Playlist">
          <TextField
            autoFocus
            margin="none"
            id="name"
            label="Number"
            type="Number"
            onChange={onUpdate}
            fullWidth
            variant="standard"
          />
          {data?.items ? data.items.map((item, index) => <p>{index} {item.name}</p>) :null}
          <div className='tempinfo'>
          </div>
      </DialogConfig>
      <div className='player'>
        <div className='option'>
        <IconButton color="primary" component="span" onClick={handleClickPrevious}>
          <div>
            Previous
          </div>
          </IconButton>
          <IconButton color="primary" component="span" onClick={handleClickNext}>
            <div>
              Next
            </div>
          </IconButton>
          <SpotifyPlayer
            styles={{
            activeColor: '#fff',
            bgColor: '#333',
            color: '#fff',
            loaderColor: '#fff',
            sliderColor: '#1cb954',
            trackArtistColor: '#ccc',
            trackNameColor: '#fff',
          }}
          token={token}
          uris={playlist} 
          name={"Spotify"}
          persistDeviceSelection={true}
          />;
        </div>
        <div className='option'>
          <IconButton color="primary" component="span" onClick={handleClickToOpen}>
            <Settings/>
          </IconButton>
        </div>
      </div>
    </div>
    
);
});

