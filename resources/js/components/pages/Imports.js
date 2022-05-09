import React, { useState } from "react";
import Box from "@mui/material/Box";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import API from "../../services/api.js";
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const Imports = () => {
    const [open, setOpen] = useState(false);
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

    const [file, setFile] = useState();
    const [array, setArray] = useState([]);
    const fileReader = new FileReader();

    const handleOnChange = (e) => {
        setFile(e.target.files[0]);
    };

    const csvFileToArray = (string, type)=> {
        const csvHeader = string.slice(0, string.indexOf("\r\n")).split(",");
        const csvRows = string.slice(string.indexOf("\n") + 1).split("\r\n");
    
        const array = csvRows.map(i => {
          const values = i.split(",");
          const obj = csvHeader.reduce((object, header, index) => {
            object[header] = values[index];
            return object;
          }, {});
          return obj;
        });
        array.splice(-1)

        setArray(array);
        let controller = "";

        if(type == 'location'){
            controller = "/v/locations/import";
        }else if(type == 'company'){
            controller = "/v/companies/import";
        }else if(type == 'supplier'){
            controller = "/v/suppliers/import";
        }else if(type == 'users'){
            controller = "/v/users/import";
        }else if(type == 'department'){
            controller = "/v/departments/import";
        }
        console.log(array);
        let nData = {data: array};
        API
        .post(controller, nData)
        .then((response) => {
            console.log(response);
            setTimeout(() => {
                let newMessage = {
                    title: "success",
                    message:  "Data has been imported!",
                };
                setLoading(false);
                setSeverity(newMessage);
            }, 1500);

        })
        .catch((error) => {
            console.log(error);
        });
      };

    const handleOnSubmit = (e, type) => {
        e.preventDefault();
        setOpen(true);
        setLoading(true);
        let newMessage = {
            title: "info",
            message: "Please wait...",
        };
        setSeverity(newMessage);  
        if (file) {
            fileReader.onload = function (event) {
                const text = event.target.result;
                csvFileToArray(text, type);
            };
            fileReader.readAsText(file);
        }
    };
    return (
        <>
            <Box sx={{ display: "flex", flexWrap: 'wrap' }}>
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
                    sx={{
                        width: "auto",
                        minWidth: 400,
                        backgroundColor: "#fff",
                        padding: "20px",
                        textAlign: "center",
                        mx: 2,
                        my: 2,
                    }}
                >
                    <h3 style={{ marginTop: 0 }}>Import Business Unit</h3>
                    <form>
                        <input
                            type={"file"}
                            id={"csvFileInput"}
                            accept={".csv"}
                            onChange={handleOnChange}
                        />

                        <button
                            onClick={(e) => {
                                handleOnSubmit(e, 'company');
                            }}
                        >
                            IMPORT CSV
                        </button>
                    </form>
                </Box>
                <Box
                    sx={{
                        width: "auto",
                        minWidth: 400,
                        backgroundColor: "#fff",
                        padding: "20px",
                        textAlign: "center",
                        mx: 2,
                        my: 2,
                    }}
                >
                    <h3 style={{ marginTop: 0 }}>Import Suppliers</h3>
                    <form>
                        <input
                            type={"file"}
                            id={"csvFileInput"}
                            accept={".csv"}
                            onChange={handleOnChange}
                        />

                        <button
                            onClick={(e) => {
                                handleOnSubmit(e, 'supplier');
                            }}
                        >
                            IMPORT CSV
                        </button>
                    </form>
                </Box> 
                <Box
                    sx={{
                        width: "auto",
                        minWidth: 400,
                        backgroundColor: "#fff",
                        padding: "20px",
                        textAlign: "center",
                        mx: 2,
                        my: 2,
                    }}
                >
                    <h3 style={{ marginTop: 0 }}>Import Departments</h3>
                    <form>
                        <input
                            type={"file"}
                            id={"csvFileInput"}
                            accept={".csv"}
                            onChange={handleOnChange}
                        />

                        <button
                            onClick={(e) => {
                                handleOnSubmit(e, 'department');
                            }}
                        >
                            IMPORT CSV
                        </button>
                    </form>
                </Box>
                <Box
                    sx={{
                        width: "auto",
                        minWidth: 400,
                        backgroundColor: "#fff",
                        padding: "20px",
                        textAlign: "center",
                        mx: 2,
                        my: 2,
                    }}
                >
                    <h3 style={{ marginTop: 0 }}>Import Locations</h3>
                    <form>
                        <input
                            type={"file"}
                            id={"csvFileInput"}
                            accept={".csv"}
                            onChange={handleOnChange}
                        />

                        <button
                            onClick={(e) => {
                                handleOnSubmit(e, 'location');
                            }}
                        >
                            IMPORT CSV
                        </button>
                    </form>
                </Box>

                <Box
                    sx={{
                        width: "auto",
                        minWidth: 400,
                        backgroundColor: "#fff",
                        padding: "20px",
                        textAlign: "center",
                        mx: 2,
                        my: 2,
                    }}
                >
                    <h3 style={{ marginTop: 0 }}>Import Users</h3>
                    <form>
                        <input
                            type={"file"}
                            id={"csvFileInput"}
                            accept={".csv"}
                            onChange={handleOnChange}
                        />

                        <button
                            onClick={(e) => {
                                handleOnSubmit(e, 'users');
                            }}
                        >
                            IMPORT CSV
                        </button>
                    </form>
                </Box>
            </Box>
        </>
    );
};

export default Imports;
