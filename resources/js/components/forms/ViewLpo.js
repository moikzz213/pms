import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LoadingButton from "@mui/lab/LoadingButton";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import API from "../../services/api.js";  
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
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
const ViewLpo = ({ id, logged }) => {
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

        API.get("/v/local-purchase-order/fetch/" + id).then((response) => {
            let fetchItems = response.data.item;
            console.log(fetchItems);
            setItems(fetchItems);
            let img = "";
            if( fetchItems.company && (fetchItems.company).toLowerCase().includes("aboud group")){
                img = "/logo/gag.png";
            }else if( fetchItems.company && (fetchItems.company).toLowerCase().includes("gallega")){
                img = "/logo/gallega.png";
            }else if( fetchItems.company && (fetchItems.company).toLowerCase().includes("platforms")){
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
            }else{
                img = "/logo/gag.png";
            }
            
            setLogo(img);

            let approvals = [];
            fetchItems.lpo_approvals.map((o,i) =>{
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

    const changeStatus = (e, type) => {
        e.preventDefault();
        setOpen(true);
        setLoading(true);
        let newMessage = {
            title: "info",
            message: "Please wait...",
        };
        setSeverity(newMessage);  
        let data = {id : id, type: type, user_id: logged.id};
        API.post('/v/local-purchase-order/update-status', data)
        .then((response) => {
            console.log(response);
            setTimeout(() => {
                newMessage = {
                    title: "success",
                    message:  response.data.message,
                };
                setLoading(false);
                setSeverity(newMessage);
            }, 1500);
        });
    }
    return (
        <Paper sx={{ px: 3, py: 3 }}>
            <Box sx={{ flexGrow: 1 }}>
            <Snackbar
                    open={open}
                    autoHideDuration={4000}
                    onClose={handleClose}
                >
                    <Alert
                        onClose={handleClose}
                        severity={severity.title}
                        sx={{ width: "100%" }}
                    >
                        {severity.message}
                    </Alert>
                </Snackbar>
                <Box
                    sx={{
                        "& .MuiTextField-root": { m: 1, width: "90%" },
                    }}
                >
                    <Grid container spacing={2}>
                        <Grid item md={3}>
                            <img
                                src={logo}
                                srcSet={logo}
                                alt="Logo"
                                loading="lazy"
                                className="logo"
                            />
                        </Grid>
                        <Grid item md={6}>
                            <h1 className="text-center ma-0 lpo-title">
                                {items.company}
                            </h1>
                            <h2 className="text-center ma-0 lpo-label">
                                LOCAL PURCHASE ORDER (LPO)
                            </h2>
                        </Grid>
                        <Grid
                            item
                            md={3}
                            className="btn-cancel"
                            sx={{ textAlign: "right" }}
                        >
                            <LoadingButton
                                    className="btn-info"
                                    color="red"
                                    size="small"
                                    variant="contained"
                                    onClick={(e) => changeStatus(e, "cancelled")}
                                    loading={loading}
                                    sx={{ mx:2, margin: "0 0 0 auto", mb:"10px", display: "block" }}
                                >
                                    Cancel
                                </LoadingButton>
                             <LoadingButton
                                    className="btn-info"
                                    color="orange"
                                    size="small"
                                    variant="contained"
                                    onClick={(e) => changeStatus(e, "onhold")}
                                    loading={loading}
                                    sx={{ mx:2, margin: "0 0 0 auto", mb:"10px", display: "block" }}
                                >
                                    onHold
                                </LoadingButton>
                                <LoadingButton
                                    className="btn-info"
                                    color="secondary"
                                    size="small"
                                    variant="contained"
                                    hide="true"
                                    onClick={(e) => changeStatus(e, "onprocess")}
                                    loading={loading}
                                    sx={{ mx:2, margin: "0 0 0 auto", mb:"10px", display: "block" }}
                                >
                                    On Process
                                </LoadingButton>
                                <LoadingButton
                                    className="btn-info"
                                    color="green"
                                    size="small"
                                    variant="contained"
                                    onClick={(e) => changeStatus(e, "closed")}
                                    loading={loading}
                                >
                                    Closed
                                </LoadingButton>
                        </Grid>
                        <Grid item md={6}>
                            <table className="normal-table" cellSpacing="0">
                                <tbody>
                                    <tr>
                                        <th>TO</th>
                                        <th>
                                            {items.supplier
                                                ? items.supplier.title
                                                : ""}
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>ADDRESS</th>
                                        <th>
                                            {items.supplier
                                                ? items.supplier.address
                                                : ""}
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>TAX NO.:</th>
                                        <th>
                                            {items.supplier
                                                ? items.supplier.tax_no
                                                : ""}
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>CONTACT NO.</th>
                                        <th>
                                            {items.supplier
                                                ? items.supplier.contact_no
                                                : ""}
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>STORE NAME</th>
                                        <th>{items.location}</th>
                                    </tr>
                                    <tr>
                                        <th>EMAIL</th>
                                        <th>
                                            {items.supplier
                                                ? items.supplier.email
                                                : ""}
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                        </Grid>
                        <Grid item md={6}>
                            <table className="normal-table" cellSpacing="0">
                                <tbody>
                                    <tr>
                                        <th>LPO</th>
                                        <th> {items.lpo_no}</th>
                                    </tr>
                                    <tr>
                                        <th>LPO DATE:</th>
                                        <th>{new Date(
                                                items.created_at
                                            ).toLocaleDateString()}
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>SUPPLIER REFERENCE #:</th>
                                        <th>{items.supplier_ref_num}</th>
                                    </tr>
                                    <tr>
                                        <th>DEPARTMENT:</th>
                                        <th>{items.company}</th>
                                    </tr>
                                    <tr>
                                        <th>PRF NO.:</th>
                                        <th>
                                            {items.requests
                                                ? items.requests.prf_no
                                                : ""}
                                            {items.prf_extension
                                                ? "-" + items.prf_extension
                                                : ""}
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>TOTAL AMOUNT</th>
                                        <th style={{textAlign:"right"}}>{  items.net_amount ? (items.net_amount).toFixed(2) : ""}</th>
                                    </tr>
                                </tbody>
                            </table>
                        </Grid>
                    </Grid>
                    {/* Table - Items */}
                    <Grid container spacing={2} sx={{ py: 3 }}>
                        <Grid item md={12} sm={12} xs={12}>
                            <table className="normal-table" cellSpacing="0">
                                <thead>
                                    <tr>
                                        <th
                                            className="text-center"
                                            style={{ width: 50 }}
                                        >
                                            S/N
                                        </th>
                                        <th className="text-center">ITEM</th>
                                        <th className="text-center">
                                            SPECIFICATIONS
                                        </th>
                                        <th
                                            className="text-center"
                                            style={{ width: 50 }}
                                        >
                                            QTY
                                        </th>
                                        <th
                                            className="text-center"
                                            style={{ width: 80 }}
                                        >
                                            UOM
                                        </th>
                                        <th
                                            className="text-center"
                                            style={{ width: 150 }}
                                        >
                                            UNIT PRICE
                                        </th>
                                        <th
                                            className="text-center"
                                            style={{ width: 150 }}
                                        >
                                            AMOUNT IN AED
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.lpo_items &&
                                        items.lpo_items.map((row, index) => {
                                            return (
                                                <tr key={row.id}>
                                                    <td className="text-center">
                                                        {index + 1}
                                                    </td>
                                                    <td className="text-center">
                                                        {row.item}
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
                            <table className="normal-table" cellSpacing="0">
                                <tbody>
                                    <tr>
                                        <td width="68.2%" style={{verticalAlign:"top"}}>
                                            {items.remarks_general}
                                        </td>
                                        <td style={{ padding: 0, margin: 0 }}>
                                            <table width="100%" cellSpacing="0">
                                                <tbody>
                                                    <tr>
                                                        <td
                                                            className="text-right"
                                                            width="150"
                                                        >
                                                            TOTAL
                                                        </td>
                                                        <td
                                                            className="text-right"
                                                            width="150"
                                                        >
                                                            { items.total_amount ? (items.total_amount).toFixed(2) : ''}
                                                        </td>
                                                    </tr>
                                                    {items.is_license ? (
                                                        <>
                                                            <tr>
                                                                <td
                                                                    className="text-right"
                                                                    width="150"
                                                                >
                                                                    {
                                                                        items.license_title_label_1
                                                                    }
                                                                </td>
                                                                <td
                                                                    className="text-right"
                                                                    width="150"
                                                                >
                                                                    {
                                                                        items.license_title_value_1
                                                                    }
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    className="text-right"
                                                                    width="150"
                                                                >
                                                                    {
                                                                        items.license_title_label_2
                                                                    }
                                                                </td>
                                                                <td
                                                                    className="text-right"
                                                                    width="150"
                                                                >
                                                                    {
                                                                        items.license_title_value_2
                                                                    }
                                                                </td>
                                                            </tr>
                                                        </>
                                                    ) : (
                                                        null
                                                    )}
                                                    <tr>
                                                        <td
                                                            className="text-right"
                                                            width="150"
                                                        >
                                                            DISCOUNT
                                                        </td>
                                                        <td
                                                            className="text-right"
                                                            width="150"
                                                        >
                                                            {items.discount}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td
                                                            className="text-right"
                                                            width="150"
                                                        >
                                                            5% VAT
                                                        </td>
                                                        <td
                                                            className="text-right"
                                                            width="150"
                                                        >
                                                            {items.vat}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td
                                                            className="text-right"
                                                            width="150"
                                                        >
                                                            NET AMOUNT
                                                        </td>
                                                        <td
                                                            className="text-right"
                                                            width="150"
                                                        >
                                                            {items.net_amount}
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

                    {/* Payment Terms */}
                    <Grid container spacing={2} sx={{ pb: 3 }}>
                        <Grid
                            item
                            xs={4}
                            md={4}
                            sx={{
                                minHeight: 167,
                                maxHeight: 167,
                            }}
                        >
                            <Box
                                sx={{
                                    border: "1px solid #cecece",
                                    px: 2,
                                    pb: 1,
                                }}
                            >
                                <h4>PAYMENT TERMS</h4>
                                <FormGroup>
                                    <FormControlLabel
                                        control={<Checkbox checked={items.payment_terms == 1 ? true : false} size="small"/>}
                                        label="Credit"
                                        disabled={items.payment_terms == 1 ? false : true}
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={items.payment_terms == 2 ? true : false} size="small"/>}
                                        label="Payment upon delivery"
                                        disabled={items.payment_terms == 2 ? false : true}
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={items.payment_terms == 3 ? true : false} size="small"/>}
                                        label="Advance"
                                        disabled={items.payment_terms == 3 ? false : true}
                                    />
                                </FormGroup>
                            </Box>
                        </Grid>
                        <Grid
                            item
                            xs={4}
                            md={4}
                            sx={{
                                minHeight: 167,
                                maxHeight: 167,
                            }}
                        >
                            <Box
                                sx={{
                                    border: "1px solid #cecece",
                                    px: 2,
                                    pb: 1,
                                }}
                            >
                                <h4>PAYMENT MODE</h4>
                                <FormGroup>
                                    <FormControlLabel
                                        control={<Checkbox checked={items.payment_mode == 1 ? true : false} size="small"/>}
                                        label="Cheque/Bank Transfers"
                                        disabled={items.payment_mode == 1 ? false : true}
                                    />
                                    <FormControlLabel
                                        control={<Checkbox   checked={items.payment_mode == 2 ? true : false} size="small"/>}
                                        label="Credit Card"
                                        disabled={items.payment_mode == 2 ? false : true}
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={items.payment_mode == 3 ? true : false} size="small"/>}
                                        label="Cash"
                                        disabled={items.payment_mode == 3 ? false : true}
                                    />
                                </FormGroup>
                            </Box>
                        </Grid>
                        <Grid item xs={4} md={4}>
                            <Box
                                className="delivery-term"
                                sx={{
                                    border: "1px solid #cecece",
                                    px: 2,
                                    pb: 1,
                                    minHeight: 167,
                                    maxHeight: 167,
                                }}
                            >
                                <h4>DELIVERY TERMS</h4>
                                {items.delivery_terms}
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Billing / Shipping Details */}
                    <Grid container spacing={2} sx={{ pb: 3 }}>
                        <Grid item md={6}>
                            <table className="normal-table" cellSpacing="0">
                                <tbody>
                                    <tr>
                                        <td colSpan="2">BILLING DETAILS:</td>
                                    </tr>
                                    <tr>
                                        <td>COMPANY</td>
                                        <td>
                                        {items.company}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>TAX NO.</td>
                                        <td>{items.billing ? items.billing.tax_no : ""}</td>
                                    </tr>
                                    <tr>
                                        <td>CONTACT PERSON:</td>
                                        <td>{items.billing ? items.billing.contact_person : ""}</td>
                                    </tr>
                                    <tr>
                                        <td>ADDRESS</td>
                                        <td>{items.billing ? items.billing.address : ""}</td>
                                    </tr>
                                    <tr>
                                        <td>CONTACT NO.</td>
                                        <td>{items.billing ? items.billing.contact_no : ""}</td>
                                    </tr>
                                    <tr>
                                        <td>EMAIL</td>
                                        <td>{items.billing ? items.billing.email : ""}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </Grid>
                        <Grid item md={6}>
                            <table className="normal-table" cellSpacing="0">
                                <tbody>
                                    <tr>
                                        <td colSpan="2">SHIPPING DETAILS:</td>
                                    </tr>
                                    <tr>
                                        <td>COMPANY</td>
                                        <td>{items.company}</td>
                                    </tr>
                                    <tr>
                                        <td>TAX NO.</td>
                                        <td>{items.billing ? items.billing.tax_no : ""}</td>
                                    </tr>
                                    <tr>
                                        <td>CONTACT PERSON:</td>
                                        <td>{items.contact_person ? items.contact_person.profile.name : ""}</td>
                                    </tr>
                                    <tr>
                                        <td>ADDRESS</td>
                                        <td>{items.billing ? items.billing.address : ""}</td>
                                    </tr>
                                    <tr>
                                        <td>CONTACT NO.</td>
                                        <td>{items.billing ? items.billing.contact_no : ""}</td>
                                    </tr>
                                    <tr>
                                        <td>EMAIL</td>
                                        <td>{items.contact_person ? items.contact_person.email : ""}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </Grid>
                    </Grid>

                    {/* Remarks */}
                    <Grid container spacing={2} sx={{ pb: 3 }}>
                        <Grid item xs={12} md={12}>
                            <table className="normal-table" cellSpacing="0">
                                <tbody>
                                    <tr>
                                        <td width="15%">REMARKS: </td>
                                        <td width="85%">{items.remarks_optional}</td>
                                    </tr>
                                    <tr>
                                        <td width="15%">FINANCE REMARKS: </td>
                                        <td width="85%"></td>
                                    </tr>
                                    <tr>
                                        <td width="15%">* PAYMENT TERMS: </td>
                                        <td width="85%">{items.remarks_payment_terms}</td>
                                    </tr> 
                                </tbody>
                            </table>
                        </Grid>
                    </Grid>

                    {/* Approval Setup */}
                    <Grid
                        className="approval-main"
                        container
                        spacing={2}
                        sx={{ py: 2 }}
                    >
                        {approvals.map((row, index) => {
                            return (
                                <Grid
                                    className="approval-box"
                                    item
                                    md={2}
                                    xs={2}
                                    sm={2}
                                    sx={{ px: 1, textAlign: "center", mt: 1 }}
                                    key={row.id}
                                >
                                    <Box
                                        sx={{ border: 1, minHeight: 80 }}
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
            </Box>
        </Paper>
    );
};

export default ViewLpo;
