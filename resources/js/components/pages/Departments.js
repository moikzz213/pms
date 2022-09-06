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

import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import API from "../../services/api.js";
const columns = [
     
    { id: "title", label: "Department", minWidth: 30 }, 
];

const Departments = () => {
    const navigate = useNavigate(); 

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

    const [itemData, setDepartmentsData] = useState([
        {
            id: null,
            title: ""            
        },
    ]);
    function fetchDepartments() {
        API
            .get("/v/departments/fetch-all/?page=" + page)
            .then((response) => {
                let fetchItems = response.data.item;
               
                setDepartmentsData(fetchItems.data);

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

    function axiosFunction(controller){
        API
        .get(controller)
        .then((response) => {
            let fetchItems = response.data.item;
            
            setDepartmentsData(fetchItems.data);

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
        fetchDepartments(); 
        return () => {
            setDepartmentsData([]);
          };
    }, [page]); 

    const handleChangePage = (selectedPage, n) => {
        let p = parseInt(selectedPage);
        p = p + n;
        setPage(p);

        var queryParams = new URLSearchParams(window.location.search);
        // Set new or modify existing parameter value. 
        queryParams.set("page",  p);
      
        // Replace current querystring with the new one.
        history.replaceState(null, null, "?"+queryParams.toString());
    };

    const handleSearch = (e) => {
        if(e.target.value.length > 3){
            
           axiosFunction("/v/departments/search/"+ e.target.value);

        }else if(e.target.value.length == 0){
            axiosFunction("/v/departments/search/-");
        }
    };

    const arrowPage = (n) => {
        let p = page + n;
        if (p > 0 && p <= lastPage) {
            setPage(p);
        }

        var queryParams = new URLSearchParams(window.location.search);
        // Set new or modify existing parameter value. 
        queryParams.set("page",  p);
      
        // Replace current querystring with the new one.
        history.replaceState(null, null, "?"+queryParams.toString());
    };

    const viewDetails = (e) => {
        navigate("id/" + e.id);
    };

    const deleteData = (e) => { 
        API.post("/v/departments/delete", e)
        .then((response) => {
            setTimeout(() => {
                fetchDepartments();
            },200);
        });
    };

    return (
        <>
            <Stack
                sx={{ marginBottom: 2 }}
                direction={{ xs: "column", sm: "row" }}
            >
                <Link to="/d/settings/departments/create">
                    <Button variant="contained"> New Department </Button>
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
                <TableContainer>
                    <Table
                        stickyHeader
                        aria-label="sticky table"
                        className="dense-table"
                    >
                        <TableHead>
                            <TableRow>
                            <TableCell sx={{width:50}}>
                                           #
                                        </TableCell>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                                  <TableCell> </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {itemData && itemData.map((row, index) => {
                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={row.id}
                                        className="row-data"
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
                                        <TableCell>
                                            <Box className="action-btn">
                                                <EditIcon
                                                    sx={{ mr: 1 }}
                                                    title="Edit"
                                                    onClick={() =>
                                                        viewDetails(row)
                                                    }
                                                />
                                                <DeleteForeverIcon
                                                    color="error"
                                                    title="Edit"
                                                    onClick={() =>
                                                        deleteData(row)
                                                    }
                                                />
                                            </Box>
                                        </TableCell>
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

export default Departments;
