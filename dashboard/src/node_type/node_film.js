import React, { memo, useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import CircularProgress from '@mui/material/CircularProgress';
import Pagination from '@mui/material/Pagination';
import Rating from '@mui/material/Rating';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import DialogConfig from './DialogConfig';
import TextField from '@mui/material/TextField';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const backdrop_path = "https://image.tmdb.org/t/p/original"

export default memo((nodeData) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1)
  const [oldQuery, setOldquery] = useState("");
  const [query, setQuery] = useState(nodeData.data.query)
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState(nodeData.data.time)
  const [openTime, setOpenTime] = useState(false)
  const handleRefresh = async () => {
    let result;
    setOpen(false)
    if (query === oldQuery)
      return;
    await fetch('http://localhost:8081/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: `
        query {
            ${query} {
                original_title
                poster_path
                release_date
                overview
                vote_average
                vote_count
          }
        }`
      }),
    })
    .then(res => res.json())
    .then(res => result = res.data)
    .catch(error => result = null)
    if (result == null) {
      nodeData.data.setAlert({
        msg: "Error loading movie",
        open: true,
        severity: 'error'
      })
      setOldquery("");
      return;
    }
    setOldquery(query)
    let temp = [];
    result[query].forEach(doc => temp.push(doc))
    setPage(1);
    setMaxPage(temp.length > 1 ? temp.length : 1);
    setData(temp)
  };

  useEffect(() => {
    nodeData.data.time = time
    let interval
    try {
      clearInterval(interval);
    } catch(err){}
    interval = setInterval(() => {
      handleRefresh()
    }, time);
    return () => {
      clearInterval(interval);
    };
  }, [time])

  const handleChange = (event, value) => {
    setPage(value);
  };

  const handleSelect = (event) => {
    setQuery(event.target.value);
    nodeData.data.query = event.target.value
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  return (
    <div className='film'>
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
          <IconButton color="primary" component="span" onClick={() => {setOpen(true)}}>
            <RefreshIcon/>
          </IconButton>
        </div>
        {data.length === 0 ? (<CircularProgress/>) : (
        <>
            <div className='data'>
                <img className='poster nodrag' src={`${backdrop_path}${data[page - 1].poster_path}`} alt='poster'/>
                <div className='info'>
                    <span className='title'>{data[page - 1].original_title}</span>
                    <div className='rating'>
                        <Rating name="read-only" value={Math.round(data[page - 1].vote_average/2)} readOnly />
                        <span style={{display: 'inline-block', alignItems: 'center', paddingTop: '4px', marginLeft: '5px'}}> on {data[page - 1].vote_count} reviews</span>
                    </div>
                    <span>{data[page - 1].overview}</span>
                    <Pagination className='page' count={maxPage} page={page} color="primary" onChange={handleChange}/>
                </div>
            </div>
        </>
        )}
        <ConfirmationDialogRaw
          id="ringtone-menu"
          keepMounted
          open={open}
          onClose={handleRefresh}
          value={query}
          setValue={handleSelect}
        />
      </div>
    </div>
  );
});

const querys = [
  {name: 'movieUpcoming', label: "Upcoming"},
  {name: 'movieToprated', label: "Top Rated"},
  {name: 'moviePopular', label: "Popular"},
];

function ConfirmationDialogRaw(props) {
  const { onClose, value: valueProp, open, setValue, ...other } = props;

  const handleOk = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      {...other}
    >
      <DialogTitle>Filter</DialogTitle>
      <DialogContent dividers>
        <RadioGroup
          aria-label="ringtone"
          name="ringtone"
          value={valueProp}
          onChange={setValue}
        >
          {querys.map((option) => (
            <FormControlLabel
              value={option.name}
              key={option.label}
              control={<Radio />}
              label={option.label}
            />
          ))}
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOk}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}