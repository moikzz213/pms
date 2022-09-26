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
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";

import SearchIcon from "@mui/icons-material/Search";
import Pagination from "@mui/material/Pagination";

import IconButton from "@mui/material/IconButton";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import API from "../../services/api.js";
const columns = [ 
    { id: "status", label: "Status", minWidth: 30 },
    { id: "prf_no", label: "PRF No.", minWidth: 50 },
    { id: "company", label: "Business Unit", minWidth: 20 },
    { id: "user_id", label: "RQSTED By", minWidth: 50 },
    { id: "process_by", label: "Process By", minWidth: 50 },
    { id: "subject", label: "Subject", minWidth: 20 },
    { id: "urgency", label: "Urgency", minWidth: 20 },
    { id: "created_at", label: "RQST DATE", minWidth: 50 },
];

const Request = ({logged}) => {
    const navigate = useNavigate();
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    var queryParams = new URLSearchParams(window.location.search);
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
    const [listRequest, setListRequests] = useState([
        {
            id: null,
            status: "",
            prf_no: "",
            company: "",
            process_by: "",
            subject: "",
            urgency: "",
            created_at: "",
        },
    ]);
    const [filterSearch, setFilterSearch] = useState([
        {
            company_id: "",
            status: "",
            process_by: "",
            user_id: "",
        }
    ]);
    function fetchRequests(ss = "") {
        let token = localStorage.getItem('auth_token');
        let pg = page;
        if(queryParams.get('page')){
            pg = queryParams.get('page');
        }
        API
            .get("/v/request/fetch-all/"+token+"/?page=" + pg+ss)
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

    function dataWithRelations(data){
        let newData = [];
         
        data.map((o,i) => {
            newData[i] = {
                id: o.id,
                status: o.status,
                prf_no: o.prf_no, 
                company: o.company ? o.company.title : "",
                user_id: o.profile ? o.profile.name : "",
                process_by: o.process_by ? o.process_by.name : "",
                subject: o.subject,
                urgency: o.urgency,
                created_at: new Date(o.created_at).toLocaleDateString()
            }
        });
       
        setListRequests(newData);
    } 

    function axiosFunction(controller) {
        API
            .get(controller)
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

    useEffect(() => {
        
        let cStatus = params.status;
       
       
        let czStatus = "";
        
        if (cStatus) {
            czStatus = "&status=" + cStatus;
        }
        
        let defaultQueryString =  czStatus;
        //if(!isSearch){
        fetchRequests(defaultQueryString);
       // }
        return () => {
            setListRequests([]);
          };
    }, [page]);

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

            axiosFunction("/v/request/search/"+logged.id +"/" + e.target.value);
        } else if (e.target.value.length == 0) {
            setIsSearch(false);
            axiosFunction("/v/request/search/"+logged.id+"/-");
        }
    
    };

    const searchSubmit = (e) =>{
        e.preventDefault();
        setListRequests([]);
        let search = filterSearch[0];
        Object.keys(search).forEach(key => {
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

    const handleData = (e,val, type) => {
        
        let value = '';
        if(val){
              value = val.id;
        }else{
              value = e.target.value;
        }
        
        let objAssign = Object.assign([], filterSearch);
        
        if(type == "company"){
            objAssign[0].company_id = value

            if(value == undefined || value == null || value == "-"){ 
                queryParams.delete('company_id');
                history.replaceState(null, null, "?" + queryParams.toString());
            }
        }else if(type == "status"){
            objAssign[0].status = value

            if(value == undefined || value == null || value == "-"){ 
                queryParams.delete('status');
                history.replaceState(null, null, "?" + queryParams.toString());
            }
        }else if(type == "processby"){
            objAssign[0].process_by = value
        } 

        setFilterSearch(objAssign);
    };

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

    const viewDetails = (e) => {
        navigate("id/" + e.id);
    }; 

    return (
        <>
            <Stack
                sx={{ marginBottom: 2 }}
                direction={{ xs: "column", sm: "row" }}
            >
                <Link to="/d/requests/new-request">
                    <Button variant="contained"> New Request </Button>
                </Link>
              
                <Box
                    sx={{
                        ml: "auto",
                        p: "2px 4px",
                        display: "flex",
                        alignItems: "center",
                        width: 400,
                    }}
                >
                      <TextField
                            sx={{ m: 1, width:"150px" }}
                             
                            select
                            size="small"
                            label="Status"
                            onChange={(e) => handleData(e,null, "status")}
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
                        size="small"
                        fullWidth
                        placeholder="Search"
                        onChange={(e) => handleSearch(e)}
                        variant="outlined"
                        inputProps={{ "aria-label": "Search" }}
                    />

                    <IconButton
                       
                        sx={{ p: "10px" }}
                        aria-label="search"
                        onClick={(e) => searchSubmit(e)}
                    >
                        <SearchIcon />
                    </IconButton>
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
                                <TableCell>#</TableCell>
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
                            {listRequest.map((row, index) => {
                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={row.id}
                                        
                                        onClick={() =>
                                            viewDetails(row)
                                        }
                                    >
                                        <TableCell>{ page == 1 ? index + 1 : ((page * 10) - 10) + index + 1}</TableCell>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell
                                                    key={column.id}
                                                    align={column.align}
                                                >
                                                    <span className={value}>
                                                        {column.format &&
                                                        typeof value ===
                                                            "number"
                                                            ? column.format(
                                                                  value
                                                              )
                                                            : value}
                                                    </span>
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

export default Request;
