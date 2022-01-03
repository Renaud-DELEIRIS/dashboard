import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import DnDFlow from './App';
import HeaderBar from './headerbar'
import Signin from './login/Signin'
import Signup from './login/Signup'
import CircularProgress from '@mui/material/CircularProgress';
import { BrowserRouter as Router, Route, Navigate, Routes } from "react-router-dom";

import {
  ReactFlowProvider,
} from 'react-flow-renderer';



const HandleRegistery = () => {
  const [data, setData] = React.useState(null);

  const isAuth = async () => {
    if (window.localStorage.token === undefined) {
      setData({"getUser": null})
      return;
    }
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
                error {
                  message
                }
            }
          }`
        })
    };
    await fetch('http://localhost:8081/graphql', requestOptions)
        .then(response => response.json())
        .then(data => setData(data.data));
        console.log(data);
    }

  useEffect(() => {
    isAuth();
  }, []);

  const Auth = () => {
    console.log(data)
    return (
      <>
      {(data.getUser == null || data.getUser.email == null) ? (<Navigate push to='/signin'/>) : (
        <>
          <HeaderBar/>
          <ReactFlowProvider>
            <DnDFlow/>
          </ReactFlowProvider>
        </>
      )}
      </>
    )
  }
  return (
    <>
      {data == null ? (<CircularProgress/>) : (<Auth/>)}
    </>
  );
}

const Logout = () => {
  const [data, setData] = React.useState(null);

  const logout = async () => {
    if (window.localStorage.token === undefined)
      return;
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': window.localStorage.token,
        }
    };
    await fetch('http://localhost:8081/logout', requestOptions)
        .then(response => response.json())
        .then(data => setData(data))
        window.localStorage.token = undefined;
    }

  useEffect(() => {
    logout();
  }, []);

  return (
    <>
      {data == null ? (<CircularProgress/>) : (<Navigate push to='/signin'/>)}
    </>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<HandleRegistery/>}/>
        <Route path="signin" element={<Signin/>}/>
        <Route path="signup" element={<Signup/>}/>
        <Route path="logout" element={<Logout/>}/>
      </Routes>
    </Router>
    {/* <Signup/> */}
    {/* <Signin/> */}
    {/* <HeaderBar/>
    <DnDFlow /> */}
  </React.StrictMode>,
  document.getElementById('root'),
);
