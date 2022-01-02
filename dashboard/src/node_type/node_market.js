import React, { memo, useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import Settings from '@mui/icons-material/Settings';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import ListItemIcon from '@mui/material/ListItemIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBitcoin, faEthereum } from '@fortawesome/free-brands-svg-icons'
import CircularProgress from '@mui/material/CircularProgress';
import DialogConfig from './DialogConfig'
import TextField from '@mui/material/TextField';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const useScript = (url, reload) => {
  useEffect(() => {
    const script = document.createElement('script');

    script.src = url;
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, [url, reload]);
};

export default memo((nodeData) => {
  const [query, setQuery] = useState(nodeData.data.query);
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState(nodeData.data.time)
  const [openTime, setOpenTime] = useState(false)
  const [reload, setReload] = useState(false)
  useScript('https://files.coinmarketcap.com/static/widget/currency.js', reload);

  const handleClickToOpen = () => {
    setOpen(true);
  };

  const handleToClose = async () => {
    setOpen(false);
  };

  useEffect(() => {
    handleToClose();
  }, []);

  useEffect(() => {
    nodeData.data.query = query
  }, [query]);

  useEffect(() => {
    nodeData.data.time = time
    let interval
    try {
      clearInterval(interval);
    } catch(err){}
    interval = setInterval(() => {
      setReload(true)
      setTimeout(() => {
          setReload(false)
      }, 1);
    }, time);
    return () => {
      clearInterval(interval);
    };
  }, [time])

  const onUpdate = (e) => {
    setQuery(e.target.value)
    setReload(true)
    setTimeout(() => {
        setReload(false)
    }, 1);
  }
  const updateTime = (e) => {
    setTime(e.target.value)
  }
  return (
    <>
    <DialogConfig
      title="ChangeMarket"
      open={open}
      handleClose={handleToClose}>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={query}
          label="Currency"
          onChange={onUpdate}
          >
          <MenuItem value={"1"}>
              <ListItemIcon>
                  <FontAwesomeIcon icon={faBitcoin} />
              </ListItemIcon>
              Bitcoin
          </MenuItem>
          <MenuItem value={"1027"}>
              <ListItemIcon>
                  <FontAwesomeIcon icon={faEthereum} />
              </ListItemIcon>
              Ethereum
          </MenuItem>
        </Select>
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
          onChange={updateTime}
        />
      </DialogConfig>
    <div>
        <div className='option'>
            <IconButton color="primary" component="span" onClick={() => setOpenTime(true)}>
                <AccessTimeIcon/>
            </IconButton>
            <IconButton color="primary" component="span" onClick={handleClickToOpen}>
                <Settings/>
            </IconButton>
        </div>
            {reload === true ? (<CircularProgress/>) :(
            <div style={{backgroundColor: 'white'}}className="nodrag coinmarketcap-currency-widget" data-currencyid={query} data-base="USD" data-secondary="" data-ticker="true" data-rank="true" data-marketcap="true" data-volume="true" data-statsticker="true" data-stats="USD"></div>
            )
            }
    </div>
    </>
  );
});