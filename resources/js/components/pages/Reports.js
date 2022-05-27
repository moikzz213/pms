import React, { useState, useEffect } from "react";
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
import SimCardDownloadOutlinedIcon from "@mui/icons-material/SimCardDownloadOutlined";
import API from "../../services/api.js";
import * as XLSX from "xlsx/xlsx.mjs";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import Button from "@mui/material/Button";
const paf_columns = [
    { id: "created_at", label: "PAF DATE", minWidth: 20 },
    { id: "paf_no", label: "PAF NO", minWidth: 20 },
    { id: "month", label: "MONTH", minWidth: 20 },
    { id: "lpo_date", label: "LPO DATE", minWidth: 20 },
    { id: "lpo_no", label: "LPO NO", minWidth: 20 },
    { id: "invoice_date", label: "INV. DATE", minWidth: 20 },
    { id: "supplier_invoice_num", label: "INV NO", minWidth: 20 },
    { id: "amount", label: "INV AMNT", minWidth: 20 },
    { id: "item", label: "ITEM", minWidth: 20 }, 
    { id: "department", label: "CATEGORY", minWidth: 20 }, 
    { id: "qty", label: "QTY", minWidth: 20 },
    { id: "unit_price", label: "UNIT PRICE", minWidth: 20 },
    { id: "vat", label: "VAT 5%", minWidth: 20 },
    { id: "total", label: "TOTAL", minWidth: 20 },
    { id: "supplier", label: "SUPPLIER", minWidth: 20 },
    { id: "location", label: "BRANCH", minWidth: 20 },
    { id: "company", label: "BUSINESS UNIT", minWidth: 20 },
    { id: "rname", label: "EMP. NAME", minWidth: 20 },
    { id: "designation", label: "DESIGNATION", minWidth: 20 },
    { id: "status", label: "STATUS", minWidth: 20 },
];

const lpo_columns = [
    { id: "prf_date", label: "RQST DATE", minWidth: 20 },
    { id: "prf_no", label: "RQST NO", minWidth: 20 },
    { id: "month", label: "MONTH", minWidth: 20 },
    { id: "created_at", label: "LPO DATE", minWidth: 20 },
    { id: "lpo_no", label: "LPO NO", minWidth: 20 },
    { id: "item", label: "ITEM", minWidth: 20 },
    { id: "specification", label: "DESC", minWidth: 20 },
    { id: "department", label: "CATEGORY", minWidth: 20 },
    { id: "category", label: "SUB CAT", minWidth: 20 },
    { id: "qty", label: "QTY", minWidth: 20 },
    { id: "unit_price", label: "UNIT PRICE", minWidth: 20 },
    { id: "vat", label: "VAT 5%", minWidth: 20 },
    { id: "total", label: "TOTAL", minWidth: 20 },
    { id: "supplier", label: "SUPPLIER", minWidth: 20 },
    { id: "location", label: "BRANCH", minWidth: 20 },
    { id: "company", label: "BUSINESS UNIT", minWidth: 20 },
    { id: "rname", label: "EMP. NAME", minWidth: 20 },
    { id: "designation", label: "DESIGNATION", minWidth: 20 },
    { id: "status", label: "STATUS", minWidth: 20 },
];

const request_columns = [
    { id: "prf_no", label: "RQST NO", minWidth: 20 },
    { id: "month", label: "MONTH", minWidth: 20 },
    { id: "created_at", label: "RQST DATE", minWidth: 20 },
    { id: "company", label: "BUSINESS UNIT", minWidth: 20 },
    { id: "details", label: "DESC", minWidth: 20 },
    { id: "process_by", label: "PROCESSED BY", minWidth: 20 },
    { id: "request_by", label: "REQUESTED BY", minWidth: 20 },
    { id: "location", label: "BRANCH", minWidth: 20 },
    { id: "due_term", label: "DUE TERMS", minWidth: 20 },
    { id: "due_date", label: "DUE DATE", minWidth: 20 },
    { id: "status", label: "STATUS", minWidth: 20 },
];

