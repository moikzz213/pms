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
export default function CompanyFormEdit({ id }) {
    let controller;
    const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState({
        title: "",
        message: "",
    }); 

    const [objData, setObjData] = useState([
        {
            title: "",
            code: "",
            contact_person: "",
            address: "",
            contact_no: "",
            tax_no: "",
            email: "",
        },
    ]);

    useEffect(() => {
        axios.get("/v/companies/fetch/" + id).then((response) => {
            let itemData = response.data.item;
            let newData = [
                {
                    title: itemData.title,
                    code: itemData.code,
                    contact_person: itemData.contact_person,
                    address: itemData.address,
                    contact_no: itemData.contact_no,
                    tax_no: itemData.tax_no,
                    email: itemData.email,
                },
            ];
            setObjData(newData);
 
        });
    }, []);

    controller = "/v/companies/update";

    const [fieldState, setFieldState] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleData = (e, type) => {
        let value = e.target.value;

        let objAssign = Object.assign([], objData);

        let data = objAssign.map((o, i) => {
            if (type == "company") {
                o.title = value;
            } else if (type == "person") {
                o.contact_person = value;
            } else if (type == "address") {
                o.address = value;
            } else if (type == "contact_no") {
                o.contact_no = value;
            } else if (type == "tax_no") {
                o.tax_no = value;
            } else if (type == "email") {
                o.email = value;
            } else if (type == "code") {
                o.code = value;
            }
            if (
                o.title &&
                o.code &&
                o.contact_person &&
                o.address &&
                o.contact_no &&
                o.tax_no &&
                o.email
            ) {
                setFieldState(false);
            } else {
                setFieldState(true);
            }
            return o;
        });

        setObjData(data);
        
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
        let data = { data: objData, id: id };

        axios
            .post(controller, data)
            .then((response) => {
                setOpen(true);
                setTimeout(() => {
                    newMessage = {
                        title: "success",
                        message: "Data has been successfully added/updated!",
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
                    <Grid container spacing={2} sx={{ py: 3, pb: 1, mb: 1 }}>
                        <Grid container spacing={2} sx={{ padding: "0 16px" }}>
                            {/* new row */}
                            <Grid item xs={12} md={2}>
                                Company Name *
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    value={objData[0].title || ""}
                                    label=""
                                    onChange={(e) => handleData(e, "company")}
                                    size="small"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={2}>
                                Code *
                            </Grid>
                            <Grid item xs={12} md={4}>
                              
                              <TextField
                                  
                                  label=""
                                  onChange={(e) => handleData(e, "code")}
                                  size="small"
                                  variant="outlined"
                              />
                          </Grid>
                            <Grid item xs={12} md={2}>
                                Contact person *
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label=""
                                    value={objData[0].contact_person || ""}
                                    size="small"
                                    onChange={(e) => handleData(e, "person")}
                                    variant="outlined"
                                />
                            </Grid>
                            {/* new row */}
                            <Grid item xs={12} md={2}>
                                Address *
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label=""
                                    value={objData[0].address || ""}
                                    onChange={(e) => handleData(e, "address")}
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
                                Tax No. *
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label=""
                                    size="small"
                                    value={objData[0].tax_no || ""}
                                    onChange={(e) => handleData(e, "tax_no")}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={2}>
                                Email *
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label=""
                                    size="small"
                                    value={objData[0].email || ""}
                                    onChange={(e) => handleData(e, "email")}
                                    variant="outlined"
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
