import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import MobileDatePicker from "@mui/lab/MobileDatePicker";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

function funcSetSupplier() {
    return {
        id: null,
        title: "",
        tax_no: "",
        address: "",
        contact_no: "",
        email: "",
    };
}

function funcSetCompany() {
    return {
        id: null,
        title: "",
        tax_no: "",
        contact_person: "",
        address: "",
        contact_no: "",
        email: "",
    };
}

function funcSetContactPerson() {
    return {
        id: null,
        contact_person: "",
        email: "",
    };
}

function funcSetPRF() {
    return {
        id: null,
        prf_no: "",
        department: "",
        location: "",
        request: "",
    };
}

function funcSetLPO() {
    return {
        id: null,
        lpo_no: "",
        department: "",
        location: "",
        supplier: "",
    };
}

function mapFilterData(array, selected) {
    let supp = array.map((sup) => {
        if (sup.id == selected) {
            return sup;
        }
    });

    supp = supp.filter((el) => {
        return el != null;
    });

    return supp[0];
}

const PafForm = () => {
    const defaultVat = 0.05; // 5% VAT
    const vatLabel = 5;

    // PAF HERE
    const [relation, setRelation] = useState("lpo");
    const [currency, setCurrency] = useState("AED");
    // End PAF

    const [dateValue, setDateValue] = useState(new Date().toLocaleDateString());
    const [prfDetails, setPrfDetails] = useState(funcSetPRF());
    const [lpoDetails, setLpoDetails] = useState(funcSetLPO());
    const [supplierDetails, setSupplierDetails] = useState(funcSetSupplier());
    const [companyDefault, setCompanyDefault] = useState(funcSetCompany());
    const [shippingCompany, setShippingCompany] = useState(funcSetCompany());
    const [contactPersonDefault, setContactPersonDefault] = useState(
        funcSetContactPerson()
    );

    const [supplierList, setSuppliers] = useState([
        {
            id: 1,
            title: "VRS",
            tax_no: "111111222222",
            address: "Planet Nemik",
            contact_no: "050565656",
            email: "tibor@gmail.com",
        },
        {
            id: 2,
            title: "Samsung",
            tax_no: "555555522222",
            address: "Planet Mars",
            contact_no: "3423424",
            email: "sho@gmail.com",
        },
    ]);

    const [employees, setEmployees] = useState([
        {
            id: 1,
            name: "Saleh Al Chalabi",
        },
        {
            id: 2,
            name: "Mahmoud Nahlawi",
        },
        {
            id: 3,
            name: "Ahmad Aboud",
        },
    ]);

    const [prfList, setPrfList] = useState([
        {
            id: 1,
            prf_no: "PRF-111111",
            department: "Ghassan Aboud Group FZE",
            location: "Jebel Ali - Warehoues",
            request:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque quis urna ac quam elementum elementum in quis nibh. Etiam iaculis, diam non aliquam aliquet, dui eros rutrum est, id porta nisl nisi iaculis lectus. Mauris sit amet finibus ex. Pellentesque nulla tortor, consectetur vel lectus a, posuere vehicula magna. Phasellus dictum augue eu consectetur gravida. Duis libero velit, tincidunt quis tempor nec, iaculis at erat. Vivamus ultricies nulla sed iaculis tempus. Nulla vitae facilisis augue, non gravida justo. Fusce risus dui, aliquam ut ipsum vel, sagittis faucibus magna. Aenean dictum porttitor enim, in eleifend mauris semper a. Integer eu lectus a eros pulvinar pulvinar vitae at arcu. Phasellus sed vehicula arcu, nec sollicitudin neque.",
        },
        {
            id: 2,
            prf_no: "PRF-222222",
            department: "Gallega",
            location: "Abu Dhabi - Kizad",
            request:
                "Fusce eget lectus id tortor egestas euismod. Nam lacinia consectetur pretium. Proin varius nisl erat, eu sollicitudin orci placerat ut. Aliquam erat volutpat. In eu tortor velit. Proin ornare libero arcu, eu faucibus velit lobortis id. Cras vitae pretium nibh. Cras et volutpat augue, gravida tincidunt metus. Nullam in mollis nunc. Quisque semper a sem quis aliquet. Pellentesque in nunc ligula. Aenean id volutpat tellus, efficitur euismod nulla.",
        },
        {
            id: 3,
            prf_no: "PRF-000111",
            department: "Ghassan Aboud New Cars",
            location: "Al Aweer - Showroom",
            request:
                "Curabitur lobortis volutpat libero sit amet blandit. Donec sed finibus magna, at volutpat dolor. Pellentesque et tempus lacus, sit amet hendrerit risus. Phasellus ut placerat lorem. Phasellus mi risus, tristique et dui nec, hendrerit pharetra magna. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Proin et hendrerit dolor. Suspendisse lobortis interdum felis, id vestibulum nisi imperdiet malesuada. Maecenas euismod mollis ligula, sed aliquet nisi fringilla non. Proin dapibus consectetur ex.",
        },
    ]);

    const [lpoList, setLpoList] = useState([
        {
            id: 1,
            lpo_no: "LPO-111111",
            department: "Ghassan Aboud Group FZE",
            location: "Jebel Ali - Warehoues",
            supplier: 1,
        },
        {
            id: 2,
            lpo_no: "LPO-222222",
            department: "Gallega",
            location: "Abu Dhabi - Kizad",
            supplier: 2,
        },
        {
            id: 3,
            lpo_no: "LPO-000111",
            department: "Ghassan Aboud New Cars",
            location: "Al Aweer - Showroom",
            supplier: 1,
        },
    ]);

    const [approvalLabelled, setApprovalLabelled] = useState([
        {
            id: 2,
            title: "Reviewed By",
        },
        {
            id: 3,
            title: "Verified By",
        },
        {
            id: 4,
            title: "Approved By",
        },
    ]);

    const [tableRows, setTableRows] = useState([
        {
            row: 0,
            category: "",
            item: "",
            specification: "",
            inv_date: new Date().toLocaleDateString(),
            qty: 1,
            uom: "",
            unit_price: 0,
            amount: 0,
            unit_vat: 0,
            total_amount: 0,
        },
    ]);

    const [approvalRows, setApprovalRows] = useState([
        {
            row: 0,
            approve_type: "",
            name: "",
        },
    ]);

    const [totalamount, setTotalamount] = useState(0);
    const [rowCount, setRowCount] = useState(1);
    const [rowCountApproval, setRowCountApproval] = useState(1);
    const [netamount, setNetAmount] = useState(0);

    const [discount, setDiscount] = useState(0);
    const [vat, setVat] = useState(0);
    const [supplier, setSupplier] = useState("");

    const [prfs, setPrfs] = useState("");
    const [lpo, setLpo] = useState("");
    // Data to be submit
    const [objData, setObjData] = useState(
        {
            rate: 1,
            paf_no: "",
            relation: "",
            relation_num: "",
            paf_date: "",
            dept_head: "",
            dept_name: "",
            requested_by: "",
            mode_of_payment: "",
            purchase_limit: 0,
            card_cash_limit: 0,
            document_no_1: "",
            document_no_2: "",
            supplier_name: "",
            payment_details: {},
            total_amount: 0,
            total_vat: 0,
            discount: 0,
            netamount: 0,
            remarks: "",
            remarks_amount_in_words: "",
            remarks_approval_limit_payment: "",
            remarks_finance_comments: ""
        }
    );

    const handleSupplier = (event) => {
        let selected = event.target.value;
        if (!selected) {
            setSupplierDetails(funcSetSupplier());
        } else {
            let supp = mapFilterData(supplierList, selected);

            setSupplierDetails(supp);
        }
        setSupplier(selected);
    };

    const handlePrf = (event) => {
        let selected = event.target.value;
        setPrfs(selected);
    };

    const handleLpo = (event) => {
        let selected = event.target.value;

        let supp = mapFilterData(lpoList, selected);
        let supplier = supp.supplier;
        console.log(supplier);
        setSupplier(supplier);
        setLpoDetails(supp);
        setLpo(selected);
    };

    const handleApproveType = (event, index) => {
        let selected = event.target.value;

        let tempRows = approvalRows.map((o, i) => {
            if (i == index) {
                o.approve_type = selected;
            }
            return o;
        });
        setApprovalRows(tempRows);
    };

    const handleApproveEmployee = (event, index) => {
        let selected = event.target.value;

        let tempRows = approvalRows.map((o, i) => {
            if (i == index) {
                o.name = selected;
            }
            return o;
        });
        setApprovalRows(tempRows);
    };

    const handleDateRow = (value, index) => {
        let tempRows = tableRows.map((o, i) => {
            if (i == index) {
                o.inv_date = value;
            }

            return o;
        });

        setTableRows(tempRows);
    };

    const handleCurrencyRate = (e, rate, totalAmnt, discount) => {
        let value = 1;  
        let newRate = { rate: 1 };
        
        if(e){
            value = e.target.value; 
            newRate = { rate: value };
        }else{
            value = rate;
            newRate = { rate: rate };
        }
         
        let amount = parseFloat(totalamount);
        if(totalAmnt){
            let totAmount = totalAmnt - discount;
            console.log("totalamount: ",totAmount);
            amount = parseFloat(totAmount);
            
        } 
        console.log("amount: ",amount);
        let newNetAmount = 0;
        
        if(!value && value <= 0){
            value = 1;
        } 
        
        newNetAmount = amount * value;
        Math.round(newNetAmount * 100) / 100;
       
        setObjData(newRate);
        setNetAmount(newNetAmount.toFixed(2));
        
    };

    const handleAddRow = () => {
        let totalRow = rowCount + 1;
        const newItem = {
            row: totalRow,
            category: "",
            item: "",
            inv_date: new Date().toLocaleDateString(),
            specification: "",
            qty: 1,
            uom: "",
            unit_price: 0,
            amount: 0,
            unit_vat: 0,
            total_amount: 0,
        };

        setRowCount(totalRow);
        setTableRows([...tableRows, newItem]);
    };

    const handleAddApproval = () => {
        let totalRow = rowCountApproval + 1;
        const newItem = {
            row: totalRow,
            approve_type: "",
            name: "",
        };

        setRowCountApproval(totalRow);
        setApprovalRows([...approvalRows, newItem]);
    };

    const calculateAmount = (e, index, type) => {
        let value = 0;

        if (e != "removedrow") {
            value = e.target.value;
        }

        let netAmountz = 0;
        let curDiscount = 0;
        let totalVat = 0;
        let tempRows = tableRows.map((o, i) => {
           
            if (type == "qty") {
                let amount = o.unit_price;
                if (i == index) {
                    if (!amount) {
                        amount = 0;
                    }
                    o.amount = (value * amount).toFixed(2);
                    o.qty = value;
                    o.total_amount = (parseFloat(o.amount) + parseFloat(defaultVat)).toFixed(2);
                }
            } else if (type == "price") {
                let qty = o.qty;
                if (i == index) {
                    if (!qty) {
                        qty = 1;
                    }
                    
                    let totalAmountz = value * qty;
                    let getVat = totalAmountz * defaultVat;
                    o.amount = totalAmountz.toFixed(2);
                   
                    o.unit_vat = getVat.toFixed(2);
                    o.total_amount = (totalAmountz + getVat).toFixed(2);
                    o.unit_price = value;
                }
            } else if (type == "vat") {
                let amount = o.amount;

                if (i == index) {
                    if (!value) {
                        value = 0;2
                    }
                    o.unit_vat = value;
                    let totalAmountz = parseFloat(amount) + parseFloat(value);

                    o.total_amount = totalAmountz.toFixed(2);
                }
            }

            totalVat += parseFloat(o.unit_vat);
            netAmountz += parseFloat(o.total_amount);

            return o;
        });

        if (type == "discount") {
            setDiscount(value);
            curDiscount = value;
        } else {
            curDiscount = discount;
        }

        if (netAmountz < 0) {
            netAmountz = 0;
        } else {
            netAmountz = Math.round(netAmountz * 100) / 100;
        }
        let totalAmnt = netAmountz.toFixed(2);
        setTotalamount(totalAmnt);

        setVat(totalVat.toFixed(2));

        netAmountz = netAmountz - curDiscount;
        netAmountz = Math.round(netAmountz * 100) / 100;

        if (netAmountz < 0) {
            netAmountz = 0;
        }

        setNetAmount(netAmountz.toFixed(2));
        setTableRows(tempRows);
        if(currency == "USD"){
             handleCurrencyRate(null, objData.rate, totalAmnt, curDiscount);
        } 
    };

    const handleRemoveRow = (index) => {
        let rows = tableRows;
        rows.splice(index, 1);
        setTableRows([...rows]);

        calculateAmount("removedrow");
    };

    const handleRemoveApprovalRow = (index) => {
        let rows = approvalRows;
        rows.splice(index, 1);
        setApprovalRows([...rows]);
    };

    const handleCurrency = (e) => {
       
        let selected = e.target.value; 
        setCurrency(selected);
        console.log(netamount);
        if(selected == "AED"){
           
            handleCurrencyRate(null, 1, totalamount, discount);
        } 
    };

    const handleSubmitForm = () => {
        console.log("Form submitted");
    };

    const handleRelation = (e) => {
        setRelation(e.target.value);
        setSupplier("");
        if (e.target.value == "prf") {
            setLpo("");
        } else {
            setPrfs("");
        }
    }; 

    return (
        <Paper sx={{ px: 3, py: 3 }}>
            <Box sx={{ flexGrow: 1 }} className="paf-form">
                <Box
                    component="form"
                    sx={{
                        "& .MuiTextField-root": { mx: 1, width: "90%" },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <Grid
                        container
                        spacing={2} 
                        sx={{ borderBottom: "1px solid #cecece", pb: 1, mb: 1, py: 3 }}
                    >
                        <Grid item xs={12} md={12}>
                            <small style={{ color: "red" }}>
                                RELATION: IF THERE IS LPO, SELECT LPO. OTHERWISE
                                SELECT PRF.
                            </small>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            SELECT RELATION (LPO/PRF)*
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                select
                                size="small"
                                required
                                label="LPO/PRF"
                                value={relation}
                                onChange={(e) => handleRelation(e)}
                                SelectProps={{
                                    native: true,
                                }}
                            >
                                <option value="lpo"> LPO </option>
                                <option value="prf"> PRF </option>
                            </TextField>
                        </Grid>
                        {relation == "prf" && (
                            <>
                                <Grid item xs={12} md={2}>
                                    PRF NO.
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        select
                                        size="small"
                                        label="PRF No."
                                        value={prfs}
                                        onChange={(e) => handlePrf(e)}
                                        SelectProps={{
                                            native: true,
                                        }}
                                    >
                                        <option value=""> - </option>
                                        {prfList.map((option) => (
                                            <option
                                                key={option.id}
                                                value={option.id}
                                            >
                                                {option.prf_no}
                                            </option>
                                        ))}
                                    </TextField>
                                </Grid>
                            </>
                        )}
                        {relation == "lpo" && (
                            <>
                                <Grid item xs={12} md={2}>
                                    LPO NO.
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        select
                                        size="small"
                                        label="LPO No."
                                        value={lpo}
                                        onChange={(e) => handleLpo(e)}
                                        SelectProps={{
                                            native: true,
                                        }}
                                    >
                                        <option value=""> - </option>
                                        {lpoList.map((option) => (
                                            <option
                                                key={option.id}
                                                value={option.id}
                                            >
                                                {option.lpo_no}
                                            </option>
                                        ))}
                                    </TextField>
                                </Grid>
                            </>
                        )}

                        <Grid item xs={12} md={2}>
                            PAF NO.
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                label="AUTO GENERATE"
                                size="small"
                                variant="outlined"
                                disabled
                            />
                        </Grid>

                        <Grid item xs={12} md={2}>
                            PAF DATE
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                label="Date"
                                size="small"
                                variant="outlined"
                                value={dateValue}
                            />
                        </Grid>

                        <Grid item xs={12} md={2}>
                            REQUESTED BY
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                label="Name"
                                size="small"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            DEPARTMENT HEAD NAME
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                size="small"
                                variant="outlined"
                                value="Saleh Al Chalabi"
                            />
                        </Grid>

                        <Grid item xs={12} md={2}>
                            DEPARTMENT NAME
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                size="small"
                                variant="outlined"
                                value="PROCUREMENT"
                            />
                        </Grid>

                        <Grid item xs={12} md={2}>
                            MODE OF PAYMENT
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                size="small"
                                variant="outlined"
                                 
                            />
                        </Grid>

                        <Grid item xs={12} md={2}>
                            PURCHASE LIMIT
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                size="small"
                                variant="outlined"
                                 
                            />
                        </Grid>

                        <Grid item xs={12} md={2}>
                            CASH/CREDIT CARD LIMIT
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                size="small"
                                variant="outlined"
                                
                            />
                        </Grid>

                        <Grid item xs={12} md={2}>
                            DOCUMENT NO. (FOR ACCOUNTS)
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                size="small"
                                variant="outlined"
                                value=""
                            />
                        </Grid>

                        <Grid item xs={12} md={2}>
                            DOCUMENT NO. (FOR ACCOUNTS)
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                size="small"
                                variant="outlined"
                                value=""
                            />
                        </Grid>

                        <Grid item xs={12} md={2}>
                            SUPPLIER NAME
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                select
                                size="small"
                                label="Supplier"
                                value={supplier}
                                onChange={(e) => handleSupplier(e)}
                                SelectProps={{
                                    native: true,
                                }}
                            >
                                <option value=""> - </option>
                                {supplierList.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.title}
                                    </option>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>
                    {/* Table - Items */}
                    <Grid container spacing={2} sx={{ py: 3 }}>
                        <Grid item md={12}>
                            <Button
                                id="addBtn"
                                variant="contained"
                                onClick={() => handleAddRow()}
                            >
                                ADD
                            </Button>
                            <TextField
                                select
                                size="small"
                                label="Currency"
                                value={currency}
                                onChange={(e) => handleCurrency(e)}
                                sx={{
                                    width: "90px !important;",
                                    marginTop: "0 !important",
                                    marginLeft: "20px !important",
                                }}
                                SelectProps={{
                                    native: true,
                                }}
                            >
                                <option value="AED"> AED </option>
                                <option value="USD"> USD </option>
                            </TextField>
                        </Grid>
                        <TableContainer sx={{ maxHeight: 600 }}>
                            <Table
                                stickyHeader
                                aria-label="a dense table"
                                className="dense-table"
                            >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>LOCATION</TableCell>
                                        <TableCell>SUPPLIER INVOICE#</TableCell>
                                        <TableCell>DESCRIPTION</TableCell>
                                        <TableCell>INVOICE DATE</TableCell>
                                        <TableCell>QTY</TableCell>
                                        <TableCell>UNIT PRICE</TableCell>
                                        <TableCell>TOTAL AMOUNT</TableCell>
                                        <TableCell>{vatLabel}% VAT</TableCell>
                                        <TableCell>
                                            TOTAL AMOUNT ({currency})
                                        </TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tableRows.map((row, index) => {
                                        return (
                                            <TableRow
                                                id={`row-${row.row}`}
                                                key={row.row}
                                            >
                                                <TableCell
                                                    sx={{ px: "0 !important" }}
                                                >
                                                    <TextField
                                                        label="Location"
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell
                                                    sx={{ px: "0 !important" }}
                                                >
                                                    <TextField
                                                        label=""
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell
                                                    sx={{ px: "0 !important" }}
                                                >
                                                    <TextField
                                                        label="Specification"
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell
                                                    sx={{ px: "0 !important" }}
                                                    className="row-date-picker"
                                                >
                                                    <LocalizationProvider
                                                        dateAdapter={
                                                            AdapterDateFns
                                                        }
                                                    >
                                                        <MobileDatePicker
                                                            label="Date"
                                                            size="small"
                                                            variant="outlined"
                                                            inputFormat="MM/dd/yyyy"
                                                            value={row.inv_date}
                                                            onChange={(e) =>
                                                                handleDateRow(
                                                                    e,
                                                                    index
                                                                )
                                                            }
                                                            sx={{
                                                                padding:
                                                                    "8.5px 14px!important",
                                                            }}
                                                            renderInput={(
                                                                params
                                                            ) => (
                                                                <TextField
                                                                    {...params}
                                                                />
                                                            )}
                                                        />
                                                    </LocalizationProvider>
                                                </TableCell>
                                                <TableCell
                                                    sx={{ px: "0 !important" }}
                                                >
                                                    <TextField
                                                        type="number"
                                                        label="Qty"
                                                        size="small"
                                                        value={row.qty}
                                                        required
                                                        onChange={(e) =>
                                                            calculateAmount(
                                                                e,
                                                                index,
                                                                "qty"
                                                            )
                                                        }
                                                        variant="outlined"
                                                        name="qty"
                                                        sx={{
                                                            width: "50px !important",
                                                        }}
                                                    />
                                                </TableCell>

                                                <TableCell
                                                    sx={{
                                                        padding: "0 !important",
                                                        px: "0 !important",
                                                    }}
                                                >
                                                    <TextField
                                                        type="number"
                                                        label="Unit Price"
                                                        size="small"
                                                        name="unit_price"
                                                        variant="outlined"
                                                        onKeyUp={(e) =>
                                                            calculateAmount(
                                                                e,
                                                                index,
                                                                "price"
                                                            )
                                                        }
                                                        sx={{
                                                            width: "100px !important",
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell
                                                    sx={{
                                                        padding: "0 !important",
                                                    }}
                                                >
                                                    <TextField
                                                        disabled
                                                        size="small"
                                                        value={row.amount}
                                                        variant="outlined"
                                                        sx={{
                                                            width: "100px !important",
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell
                                                    sx={{
                                                        padding: "0 !important",
                                                    }}
                                                >
                                                    <TextField
                                                        size="small"
                                                        type="number"
                                                        value={
                                                            "" || row.unit_vat
                                                        }
                                                        variant="outlined"
                                                        onChange={(e) =>
                                                            calculateAmount(
                                                                e,
                                                                index,
                                                                "vat"
                                                            )
                                                        }
                                                        sx={{
                                                            width: "100px !important",
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell
                                                    sx={{
                                                        padding: "0 !important",
                                                    }}
                                                >
                                                    <TextField
                                                        disabled
                                                        size="small"
                                                        value={row.total_amount}
                                                        variant="outlined"
                                                        sx={{
                                                            width: "100px !important",
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell
                                                    sx={{
                                                        padding: "0 !important",
                                                    }}
                                                >
                                                    <IconButton
                                                        onClick={() =>
                                                            handleRemoveRow(
                                                                index
                                                            )
                                                        }
                                                        className="remove"
                                                        color="inherit"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>

                    {/* Remarks - Net Amount */}
                    <Grid container spacing={2} sx={{ pb: 3 }}>
                        <Grid item xs={12} md={12}>
                            <Grid container spacing={2} sx={{ py: 3 }}>
                                <Grid item xs={12} md={8}>
                                    <Grid container spacing={2} sx={{ py: 3 }}>
                                        <Grid item xs={12} md={12}>
                                            <TextareaAutosize
                                                aria-label="minimum height"
                                                minRows={12}
                                                maxRows={15}
                                                placeholder="Remarks"
                                                style={{
                                                    width: "90%",
                                                    border: "1px solid #cecece",
                                                    padding: 10,
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Grid container spacing={2} sx={{ py: 3 }}>
                                        <Grid item xs={12} md={4}>
                                            Total
                                        </Grid>
                                        <Grid item xs={12} md={8}>
                                            <TextField
                                                size="small"
                                                label="Total"
                                                variant="outlined"
                                                disabled
                                                value={totalamount}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            Total VAT
                                        </Grid>
                                        <Grid item xs={12} md={8}>
                                            <TextField
                                                value={vat}
                                                size="small"
                                                disabled
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            Discount
                                        </Grid>
                                        <Grid item xs={12} md={8}>
                                            <TextField
                                                label="Discount"
                                                size="small"
                                                type="number"
                                                variant="outlined"
                                                margin="dense"
                                                onKeyUp={(e) =>
                                                    calculateAmount(
                                                        e,
                                                        null,
                                                        "discount"
                                                    )
                                                }
                                            />
                                        </Grid>
                                       
                                        {currency == "USD" && (
                                            <>
                                                <Grid item xs={4} md={4}>
                                                USD TO AED
                                                </Grid>
                                                <Grid item xs={8} md={8}>
                                                    <TextField 
                                                        size="small" 
                                                        type="number"
                                                        dense
                                                        variant="outlined"
                                                        value={objData.rate}
                                                        onChange={(e) =>
                                                            
                                                            handleCurrencyRate( e )
                                                        }
                                                    />
                                                </Grid>
                                            </>
                                        )}
                                        <Grid item xs={12} md={4}>
                                            Net Amount
                                        </Grid>
                                        <Grid item xs={12} md={8}>
                                            <TextField
                                                value={netamount}
                                                size="small"
                                                disabled
                                                variant="outlined"
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Remarks */}
                    <Grid container spacing={2} sx={{ pb: 3 }}>
                        <Grid item xs={12} md={2}>
                            AMOUNT IN WORDS
                        </Grid>
                        <Grid item xs={12} md={10}>
                            <TextField
                                label=""
                                size="small"
                                variant="outlined"
                                className="full-width"
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            APPROVALS LIMIT FOR PAYMENT
                        </Grid>
                        <Grid item xs={12} md={10}>
                        <TextField
                                className="full-width"
                                label=""
                                size="small"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            FINANCE COMMENTS
                        </Grid>
                        <Grid item xs={12} md={10}>
                            <TextField
                                className="full-width"
                                label=""
                                size="small"
                                variant="outlined"
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{ mb:2, backgroundColor: "#cecece", textAlign: "center"}}>
                    <FormControl> 
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                        >
                            <FormControlLabel value="1" control={<Radio />} label="BUDGETED" />
                            <FormControlLabel value="2" control={<Radio />} label="NOT BUDGETED" />
                            
                        </RadioGroup>
                        </FormControl>
                    </Box>

                    {/* Approval Setup */}
                    <Grid
                        container
                        spacing={2}
                        sx={{ py: 2}}
                    >
                        <Grid item md={12}>
                            <Button
                                id="addBtn"
                                variant="contained"
                                onClick={() => handleAddApproval()}
                                sx={{ mr: 2 }}
                            >
                                ADD
                            </Button>
                            APPROVAL SETUP
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TableContainer sx={{ maxHeight: 600 }}>
                                <Table
                                    stickyHeader
                                    aria-label="a dense table"
                                    className="dense-table"
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>S/N</TableCell>
                                            <TableCell>Title</TableCell>
                                            <TableCell>Name</TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>1</TableCell>
                                            <TableCell>Prepared By</TableCell>
                                            <TableCell>Steve Ayala</TableCell>
                                        </TableRow>
                                        {approvalRows.map((row, index) => {
                                            return (
                                                <TableRow
                                                    id={`row-${row.row}`}
                                                    key={row.row + index}
                                                >
                                                    <TableCell>
                                                        {index + 2}
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            padding:
                                                                "0 !important",
                                                        }}
                                                    >
                                                        <TextField
                                                            select
                                                            size="small"
                                                            label="Approval Type"
                                                            name="approve_type"
                                                            value={
                                                                row.approve_type
                                                            }
                                                            onChange={(e) =>
                                                                handleApproveType(
                                                                    e,
                                                                    index
                                                                )
                                                            }
                                                            SelectProps={{
                                                                native: true,
                                                            }}
                                                        >
                                                            <option value="">
                                                                -
                                                            </option>
                                                            {approvalLabelled.map(
                                                                (option) => (
                                                                    <option
                                                                        key={
                                                                            option.id
                                                                        }
                                                                        value={
                                                                            option.id
                                                                        }
                                                                    >
                                                                        {
                                                                            option.title
                                                                        }
                                                                    </option>
                                                                )
                                                            )}
                                                        </TextField>
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            select
                                                            size="small"
                                                            label="Approval"
                                                            name="employee"
                                                            value={row.name}
                                                            onChange={(e) =>
                                                                handleApproveEmployee(
                                                                    e,
                                                                    index
                                                                )
                                                            }
                                                            SelectProps={{
                                                                native: true,
                                                            }}
                                                        >
                                                            <option value="">
                                                                -
                                                            </option>
                                                            {employees.map(
                                                                (option) => (
                                                                    <option
                                                                        key={
                                                                            option.id
                                                                        }
                                                                        value={
                                                                            option.id
                                                                        }
                                                                    >
                                                                        {
                                                                            option.name
                                                                        }
                                                                    </option>
                                                                )
                                                            )}
                                                        </TextField>
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            padding:
                                                                "0 !important",
                                                        }}
                                                    >
                                                        <IconButton
                                                            onClick={() =>
                                                                handleRemoveApprovalRow(
                                                                    index
                                                                )
                                                            }
                                                            className="remove"
                                                            color="inherit"
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid> 

                    <Grid container spacing={2} sx={{ py: 2 }}>
                        <Grid item md={12}>
                            <Button
                                id="addBtn"
                                variant="contained"
                                color="secondary"
                                onClick={() => handleSubmitForm()}
                            >
                                SUBMIT FORM
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Paper>
    );
};

export default PafForm;
