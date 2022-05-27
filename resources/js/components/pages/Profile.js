import React, { useState, useEffect } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LoadingButton from "@mui/lab/LoadingButton";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function Profile({ logged }) {
    let controller;
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState("");
    const [severity, setSeverity] = useState({
        title: "",
        message: "",
    });

    const [company, setCompany] = useState([
        {
            id: null,
            title: "",
        },
    ]);

    const [objData, setObjData] = useState([
        {
            name: "",
            contact_no: "",
            designation: "",
            company_id: "",
        },
    ]);

    const [passwordData, setPasswordData] = useState([
        {
            password: "",
            confirm_password: "",
        },
    ]);

    function fetchCompanies() {
        axios
            .get("/v/companies/fetch-non-paginate")
            .then((response) => {
                let fetchItems = response.data.item;
                fetchItems = Object.assign([], fetchItems);

                setCompany(fetchItems);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function fetchUser() {
        let profile = { id: logged.id };
        setUser(logged.id);
        axios.post("/v/users/profile-fetch", profile).then((response) => {
            let itemData = response.data.item;
            let newData = [
                {
                    name: itemData.profile.name,
                    contact_no: itemData.profile.contact_no,
                    designation: itemData.profile.designation,
                    company_id: itemData.profile.company_id,
                    email: itemData.email,
                },
            ];
            setObjData(newData);
        });
    }

    useEffect(() => {
        fetchUser();
    }, [logged]);
    useEffect(() => {
        fetchCompanies();
    }, []);

    const [fieldState, setFieldState] = useState(true);
    const [fieldState2, setFieldState2] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleData = (e, type) => {
        let value = e.target.value;

        let objAssign = Object.assign([], objData);

        let data = objAssign.map((o, i) => {
            if (type == "company") {
                o.company_id = value;
            } else if (type == "name") {
                o.name = value;
            } else if (type == "contact_no") {
                o.contact_no = value;
            } else if (type == "designation") {
                o.designation = value;
            }
            if (o.company_id && o.name && o.contact_no && o.designation) {
                setFieldState(false);
            } else {
                setFieldState(true);
            }
            return o;
        });

        setObjData(data);
    };
    const handlePassword = (e, type) => {
        let value = e.target.value;
        
        let objAssign = Object.assign([], passwordData);
        let data = objAssign.map((o, i) => {
            if (type == "password") {
                o.password = value;
            } else if (type == "confirm_password") {
                o.confirm_password = value;
            }

            if(o.password.length > 6 && o.password == o.confirm_password){
                setFieldState2(false);
            }else{
                setFieldState2(true);
            }
            return o;
        });
        
        setPasswordData(data);
    };

    const submitPassword = () =>{
        setLoading(true);
        let newMessage = {
            title: "info",
            message: "Please wait...",
        };
        setSeverity(newMessage);
        let data = { password: passwordData[0].password, id: user };
        
        axios
            .post('/v/profile/change-password', data)
            .then((response) => {
                setOpen(true);
                setTimeout(() => {
                    newMessage = {
                        title: "success",
                        message: "Password has been successfully updated!",
                    };
                    setLoading(false);
                    setSeverity(newMessage);
                }, 500);
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

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };

    controller = "/v/users/update";

    const submitForm = () => {
        setLoading(true);
        let newMessage = {
            title: "info",
            message: "Please wait...",
        };
        setSeverity(newMessage);
        let data = { data: objData, id: logged.id };

        axios
            .post(controller, data)
            .then((response) => {
                setOpen(true);
                setTimeout(() => {
                    newMessage = {
                        title: "success",
                        message: "Profile has been successfully updated!",
                    };
                    setLoading(false);
                    setSeverity(newMessage);
                }, 500);
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
        <>
            <Paper sx={{ px: 3, py: 3 }}>
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
                            "& .MuiTextField-root": { m: 1, width: "80%" },
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <Grid
                            container
                            spacing={2}
                            sx={{ py: 3, pb: 1, mb: 1 }}
                        >
                            <Grid
                                container
                                spacing={2}
                                sx={{ padding: "0 16px" }}
                            >
                                {/* new row */}
                                <Grid item xs={12} md={2}>
                                    Name *
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        value={objData[0].name || ""}
                                        label=""
                                        onChange={(e) => handleData(e, "name")}
                                        size="small"
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    Email *
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    {objData[0].email || ""}
                                </Grid>
                                {/* new row */}
                                <Grid item xs={12} md={2}>
                                    Designation *
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        label=""
                                        value={objData[0].designation || ""}
                                        onChange={(e) =>
                                            handleData(e, "designation")
                                        }
                                        size="small"
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    Contact No. *
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        label=""
                                        size="small"
                                        value={objData[0].contact_no || ""}
                                        onChange={(e) =>
                                            handleData(e, "contact_no")
                                        }
                                        variant="outlined"
                                    />
                                </Grid>
                                {/* new row */}
                                <Grid item xs={12} md={2}>
                                    Company *
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        select
                                        size="small"
                                        label="Company"
                                        value={
                                            objData[0].company_id || company.id
                                        }
                                        onChange={(e) =>
                                            handleData(e, "company")
                                        }
                                        SelectProps={{
                                            native: true,
                                        }}
                                    >
                                        <option> - </option>
                                        {company.map((option) => (
                                            <option
                                                key={option.id}
                                                value={option.id}
                                            >
                                                {option.title}
                                            </option>
                                        ))}
                                    </TextField>
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

            <Paper sx={{ px: 3, py: 3, mt: 2 }}>
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
                            "& .MuiTextField-root": { m: 1, width: "80%" },
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <Grid
                            container
                            spacing={2}
                            sx={{ py: 3, pb: 1, mb: 1 }}
                        >
                            <Grid
                                container
                                spacing={2}
                                sx={{ padding: "0 16px" }}
                            >
                                {/* new row */}
                                <Grid item xs={12} md={2}>
                                    Password *
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        label="" 
                                        onChange={(e) =>
                                            handlePassword(e, "password")
                                        }
                                        size="small"
                                        variant="outlined"
                                        type="password"
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    Confirm Password *
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        label="" 
                                        onChange={(e) =>
                                            handlePassword(
                                                e,
                                                "confirm_password"
                                            )
                                        }
                                        type="password"
                                        size="small"
                                        variant="outlined"
                                    />
                                </Grid>

                                <Grid item xs={12} md={12}>
                                    <small>Password must be atleast 7 characters.</small> <br/><br/>
                                    <LoadingButton
                                        variant="contained"
                                        onClick={submitPassword}
                                        loading={loading}
                                        disabled={fieldState2}
                                    >
                                        Change Password
                                    </LoadingButton>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Paper>
        </>
    );
}
