import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import LoadingButton from "@mui/lab/LoadingButton";
import API from "../../services/api.js";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function ProcessRequest({id, logged}) {
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState("");
    const [active, setActive] = useState(false);
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
                    if(logged.role !== 'admin' && responseData.status == 'closed'){
                        setActive(false);
                    }else if(responseData.status !== 'cancelled'){ 
                        setActive(true);
                    }

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
                        subject: responseData.subject,
                        date: date,
                        time: curTime,
                        requestor: responseData.profile.name,
                        designation: responseData.profile.designation,
                    }
                    setData(details);
                   
                    setImage(responseData.images);
                     
                }
            })
    }, [logged]);

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
        let data = {id : id, type: type, user_id: logged.id};
        API.post('/v/request/update-status', data)
        .then((response) => { 
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
                    <Grid className="process-request" container spacing={2} sx={{mt:1}}>
                        <Grid container spacing={2} sx={{ padding: 2 }}>
                            <Grid item xs={2} md={2}>
                                PRF No.
                            </Grid>
                            <Grid item xs={4} md={4}>
                               {data.prf_no}
                            </Grid>
                           
                            
                            <Grid item xs={2} md={2}>
                                Urgency
                            </Grid>
                            <Grid item xs={4} md={2}>
                                {data.urgency}
                            </Grid>

                            <Grid
                            item
                            md={2}
                            xs={12}
                            className="btn-cancel no-print" 
                            sx={{ textAlign: "right" }}
                        > 
                         <small> Status: <span className="text-red font-weight-bold">{status}</span></small>
                           
                        </Grid> 

                            {/* new row */}
                            <Grid item xs={2} md={2}>
                                Business Entity
                            </Grid>
                            <Grid item xs={4} md={4}>
                            {data.company}
                            </Grid>
                            <Grid item xs={2} md={2}>
                                Date
                            </Grid>
                            <Grid item xs={4} md={4}>
                            {data.date}
                            </Grid>
                            {/* new row */}
                            <Grid item xs={2} md={2}>
                                Requestor Name
                            </Grid>
                            <Grid item xs={4} md={4}>
                            {data.requestor}
                            </Grid>
                            <Grid item xs={2} md={2}>
                                Time
                            </Grid>
                            <Grid item xs={4} md={4}>
                            {data.time}
                            </Grid>
                            {/* new row */}
                            <Grid item xs={2} md={2}>
                                Designation
                            </Grid>
                            <Grid item xs={4} md={4}>
                            {data.designation}
                            </Grid>
                            <Grid item xs={2} md={2}>
                                Branch/Location
                            </Grid>
                            <Grid item xs={4} md={4}>
                            {data.location}
                            </Grid>
                            {/* new row */}

                            <Grid item xs={12} md={12}>
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
                                <h3>{data.subject}</h3>
                                 <Box className="inner-request" sx={{border: "1px solid #ccc", padding: "10px;", minHeight: "150px"}}  dangerouslySetInnerHTML={{__html: data.details}} >
                                    
                                 </Box>
                            </Grid>
                         
                             { active ? 
                             <>
                                {status == 'onprocess' ?
                                <>
                            <Grid   className="no-print" item xs={12} md={6}>
                                <Link to="/d/procurement-team/local-purchase-orders/create">
                                    <Button
                                        variant="contained"
                                        size="small"
                                        sx={{ mr: 3 }}
                                    >
                                        Create LPO
                                    </Button>
                                </Link>

                                <Link to="/d/procurement-team/payment-approval-forms/create">
                                    <Button
                                        color="secondary"
                                        variant="contained"
                                        size="small"
                                    >
                                        Create PAF
                                    </Button>
                                </Link>
                            </Grid>
                            </> :  <>
                            <Grid   className="no-print" item xs={12} md={6}>Only <b>ON PROCESS</b> status can create LPO/PAF </Grid> </> }
                            <Grid   className="no-print" item xs={12} md={6}>
                                
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
                                <LoadingButton
                                    className="btn-info"
                                    color="primary"
                                    size="small"
                                    variant="contained"
                                    onClick={(e) => changeStatus(e, "onhold")}
                                    loading={loading}
                                    sx={{ mx:2 }}
                                >
                                    onHold
                                </LoadingButton>
                                <LoadingButton
                                    className="btn-info"
                                    color="secondary"
                                    size="small"
                                    variant="contained"
                                    onClick={(e) => changeStatus(e, "onprocess")}
                                    loading={loading}
                                    sx={{ mr:2 }}
                                >
                                    On Process
                                </LoadingButton>
                                <LoadingButton
                                    className="btn-info"
                                    color="green"
                                    size="small"
                                    variant="contained"
                                    onClick={(e) => changeStatus(e, "closed")}
                                    loading={loading}
                                >
                                    Closed
                                </LoadingButton>
                                <br/><br/>
                                <small style={{color: "red"}}>Procurement Team needs to manually closed the request.</small> <br/>
                                <small>Once the request has been <b>cancelled/closed</b> it will no longer be updated.</small> <br/>
                                
                                <small><b>ONHOLD/PENDING STATUS</b> enable requestor to edit their request</small>
                            </Grid>
                             </>
                             : 
                             <>
                             <Grid item xs={12} md={6}>
                                <small>Once the request has been <b>cancelled/closed</b> it will no longer be updated.</small> <br/>
                                 
                                <small><b>ONHOLD/PENDING STATUS</b> enable requestor to edit their request</small>
                             </Grid>  
                             <Grid item xs={12} md={6}>
                             {status == 'cancelled' && logged.role == 'admin' &&
                          
                                 <LoadingButton
                                   className="btn-info"
                                   color="primary"
                                   size="small"
                                   variant="contained"
                                   onClick={(e) => changeStatus(e, "onhold")}
                                   loading={loading}
                                   sx={{ mx:2 }}
                                >
                                    onHold
                                </LoadingButton>
                           
                            }
                             </Grid>  
                               </> 
                             }
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Paper>
    );
}
