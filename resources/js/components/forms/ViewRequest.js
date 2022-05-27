import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LoadingButton from "@mui/lab/LoadingButton";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import API from "../../services/api.js";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function RequestForm({ id }) {

    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState("");
    const [severity, setSeverity] = useState({
        title: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };

    const [data, setData] = useState({
        company: "",
        details: "",
        location: "",
        prf_no: "",
        date: "",
        time: "",
        requestor: "",
        designation: ""
    }); 
     
    const [image, setImage] = useState([]);
    useEffect(() => {
        API
            .get("/v/request/fetch/"+ id)
            .then((response) => {
                if(response.data){
                    let responseData = response.data.item;
                  
                    setStatus(responseData.status);
                    let date = new Date(responseData.created_at).toLocaleDateString();
                    let defaultDate =  new Date(responseData.created_at);
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
                   
                    let details = {
                        urgency: responseData.urgency,
                        company: responseData.company.title,
                        details: responseData.details,
                        location: responseData.location.title,
                        prf_no: responseData.prf_no,
                        date: date,
                        time: curTime,
                        requestor: responseData.profile.name,
                        designation: responseData.profile.designation,
                    }
                    setData(details);
                   
                    setImage(responseData.images);
                     
                }
            })
    }, []);

    const changeStatus = (e, type) => {
        e.preventDefault();
        setOpen(true);
        setLoading(true);
        let newMessage = {
            title: "info",
            message: "Please wait...",
        };
        setSeverity(newMessage); 
        setStatus(type);
        let data = {id : id, type: type};
        API.post('/v/request/update-status', data)
        .then((response) => {
            console.log(response);
            setTimeout(() => {
                newMessage = {
                    title: "success",
                    message:  response.data.message,
                };
                setLoading(false);
                setSeverity(newMessage);
            }, 1500);
        });
    }
 
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
                        "& .MuiTextField-root": { m: 1, width: "25ch" },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <Grid container spacing={2}>
                        <Grid container spacing={2} sx={{ padding: 2 }}>
                            <Grid item xs={12} md={2}>
                                PRF No.
                            </Grid>
                            <Grid item xs={12} md={4}>
                               {data.prf_no}
                            </Grid>
                           
                            
                            <Grid item xs={12} md={2}>
                                Urgency
                            </Grid>
                            <Grid item xs={12} md={2}>
                                {data.urgency}
                            </Grid>

                            <Grid
                            item
                            md={2}
                            className="btn-cancel"
                            sx={{ textAlign: "right" }}
                        >
                             {status == "pending" ?
                             
                                <LoadingButton
                                    className="btn-cancel"
                                    color="red"
                                    size="small"
                                    variant="contained"
                                    onClick={(e) => changeStatus(e, "cancelled")}
                                    loading={loading}
                                >
                                    CANCEL
                                </LoadingButton>
                                : status == "cancelled" ?
                                <>
                                <LoadingButton
                                    className="btn-info"
                                    color="info"
                                    size="small"
                                    variant="contained"
                                    onClick={(e) => changeStatus(e, "pending")}
                                    loading={loading}
                                >
                                    Re-open
                                </LoadingButton> <br/>
                                <small> Status: <span className="text-red">Cancelled</span></small>
                                </>
                                :  <small> Status: <span className="text-red font-weight-bold">{status}</span></small>
                            }
                        </Grid> 

                            {/* new row */}
                            <Grid item xs={12} md={2}>
                                Business Entity
                            </Grid>
                            <Grid item xs={12} md={4}>
                            {data.company}
                            </Grid>
                            <Grid item xs={12} md={2}>
                                Date
                            </Grid>
                            <Grid item xs={12} md={4}>
                            {data.date}
                            </Grid>
                            {/* new row */}
                            <Grid item xs={12} md={2}>
                                Requestor Name
                            </Grid>
                            <Grid item xs={12} md={4}>
                            {data.requestor}
                            </Grid>
                            <Grid item xs={12} md={2}>
                                Time
                            </Grid>
                            <Grid item xs={12} md={4}>
                            {data.time}
                            </Grid>
                            {/* new row */}
                            <Grid item xs={12} md={2}>
                                Designation
                            </Grid>
                            <Grid item xs={12} md={4}>
                            {data.designation}
                            </Grid>
                            <Grid item xs={12} md={2}>
                                Branch/Location
                            </Grid>
                            <Grid item xs={12} md={4}>
                            {data.location}
                            </Grid>
                            {/* new row */}

                            <Grid item xs={12} md={2}>
                            <strong>Attachment(s): </strong>
                            {image.map((row, index) => {
                                     return(
                                         <li key={row.id} >
                                              <Link to={'/file/'+row.path} target="_blank" className="underlined" download>  {row.original_name}   </Link>
                                         </li>
                                         
                                     )
                                 })
                                }
                            </Grid>
                            <Grid item xs={12} md={4}></Grid>

                            <Grid className="request-desc" item xs={12} md={12}>
                                 <Box sx={{border: "1px solid #ccc", padding: "10px;", minHeight: "150px"}}  dangerouslySetInnerHTML={{__html: data.details}} >
                                    
                                 </Box>
                            </Grid>

                          
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Paper>
    );
}