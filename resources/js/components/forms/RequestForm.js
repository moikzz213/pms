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
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { useDropzone } from "react-dropzone";
import Modal from "@mui/material/Modal";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import API from "../../services/api.js";
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};
 
export default function RequestForm({ logged }) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const { vertical, horizontal } = {
        vertical: "bottom",
        horizontal: "center",
    };

    const [newLocation, setNewLocation] = useState("");
    const [openModal, setOpenModal] = useState(false);
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
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (hours < 12) {
        ampm = "AM";
    }

    let curTime = hours + ":" + minutes + " " + ampm;
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

    const onDrop = useCallback(
        (acceptedFiles) => {
            setFiles(acceptedFiles);
        },
        [setFiles]
    );

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        onDrop,
    });

    const acceptedFileItems = acceptedFiles.map((file) => (
        <li key={file.path}>
            {file.path} - {parseInt(file.size / 1000)} KB
        </li>
    ));
    //   End Drop Zone

    const handleData = (e, val, type) => {
        let value = "";
        if (val) {
            value = val.value;
        } else {
            value = e.target.value;
        }
        
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
                o.details = val;
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
    const handleAddLocation = () => {
        setOpenModal(true);
    };

    useEffect(() => {
        axios.get("/v/companies/fetch-non-paginate").then((response) => {
            let fetchItems = response.data.item;
            fetchItems = Object.assign([], fetchItems);
            let newData = [];
            fetchItems.map((o, i) => {
                newData[i] = {
                    label: o.title,
                    value: o.id,
                };
            });
            setCompany(newData);
        });

        axios.get(" /v/profile/fetch/" + logged.id).then((response) => {
            setRequestor(response.data.item);
        });

        axios.get("/v/locations/fetch-non-paginate").then((response) => {
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

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };

    const handleCloseModal = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setNewLocation("");
        setOpenModal(false);
    };

    const createLocation = (e) => {
        setNewLocation(e.target.value);
    };

    const handleNewLocation = (e) => {
        e.preventDefault();
        setOpen(true);
        if (!newLocation) {
            newMessage = {
                title: "error",
                message: "Field is empty!",
            };

            setSeverity(newMessage);
            return false;
        }
        let newMessage = {
            title: "info",
            message: "Please wait...",
        };

        setSeverity(newMessage);
        let data = { data: [{ title: newLocation }] };

        axios
            .post("/v/locations/new", data)
            .then((response) => {
                setTimeout(() => {
                    newMessage = {
                        title: "success",
                        message: "Data has been successfully added!",
                    };

                    setSeverity(newMessage);
                }, 500);

                setTimeout(() => {
                    setNewLocation("");
                    setOpenModal(false);
                }, 1000);

                setLocation([]);
                axios
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
            })
            .catch((error) => {
                newMessage = {
                    title: "error",
                    message: "Kindly refresh the page.",
                };
                setSeverity(newMessage);
            });
    };

    const submitForm = (e) => {
        e.preventDefault();
        setLoading(true);
        let newMessage = {
            title: "info",
            message: "Please wait...",
        };
        setSeverity(newMessage);
        let objAssign = Object.assign({}, objData); 
       
        let newDetails = objAssign[0].details.replaceAll('<td>', '<td style="border: 1px solid #cecece;font-size:12px;padding-left:10px;">');
        newDetails = newDetails.replaceAll('<table>', '<table style="border-spacing:0">');
        const data = new FormData();
       
        data.append("company_id", objAssign[0].company_id);
        data.append("details", newDetails);
        data.append("location_id", objAssign[0].location_id);
        data.append("urgency", objAssign[0].urgency);
        data.append("user_id", objAssign[0].user_id);

        if (files) {
            files.forEach((file) => {
                data.append("images[]", file, file.name);
            });
        }

        API.post("/v/request/new", data)
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
                    navigate("/d/requests/id/" + response.data.id);
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
                                    onChange={(e) =>
                                        handleData(e, null, "urgency")
                                    }
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
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={company}
                                    value={company.id}
                                    size="small"
                                    onChange={(e, value) =>
                                        handleData(e, value, "company")
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Company"
                                        />
                                    )}
                                />
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
                            <Grid item xs={12} md={4} sx={{ display: "flex" }}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={location}
                                    sx={{ width: "100%" }}
                                    size="small"
                                    onChange={(e, value) =>
                                        handleData(e, value, "location")
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            sx={{ width: "95% !important" }}
                                            label="Location"
                                        />
                                    )}
                                />
                                <IconButton
                                    onClick={(e) => handleAddLocation(e)}
                                    size="small"
                                    sx={{
                                        backgroundColor: "#000",
                                        color: "#fff",
                                        width: "25px",
                                        height: "20px",
                                        margin: "auto 0",
                                    }}
                                >
                                    <AddIcon />
                                </IconButton>
                            </Grid>
                            {/* new row */}

                            <Grid item xs={12} md={12} className="container">
                                <div {...getRootProps()} className="dropzone">
                                    <input {...getInputProps()} />
                                    <p>
                                        Drag 'n' drop some files here, or click
                                        to select files
                                    </p>
                                    <em>
                                        (Only *.jpeg, *.jpg and *.png images
                                        will be accepted)
                                    </em>
                                </div>
                                <aside>
                                    <h4>Files</h4>
                                    <ul>{acceptedFileItems}</ul>
                                </aside>
                            </Grid>

                            <Grid item xs={12} md={12}>
                               
                               

                                <CKEditor
                                    editor={ClassicEditor}
                                   
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
                                         
                                        handleData(event, data, "details");
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
            <Modal
                hideBackdrop
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={{ ...style, width: 250 }}>
                    <h4 className="text-center" id="child-modal-title" >ADD NEW LOCATION</h4>
                    <TextField
                        label=""
                        onChange={(e) => createLocation(e)}
                        size="small"
                        variant="outlined"
                    />
                    <Box sx={{display:"flex", justifyContent: "space-between"}}>
                    <Button color="secondary" onClick={handleCloseModal}>
                        Cancel
                    </Button>
                    <Button onClick={handleNewLocation}>Submit</Button>
                    </Box>
                </Box>
            </Modal>
        </Paper>
    );
}
