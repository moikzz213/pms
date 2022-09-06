import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LoadingButton from "@mui/lab/LoadingButton";
import API from "../../services/api.js";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import EditIcon from "@mui/icons-material/Edit";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function RequestForm({ id, logged }) {

    function fetchRequest(){
        API.get("/v/request/fetch/" + id).then((response) => {
            if (response.data) {
                let responseData = response.data.item;

                setStatus(responseData.status);
                let date = new Date(
                    responseData.created_at
                ).toLocaleDateString();
                let defaultDate = new Date(responseData.created_at);
                let minutes = defaultDate.getMinutes();
                let hours = defaultDate.getHours();
                let ampm = "PM";
                if (minutes < 10) {
                    minutes = "0" + minutes;
                }
                if (hours < 12) {
                    ampm = "AM";
                }
                let curTime = hours + ":" + minutes + " " + ampm;

                let details = {
                    urgency: responseData.urgency,
                    company: responseData.company,

                    details: responseData.details,
                    recipients: responseData.recipients,
                    location: responseData.location.title,
                    subject: responseData.subject,
                    prf_no: responseData.prf_no,
                    date: date,
                    time: curTime,
                    requestor: responseData.profile.name,
                    designation: responseData.profile.designation, 
                };
                setData(details);
                setSpecs([{
                    details: responseData.details
                }]);
                setNewCompany(responseData.company.id);
                setNewLocation(responseData.location.id);
                setEditSubject(responseData.subject);
                setImage(responseData.images);
            }
        });
    }

    const { vertical, horizontal } = {
        vertical: "bottom",
        horizontal: "center",
    };
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [status, setStatus] = useState("");
    const [specs, setSpecs] = useState([]);
    const [editSubject, setEditSubject] = useState("");
    const [newCompany, setNewCompany] = useState("");
    const [newLocation, setNewLocation] = useState("");
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
    const [location, setLocation] = useState([]);

    const [data, setData] = useState({
        company: "",
        details: "",
        location: "",
        prf_no: "",
        date: "",
        time: "",
        requestor: "", 
        designation: "",
    });

    const [company, setCompany] = useState([]);

    const [image, setImage] = useState([]);
    useEffect(() => {
        fetchRequest();

        API.get("/v/companies/fetch-non-paginate").then((response) => {
            let fetchItems = response.data.item;
            fetchItems = Object.assign([], fetchItems);
            let newData = [];
            fetchItems.map((o, i) => {
                newData[i] = {
                    label: o.title,
                    title: o.title,
                    id: o.id,
                    value: o.id,
                };
            });
            setCompany(newData);
        });

        API
        .get("/v/locations/fetch-non-paginate")
        .then((response) => {
            let fetchItems = response.data.item;
            fetchItems = Object.assign([], fetchItems);
            let newData = [];
            fetchItems.map((o, i) => {
                newData[i] = {
                    label: o.title,
                    value: o.id,
                };
            });
            setLocation(newData);
        });
    }, [logged]); 
    
    const handleData = (e, value) => {
        setSpecs([{
            details: value
        }]);
    }
    const editRequest = (e) => {
        setIsEdit(true);
        fetchRequest();
    };

    const cancelEdit = (e) => {
        setIsEdit(false);
        setSpecs([])
        setEditSubject("");
    };

    const handleCompany = (e,val, type) => { 
        if(type == "company"){

            setNewCompany(val.value);
        }else{
            setNewLocation(val.value);
        }
    }

    const handleSubject = (e)=> {
        console.log(e.target.value);
        setEditSubject(e.target.value);
    }
    const saveEdit = (e) => {
         
        let newDetails = specs[0].details.replaceAll('<td>', '<td style="border: 1px solid #cecece;font-size:12px;padding-left:10px;">');
        newDetails = newDetails.replaceAll('<table>', '<table style="border-spacing:0">');

        setLoading(true);
        let newMessage = {
            title: "info",
            message: "Please wait...",
        };

        setSeverity(newMessage);
        let data = { details: newDetails, subject: editSubject, company: newCompany, location: newLocation,  id: id, user_id: logged.id};
         
       
        API
            .post('/v/request/edit-data', data)
            .then((response) => {
                setOpen(true);
                setTimeout(() => {
                    newMessage = {
                        title: "success",
                        message: "Data has been successfully updated!",
                    };
                    setLoading(false);
                    setSeverity(newMessage);

                    setIsEdit(false);

                    fetchRequest();
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
        let data = { id: id, type: type, user_id : logged.id };
        API.post("/v/request/update-status", data).then((response) => {
            console.log(response);
            setTimeout(() => {
                newMessage = {
                    title: "success",
                    message: response.data.message,
                };
                setLoading(false);
                setSeverity(newMessage);
            }, 1500);
        });
    };

    return (
        <Paper sx={{ px: 3, py: 3 }}>
            <Box sx={{ flexGrow: 1 }}>
                <Snackbar
                    open={open}
                    autoHideDuration={4000}
                    anchorOrigin={{ vertical, horizontal }}
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
                        <Grid container spacing={2} sx={{ padding: 2, pt:"25px !important" }}>
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
                                className="btn-cancel"
                                sx={{ textAlign: "right" }}
                            >
                                {!isEdit && (status == 'onhold' || status == 'pending' ) && (
                                    <LoadingButton
                                        variant="contained"
                                        onClick={(e) => editRequest(e)}
                                        sx={{ mr: "5px", mb: "5px" }}
                                        size="small"
                                    >
                                        <EditIcon />
                                    </LoadingButton>
                                )}
                                {isEdit && (
                                    <>
                                        <LoadingButton
                                            variant="contained"
                                            onClick={(e) => cancelEdit(e)}
                                            sx={{ mr: "5px", mb: "5px" }}
                                            size="small"
                                        >
                                            Cancel
                                        </LoadingButton>
                                        <LoadingButton
                                            variant="contained"
                                            color="green"
                                            onClick={(e) => saveEdit(e)}
                                            sx={{ mr: "5px", mb: "5px" }}
                                            size="small"
                                        >
                                            Save
                                        </LoadingButton>
                                    </>
                                )}
                                {!isEdit && (
                                    <>
                                        {status == "pending" ? (
                                            <LoadingButton
                                                sx={{ mr: "5px", mb: "5px" }}
                                                className="btn-cancel"
                                                color="red"
                                                size="small"
                                                variant="contained"
                                                onClick={(e) =>
                                                    changeStatus(e, "cancelled")
                                                }
                                                loading={loading}
                                            >
                                                CANCEL REQUEST
                                            </LoadingButton>
                                        ) : status == "cancelled" && logged.role == 'admin' ? (
                                            <>
                                                <LoadingButton
                                                    className="btn-info"
                                                    color="info"
                                                    sx={{
                                                        mr: "5px",
                                                        mb: "5px",
                                                    }}
                                                    size="small"
                                                    variant="contained"
                                                    onClick={(e) =>
                                                        changeStatus(
                                                            e,
                                                            "pending"
                                                        )
                                                    }
                                                    loading={loading}
                                                >
                                                    Re-open
                                                </LoadingButton>
                                                <br />
                                                <small>
                                                  
                                                    Status:
                                                    <span className="text-red">
                                                        Cancelled
                                                    </span>
                                                </small>
                                            </>
                                        ) : (
                                            <small>
                                                <br/>
                                                Status: 
                                                <span className="text-red font-weight-bold">
                                                    {status}
                                                </span>
                                            </small>
                                        )}
                                    </>
                                )}
                            </Grid>

                            {/* new row */}
                            <Grid item xs={2} md={2}>
                                Business Entity
                            </Grid>
                            <Grid item xs={4} md={4}>
                                {!isEdit &&
                                <>
                                {data.company.title}
                                    </>}
                                {isEdit &&
                                 <Autocomplete
                                 disablePortal 
                                 options={company} 
                                 size="small" 
                                 onChange={(e, value) =>
                                    handleCompany(e, value, "company")
                                }
                                 renderInput={(params) => (
                                     <TextField
                                         {...params}
                                         label="Company*"
                                     />
                                 )}
                             />
                             }
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
                                {!isEdit &&
                                <> 
                                {data.location}
                                </>}

                                {isEdit && 
                                <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={location}
                                sx={{ width: "100%" }}
                                size="small"
                                onChange={(e, value) =>
                                    handleCompany(e, value, "location")
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        sx={{ width: "95% !important" }}
                                        label="Location*"
                                    />
                                )}
                            />}
                            </Grid>
                            {/* new row */}

                            <Grid item xs={12} md={8}>
                                <strong>Attachment(s): </strong>
                                {image.map((row, index) => {
                                    return (
                                        <li key={row.id}>
                                            <Link
                                                to={"/file/" + row.path}
                                                target="_blank"
                                                className="underlined"
                                                download
                                            >
                                                
                                                {row.original_name}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </Grid>
                       
                            <Grid item xs={12} md={4}></Grid>

                            <Grid className="request-desc" item xs={12} md={12}> 
                            
                                {!isEdit && 
                                <>
                                  <h3>{data.subject}</h3>
                                <Box
                                    sx={{
                                        border: "1px solid #ccc",
                                        padding: "10px;",
                                        minHeight: "150px",
                                    }}
                                    dangerouslySetInnerHTML={{
                                        __html: data.details,
                                    }}
                                ></Box>
                                {data.recipients && 
                                <Box sx={{mt:2}}>Mailed To: {data.recipients}</Box>
                                }
                                </>
                                }
                                {isEdit &&
                                <>
                                <TextField
                                fullWidth 
                                value={editSubject || ""}
                                sx={{marginLeft: "0 !important", width: "100% !important"}}
                                size="small"
                                label="Subject*" 
                                onChange={(e) =>
                                    handleSubject(e)
                                } 
                            > </TextField>
                                     <CKEditor
                                     editor={ClassicEditor}
                                     data={data.details}
                                     placeholder="Your detailed request here. (required)"
                                     onReady={(editor) => {
                                         // You can store the "editor" and use when it is needed.
                                         console.log(
                                             "Editor is ready to use!",
                                             editor
                                         );
                                     }}
                                     config={ {
                                         removePlugins: [ 'Image', 'Link', 'CKFinder' ], 
                                     } }
                                    
                                     onChange={(event, editor) => {
                                         const data = editor.getData();
                                          
                                         handleData(event, data);
                                     }}
                                     
                                 />
                                 </>
                                }
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <Box>Normal Requests will take atleast 14 working days.</Box>
                                {status !== 'onhold' && status !== 'pending' && status !== 'cancelled' &&
                                <small>Note: Contact the Procurement Team who is processing this request to change the status to <b>ON HOLD</b> for you to edit the description.</small>
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Paper>
    );
}
