import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import SearchIcon from "@mui/icons-material/Search";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import AddIcon from "@mui/icons-material/Add";
function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === "rtl" ? (
                    <LastPageIcon />
                ) : (
                    <FirstPageIcon />
                )}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === "rtl" ? (
                    <KeyboardArrowRight />
                ) : (
                    <KeyboardArrowLeft />
                )}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === "rtl" ? (
                    <KeyboardArrowLeft />
                ) : (
                    <KeyboardArrowRight />
                )}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === "rtl" ? (
                    <FirstPageIcon />
                ) : (
                    <LastPageIcon />
                )}
            </IconButton>
        </Box>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

const columns = [
    { id: "status", label: "STATUS", minWidth: 10 },
    { id: "paf_no", label: "PAF NO.", minWidth: 10 },
    { id: "lpo_no", label: "LPO NO.", minWidth: 10 },
    { id: "inv_no", label: "INV NO.", minWidth: 10 },
    { id: "inv_date", label: "INV DATE.", minWidth: 10 },
    { id: "inv_amount", label: "INV AMNT", minWidth: 10 },
    { id: "company", label: "Business Unit", minWidth: 10 },
    { id: "supplier", label: "SUPPLIER", minWidth: 10 },
    { id: "process_by", label: "PROCESSED BY", minWidth: 10 },
    { id: "created_at", label: "Date", minWidth: 10 },
];

const companies = [
    {
        id: 1,
        title: "Ghassan Aboud Group FZE",
    },
    {
        id: 2,
        title: "Ghassan Aboud New Cars",
    },
].sort((a, b) => (a.title < b.title ? -1 : 1));

const statuses = [
    {
        id: 1,
        title: "Open",
    },
    {
        id: 2,
        title: "Closed",
    },
    {
        id: 3,
        title: "onProcess",
    },
    {
        id: 4,
        title: "onHold",
    },
    {
        id: 5,
        title: "Cancelled",
    },
].sort((a, b) => (a.title < b.title ? -1 : 1));

const processedBy = [
    {
        id: 1,
        name: "Saleh",
    },
    {
        id: 2,
        name: "Marie",
    },
    {
        id: 3,
        name: "Dawn",
    },
    {
        id: 4,
        name: "Ashfak",
    },
    {
        id: 5,
        name: "Murshid",
    },
].sort((a, b) => (a.name < b.name ? -1 : 1));

const suppliers = [
    {
        id: 1,
        title: "VRS",
    },
    {
        id: 2,
        title: "Samsung",
    },
];

const Pafs = () => {
    const navigate = useNavigate();
    const [rows, setrows] = useState(
        [
            {
                id: 1,
                status: "onProcess",
                paf_no: "PAF-00001",
                lpo_no: "LPO-00001",
                company: "Ghassan Aboud Group FZE",
                supplier: "VRS",
                process_by: "Murshid",
                created_at: "03/09/2022",
            },
            {
                id: 2,
                status: "Completed",
                paf_no: "PAF-00002",
                lpo_no: "LPO-00001",
                company: "Ghassan Aboud Group FZE",
                supplier: "EMSYS IT",
                process_by: "Marie",

                created_at: "03/09/2022",
            },
            {
                id: 3,
                status: "onProcess",
                paf_no: "PAF-00003",
                lpo_no: "LPO-00003",
                company: "Ghassan Aboud Group FZE",
                supplier: "EMSYS IT",
                process_by: "Ashfak",
                created_at: "03/09/2022",
            },
            {
                id: 4,
                status: "onProcess",
                paf_no: "PAF-00004",
                lpo_no: "LPO-00004",
                company: "Ghassan Aboud Group FZE",
                supplier: "VRS",
                process_by: "Dawn",

                created_at: "03/09/2022",
            },
        ].sort((a, b) => (a.id > b.id ? -1 : 1))
    );

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const [company, setCompany] = useState("");
    const handleCompany = (event) => {
        setCompany(event.target.value);
    };

    const [supplier, setSupplier] = useState("");
    const handleSupplier = (event) => {
        console.log(event.target.value);
        setSupplier(event.target.value);
    };

    const [status, setStatus] = useState("");
    const handleStatus = (event) => {
        setStatus(event.target.value);
    };

    const [processed, setProcessed] = useState("");
    const handleProcessed = (event) => {
        setProcessed(event.target.value);
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
                <Box sx={{ display: "flex", width: "100%" }}>
                    <Box sx={{ display: "flex" }}>
                        <Link to="/d/procurement-team/payment-approval-forms/create" style={{margin: "auto 5px", marginRight: "20px"}}>
                            <IconButton sx={{backgroundColor: "#000", color: "#fff"}}>
                                <AddIcon />
                            </IconButton>
                        </Link>
                        <Box sx={{ my: "auto" }}> Filter by:</Box>
                        <FormControl sx={{ m: 1, minWidth: 150 }}>
                            <InputLabel id="simple-select-label" size="small">
                                Business Unit
                            </InputLabel>
                            <Select
                                labelId="simple-select-label"
                                id="simple-select"
                                size="small"
                                value={company}
                                autoWidth
                                label="Company"
                                onChange={handleCompany}
                            >
                                <MenuItem value="">-</MenuItem>
                                {companies.map((data) => {
                                    return (
                                        <MenuItem key={data.id} value={data.id}>
                                            {data.title}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>

                        <FormControl sx={{ m: 1, minWidth: 150 }}>
                            <InputLabel id="simple-select-label" size="small">
                                Suppliers
                            </InputLabel>
                            <Select
                                labelId="simple-select-label"
                                id="simple-select"
                                size="small"
                                value={supplier}
                                autoWidth
                                label="Supplier"
                                onChange={handleSupplier}
                            >
                                <MenuItem value="">-</MenuItem>
                                {suppliers.map((data) => {
                                    return (
                                        <MenuItem key={data.id} value={data.id}>
                                            {data.title}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>

                        <FormControl sx={{ m: 1, minWidth: 150 }}>
                            <InputLabel id="simple-select-label" size="small">
                                Status
                            </InputLabel>
                            <Select
                                labelId="simple-select-label"
                                id="simple-select"
                                size="small"
                                value={status}
                                autoWidth
                                label="Status"
                                onChange={handleStatus}
                            >
                                <MenuItem value="">-</MenuItem>
                                {statuses.map((data) => {
                                    return (
                                        <MenuItem key={data.id} value={data.id}>
                                            {data.title}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>

                        <FormControl sx={{ m: 1, minWidth: 150 }}>
                            <InputLabel id="simple-select-label" size="small">
                                Processed by
                            </InputLabel>
                            <Select
                                labelId="simple-select-label"
                                id="simple-select"
                                size="small"
                                value={processed}
                                autoWidth
                                label="Process By"
                                onChange={handleProcessed}
                            >
                                <MenuItem value="">-</MenuItem>
                                {processedBy.map((data) => {
                                    return (
                                        <MenuItem key={data.id} value={data.id}>
                                            {data.name}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
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
                            {rows
                                .slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                )
                                .map((row) => {
                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            tabIndex={-1}
                                            key={row.paf_no}
                                            onClick={() => viewDetails(row)}
                                        >
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
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </>
    );
};

export default Pafs;
