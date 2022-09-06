import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

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
import AddIcon from "@mui/icons-material/Add";
import Autocomplete from "@mui/material/Autocomplete";
import API from "../../services/api.js";

const columns = [
    { id: "status", label: "STATUS", minWidth: 20 },
    { id: "lpo_no", label: "LPO NO.", minWidth: 30 },
    { id: "prf_no", label: "PRF NO.", minWidth: 30 },
    { id: "company", label: "Business Unit", minWidth: 50 },
    { id: "supplier", label: "Supplier", minWidth: 50 },
    { id: "net_amount", label: "Amount", minWidth: 50 },
    { id: "process_by", label: "PROCESSED BY", minWidth: 50 },
    { id: "created_at", label: "D.Created", minWidth: 20 },
];

const Lpo = () => {
    const navigate = useNavigate();
    var queryParams = new URLSearchParams(window.location.search);
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    // Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
    let qpage = params.page; // "some_value"
    if(!qpage){
        qpage = 1;
    }

    const [page, setPage] = useState(parseInt(qpage));
    const [lastPage, setlastPage] = useState(0);
    const [totalPage, settotalPage] = useState(0);
    const [toPage, settoPage] = useState(0);
    const [fromPage, setfromPage] = useState(0);
    const [isSearch, setIsSearch ]= useState(false);
    const arrowPage = (n) => {
        let p = page + n;
        if (p > 0 && p <= lastPage) {
            setPage(p);
        }

        
        // Set new or modify existing parameter value. 
        queryParams.set("page",  p);
      
        // Replace current querystring with the new one.
        history.replaceState(null, null, "?"+queryParams.toString());
    };
    const [company, setCompany] = useState([
        {
            id: null,
            title: "",
        },
    ]);
    const [supplier, setSupplier] = useState([
        {
            id: null,
            title: "",
        },
    ]);
    const [processBy, setProcessBy] = useState([]);

    const [filterSearch, setFilterSearch] = useState([
        {
            company_id: "",
            status: "",
            process_by: "",
            user_id: "",
        },
    ]);

    const [lpoData, setLpoData] = useState([
        {
            id: null,
            status: "",
            lpo_no: "",
            prf_no: "",
            company: "",
            supplier: "",
            net_amount: 0.00,
            process_by: "",
            created_at: "",
        },
    ]);

    function fetchRequests(ss = "") {
        let pg = page;
        if(queryParams.get('page')){
            pg = queryParams.get('page');
        }
        API.get("/v/local-purchase-order/fetch/?page=" + pg+ss)
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
            let prf = o.requests.prf_no;
            if (o.prf_extension) {
                prf = prf + "-" + o.prf_extension;
            }

            newData[i] = {
                id: o.id,
                status: o.status,
                lpo_no: o.lpo_no,
                prf_no: prf,
                supplier: o.supplier ? o.supplier.title : "",
                company: o.company,
                net_amount: o.net_amount ? o.net_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "0.00",
                process_by: o.process_by ? o.process_by.name : "",
                created_at: new Date(o.created_at).toLocaleDateString(),
            };
        });

        setLpoData(newData);
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

    const handleData = (e, val, type) => {
        let value = "";
        if (val) {
            value = val.id;
        } else {
            value = e.target.value;
        }
      
        let objAssign = Object.assign([], filterSearch);

        if (type == "company") {
            
            objAssign[0].company_id = val.id;
            if(value == undefined || value == null || value == "-" || value == 0){ 
                queryParams.delete('company_id');
                history.replaceState(null, null, "?" + queryParams.toString());
            }
        } else if (type == "status") {
            objAssign[0].status = value;

            if(value == undefined || value == null || value == "-"){ 
                queryParams.delete('status');
                history.replaceState(null, null, "?" + queryParams.toString());
            }
        } else if (type == "supplier") {
            objAssign[0].supplier_id = value;

            if(value == undefined || value == null || value == "-"){ 
                queryParams.delete('supplier_id');
                history.replaceState(null, null, "?" + queryParams.toString());
            }
        } else if (type == "processby") {
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
        setLpoData([]);
        
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
            navigate("id/" + e.id);
        }
    };

    useEffect(() => {
        let cID = params.company_id;
        let cStatus = params.status;
        let cProcess = params.user_id;
        let cUser = params.supplier_id;
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
            czProcess = "&user_id=" + cProcess;
        }
        if (cUser) {
            czUser = "&supplier_id=" + cUser;
        }
        let defaultQueryString = czID + czStatus + czProcess + czUser;
        if(!isSearch){
            fetchRequests(defaultQueryString);
        }
        return () => {
            setLpoData([]);
        };
    }, [page]);

    useEffect(() => {
        API.get("/v/profile/procurements/list").then((response) => {
            if (response.data) {
                setProcessBy(response.data.item);
            }
        });

        API.get("/v/suppliers/fetch-non-paginate").then((response) => {
            if (response.data) {
                setSupplier(response.data.item);
            }
        });

        API.get("/v/companies/fetch-non-paginate").then((response) => {
            let fetchItems = response.data.item;
            let defaultData = [
                {
                    id: 0,
                    title: "-",
                },
            ];
            fetchItems = Object.assign([], fetchItems);
            let newData = [...defaultData, ...fetchItems];
            setCompany(newData);
        });
    }, []);

    const handleChangePage = (selectedPage, n) => {
        let p = parseInt(selectedPage);
        p = p + n;
        setPage(p);
        
        // Set new or modify existing parameter value. 
        queryParams.set("page",  p);
      
        // Replace current querystring with the new one.
        history.replaceState(null, null, "?"+queryParams.toString());
    };

    const handleSearch = (e) => {
        if (e.target.value.length > 3) { 
            setIsSearch(true);
            setPage(1);
            queryParams.set("page", 1);  
            history.replaceState(null, null, "?" + queryParams.toString()); 
                
            axiosFunction("/v/local-purchase-order/search/" + e.target.value);
            
        } else if (e.target.value.length == 0) {
            setIsSearch(false);
            axiosFunction("/v/local-purchase-order/search/-");
        }
    };

    return (
        <>
            <Stack
                sx={{ marginBottom: 2 }}
                direction={{ xs: "column", sm: "row" }}
            >
                <Box sx={{ display: "flex", width: "100%" }}>
                    <Box sx={{ display: "flex", width: "80%" }}>
                        <Link
                            to="/d/procurement-team/local-purchase-orders/create"
                            style={{ margin: "auto 5px", marginRight: "20px" }}
                        >
                            <IconButton
                                sx={{ backgroundColor: "#000", color: "#fff" }}
                            >
                                <AddIcon />
                            </IconButton>
                        </Link>
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

                        <Autocomplete
                            disablePortal
                            sx={{ m: 1 }}
                            fullWidth
                            options={supplier}
                            getOptionLabel={(supplier) => supplier.title}
                            size="small"
                            onChange={(e, value) =>
                                handleData(e, value, "supplier")
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
                                    label="Supplier"
                                    fullWidth
                                />
                            )}
                        />

                        <Autocomplete
                            disablePortal
                            sx={{ m: 1 }}
                            fullWidth
                            options={processBy}
                            getOptionLabel={(process) => process.name}
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
                                    label="Process by"
                                    fullWidth
                                />
                            )}
                        />
                        <TextField
                            sx={{ m: 1 }}
                            select
                            fullWidth
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
                    </Box>
                    <Box
                        sx={{
                            ml: "auto",
                            p: "2px 4px",
                            display: "flex",
                            alignItems: "center",
                            borderLeft: "1px solid #ccc"
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
                <TableContainer >
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
                            {lpoData.map((row, index) => {
                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={row.lpo_no}
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
                                                    {
                                                        <span className={value}>
                                                            {column.format &&
                                                            typeof value ===
                                                                "number"
                                                                ? column.format(
                                                                      value
                                                                  )
                                                                : value}
                                                        </span>
                                                    }
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

export default Lpo;
