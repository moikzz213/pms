import React, { useState, useEffect } from "react";
import axios from "axios";
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
const columns = [ 
    { id: "title", label: "Company", minWidth: 30 },
    { id: "code", label: "Code", minWidth: 30 },
    { id: "address", label: "Address", minWidth: 50 },
    { id: "tax_no", label: "Tax No.", minWidth: 20 },
    { id: "contact_person", label: "Contact Person", minWidth: 50 },
    { id: "contact_no", label: "Contact No.", minWidth: 20 },
    { id: "email", label: "Email", minWidth: 50 },
];

const Companies = ({logged}) => {
    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const [lastPage, setlastPage] = useState(0);
    const [totalPage, settotalPage] = useState(0);
    const [toPage, settoPage] = useState(0);
    const [fromPage, setfromPage] = useState(0);

    const [companyList, setCompanyList] = useState([
        {
            id: null,
            title: "",
            code: "",
            address: "",
            tax_no: "",
            contact_person: "",
            contact_no: "",
            email: "",
        },
    ]);
    function fetchCompanies() {
        axios
            .get("/v/companies/fetch-all/?page=" + page)
            .then((response) => {
                let fetchItems = response.data.item;
                setCompanyList(fetchItems.data);

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

    function axiosFunction(controller) {
        axios
            .get(controller)
            .then((response) => {
                let fetchItems = response.data.item;
                setCompanyList(fetchItems.data);

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
        fetchCompanies();
        return () => {
        setCompanyList([]); // This worked for me
        };
    }, [page]);

    const handleChangePage = (selectedPage, n) => {
        let p = parseInt(selectedPage);
        p = p + n;
        setPage(p);
    };

    const handleSearch = (e) => {
        
        if (e.target.value.length > 3) {
            axiosFunction("/v/companies/search/" + e.target.value);
        } else if (e.target.value.length == 0) {
            axiosFunction("/v/companies/search/-");
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

    const deleteData = (e) => {
        axios.post("/v/companies/delete", e).then((response) => {
            setTimeout(() => {
                fetchCompanies();
            }, 200);
        });
    };

    return (
        <>
            <Stack
                sx={{ marginBottom: 2 }}
                direction={{ xs: "column", sm: "row" }}
            >
                <Link to="/d/settings/companies/create">
                    <Button variant="contained"> New Company </Button>
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
                <TableContainer sx={{ maxHeight: 700 }}>
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
                                <TableCell>-</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {companyList.map((row, index) => {
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
                                        <TableCell className="td-action-btn">
                                            <Box className="action-btn">
                                                <EditIcon
                                                    sx={{ mr: 1 }}
                                                    title="Edit"
                                                    onClick={() =>
                                                        viewDetails(row)
                                                    }
                                                />
                                                { logged && logged.role == 'admin' && 
                                                (
                                                <DeleteForeverIcon
                                                    color="error"
                                                    title="Edit"
                                                    onClick={() =>
                                                        deleteData(row)
                                                    }
                                                />
                                                )}
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
