import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useDropzone } from "react-dropzone";
import API from "../../services/api.js";
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function RequestForm({ logged }) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [fieldState, setFieldState] = useState(true);
    const [files, setFiles] = useState("");
    const [requestor, setRequestor] = useState([
        {
            name: "",
            designation: "",
        },
    ]);
    const [severity, setSeverity] = useState({
        title: "",
        message: "",
    });

    let defaultDate = new Date();
    const [date, setDate] = useState(defaultDate);

    let minutes = defaultDate.getMinutes();
    let hours = defaultDate.getHours();
    let ampm = "PM";
    if(minutes < 10){
        minutes = "0"+minutes;
    }
    if(hours < 12){
        ampm = "AM";
    }


    let curTime = hours + ":" + minutes +" "+ampm;
    const [time, setTime] = useState(curTime);

    const [loading, setLoading] = useState(false);
    const [urgency, setUrgency] = useState();
    const [location, setLocation] = useState([
        {
            id: null,
            title: "",
        },
    ]);

    const [company, setCompany] = useState([
        {
            id: null,
            title: "",
        },
    ]);

    const [objData, setObjData] = useState([
        {
            company_id: "",
            urgency: "",
            location_id: "",
            details: "",
        },
    ]);

    //Dropzone 
      
    const onDrop = useCallback((acceptedFiles) => {  
        setFiles(acceptedFiles);
    }, [setFiles]); 

    const {
        acceptedFiles, 
        getRootProps,
        getInputProps
      } = useDropzone({
        onDrop
      });
      
    const acceptedFileItems = acceptedFiles.map(file => ( 
        <li key={file.path}>
          {file.path} - {parseInt(file.size/ 1000)}  KB
        </li>
      ));
    //   End Drop Zone

    const handleData = (e, type) => {
        let value = e.target.value;

        let objAssign = Object.assign([], objData);

        let data = objAssign.map((o, i) => {
            o.user_id = logged.id;
            if (type == "company") {
                o.company_id = value;
            } else if (type == "urgency") {
                o.urgency = value;
            } else if (type == "location") {
                o.location_id = value;
            } else if (type == "details") {
                o.details = value;
            }
            if (o.urgency && o.company_id && o.location_id && o.details) {
                setFieldState(false);
            } else {
                setFieldState(true);
            }
            return o;
        });

        setObjData(data);
    };

    useEffect(() => {
        axios.get("/v/companies/fetch-non-paginate").then((response) => {
            let fetchItems = response.data.item;
            fetchItems = Object.assign([], fetchItems);

            setCompany(fetchItems);
        });

        axios.get("/v/locations/fetch-non-paginate").then((response) => {
            let fetchItems = response.data.item;
            fetchItems = Object.assign([], fetchItems);

            setLocation(fetchItems);
        });

        axios.get(" /v/profile/fetch/" + logged.id).then((response) => {
            setRequestor(response.data.item);
        });
    }, [logged]);

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };

    const submitForm = (e) => {
        e.preventDefault();
        setLoading(true);
        let newMessage = {
            title: "info",
            message: "Please wait...",
        };
        setSeverity(newMessage);
        
        const data = new FormData();
        let objAssign = Object.assign({}, objData);
        data.append('company_id', objAssign[0].company_id);
        data.append('details', objAssign[0].details);
        data.append('location_id', objAssign[0].location_id);
        data.append('urgency', objAssign[0].urgency);
        data.append('user_id', objAssign[0].user_id); 
        
        if(files){
        files.forEach(file => {
            data.append('images[]', file, file.name);
        }); 
        }
      
        API
            .post("/v/request/new", data)
            .then((response) => {
                setOpen(true);
                setTimeout(() => {
                    newMessage = {
                        title: "success",
                        message: "Data has been successfully created!",
                    };
                    setLoading(false);
                    setSeverity(newMessage);
                }, 500);

                setTimeout(() => {
                    // Route to Edit by id
                    navigate(
                        "/d/requests/id/" + response.data.id
                    );
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
                    enctype="multipart/form-data"
                    onSubmit={submitForm}
                    autoComplete="off"
                >
                    <Grid container spacing={2} sx={{ py: 3 }}>
                        <Grid container spacing={2} sx={{ padding: 2 }}>
                            <Grid item xs={12} md={2}>
                                Urgency?
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    select
                                    size="small"
                                    label="urgency"
                                    value={urgency}
                                    onChange={(e) => handleData(e, "urgency")}
                                    SelectProps={{
                                        native: true,
                                    }}
                                >
                                    <option value=""> - </option>
                                    <option value="1"> 1 </option>
                                    <option value="2"> 2 </option>
                                    <option value="3"> 3 </option>
                                </TextField>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ padding: "0 16px" }}>
                            {/* new row */}
                            <Grid item xs={12} md={2}>
                                Business Entity
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    select
                                    size="small"
                                    label="Company"
                                    value={company.id}
                                    onChange={(e) => handleData(e, "company")}
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
                            <Grid item xs={12} md={2}>
                                Date
                            </Grid>
                            <Grid item xs={12} md={4}>
                                {date.toLocaleDateString()}
                            </Grid>
                            {/* new row */}
                            <Grid item xs={12} md={2}>
                                Requestor Name
                            </Grid>
                            <Grid item xs={12} md={4}>
                                {requestor ? requestor.name : ""}
                            </Grid>
                            <Grid item xs={12} md={2}>
                                Time
                            </Grid>
                            <Grid item xs={12} md={4}>
                                {time}
                            </Grid>
                            {/* new row */}
                            <Grid item xs={12} md={2}>
                                Designation
                            </Grid>
                            <Grid item xs={12} md={4}>
                                {requestor ? requestor.designation : ""}
                            </Grid>
                            <Grid item xs={12} md={2}>
                                Branch/Location
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    select
                                    size="small"
                                    label="Location"
                                    value={location.id}
                                    onChange={(e) => handleData(e, "location")}
                                    SelectProps={{
                                        native: true,
                                    }}
                                >
                                    <option> - </option>
                                    {location &&
                                        location.map((option) => (
                                            <option
                                                key={option.id}
                                                value={option.id}
                                            >
                                                {option.title}
                                            </option>
                                        ))}
                                </TextField>
                            </Grid>
                            {/* new row */}

                            <Grid item xs={12} md={12} className="container">
                                <div {...getRootProps()} className="dropzone">
                                    <input {...getInputProps()} />
                                    <p>Drag 'n' drop some files here, or click to select files</p>
                                    <em>(Only *.jpeg, *.jpg and *.png images will be accepted)</em>
                                </div>
                                <aside>
                                    <h4>Files</h4>
                                    <ul>{acceptedFileItems}</ul>
                                </aside>
                            </Grid>

                            <Grid item xs={12} md={12}>
                                <TextareaAutosize
                                    onChange={(e) => handleData(e, "details")}
                                    aria-label="minimum height"
                                    minRows={6}
                                    maxRows={10}
                                    placeholder="Your detailed request here. (required)"
                                    style={{
                                        width: "100%",
                                        border: "1px solid #cecece",
                                        padding: 10,
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={12}>
                                <LoadingButton
                                    disabled={fieldState}
                                    variant="contained"
                                    type="submit"
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
