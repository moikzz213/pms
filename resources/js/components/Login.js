import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as CryptoJS from "crypto-js";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import CssBaseline from "@mui/material/CssBaseline";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles"; 

import is_logged from "../services/is_loggedin";
const theme = createTheme();

export default function Login() {
    const navigate = useNavigate();
    const [loginDetails, setLoginDetails] = useState({
        email: "",
        password: "",
    });
   
    const [alertMessage, setAlertMessage] = useState({
        status: false,
        message: "Error please try again later",
    });

    const [isLoading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        let loginCredentials = {
            email: loginDetails.email,
            password: loginDetails.password,
        };

        //https://gagusers.melinfinity.com/

    //     axios.get('/sanctum/csrf-cookie').then(res => {
    //   axios.post('api/login', loginCredentials).then((response) => { 
        axios.get('/sanctum/csrf-cookie').then(res => {
          axios.post('api/login', loginCredentials).then((response) => { 
            let role = CryptoJS.AES.encrypt(response.data.role, "Moikzz");
            localStorage.setItem("auth_token",response.data.token);
            localStorage.setItem("auth_role",role);
            setLoading(false); 
              
            navigate("/d/dashboard"); 

        }).catch((error) => {
          setLoading(false);
          setAlertMessage({
            status: true,
            message: error.response.data.errors.email[0],
          });
         
        });
      });
       
    };
   
    useEffect(() => { 
        // let ls = localStorage.getItem('auth_token');
        // if(ls){ 
            is_logged.get("api/user")
            .then((response) =>{
                
                if(response.status == 200){
                    navigate("/d/dashboard"); 
                }
            }).catch((err) => {
                console.log(err);
            });
       // } 
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Card
                    sx={{
                        marginTop: 3,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <CardContent>
                        <Avatar
                            alt="Logo"
                            src="/images/GAG.png"
                            sx={{ width: "100%", height: "auto" }}
                        />
                        <Typography
                            sx={{ textAlign: "center" }}
                            component="h1"
                            variant="h5"
                        >
                            GAG - Procurement
                        </Typography>
                        <Box
                            component="form"
                            onSubmit={(e) => handleSubmit(e)}
                            noValidate
                            sx={{ mt: 1 }}
                        >
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                onChange={(e) =>
                                    setLoginDetails({
                                        ...loginDetails,
                                        email: e.target.value,
                                    })
                                }
                                autoComplete="email"
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                onChange={(e) =>
                                    setLoginDetails({
                                        ...loginDetails,
                                        password: e.target.value,
                                    })
                                }
                                autoComplete="current-password"
                            />

                            <LoadingButton
                                loading={isLoading}
                                classes={{ disabled: "gDisabledButton" }}
                                size="small"
                                fullWidth
                                disabled={
                                    loginDetails.email !== "" &&
                                    loginDetails.password !== ""
                                        ? false
                                        : true
                                }
                                variant={
                                    loginDetails.email !== "" &&
                                    loginDetails.password !== ""
                                        ? "contained"
                                        : "outlined"
                                }
                                sx={{
                                    marginBottom: "15px",
                                    padding: "15px 0",
                                    borderRadius: 0,
                                }}
                                onClick={(e) => handleSubmit(e)}
                            >
                                Login
                            </LoadingButton>
                            <Collapse in={alertMessage.status}>
                                <Alert
                                    severity="error"
                                    action={
                                        <IconButton
                                            aria-label="close"
                                            color="inherit"
                                            size="small"
                                            onClick={() => {
                                                setAlertMessage({
                                                    ...alertMessage,
                                                    status: false,
                                                });
                                            }}
                                        >
                                            <CloseIcon fontSize="inherit" />
                                        </IconButton>
                                    }
                                    sx={{ mb: 2 }}
                                >
                                    {alertMessage.message}
                                </Alert>
                            </Collapse>
                            <Grid container>
                                <Grid item xs>
                                    {/* <Link href="#" variant="body2">
                                        Forgot password?
                                    </Link> */}
                                </Grid>
                            </Grid>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </ThemeProvider>
    );
}
