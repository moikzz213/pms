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
import API from "../../services/api.js";
import AddIcon from "@mui/icons-material/Add";

const columns = [
    { id: "status", label: "STATUS", minWidth: 20 },
    { id: "paf_no", label: "PAF NO.", minWidth: 30 },
    { id: "lpo_no", label: "LPO NO.", minWidth: 30 },
    { id: "invoice_no", label: "INV NO.", minWidth: 30 },
    { id: "invoice_date", label: "INV Date", minWidth: 30 },
    { id: "net_amount", label: "INV AMNT(AED)", minWidth: 30 },
    { id: "company", label: "Business Unit", minWidth: 50 },
    { id: "supplier", label: "Supplier", minWidth: 50 },
    { id: "process_by", label: "PROCESSED BY", minWidth: 50 },
    { id: "created_at", label: "Date", minWidth: 20 },
]; 

const Pafs = () => { 

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
        }
    ]);

    const [pafData, setPafData] = useState([
        {
            id: null,
            status: "",
            lpo_no: "",
            paf_no: "",
            company: "",
            supplier: "",
            process_by: "", 
            created_at: "",
        },
    ]);

    function fetchRequests() {
        API.get("/v/payment-approval-form/fetch/?page=" + page)
            .then((response) => {
                let fetchItems = response.data.item;
                console.log(fetchItems.data);
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
        console.log(data);
        data.map((o, i) => {
            let lpo = "";
            if( o.lpo_num ){
                lpo = o.lpo_num.lpo_no;
            }else if(o.request_id){
                lpo = o.requests.prf_no
            }

            newData[i] = {
                id: o.id,
                status: o.status,
                lpo_no: lpo,
                paf_no: o.paf_no,
                net_amount: o.net_amount,
                supplier: o.supplier ? o.supplier.title : "",
                company:o.company ? o.company.title : "",
                process_by: o.process_by ? o.process_by.name : "",
                created_at: new Date(o.created_at).toLocaleDateString(),
            };
        });

        setPafData(newData);
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

    const handleData = (e, type) => {
        let value = e.target.value;

        let objAssign = Object.assign([], filterSearch);
        
        if(type == "company"){
            objAssign[0].company_id = value
        }else if(type == "status"){
            objAssign[0].status = value
        }else if(type == "supplier"){
            objAssign[0].supplier_id = value
        }else if(type == "processby"){
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
        API.post("/v/payment-approval-form/filter/search", search).then((response) => {
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
            navigate("id/" + e.id);
        }
    };

    useEffect(() => {
        fetchRequests();
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
            axiosFunction("/v/payment-approval-form/search/" + e.target.value);
        } else if (e.target.value.length == 0) {
            axiosFunction("/v/payment-approval-form/search/-");
        }
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
                            {pafData.map((row, index) => {
                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={row.paf_no}
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

export default Pafs;
