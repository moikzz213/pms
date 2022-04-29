import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import LoadingButton from "@mui/lab/LoadingButton";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function LocationForm({ action, id }) {
    let controller;
    const [open, setOpen] = useState(false);
    const [fieldState, setFieldState] = useState(true);
    const [loading, setLoading] = useState(false);
    const [severity, setSeverity] = useState({
        title: "",
        message: "",
    });

    const [objData, setObjData] = useState([
        {
            title: "",
        },
    ]);

    // Route Redirect
    const navigate = useNavigate();

    controller = "/v/locations/new";

    const handleData = (e, type) => {
        let value = e.target.value;
        if (value.length > 0) {
            setFieldState(false);
        } else {
            setFieldState(true);
        }
        let newData = [
            {
                title: value,
            },
        ];

        setObjData(newData);
    };

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };

    const submitForm = () => {
        setLoading(true);
        let newMessage = {
            title: "info",
            message: "Please wait...",
        };
        setSeverity(newMessage);
        let data = { data: objData };

        axios
            .post(controller, data)
            .then((response) => {
                setOpen(true);
                setTimeout(() => {
                    newMessage = {
                        title: "success",
                        message: "Data has been successfully added!",
                    };
                    setLoading(false);
                    setSeverity(newMessage);
                }, 500);

                setTimeout(() => {
                    // Route to Edit by id
                    navigate("/d/settings/locations/id/" + response.data.id);
                }, 1000);
            })
            .catch((error) => {
                newMessage = {
                    title: "error",
                    message: "Kindly refresh the page.",
                };
                setSeverity(newMessage);
                setLoading(false);
            });
    };
    return (
        <Paper sx={{ px: 3, py: 3, width: "400px" }}>
            <Box sx={{ flexGrow: 1 }}>
                <Snackbar
                    open={open}
                    autoHideDuration={4000}
                    onClose={handleClose}
                >
                    <Alert
                        onClose={handleClose}
                        severity={severity.title}
                        sx={{ width: "100%" }}
                    >
                        {severity.message}
                    </Alert>
                </Snackbar>
                <Box
                    component="form"
                    sx={{
                        "& .MuiTextField-root": { m: 1, width: "100%" },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <Grid container spacing={2} sx={{ py: 3, pb: 1, mb: 1 }}>
                        <Grid container spacing={2} sx={{ padding: "0 16px" }}>
                            {/* new row */}
                            <Grid item xs={12} md={2}>
                                Title
                            </Grid>
                            <Grid item xs={12} md={10}>
                                <TextField
                                    label=""
                                    size="small"
                                    variant="outlined"
                                    onChange={(e) => handleData(e)}
                                />
                            </Grid>

                            <Grid item xs={12} md={12}>
                                <LoadingButton
                                    disabled={fieldState}
                                    variant="contained"
                                    onClick={submitForm}
                                    loading={loading}
                                >
                                    Submit
                                </LoadingButton>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Paper>
    );
}
