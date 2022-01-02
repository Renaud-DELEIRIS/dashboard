import React, { useState, useRef, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  removeElements,
  Controls,
  ControlButton
} from 'react-flow-renderer';

import Sidebar from './Sidebar';
import Meteo from './node_type/node_meteo';
import Film from './node_type/node_film';
import Market from './node_type/node_market'
import Player from './node_type/node_player'
import Bullish from './node_type/node_bullish'
import Exchange from './node_type/node_exchange'
import Recipe from './node_type/node_recipe'
import SaveIcon from '@mui/icons-material/Save';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import uuid from 'react-uuid'

import './node_type/node.css'

const nodeTypes = {
  meteoNode: Meteo,
  filmNode: Film,
  marketNode: Market,
  playerNode: Player,
  bullishNode: Bullish,
  exchangeNode: Exchange,
  recipeNode: Recipe,
};

const getId = () => `dndnode_${uuid()}`;

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [elements, setElements] = useState([{}]);
  const [load, setLoad] = useState(false)
  const [dash, setDash] = useState(null)
  const [alert, setAlert] = useState({
    open: false,
    msg: "",
    severity: 'error'
  })
  const onConnect = (params) => setElements((els) => addEdge(params, els));
  const onElementsRemove = (elementsToRemove) =>
    setElements((els) => removeElements(elementsToRemove, els));

    const getUserDasboard = async () => {
      if (window.localStorage.token === undefined)
        return;
      const requestOptions = {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': window.localStorage.token,
          },
          body: JSON.stringify({ query: `
            query {
                getUser {
                  dashboard
              }
            }`
          })
      };
      await fetch('http://localhost:8081/graphql', requestOptions)
          .then(response => response.json())
          .then(data => {
            if (data.data.getUser.dashboard !== null) {
              setDash(data.data.getUser.dashboard)
              setLoad(true)
            }
          })
      }

    const onLoad = (_reactFlowInstance) => {
      setReactFlowInstance(_reactFlowInstance);
    }

    const onDragOver = (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    };

    useEffect(() => {
      async function load() {
        await getUserDasboard()
    }
    load()
  }, [])

  useEffect(() => {
    if (load && dash) {
      try  {
        reactFlowInstance.setTransform({x: dash.position[0], y: dash.position[1], zoom: dash.zoom})
        if (dash.elements) {
          dash.elements.forEach(element => { element.data.setAlert = setAlert});
          setElements(dash.elements);
        }
      } catch (e) {
        setAlert({
          open: true,
          msg: "Error loading dashboard",
          severity: 'error'
        })
      }
  }
}, [load])

  const onDrop = (event) => {
    event.preventDefault();
    console.log(reactFlowInstance.toObject())
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const type = event.dataTransfer.getData('application/reactflow');
    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });
    let nodeData;
    try {
      nodeData = JSON.parse(event.dataTransfer.getData('application/nodeData'))
    } catch(e) {
      nodeData = event.dataTransfer.getData('application/nodeData')
    }
    const newNode = {
      id: getId(),
      type: type,
      position: position,
      data: {
        query: nodeData,
        setAlert: setAlert,
        time: 50000
      },
    };
    setElements((es) => es.concat(newNode));
  };

  const handleSave = async () => {
    let result;
    const requestOptions = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'authorization': window.localStorage.token
      },
      body: JSON.stringify(reactFlowInstance.toObject())
    };
    await fetch('http://localhost:8081/user/update', requestOptions)
        .then(response => response.json())
        .then(data => result = data);
    if (result.error === undefined)
      setAlert({
        open: true,
        msg: 'Dashboard saved',
        severity: 'success'
      })
    else
      setAlert({
        open: true,
        msg: result.error.message,
        severity: 'error'
      })
  }

  return (
    <div className="dndflow" style={{display: 'flex', flexDirection: 'row'}}>
      <RaiseInfo alert={alert} setAlert={setAlert}/>
        <Sidebar/>
        <div className="reactflow-wrapper" ref={reactFlowWrapper} style={{height: '93vh', width: '80vw'}}>
          {elements &&
          <ReactFlow
            elements={elements}
            onConnect={onConnect}
            onElementsRemove={onElementsRemove}
            onLoad={onLoad}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
          >
            <Controls showInteractive={false}>
              <ControlButton onClick={handleSave}>
                <SaveIcon />
              </ControlButton>
            </Controls>
          </ReactFlow>}
        </div>
    </div>
  );
};

export default DnDFlow;

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function RaiseInfo(props) {
  const {alert, setAlert} = props;

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlert({
      open: false,
      msg: '',
      severity: alert.severity
    })
  };
  return (
      <Snackbar open={alert.open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleClose} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.msg}
        </Alert>
      </Snackbar>
  );
}