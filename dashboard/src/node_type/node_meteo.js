import React, { memo, useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import Settings from '@mui/icons-material/Settings';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import DialogConfig from './DialogConfig'
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default memo((nodeData) => {
  const [city, setCity] = useState(nodeData.data.query);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const [time, setTime] = useState(nodeData.data.time)
  const [openTime, setOpenTime] = useState(false)

  const handleClickToOpen = () => {
    setOpen(true);
  };

  const handleToClose = async () => {
    let result;
    setOpen(false);
    await fetch('http://localhost:8081/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: `
        query {
          weather(name: "${city}") {
            location {
              name
              country
              region
              localtime
            }
            current {
              observation_time
              temperature
              weather_icons
              weather_descriptions
            }
          }
        }`
      }),
    })
    .then(res => res.json())
    .then(res => result = res.data)
    .catch(error => result = {weather: null})
    console.log(result)
    if (result.weather == null || result.weather.location == null) {
      result.weather = null;
      nodeData.data.setAlert({
        msg: "Error loading meteo",
        open: true,
        severity: 'error'
      });
    }
    setData(result.weather);
  };

  useEffect(() => {
    handleToClose();
  }, []);

  useEffect(() => {
    nodeData.data.time = time
    let interval
    try {
      clearInterval(interval);
    } catch(err){}
    interval = setInterval(() => {
      handleToClose()
    }, time);
    return () => {
      clearInterval(interval);
    };
  }, [time])

  const onUpdate = (e) => {
    setCity(e.target.value)
    nodeData.data.query = e.target.value
  }
  return (
    <div className='meteo'>
      <DialogConfig
        open={open}
        handleClose={handleToClose}
        title="Change city ?">
          <TextField
            autoFocus
            margin="none"
            id="name"
            label="City name"
            type="email"
            value={city}
            onChange={onUpdate}
            fullWidth
            variant="standard"
          />
      </DialogConfig>
      <DialogConfig
      title="ChangeMarket"
      open={openTime}
      handleClose={() => setOpenTime(false)}>
        <TextField
          id="outlined-number"
          label="Number"
          type="number"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </DialogConfig>
      <div className='container'>
        <div className='option'>
        <IconButton color="primary" component="span" onClick={() => setOpenTime(true)}>
                <AccessTimeIcon/>
            </IconButton>
          <IconButton color="primary" component="span" onClick={handleClickToOpen}>
            <Settings/>
          </IconButton>
        </div>
        {data === null ? (<CircularProgress/>) : (
        <div className='data'>
          <div className='cityName'>
            {data.location.name}, {data.location.country}
          </div>
            <div className='info'>
              <img className='nodrag' src={data.current.weather_icons[0]} alt='logo'/>
              <div className='tempinfo'>
                <span className='temperature'>{data.current.temperature} °C</span>
                <span className='tempdescription'>{data.current.weather_descriptions[0]}</span>
              </div>
            </div>
            <div className='localtime'>{data.location.localtime}</div>
        </div>
        )}
      </div>
    </div>
  );
});