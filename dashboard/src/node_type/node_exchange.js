import React, { memo, useState, useEffect } from 'react';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBitcoin, faEthereum } from '@fortawesome/free-brands-svg-icons'
import { faEuroSign, faDollarSign, faExchangeAlt } from '@fortawesome/free-solid-svg-icons'
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import FilledInput from '@mui/material/FilledInput';
import DialogConfig from './DialogConfig';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const currencies = [
  {
    value: 'USD',
    label: 'Dollar',
    icon: faDollarSign
  },
  {
    value: 'EUR',
    label: 'Euro',
    icon: faEuroSign
  },
  {
    value: 'BTC',
    label: 'Bitcoin',
    icon: faBitcoin
  },
  {
    value: 'ETH',
    label: 'Ethereum',
    icon: faEthereum
  },
];

export default memo((nodeData) => {
  const [query, setQuery] = useState(nodeData.data.query);
  const [convert, setConvert] = useState(0)
  const [time, setTime] = useState(nodeData.data.time)
  const [openTime, setOpenTime] = useState(false)

  const handleToClose = async () => {
    let result;
    console.log(query)
    await fetch('https://193.70.2.77:8081/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: `
        query {
            getExchangeRate(symbol: "${query.right}", amount: ${query.amount}, convert:"${query.left}") {
                data
                status
              }
        }`
      }),
    })
    .then(res => res.json())
    .then(res => result = res.data.getExchangeRate)
    .catch(error => result = {data: null})
    console.log(result)
    if (result == null || result.data == null) {
      nodeData.data.setAlert({
        msg: "Error loading exchange",
        open: true,
        severity: 'error'
      });
      return;
    }
    setConvert(new Intl.NumberFormat('de-DE', { style: 'currency', currency: query.left }).format(Math.round(result.data.quote[query.left].price)))
  };

  useEffect(() => {
    handleToClose();
  }, [query]);

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

  const onUpdate = (prop) => (e) => {
    setQuery({...query, [prop]: e.target.value})
    nodeData.data.query = query
  }
  return (
    <div className='exchange'>
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
        </div>
        <div className='info'>
          <div className='field'>
            <Select
              style={{display: 'flex', margin: '10px'}}
              labelId="select-right-currency"
              id="right-currency"
              value={query.right}
              onChange={onUpdate('right')}
            >
              {currencies.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <ListItemIcon>
                    <FontAwesomeIcon icon={option.icon}/>
                  </ListItemIcon>
                  <ListItemText primary={option.label} />
                </MenuItem>
              ))}
            </Select>
            <FontAwesomeIcon icon={faExchangeAlt}/>
            <Select
              style={{display: 'flex', margin: '10px'}}
              labelId="select-left-currency"
              id="left-currency"
              value={query.left}
              onChange={onUpdate('left')}
            >
              {currencies.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <ListItemIcon>
                    <FontAwesomeIcon icon={option.icon}/>
                  </ListItemIcon>
                  <ListItemText primary={option.label} />
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className='result'>
            <FormControl variant="filled">
              <InputLabel htmlFor="filled-adornment-amount">Amount</InputLabel>
              <FilledInput
                id="filled-adornment-amount"
                value={query.amount}
                onChange={onUpdate('amount')}
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                />
            </FormControl>
            <span className='convert'>{convert}</span>
          </div>
        </div>
      </div>
    </div>
  );
});