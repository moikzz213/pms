import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {  createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline'; 
import Box from '@mui/material/Box'; 
import Toolbar from '@mui/material/Toolbar'; 
import Content from './Content';
import Sidebar from './Sidebar'; 
import axios from "axios";
const mdTheme = createTheme({ 
    palette: {
      
      primary: {
        // Gold and green play nicely together.
        main: '#c6a92d', 
        contrastText: '#fff',
      },
      secondary: {
        // This is green.A700 as hex.
        main: '#01579b',
      },
      red:{
        main: "red",
        contrastText: '#fff',
      },
      orange:{
        main: "orange",
        contrastText: '#fff',
      },
      green:{
        main: "#1b8b29",
        contrastText: '#fff',
      }
    }, 
});

function CommonTheme() { 

  const navigate = useNavigate(); 
  const [logged, setLogged] = useState({});
  useEffect(() => {
    let apiUrl = process.env.MIX_SENTRY_DSN_PUBLIC;
    let ls = localStorage.getItem('auth_token');
     
    const apiClient = axios.create({
      baseURL: apiUrl,
      withCredentials: true,
      headers: {
        Authorization: "Bearer "+ls,
        Accept: 'application/json',
        "Content-Type": "application/json",
      }
    });
    apiClient.get("api/user")
    .then((response) =>{
         if(response.status !== 200){         
           navigate("/login"); 
         } 
         setLogged(response.data);
    }).catch((err) => {
      navigate("/login"); 
    })
}, []);
 
  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline /> 

        {/* Page Sidebar  */}
        <Sidebar/>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar className="no-print" />

          {/* Page Contents */}
          <Content logged={logged}/>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function Theme() {
    return <CommonTheme />;
  }