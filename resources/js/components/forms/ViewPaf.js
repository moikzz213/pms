import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import MobileDatePicker from "@mui/lab/MobileDatePicker";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import API from "../../services/api.js"; 
function approvalLabelled(label){
    if(label == 'prepared_by'){
        return "Prepared By";
    }else if(label == 'reviewed_by'){
       return "Reviewed By";
    }else if(label == 'verified_by'){
        return "Verified By";
    }else if(label == 'approved_by'){ 
        return "Approved By";
    } 
}
const ViewPaf = ({ id }) => { 

    const [logo, setLogo] = useState("");
    const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState({
        title: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        } 
        setOpen(false);
    };
    
    const [approvals, setApprovals] = useState([]);
    const [items, setItems] = useState({});

    useEffect(() => {
        let fetchApprovals = [];
        setApprovals(fetchApprovals);

        API.get("/v/payment-approval-form/fetch/" + id).then((response) => {
            let fetchItems = response.data.item;
            console.log(fetchItems);
            setItems(fetchItems);
            let img = "";
            if( fetchItems.company && (fetchItems.company).toLowerCase().includes("aboud group")){
                img = "/logo/gag.png";
            }else if( fetchItems.company && (fetchItems.company).toLowerCase().includes("gallega")){
                img = "/logo/gallega.png";
            }else if( fetchItems.company && (fetchItems.company).toLowerCase().includes("buygro")){
                img = "/logo/buygro.png";
            }else if( fetchItems.company && (fetchItems.company).toLowerCase().includes("catering")){
                img = "/logo/catering.png";
            }else if( fetchItems.company && (fetchItems.company).toLowerCase().includes("crystal")){
                img = "/logo/crystalbrook.png";
            }else if( fetchItems.company && (fetchItems.company).toLowerCase().includes("news")){
                img = "/logo/orient.png";
            }else if( fetchItems.company && (fetchItems.company).toLowerCase().includes("cars")){
                img = "/logo/gac.png";
            }else if( fetchItems.company && (fetchItems.company).toLowerCase().includes("gaelan")){
                img = "/logo/gaelan.png";
            }else if( fetchItems.company && (fetchItems.company).toLowerCase().includes("point")){
                img = "/logo/livepoint.png";
            }else if( fetchItems.company && (fetchItems.company).toLowerCase().includes("training")){
                img = "/logo/otc.png";
            }else if( fetchItems.company && (fetchItems.company).toLowerCase().includes("supermarket")){
                img = "/logo/supermarket.png";
            }else if( fetchItems.company && (fetchItems.company).toLowerCase().includes("olive")){
                img = "/logo/olive.png";
            }
            
            setLogo(img);

            let approvals = [];
            fetchItems.paf_approvals.map((o,i) =>{
                approvals[i] ={
                    id: o.user_id,
                    name: o.users.profile.name,
                    designation: o.users.profile.designation,
                    type: approvalLabelled(o.approval_type),
                }
            });
            setApprovals(approvals);
        });
    }, []);

    const [invoice_date, setInvoiceDate] = useState(
        new Date().toLocaleDateString()
    );
    
    const handleDateRow = (e) => {
        setInvoiceDate(e);
    };
    useEffect(() => {
        let fetchApprovals = [
            {
                id: 1,
                name: "Marie Campos",
                designation: "Procurement Coordinator",
                type: "Prepared By",
            },
            {
                id: 2,
                name: "Leslie Columna",
                designation: "IT Supervisor",
                type: "Verified By",
            },
            {
                id: 3,
                name: "Saleh Al Chalabi",
                designation: "Procurement Supervisor",
                type: "Approved By",
            },
            {
                id: 4,
                name: "Evangelos Kalamatianos",
                designation: "GM - Facilities & Projects",
                type: "Approved By",
            },
            {
                id: 5,
                name: "Mahmoud Nahlawi",
                designation: "Group GM - IT",
                type: "Approved By",
            },
            {
                id: 6,
                name: "Santosh Shetty",
                designation: "Chief Information Officer",
                type: "Approved By",
            },
            {
                id: 7,
                name: "Santosh Shetty",
                designation: "Chief Information Officer",
                type: "Approved By",
            },
            {
                id: 8,
                name: "Santosh Shetty",
                designation: "Chief Information Officer",
                type: "Approved By",
            },
        ];
        setApprovals(fetchApprovals);
    }, []);
    return (
        <Paper sx={{ px: 3, py: 3 }}>
            <Box sx={{ flexGrow: 1 }} className="paf-table">
                <Box
                    sx={{
                        "& .MuiTextField-root": { m: 1, width: "90%" },
                    }}
                >
                    <Grid container spacing={2}>
                        <Grid
                            item
                            sm={8}
                            xs={8}
                            md={8}
                            sx={{ display: "flex" }}
                        >
                            <img
                                src="/logo/GAG.png"
                                srcSet="/logo/GAG.png"
                                alt="Logo"
                                loading="lazy"
                                className="paf-logo"
                            />

                            <h5 className="ma-0 paf-title">
                                GHASSAN ABOUD GROUP FZE
                            </h5>
                        </Grid>

                        <Grid
                            item
                            md={4}
                            sm={4}
                            xs={4}
                            sx={{ textAlign: "right" }}
                            className="table-paf-no"
                        >
                            <Button
                                className="btn-cancel"
                                variant="contained"
                                color="red"
                                size="small"
                                sx={{ mr: 1 }}
                            >
                                CANCEL PAF
                            </Button>
                            <Button
                                className="btn-cancel"
                                variant="contained"
                                color="orange"
                                size="small"
                                sx={{ mr: 1 }}
                            >
                                ON PROCESSED
                            </Button>
                            <Button
                                className="btn-cancel"
                                variant="contained" 
                                size="small"
                                sx={{ mr: 1 }}
                            >
                                ON HOLD
                            </Button>

                            <div>PAYMENT APPROVAL FORM (PAF)</div>
                            <table
                                className="normal-table table-small "
                                cellSpacing="0"
                            >
                                <tbody>
                                    <tr>
                                        <th>PAF NO.</th>
                                        <th>32386</th>
                                    </tr>
                                    <tr>
                                        <th>VOUCHER DATE</th>
                                        <th>06-APR-2022</th>
                                    </tr>
                                </tbody>
                            </table>
                        </Grid>
                        <Grid item md={6} sx={{ paddingTop: "0 !important" }}>
                            <table
                                className="normal-table table-small"
                                cellSpacing="0"
                            >
                                <tbody>
                                    <tr>
                                        <th width="250">REQUESTED BY</th>
                                        <th>STEVE AYALA</th>
                                    </tr>
                                    <tr>
                                        <th>DEPARTMENT NAME</th>
                                        <th>PROCUREMENT</th>
                                    </tr>
                                    <tr>
                                        <th>PURCHASE LIMIT</th>
                                        <th>100000</th>
                                    </tr>
                                    <tr>
                                        <th>DOCUMENT NO. (FOR ACCOUNTS)</th>
                                        <th></th>
                                    </tr>
                                </tbody>
                            </table>
                        </Grid>
                        <Grid item md={6} sx={{ paddingTop: "0!important" }}>
                            <table
                                className="normal-table table-small"
                                cellSpacing="0"
                            >
                                <tbody>
                                    <tr>
                                        <th width="250">
                                            DEPARTMENT HEAD NAME
                                        </th>
                                        <th>SALEH AL CHALABI</th>
                                    </tr>
                                    <tr>
                                        <th>MODE OF PAYMENT</th>
                                        <th></th>
                                    </tr>
                                    <tr>
                                        <th>CASH/CARD LIMIT</th>
                                        <th></th>
                                    </tr>
                                    <tr>
                                        <th>DOCUMENT NO (FOR ACCOUNTS)</th>
                                        <th></th>
                                    </tr>
                                </tbody>
                            </table>
                        </Grid>
                    </Grid>
                    {/* Table - Items */}
                    <Grid container spacing={2} sx={{ py: 3 }}>
                        <Grid item md={12} sm={12} xs={12}>
                            <table
                                className="normal-table table-small"
                                cellSpacing="0"
                            >
                                <thead>
                                    <tr>
                                        <th
                                            className="text-center"
                                            style={{ width: 50 }}
                                        >
                                            SR #
                                        </th>
                                        <th className="text-center">
                                            SUPPLIER NAME
                                        </th>
                                        <th className="text-center">
                                            LOCATION
                                        </th>
                                        <th className="text-center">
                                            SUPPLIER INVOICE #
                                        </th>
                                        <th className="text-center paf-description">
                                            DESCRIPTION
                                        </th>
                                        <th
                                            className="text-center"
                                            style={{ minWidth: 100 }}
                                        >
                                            INVOICE DATE
                                        </th>
                                        <th
                                            className="text-center"
                                            style={{ width: 50 }}
                                        >
                                            QTY
                                        </th>
                                        <th
                                            className="text-center"
                                            style={{ width: 70 }}
                                        >
                                            UNIT PRICE
                                        </th>
                                        <th className="text-center">
                                            TOTAL AMOUNT
                                        </th>
                                        <th className="text-center">VAT 5%</th>
                                        <th
                                            className="text-center"
                                            style={{ width: 150 }}
                                        >
                                            TOTAL AMOUNT IN USD
                                        </th>
                                    </tr>
                                </thead>
                                <tbody> 
                                    {items.paf_items &&
                                        items.paf_items.map((row, index) => {
                                            return (
                                                <tr key={row.id} rowSpan={index < items.paf_items.length-1  ? items.paf_items.length : ""}>
                                                    <td className="text-center">
                                                        {index + 1}
                                                    </td>
                                                    <td className="text-center">
                                                      Test
                                                    </td>
                                                    <td className="text-center">
                                                        {row.specification}
                                                    </td>
                                                    <td className="text-center">
                                                        {row.qty}
                                                    </td>
                                                    <td className="text-center">
                                                        {row.uom}
                                                    </td>
                                                    <td className="text-right">
                                                        {row.unit_price}
                                                    </td>
                                                    <td className="text-right">
                                                        {row.unit_price ? (
                                                            row.qty *
                                                            row.unit_price
                                                        ).toFixed(2) : ''}
                                                    </td>
                                                    <td className="text-center"></td>
                                                    <td className="text-center"></td>
                                                    <td className="text-center"></td>
                                                    <td className="text-center"></td>
                                                </tr>
                                            );
                                        })}
                                   
                                </tbody>
                            </table>
                        </Grid>
                    </Grid>

                    {/* Remarks - Net Amount */}
                    <Grid container spacing={2} sx={{ pb: 3 }}>
                        <Grid item md={12} xs={12}>
                            <table
                                className="normal-table table-small"
                                cellSpacing="0"
                            >
                                <tbody>
                                    <tr>
                                        <td width="70%"></td>
                                        <td style={{ padding: 0, margin: 0 }}>
                                            <table width="100%" cellSpacing="0">
                                                <tbody>
                                                    <tr>
                                                        <td
                                                            className="text-right"
                                                            width="60%"
                                                        >
                                                            TOTAL
                                                        </td>
                                                        <td
                                                            className="text-right"
                                                            width="40%"
                                                        >
                                                            106.43
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td
                                                            className="text-right"
                                                            width="60%"
                                                        >
                                                            DISCOUNT
                                                        </td>
                                                        <td
                                                            className="text-right"
                                                            width="40%"
                                                        >
                                                            106.43
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td
                                                            className="text-right"
                                                            width="60%"
                                                        >
                                                            TOTAL VAT
                                                        </td>
                                                        <td
                                                            className="text-right"
                                                            width="40%"
                                                        >
                                                            106.43
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td
                                                            className="text-right"
                                                            width="60%"
                                                        >
                                                            USD TO AED
                                                        </td>
                                                        <td
                                                            className="text-right"
                                                            width="40%"
                                                        >
                                                            106.43
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td
                                                            className="text-right"
                                                            width="60%"
                                                        >
                                                            NET AMOUNT
                                                        </td>
                                                        <td
                                                            className="text-right"
                                                            width="40%"
                                                        >
                                                            106.43
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </Grid>
                    </Grid>

                    {/* Remarks */}
                    <Grid container spacing={2} sx={{ pb: 3 }}>
                        <Grid item xs={12} md={12}>
                            <table
                                className="normal-table table-small"
                                cellSpacing="0"
                            >
                                <tbody>
                                    <tr>
                                        <td width="20%">AMOUNT IN WORDS </td>
                                        <td width="80%">Test Only</td>
                                    </tr>
                                    <tr>
                                        <td width="20%">
                                            APPROVALS LIMIT FOR PAYMENT{" "}
                                        </td>
                                        <td width="80%"></td>
                                    </tr>
                                    <tr>
                                        <td width="20%">FINANCE COMMENTS</td>
                                        <td width="80%">Test Only</td>
                                    </tr>
                                </tbody>
                            </table>
                        </Grid>
                    </Grid>

                    <Box
                        className="budget-area"
                        sx={{
                            mb: 2,
                            backgroundColor: "#e7e7e7",
                            textAlign: "center",
                        }}
                    >
                        <FormControlLabel
                            control={<Checkbox defaultChecked />}
                            label="Budgeted according to policy"
                        ></FormControlLabel>
                        <FormControlLabel
                            control={<Checkbox />}
                            label="Not Budgeted"
                        ></FormControlLabel>
                    </Box>

                    {/* Approval Setup */}
                    <Grid
                        className="approval-main"
                        container
                        spacing={2}
                        sx={{ py: 2, px: 2 }}
                    >
                        {approvals.map((row, index) => {
                            return (
                                <Grid
                                    className="approval-box"
                                    item
                                    sx={{
                                        paddingRight: 2,
                                        paddingLeft: "0 !important",
                                        textAlign: "center",
                                        mt: 1,
                                        width: "auto",
                                        minWidth: "11%",
                                        maxWidth: "130px"
                                    }}
                                    key={row.id}
                                >
                                    <Box
                                        sx={{ border: 1, minHeight: 50 }}
                                    ></Box>
                                    <br />
                                    <small>{row.type}</small> <br />
                                    <small>{row.name}</small>
                                    <br />
                                    <small>{row.designation}</small>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Box>

                <Box
                    className="no-print"
                    sx={{
                        py: 1,
                        backgroundColor: "#336d89",
                        color: "#ffffff",
                        textAlign: "center",
                    }}
                >
                    BELOW IS FOR ADDING INVOICE ONLY!
                </Box>

                <Grid  className="no-print" container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} md={2}>
                        INVOICE NO.
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            size="small"
                            required
                            variant="outlined"
                        ></TextField>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            type="file"
                            size="small"
                            variant="outlined"
                        ></TextField>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        PNG, JPG &amp; JPEG ONLY
                    </Grid>
                    <Grid item xs={12} md={2}>
                        INVOICE DATE
                    </Grid>
                    <Grid item xs={12} md={4} className="row-date-picker">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <MobileDatePicker
                                label="Invoice date"
                                size="small"
                                variant="outlined"
                                inputFormat="MM/dd/yyyy"
                                value={invoice_date}
                                onChange={(e) => handleDateRow(e)}
                                sx={{
                                    padding: "8.5px 14px!important",
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} />
                                )}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item md={6}></Grid>
                    <Grid item xs={12} md={2}>
                        INVOICE AMOUNT
                    </Grid>
                    <Grid item xs={12} md={4} className="row-date-picker">
                        <TextField
                            size="small"
                            type="number"
                            variant="outlined"
                        ></TextField>
                    </Grid>
                    <Grid item md={6}></Grid>
                    <Grid item md={2}>
                    <Button
                                className="btn-save-invoice"
                                variant="contained"
                                color="primary"
                                size="small"
                            >
                                SAVE INVOICE
                            </Button>
                    </Grid>
                    <Grid item md={12}>
                                    <small>Note: You cannot edit once you save the invoice!</small>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
};

export default ViewPaf;