const Reports = () => {
    let currentYear = new Date().getFullYear();
    let year1 = currentYear - 1;
    let year2 = currentYear - 2;
    let year3 = currentYear - 3;
    let year4 = currentYear - 4;
    let today = new Date();
    today.setDate(today.getDate() - 15);
    let dtDate = new Date(today).toLocaleDateString();

    const [reportYear, setReportYear] = useState(new Date().getFullYear());
    const [fromDate, setFromDate] = useState(new Date(dtDate));
    const [toDate, setToDate] = useState(new Date());
    const [vtype, setVtype] = useState("prf");
    const [totalData, setTotalData] = useState(0);
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

    const [columns, setColumns] = useState(request_columns);
    const [statusReport, setStatusReport] = useState([
        { id: "name", label: "NAME", minWidth: 50 },
        { id: "pending", label: "OPEN", minWidth: 30 },
        { id: "onprocess", label: "PROCESSING", minWidth: 30 },
        { id: "onhold", label: "HOLD", minWidth: 30 },
        { id: "cancelled", label: "CANCELLED", minWidth: 30 },
        { id: "closed", label: "CLOSED", minWidth: 30 },
    ]);
    const [fullData, setFullData] = useState([]);
    const [processBy, setProcessBy] = useState([]);

    const [filterSearch, setFilterSearch] = useState([
        {
            company_id: "",
            status: "",
            process_by: "",
            supplier_id: "",
        },
    ]);

    const [reportData, setReportData] = useState([]);
    const [reportStatusData, setReportStatusData] = useState([]);

    function dataWithRelations(data) {
        let newData = [];
        let fData = [];
        let dterms = 7;
        let currentDate = new Date();
        setTotalData(data.length);
        data.map((o, i) => {
            let flagged = "";

            if (vtype == "prf") {
                let date = new Date(o.created_at);
                let udate = new Date(o.updated_at);
                let ddate = new Date(
                    date.setTime(date.getTime() + dterms * 86400000)
                );

                let due_date = ddate.toLocaleDateString();

                if (
                    (currentDate > ddate && o.status !== "closed") ||
                    udate > ddate
                ) {
                    flagged = "flagged";
                }
                if (i < 100) {
                    newData[i] = {
                        id: o.id,
                        status: o.status,
                        prf_no: o.prf_no,
                        company: o.company ? o.company.title : "",
                        process_by: o.process_by ? o.process_by.name : "",
                        request_by: o.profile.name,
                        location: o.location ? o.location.title : "",
                        month: date.toLocaleString("en-us", { month: "long" }),
                        details: o.details.replace(/(<([^>]+)>)/gi, " / "),
                        due_term: dterms,
                        cstatus: flagged,
                        due_date: due_date,
                        created_at: new Date(o.created_at).toLocaleDateString(),
                    };
                }

                fData[i] = {
                    PRFNo: o.prf_no,
                    Month: date.toLocaleString("en-us", { month: "long" }),
                    RQSTDATE: new Date(o.created_at).toLocaleDateString(),
                    Company: o.company ? o.company.title : "",
                    Description: o.details.replace(/(<([^>]+)>)/gi, " / "),
                    ProcessBy: o.process_by ? o.process_by.name : "",
                    RequestedBy: o.profile.name,
                    Location: o.location ? o.location.title : "",
                    DueTerm: dterms,
                    DueDate: due_date,
                    Flagged: flagged,
                    Status: o.status,
                };
            } else if (vtype == "lpo") {
                let prf = o.lpo.requests.prf_no;
                if (o.lpo.prf_extension) {
                    prf = prf + "-" + o.lpo.prf_extension;
                }

                let date = new Date(o.lpo.requests.created_at);
                let udate = new Date(o.lpo.updated_at);
                let ddate = new Date(
                    date.setTime(date.getTime() + dterms * 86400000)
                );

                if (
                    (currentDate > ddate && o.status !== "closed") ||
                    udate > ddate
                ) {
                    flagged = "flagged";
                }

                if (i < 100) {
                    newData[i] = {
                        id: o.id,
                        cstatus: flagged,
                        prf_date: new Date(
                            o.lpo.requests.created_at
                        ).toLocaleDateString(),
                        prf_no: prf,
                        month: date.toLocaleString("en-us", { month: "long" }),
                        created_at: new Date(
                            o.lpo.created_at
                        ).toLocaleDateString(),
                        lpo_no: o.lpo.lpo_no,
                        item: o.item,
                        specification: o.specification,
                        department: o.lpo.department
                            ? o.lpo.department.title
                            : "",
                        category: o.category ? o.category.title : "",
                        qty: o.qty,
                        unit_price: o.unit_price,
                        vat: o.vat,
                        total: o.lpo.total_amount,
                        supplier: o.lpo.supplier ? o.lpo.supplier.title : "",
                        location: o.lpo.requests
                            ? o.lpo.requests.location.title
                            : "",
                        company: o.lpo.company,
                        rname: o.lpo.requests
                            ? o.lpo.requests.profile.name
                            : "",
                        designation: o.lpo.requests.profile
                            ? o.lpo.requests.profile.designation
                            : "",
                        status: o.lpo.status,
                    };
                }

                fData[i] = {
                    RequestDate: new Date(
                        o.lpo.requests.created_at
                    ).toLocaleDateString(),
                    PRFNo: prf,
                    Month: date.toLocaleString("en-us", { month: "long" }),
                    LPODate: new Date(o.lpo.created_at).toLocaleDateString(),
                    LPONo: o.lpo.lpo_no,
                    Item: o.item,
                    Specification: o.specification,
                    Department: o.lpo.department ? o.lpo.department.title : "",
                    Category: o.category ? o.category.title : "",
                    Qty: o.qty,
                    UnitPrice: o.unit_price,
                    VAT: o.vat,
                    Total: o.lpo.total_amount,
                    Supplier: o.lpo.supplier ? o.lpo.supplier.title : "",
                    Location: o.lpo.requests
                        ? o.lpo.requests.location.title
                        : "",
                    Company: o.lpo.company,
                    RequestBy: o.lpo.requests
                        ? o.lpo.requests.profile.name
                        : "",
                    Designation: o.lpo.requests.profile
                        ? o.lpo.requests.profile.designation
                        : "",
                    Status: o.lpo.status,
                };
            } else if (vtype == "paf") {
                let date = new Date(o.created_at);
                let udate = new Date(o.updated_at);
                let ddate = new Date(
                    date.setTime(date.getTime() + dterms * 86400000)
                );

                if (
                    (currentDate > ddate && o.status !== "closed") ||
                    udate > ddate
                ) {
                    flagged = "flagged";
                }

                if (i < 100) {
                    newData[i] = {
                        id: o.id,
                        cstatus: flagged,
                        created_at: new Date(o.created_at).toLocaleDateString(),
                        paf_no: o.paf.paf_no,
                        month: date.toLocaleString("en-us", { month: "long" }),
                        lpo_date: new Date(
                            o.lpo.created_at
                        ).toLocaleDateString(),
                        lpo_no: o.lpo.lpo_no,
                        invoice_date: o.invoice_date,
                        supplier_invoice_num: o.supplier_invoice_num,
                        amount: o.amount,
                        item: o.description,
                        department: o.lpo.department.title, 
                        qty: o.qty,
                        unit_price: o.unit_price,
                        vat: o.vat,
                        total: o.total_amount,
                        supplier: o.paf.supplier.title,
                        location: o.location,
                        company: o.paf.company.title,
                        rname: o.paf.process_by.name,
                        designation: o.paf.process_by.designation,
                        status: o.paf.status,
                    };
                }
                fData[i] = {
                   
                    
                    PAFDate: new Date(o.created_at).toLocaleDateString(),
                    PAFNo: o.paf.paf_no,
                    Month: date.toLocaleString("en-us", { month: "long" }),
                    LPODate: new Date(
                        o.lpo.created_at
                    ).toLocaleDateString(),
                    LPONo: o.lpo.lpo_no,
                    InvDate: o.invoice_date,
                    InvNo: o.supplier_invoice_num,
                    InvAmnt: o.total_amount,
                    Item: o.description,
                    Department: o.lpo.department.title, 
                    Qty: o.qty,
                    UnitPrice: o.unit_price,
                    VAT: o.vat,
                    Total: o.total_amount,
                    Supplier: o.paf.supplier.title,
                    Location: o.location,
                    Company: o.paf.company.title,
                    ProcessBy: o.paf.process_by.name,
                    Designation: o.paf.process_by.designation,
                    Flagged: flagged,
                    status: o.paf.status,
                };
            }
        });

        setFullData(fData);
        setReportData(newData);
    }

    const downloadExcel = (e) => {
        e.preventDefault();
        const worksheet = XLSX.utils.json_to_sheet(fullData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        XLSX.writeFile(workbook, "Report.xlsx");
    };

    const handleType = (e) => {
        setReportData([]);
        if (e.target.value == "prf") {
            setColumns(request_columns);
        } else if (e.target.value == "lpo") {
            setColumns(lpo_columns);
        } else if (e.target.value == "paf") {
            setColumns(paf_columns);
        }

        setVtype(e.target.value);
    };

    const handleData = (e, type) => {
        let value = e.target.value;
        let objAssign = Object.assign([], filterSearch);

        if (type == "company") {
            objAssign[0].company_id = value;
        } else if (type == "status") {
            objAssign[0].status = value;
        } else if (type == "supplier") {
            objAssign[0].supplier_id = value;
        } else if (type == "processby") {
            objAssign[0].process_by = value;
        }
        setFilterSearch(objAssign);
    };

    const searchSubmit = (e) => {
        e.preventDefault();
        setTotalData(0);
        setReportData([]);

        let search = filterSearch[0];
        Object.keys(search).forEach((key) => {
            if (search[key] === "" || search[key] === "-") {
                delete search[key];
            }
        });

        let controller = "";
        if (vtype == "prf") {
            controller = "/v/report/prf";
        } else if (vtype == "lpo") {
            controller = "/v/report/lpo";
        } else if (vtype == "paf") {
            controller = "/v/report/paf";
        }

        let dateRange = { from: fromDate, to: toDate };

        search = { data: search, daterange: dateRange };
        API.post(controller, search).then((response) => {
            if (response.data) {
                let fetchItems = response.data.item;

                dataWithRelations(fetchItems);
            }
        });
    };

    const handleStatusReport = (e) => {
        let search = { year: reportYear };
        API.post("/v/report/statuses/counts", search).then((response) => {
            if (response.data) {
                let fetchItems = response.data.item;
                setReportStatusData(fetchItems);
            }
        });
    };

    useEffect(() => {
        API.get("/v/profile/procurements/list").then((response) => {
            if (response.data) {
                let get_first_name = [];
                response.data.item.map((o, i) => {
                    let first = o.name.split(" ");
                    get_first_name[i] = {
                        id: o.id,
                        user_id: o.user_id,
                        name: first[0],
                    };
                });
                setProcessBy(get_first_name);
            }
        });

        API.get("/v/suppliers/fetch-non-paginate").then((response) => {
            if (response.data) {
                setSupplier(response.data.item);
            }
        });

        API.get("/v/companies/fetch-non-paginate").then((response) => {
            let fetchItems = response.data.item;
            fetchItems = Object.assign([], fetchItems);

            setCompany(fetchItems);
        });
    }, []);

    return (
        <>
            <Stack
                sx={{ marginBottom: 2 }}
                direction={{ xs: "column", sm: "row" }}
            >
                <Box
                    sx={{ display: "flex", width: "100%" }}
                    className="report-page"
                >
                    <Box sx={{ display: "flex" }}>
                        <TextField
                            sx={{ m: 1, width: 90 }}
                            select
                            size="small"
                            label="Type"
                            onChange={(e) => handleType(e)}
                            SelectProps={{
                                native: true,
                            }}
                        >
                            <option value="prf"> PRF </option>
                            <option value="lpo"> LPO </option>
                            <option value="paf"> PAF </option>
                        </TextField>
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
                            label="Suppliers"
                            value={supplier.id}
                            onChange={(e) => handleData(e, "supplier")}
                            SelectProps={{
                                native: true,
                            }}
                        >
                            <option> - </option>
                            {supplier.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.title}
                                </option>
                            ))}
                        </TextField>

                        <TextField
                            sx={{ m: 1, width: 115 }}
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
                                <option
                                    key={option.user_id}
                                    value={option.user_id}
                                >
                                    {option.name}
                                </option>
                            ))}
                        </TextField>
                        <TextField
                            sx={{ m: 1, width: 120 }}
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
                        <LocalizationProvider
                            size="small"
                            dateAdapter={AdapterDateFns}
                        >
                            <Stack
                                sx={{ margin: "auto 0 !important;" }}
                                size="small"
                                spacing={3}
                            >
                                <MobileDatePicker
                                    label="From"
                                    value={fromDate}
                                    size="small"
                                    onChange={(newValue) => {
                                        setFromDate(newValue);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            className="filter-date"
                                        />
                                    )}
                                />
                            </Stack>
                        </LocalizationProvider>
                        <LocalizationProvider
                            size="small"
                            dateAdapter={AdapterDateFns}
                        >
                            <Stack
                                sx={{ margin: "auto 0 !important;" }}
                                size="small"
                                spacing={3}
                            >
                                <MobileDatePicker
                                    label="To"
                                    value={toDate}
                                    size="small"
                                    onChange={(newValue) => {
                                        setToDate(newValue);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            className="filter-date"
                                        />
                                    )}
                                />
                            </Stack>
                        </LocalizationProvider>
                    </Box>
                    <Box
                        sx={{
                            ml: "auto",
                            p: "2px 4px",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <IconButton
                            onClick={(e) => searchSubmit(e)}
                            sx={{ p: "10px" }}
                            aria-label="search"
                        >
                            <SearchIcon />
                        </IconButton>

                        <IconButton
                            onClick={(e) => downloadExcel(e)}
                            sx={{ p: "10px" }}
                            aria-label="search"
                            color="green"
                        >
                            <SimCardDownloadOutlinedIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Stack>
            <Box>
                <small>Showing maximum records of 100 only. </small>{" "}
                <small style={{ float: "right", marginRight: "20px" }}>
                    {"Total Record(s): " + totalData}
                </small>
            </Box>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <TableContainer sx={{ maxHeight: 620 }}>
                    <Table
                        stickyHeader
                        aria-label="sticky table"
                        className="report-table"
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
                            {reportData.map((row, index) => {
                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={row.id}
                                        className={row.cstatus}
                                    >
                                        {columns.map((column) => {
                                            const value = row[column.id];

                                            return (
                                                <TableCell key={column.id}>
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
            </Paper>
            <br />
            <Button
                size="small"
                sx={{ verticalAlign: "bottom", mb: 2 }}
                variant="contained"
                onClick={(e) => handleStatusReport(e)}
            >
                Show Data
            </Button>
            <TextField
                sx={{ m: 1, width: 120 }}
                select
                size="small"
                label="Year"
                value={reportYear}
                onChange={(e) => setReportYear(e.target.value)}
                SelectProps={{
                    native: true,
                }}
            >
                <option value={currentYear}> {currentYear} </option>
                <option value={year1}> {year1} </option>
                <option value={year2}> {year2} </option>
                <option value={year3}> {year3} </option>
                <option value={year4}> {year4} </option>
            </TextField>

            <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <TableContainer sx={{ maxHeight: 620 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {statusReport.map((column) => (
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
                            {reportStatusData &&
                                reportStatusData.map((row, index) => {
                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            tabIndex={-1}
                                            key={row.name}
                                        >
                                            {statusReport.map((column) => {
                                                const value = row[column.id];

                                                return (
                                                    <TableCell key={column.id}>
                                                        {
                                                            <span
                                                                className={
                                                                    value
                                                                }
                                                            >
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
                            {!reportStatusData ||
                                (reportStatusData.length == 0 && (
                                    <TableRow key="norecord">
                                        <TableCell key="no-record" colSpan="6">
                                            No record found.
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </>
    );
};

export default Reports;
