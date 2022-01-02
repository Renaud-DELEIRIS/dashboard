import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import MovieIcon from '@mui/icons-material/Movie';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CakeIcon from '@mui/icons-material/Cake';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

export default function SideBar() {
  const onDragStart = (event, nodeType, data) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/nodeData', data);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="sidebar">
        <List>
          <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'meteoNode', 'Lyon')} draggable>
            <ListItem>
              <ListItemIcon>
                <DeviceThermostatIcon />
              </ListItemIcon>
              <ListItemText primary="Méteo" />
            </ListItem>
          </div>
          <div className="dndnode" onDragStart={(event) => onDragStart(event, 'filmNode', 'movieUpcoming')} draggable>
            <ListItem>
                <ListItemIcon>
                  <MovieIcon />
                </ListItemIcon>
                <ListItemText primary="Film" />
            </ListItem>
          </div>
          <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'marketNode', '1')} draggable>
            <ListItem>
                <ListItemIcon>
                  <MonetizationOnIcon />
                </ListItemIcon>
                <ListItemText primary="Market" />
            </ListItem>
          </div>
          <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'bullishNode', 'BTC')} draggable>
            <ListItem>
                <ListItemIcon>
                  <PointOfSaleIcon />
                </ListItemIcon>
                <ListItemText primary="Bullish" />
            </ListItem>
          </div>
          <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'exchangeNode', JSON.stringify({amount: 1, right: 'BTC', left: 'EUR'}))} draggable>
            <ListItem>
                <ListItemIcon>
                  <CompareArrowsIcon />
                </ListItemIcon>
                <ListItemText primary="Exchange" />
            </ListItem>
          </div>
          <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'recipeNode', '')} draggable>
            <ListItem>
                <ListItemIcon>
                  <CakeIcon />
                </ListItemIcon>
                <ListItemText primary="Recipe" />
            </ListItem>
          </div>
          <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'playerNode')} draggable>
            <ListItem>
                <ListItemIcon>
                  <MusicNoteIcon />
                </ListItemIcon>
                <ListItemText primary="Spotify" />
            </ListItem>
          </div>
        </List>
    </div>
  );
};