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
    { id: "process_by", label: "Process By", minWidth: 50 },
    { id: "urgency", label: "Urgency", minWidth: 20 },
    { id: "created_at", label: "RQST DATE", minWidth: 50 },
];

const Companies = () => {
    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const [lastPage, setlastPage] = useState(0);
    const [totalPage, settotalPage] = useState(0);
    const [toPage, settoPage] = useState(0);
    const [fromPage, setfromPage] = useState(0);

    const [listRequest, setListRequests] = useState([
        {
            id: null,
            status: "",
            prf_no: "",
            company: "",
            process_by: "",
            urgency: "",
            created_at: "",
        },
    ]);
    function fetchRequests() {
        let token = localStorage.getItem('auth_token');
        API
            .get("/v/request/fetch-all/"+token+"/?page=" + page)
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
                process_by: o.process_by ? o.process_by.name : "",
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
        fetchRequests();
       
    }, [page]);

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

    const arrowPage = (n) => {
        let p = page + n;
        if (p > 0 && p <= lastPage) {
            setPage(p);
        }
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
                        size="small"
                        fullWidth
                        placeholder="Search"
                        onChange={(e) => handleSearch(e)}
                        variant="outlined"
                        inputProps={{ "aria-label": "Search" }}
                    />

                    <IconButton
                        type="submit"
                        sx={{ p: "10px" }}
                        aria-label="search"
                    >
                        <SearchIcon />
                    </IconButton>
                </Box>
            </Stack>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <TableContainer sx={{ maxHeight: 600 }}>
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

export default Companies;
