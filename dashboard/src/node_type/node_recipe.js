import React, { memo, useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import Settings from '@mui/icons-material/Settings';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import DialogConfig from './DialogConfig'
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default memo((nodeData) => {
  const [tag, setTag] = useState(nodeData.data.query);
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
    await fetch('https://193.70.2.77:8081/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: `
        query {
            getRandomRecipe(tags: "${tag}"){
                url
                status
              }
        }`
      }),
    })
    .then(res => res.json())
    .then(res => result = res.data)
    .catch(error => result = {getRandomRecipe: null})
    console.log(result)
    if (result.getRandomRecipe == null) {
      result.getRandomRecipe = null;
      nodeData.data.setAlert({
        msg: "Error loading recipe",
        open: true,
        severity: 'error'
      });
    }
    setData(result.getRandomRecipe);
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
      handleToClose();
    }, time);
    return () => {
      clearInterval(interval);
    };
  }, [time])

  const onUpdate = (e) => {
    setTag(e.target.value)
    nodeData.data.query = e.target.value
  }
  return (
    <div className='recipe'>
      <DialogConfig
        open={open}
        handleClose={handleToClose}
        title="Recipe tag">
          <TextField
            autoFocus
            margin="none"
            id="recipe"
            label="Recipe tag"
            type="email"
            value={tag}
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
            <img className='nodrag data' src={data.url} alt='recipe'/>
        </div>
        )}
      </div>
    </div>
  );
});