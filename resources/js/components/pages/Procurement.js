import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";

import TableRow from "@mui/material/TableRow";

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

const Procurement = ({logged}) => {
    const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState({
        title: "",
        message: "",
    });
     
    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    }; 

    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [lastPage, setlastPage] = useState(0);
    const [totalPage, settotalPage] = useState(0);
    const [toPage, settoPage] = useState(0);
    const [fromPage, setfromPage] = useState(0);
    const arrowPage = (n) => {
        let p = page + n;
        if (p > 0 && p <= lastPage) {
            setPage(p);
        }
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
        }
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

    function fetchRequests() {
        API.get("/v/request/procurement/fetch-all/?page=" + page)
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
                process_by: o.process_by ? o.process_by.name : "",
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
        
        let selected = e.target.value;
         
        let newMessage = {
            title: "info",
            message: "Please wait...",
        };
        setSeverity(newMessage); 
        
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
                }, 1500);
            })
            .catch((error) => {
                newMessage = {
                    title: "error",
                    message: "Kindly refresh the page.",
                };
                setSeverity(newMessage);
                 
            });
    };

    const handleData = (e, type) => {
        let value = e.target.value;

        let objAssign = Object.assign([], filterSearch);
        
        if(type == "company"){
            objAssign[0].company_id = value
        }else if(type == "status"){
            objAssign[0].status = value
        }else if(type == "processby"){
            objAssign[0].process_by = value
        }else if(type == "requestedby"){
            objAssign[0].user_id = value
        }

        setFilterSearch(objAssign);
    };

    const searchSubmit = (e) =>{
        e.preventDefault();
        let search = filterSearch[0];
        Object.keys(search).forEach(key => {
            if (search[key] === '' || search[key] === '-') {
              delete search[key];
            }
          }); 
        
         
        search = { data: search };
        API.post("/v/request/procurement/filter/search", search).then((response) => {
            if (response.data) {
                let fetchItems = response.data.item;

                dataWithRelations(fetchItems.data);

                setPage(fetchItems.current_page);
                setlastPage(fetchItems.last_page);
                settotalPage(fetchItems.total);
                settoPage(fetchItems.to);
                setfromPage(fetchItems.from);
            }
        });
    };

    const viewDetails = (e, v) => {
        if (v) {
            navigate("request/id/" + e.id);
        }
    };

    useEffect(() => {
        fetchRequests();
        return () => {
            setRequestsData([]);
          };
    }, [page]);

    useEffect(() => {
        API.get("/v/profile/procurements/list").then((response) => {
            if (response.data) {
                setProcessBy(response.data.item);
            }
        });

        API.get("/v/profile/procurements/profile_users").then((response) => {
            if (response.data) {
                setRequestedBy(response.data.item);
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
    };

    const handleSearch = (e) => {
        if (e.target.value.length > 3) {
            axiosFunction("/v/request/search/" + e.target.value);
        } else if (e.target.value.length == 0) {
            axiosFunction("/v/request/search/-");
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
                    <Box sx={{ display: "flex" }}>
                        <Box sx={{ my: "auto" }}> Filter by:</Box>
                        <TextField
                            sx={{ m: 1 }}
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
                                <option key={option.id} value={option.id}>
                                    {option.title}
                                </option>
                            ))}
                        </TextField>

                        <TextField
                            sx={{ m: 1 }}
                            select
                            size="small"
                            label="Status"
                            onChange={(e) => handleData(e, "status")}
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

                        <TextField
                            sx={{ m: 1 }}
                            select
                            size="small"
                            label="Process By"
                            value={processBy.user_id}
                            onChange={(e) => handleData(e, "processby")}
                            SelectProps={{
                                native: true,
                            }}
                        >
                            <option> - </option>
                            {processBy.map((option) => (
                                <option key={option.user_id} value={option.user_id}>
                                    {option.name}
                                </option>
                            ))}
                        </TextField>
                        <TextField
                            sx={{ m: 1 }}
                            select
                            size="small"
                            label="Requested By"
                            value={requestedBy.user_id}
                            onChange={(e) => handleData(e, "requestedby")}
                            SelectProps={{
                                native: true,
                            }}
                        >
                            <option> - </option>
                            {requestedBy.map((option) => (
                                <option key={option.user_id} value={option.user_id}>
                                    {option.name}
                                </option>
                            ))}
                        </TextField>
                    </Box>
                    <Box
                        sx={{
                            ml: "auto",
                            p: "2px 4px",
                            display: "flex",
                            alignItems: "center",
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
                <TableContainer sx={{ maxHeight: 620 }}>
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

                                            return (
                                                <TableCell
                                                    key={column.id}
                                                    align={column.align}
                                                    onClick={() =>
                                                        viewDetails(row, value)
                                                    }
                                                >
                                                    {value ? (
                                                        <span className={value}>
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
                                                            select
                                                            size="small"
                                                            label="Assign To"
                                                            value={
                                                                processBy.user_id
                                                            }
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
                        size="medium"
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
