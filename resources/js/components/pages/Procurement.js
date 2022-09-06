import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Autocomplete from "@mui/material/Autocomplete";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Pagination from "@mui/material/Pagination";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import API from "../../services/api.js";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const columns = [
    { id: "status", label: "STATUS", minWidth: 20 },
    { id: "prf_no", label: "PRF NO.", minWidth: 30 },
    { id: "company", label: "Business Unit", minWidth: 50 },
    { id: "requested_by", label: "REQUESTED BY", minWidth: 50 },
    { id: "process_by", label: "PROCESSED BY", minWidth: 50 },
    { id: "urgency", label: "URGENCY", minWidth: 50 },
    { id: "created_at", label: "Date Requested", minWidth: 20 },
];

const Procurement = ({ logged }) => {
    const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState({
        title: "",
        message: "",
    });

    const { vertical, horizontal } = {
        vertical: "bottom",
        horizontal: "center",
    };

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };

    const navigate = useNavigate();
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    // Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
    let qpage = params.page; // "some_value"
    if (!qpage) {
        qpage = 1;
    }
    var queryParams = new URLSearchParams(window.location.search);
    const [page, setPage] = useState(parseInt(qpage));

    const [lastPage, setlastPage] = useState(0);
    const [totalPage, settotalPage] = useState(0);
    const [toPage, settoPage] = useState(0);
    const [isadmin, setIsadmin] = useState(false);
    const [fromPage, setfromPage] = useState(0);
    const [isSearch, setIsSearch ]= useState(false);
    const arrowPage = (n) => {
        let p = page + n;
        if (p > 0 && p <= lastPage) {
            setPage(p);
        }

        // Set new or modify existing parameter value.
        queryParams.set("page", p);

        // Replace current querystring with the new one.
        history.replaceState(null, null, "?" + queryParams.toString());
    };
    const [company, setCompany] = useState([
        {
            id: null,
            title: "",
        },
    ]);
    const [processBy, setProcessBy] = useState([]);
    const [requestedBy, setRequestedBy] = useState([]);
    const [filterSearch, setFilterSearch] = useState([
        {
            company_id: "",
            status: "",
            process_by: "",
            user_id: "",
        },
    ]);

    const [requestData, setRequestsData] = useState([
        {
            id: null,
            status: "",
            prf_no: "",
            company: "",
            requested_by: "",
            process_by: "",
            urgency: "",
            created_at: "",
        },
    ]);

    function fetchRequests(ss = "") {
        let pg = page;
        if(queryParams.get('page')){
            pg = queryParams.get('page');
        }
         
        API.get("/v/request/procurement/fetch-all/?page=" + pg + ss)
            .then((response) => {
                let fetchItems = response.data.item;

                dataWithRelations(fetchItems.data);

                setPage(fetchItems.current_page);
                setlastPage(fetchItems.last_page);
                settotalPage(fetchItems.total);
                settoPage(fetchItems.to);
                setfromPage(fetchItems.from);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function dataWithRelations(data) {
        let newData = [];

        data.map((o, i) => {
            newData[i] = {
                id: o.id,
                status: o.status,
                prf_no: o.prf_no,
                requested_by: o.profile ? o.profile.name : "",
                company: o.company ? o.company.title : "",
                //process_by: o.process_by ? o.process_by.name : "",
                process_by: o.process_by,
                urgency: o.urgency,
                created_at: new Date(o.created_at).toLocaleDateString(),
            };
        });

        setRequestsData(newData);
    }

    function axiosFunction(controller) {
        API.get(controller)
            .then((response) => {
                let fetchItems = response.data.item;
                dataWithRelations(fetchItems.data);

                setPage(fetchItems.current_page);
                setlastPage(fetchItems.last_page);
                settotalPage(fetchItems.total);
                settoPage(fetchItems.to);
                setfromPage(fetchItems.from);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const handleAssign = (e, row) => {
        setOpen(true);
        let newMessage = {
            title: "info",
            message: "Please wait...",
        };

        setSeverity(newMessage);

        let selected = e.target.value;  

        let data = { id: row.id, process_by: selected, user_id: logged.id };
        API.post("/v/request/procurement/assigned", data)
            .then((response) => {
                setOpen(true);
                setTimeout(() => {
                    newMessage = {
                        title: "success",
                        message: response.data.message,
                    };

                    setSeverity(newMessage);
                    
                    fetchRequests();
                }, 500);
            })
            .catch((error) => {
                newMessage = {
                    title: "error",
                    message: "Kindly refresh the page.",
                };
                setSeverity(newMessage);
            });
    };

    const handleData = (e, val, type) => {
        let value = "";
        if (val) {
            value = val.id;
        } else {
            value = e.target.value;
        }

        let objAssign = Object.assign([], filterSearch);

        if (type == "company") {
            objAssign[0].company_id = value;
             
            if(value == undefined || value == null || value == "-"){ 
                queryParams.delete('company_id');
                history.replaceState(null, null, "?" + queryParams.toString());
            }
        } else if (type == "status") {
            objAssign[0].status = value;

            if(value == undefined || value == null || value == "-"){ 
                queryParams.delete('status');
                history.replaceState(null, null, "?" + queryParams.toString());
            }
        } else if (type == "processby") {
            objAssign[0].process_by = value;

            if(value == undefined || value == null || value == "-"){ 
                queryParams.delete('process_by');
                history.replaceState(null, null, "?" + queryParams.toString());
            }
        } else if (type == "requestedby") {
            objAssign[0].user_id = value;

            if(value == undefined || value == null || value == "-"){ 
                queryParams.delete('user_id');
                history.replaceState(null, null, "?" + queryParams.toString());
            }
        }

        setFilterSearch(objAssign);
    };

    const searchSubmit = (e) => {
        e.preventDefault();
        setRequestsData([]);
        // Set new or modify existing parameter value.
  
        let search = filterSearch[0];
        
        Object.keys(search).forEach((key) => {
            if (search[key] === undefined || search[key] === "" || search[key] === "-") {
                delete search[key];
            }
        });

        let ssssss = Object.assign([], search);
        queryParams.set("page", 1);
        let stringObj = "";
       
        Object.keys(ssssss).forEach((key) => {
            stringObj += "&" + key + "=" + ssssss[key];
            queryParams.set(key, ssssss[key]);
        }); 

        history.replaceState(null, null, "?" + queryParams.toString());
        

        fetchRequests(stringObj);
    };

    const viewDetails = (e, v) => {
        if (v) {
            navigate("request/id/" + e.id);
        }
    };

    useEffect(() => {
        let cID = params.company_id;
        let cStatus = params.status;
        let cProcess = params.process_by;
        let cUser = params.user_id;
        let czID = "";
        let czStatus = "";
        let czProcess = "";
        let czUser = "";
        if (cID) {
            czID = "&company_id=" + cID;
        }
        if (cStatus) {
            czStatus = "&status=" + cStatus;
        }
        if (cProcess) {
            czProcess = "&process_by=" + cProcess;
        }
        if (cUser) {
            czUser = "&user_id=" + cUser;
        }
        let defaultQueryString = czID + czStatus + czProcess + czUser;
        if(!isSearch){
        fetchRequests(defaultQueryString);
        }
        return () => {
            setRequestsData([]);
        }; 
     
    }, [page]);

    useEffect(() => {
        API.get("/v/profile/procurements/list").then((response) => {
            if (response.data) {
                let fetchItems = response.data.item;
                fetchItems = Object.assign([], fetchItems);
                let unSigned = [
                    {
                        id: "unassign",
                        name: "Unassign",
                        user_id: "unassign",
                    },
                ];
                let mergeData = [...fetchItems, ...unSigned];

                setProcessBy(mergeData);

                let vcheckAdmin = false;
                if(logged.id == 1 || logged.id == 344){
                    vcheckAdmin = true;
                }
                setIsadmin(vcheckAdmin); 
            }
        });

        API.get("/v/profile/procurements/profile_users").then((response) => {
            if (response.data) {
                let fetchItems = response.data.item;
                fetchItems = Object.assign([], fetchItems);

                setRequestedBy(fetchItems);
            }
        });

        API.get("/v/companies/fetch-non-paginate").then((response) => {
            let fetchItems = response.data.item;
            fetchItems = Object.assign([], fetchItems);

            setCompany(fetchItems);
        });
    }, []);

    const handleChangePage = (selectedPage, n) => {
        let p = parseInt(selectedPage);
        p = p + n;
        setPage(p);

        // Set new or modify existing parameter value.
        queryParams.set("page", p);

        // Replace current querystring with the new one.
        history.replaceState(null, null, "?" + queryParams.toString());
    };

    const handleSearch = (e) => {
        
        if (e.target.value.length > 3) { 
            setIsSearch(true);
            setPage(1);
            queryParams.set("page", 1);  
            history.replaceState(null, null, "?" + queryParams.toString()); 
            axiosFunction("/v/request/proc-search/" + e.target.value);
            
        } else if (e.target.value.length == 0) {
            setIsSearch(false);
            axiosFunction("/v/request/proc-search/-");
        }
    };

    return (
        <>
            <Stack
                sx={{ marginBottom: 2 }}
                direction={{ xs: "column", sm: "row" }}
            >
                <Box sx={{ display: "flex", width: "100%" }}>
                    <Snackbar
                        open={open}
                        autoHideDuration={5000}
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
                    <Box sx={{ display: "flex", width: "80%" }}>
                        <Box sx={{ my: "auto" }}> Filter by:</Box>

                        <Autocomplete
                            disablePortal
                            fullWidth
                            sx={{ m: 1 }}
                            options={company}
                            getOptionLabel={(company) => company.title}
                            size="small"
                            onChange={(e, value) =>
                                handleData(e, value, "company")
                            }
                            renderOption={(props, option) => {
                                return (
                                    <li {...props} key={option.id}>
                                        {option.title}
                                    </li>
                                );
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Company"
                                    fullWidth
                                />
                            )}
                        />
                        <TextField
                            sx={{ m: 1 }}
                            fullWidth
                            select
                            size="small"
                            label="Status"
                            onChange={(e) => handleData(e, null, "status")}
                            SelectProps={{
                                native: true,
                            }}
                        >
                            <option> - </option>
                            <option value="pending"> Open </option>
                            <option value="onhold"> onHold </option>
                            <option value="onprocess"> OnProcess </option>
                            <option value="closed"> Closed </option>
                            <option value="cancelled"> Cancelled </option>
                        </TextField>

                        <Autocomplete
                            disablePortal
                            sx={{ m: 1 }}
                            fullWidth
                            options={processBy}
                            getOptionLabel={(company) => company.name}
                            size="small"
                            onChange={(e, value) =>
                                handleData(e, value, "processby")
                            }
                            renderOption={(props, option) => {
                                return (
                                    <li {...props} key={option.user_id}>
                                        {option.name}
                                    </li>
                                );
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Process By"
                                    fullWidth
                                />
                            )}
                        />
                        <Autocomplete
                            disablePortal
                            fullWidth
                            sx={{ m: 1 }}
                            options={requestedBy}
                            getOptionLabel={(company) => company.name}
                            size="small"
                            onChange={(e, value) =>
                                handleData(e, value, "requestedby")
                            }
                            renderOption={(props, option) => {
                                return (
                                    <li {...props} key={option.user_id}>
                                        {option.name}
                                    </li>
                                );
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Requested By"
                                    fullWidth
                                />
                            )}
                        />
                    </Box>
                    <Box
                        sx={{
                            ml: "auto",
                            p: "2px 4px",
                            display: "flex",
                            alignItems: "center",
                            borderLeft: "1px solid #ccc",
                        }}
                    >
                        <TextField
                            size="small"
                            fullWidth
                            placeholder="Search"
                            onChange={(e) => handleSearch(e)}
                            variant="outlined"
                            inputProps={{ "aria-label": "Search" }}
                        />
                        <IconButton
                            onClick={(e) => searchSubmit(e)}
                            sx={{ p: "10px" }}
                            aria-label="search"
                        >
                            <SearchIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Stack>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <TableContainer>
                    <Table
                        stickyHeader
                        aria-label="sticky table"
                        className="dense-table"
                    >
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {requestData.map((row, index) => {
                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={row.prf_no}
                                    >
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            const prby = column.id;
                                          
                                            return (
                                                <TableCell
                                                    key={column.id}
                                                    align={column.align}
                                                  
                                                >
                                                    {value && prby !== 'process_by'  ? (
                                                        <span   onClick={() =>
                                                            viewDetails(row, value)
                                                        } className={value}>
                                                            {column.format &&
                                                            typeof value ===
                                                                "number"
                                                                ? column.format(
                                                                      value
                                                                  )
                                                                : value}
                                                        </span>
                                                    ) : (
                                                        <TextField
                                                            disabled={
                                                                !isadmin  && ( 
                                                                row.status ==
                                                                "cancelled" || 
                                                                     row.status ==
                                                                    "closed" )
                                                            }
                                                            select
                                                            size="small"
                                                            label="Assign To"
                                                            value={ processBy.user_id ? processBy.user_id : value ? value.id : processBy.user_id  }
                                                            onChange={(e) =>
                                                                handleAssign(
                                                                    e,
                                                                    row
                                                                )
                                                            }
                                                            SelectProps={{
                                                                native: true,
                                                            }}
                                                        >
                                                            <option> - </option>
                                                            {processBy.map(
                                                                (option) => (
                                                                    <option
                                                                        key={
                                                                            option.user_id
                                                                        }
                                                                        value={
                                                                            option.user_id
                                                                        }
                                                                    >
                                                                        {
                                                                            option.name
                                                                        }
                                                                    </option>
                                                                )
                                                            )}
                                                        </TextField>
                                                    )}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                >
                    <IconButton
                        disabled={fromPage === 1 ? true : false}
                        color="primary"
                        aria-label="Previous Page"
                        component="span"
                        sx={{ mx: 1 }}
                        onClick={() => arrowPage(-1)}
                    >
                        <ChevronLeftIcon />
                    </IconButton>
                    <Pagination
                        count={lastPage}
                        page={page}
                        onChange={(e) =>
                            handleChangePage(e.target.innerText, 0)
                        }
                        hidePrevButton
                        hideNextButton
                        color="secondary" 
                        variant="outlined"
                        shape="rounded"
                        size="small"
                    />
                    <IconButton
                        disabled={toPage === totalPage ? true : false}
                        color="primary"
                        aria-label="Next Page"
                        component="span"
                        sx={{ mx: 1 }}
                        onClick={() => arrowPage(1)}
                    >
                        <ChevronRightIcon />
                    </IconButton>
                </Stack>
            </Paper>
        </>
    );
};

export default Procurement;