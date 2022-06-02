import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LoadingButton from "@mui/lab/LoadingButton";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import API from "../../services/api.js";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Autocomplete from "@mui/material/Autocomplete";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function approvalLabelled(label) {
    if (label == "prepared_by") {
        return "Prepared By";
    }else if (label == "requested_by") {
        return "Requested By";
    } else if (label == "reviewed_by") {
        return "Reviewed By";
    } else if (label == "verified_by") {
        return "Verified By";
    } else if (label == "approved_by") {
        return "Approved By";
    }
}
const ViewLpo = ({ id, logged }) => {
    const [logo, setLogo] = useState("");
    const [open, setOpen] = useState(false);
    const [editEnable, setEditEnable] = useState(false);
    const [severity, setSeverity] = useState({
        title: "",
        message: "",
    });
    const defaultVat = 0.05; // 5% VAT
    const vatLabel = 5;
    const [totalamount, setTotalamount] = useState(0);
    const [enableLicense, setEnableLicense] = useState(false);
    const [rowCountApproval, setRowCountApproval] = useState(1);
    const [netamount, setNetAmount] = useState(0);
    const [licenseMonth, setLicenseMonth] = useState(0);
    const [licenseTotalAmount, setLicenseTotalAmount] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [vat, setVat] = useState(0);
    const [categoryList, setCategories] = useState([]);
    const [rowCount, setRowCount] = useState(1);
    const [loading, setLoading] = useState(false);
    const [objData, setObjData] = useState([{}]);

    const [tempTotal, setTempTotal] = useState(0);
    const [tempDiscount, setTempDiscount] = useState(0);
    const [tempVat, setTempVat] = useState(0); 
    const [tempNetAmount, setTempNetAmount] = useState(0);

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };
    const [active, setActive] = useState(false);
    const [approvals, setApprovals] = useState([]);
    const [items, setItems] = useState({});
    
    const [tableRows, setTableRows] = useState([
        {
            row: 0,
            category_id: "",
            item: "",
            specification: "",
            qty: 1,
            uom: "",
            unit_price: 0,
            amount: 0,
        },
    ]);
    const [editOnlyRows, setEditOnlyRows] = useState([]);

    function defaultFetch(logged){
        setApprovals([]);

        API.get("/v/local-purchase-order/fetch/" + id).then((response) => {
            let fetchItems = response.data.item;
            
            if(logged.role !== 'admin' && fetchItems.status == 'closed'){
                setActive(true); // should be false but will give procurement to update status if its closed
            }else if( fetchItems.status == 'cancelled'){
                setActive(true);
            }else if(logged.role == 'admin'){
                setActive(true);
            }else{
                setActive(true);
            }
          
            setItems(fetchItems);
          
            let img = "";
            if (
                fetchItems.company &&
                fetchItems.company.toLowerCase().includes("aboud group")
            ) {
                img = "/logo/gag.png";
            } else if (
                fetchItems.company &&
                fetchItems.company.toLowerCase().includes("gallega")
            ) {
                img = "/logo/gallega.png";
            } else if (
                fetchItems.company &&
                fetchItems.company.toLowerCase().includes("trade platform")
            ) {
                img = "/logo/buygro.png";
            }else if (
                fetchItems.company &&
                fetchItems.company.toLowerCase().includes("auto platform")
            ) {
                img = "/logo/autotrade.png";
            } else if (
                fetchItems.company &&
                fetchItems.company.toLowerCase().includes("catering")
            ) {
                img = "/logo/catering.png";
            } else if (
                fetchItems.company &&
                fetchItems.company.toLowerCase().includes("crystal")
            ) {
                img = "/logo/crystalbrook.png";
            } else if (
                fetchItems.company &&
                fetchItems.company.toLowerCase().includes("news")
            ) {
                img = "/logo/orient.png";
            } else if (
                fetchItems.company &&
                fetchItems.company.toLowerCase().includes("cars")
            ) {
                img = "/logo/gac.png";
            } else if (
                fetchItems.company &&
                fetchItems.company.toLowerCase().includes("gaelan")
            ) {
                img = "/logo/gaelan.png";
            } else if (
                fetchItems.company &&
                fetchItems.company.toLowerCase().includes("point")
            ) {
                img = "/logo/livepoint.png";
            } else if (
                fetchItems.company &&
                fetchItems.company.toLowerCase().includes("training")
            ) {
                img = "/logo/otc.png";
            } else if (
                fetchItems.company &&
                fetchItems.company.toLowerCase().includes("supermarket")
            ) {
                img = "/logo/supermarket.png";
            } else if (
                fetchItems.company &&
                fetchItems.company.toLowerCase().includes("olive")
            ) {
                img = "/logo/olive.png";
            } else {
                img = "/logo/gag.png";
            }

            setLogo(img);

            let approvals = [];
            fetchItems.lpo_approvals.map((o, i) => {
                approvals[i] = {
                    id: o.user_id,
                    name: o.users.profile.name,
                    designation: o.users.profile.designation,
                    type: approvalLabelled(o.approval_type),
                };
            });
            setApprovals(approvals);
        });
    }

    useEffect(() => { 
        defaultFetch(logged);
    }, [logged]);

    const changeStatus = (e, type) => {
        e.preventDefault();
        setOpen(true);
        setLoading(true);
        let newMessage = {
            title: "info",
            message: "Please wait...",
        };
        setSeverity(newMessage);
        let data = { id: id, type: type, user_id: logged.id };
        API.post("/v/local-purchase-order/update-status", data).then(
            (response) => {
                setTimeout(() => {
                    newMessage = {
                        title: "success",
                        message: response.data.message,
                    };
                    setLoading(false);
                    setSeverity(newMessage);
                }, 1500);
            }
        );
    };

    // Edit Area

    const editLPO = (e, stats) => {
        setEditEnable(stats);
        if(stats){ 
            
            API.get("/v/categories/fetch-non-paginate").then((response) => {
                let fetchItems = response.data.item;
                fetchItems = Object.assign([], fetchItems);
        
                setCategories(fetchItems);
            }); 
            
            setEnableLicense(items.is_licenes);
            setEditOnlyRows([...items.lpo_items]);
        } 
    };

    const handleRemoveRow = (index) => {
        let rows = tableRows;
        rows.splice(index, 1);
        setTableRows([...rows]);

        calculateAmount("removedrow");
    };

    const handleEditOnlyCategory = (event, index, type) => {
        let selected = event.target.value;
        let rowsData = Object.assign([], editOnlyRows);
        let tempRows = rowsData.map((o, i) => {
            if (i == index && type == "category") {
                o.category_id = selected;
            } else if (i == index && type == "uom") {
                o.uom = selected;
            }
            if (i == index && type == "specs") {
                o.specification = selected;
            }
            if (i == index && type == "item") {
                o.item = selected;
            }
            return o;
        });

        setEditOnlyRows(tempRows);
    };

    const handleCategory = (event, index, type) => {
        let selected = event.target.value;
        let rowsData = Object.assign([], tableRows);
        let tempRows = rowsData.map((o, i) => {
            if (i == index && type == "category") {
                o.category_id = selected;
            } else if (i == index && type == "uom") {
                o.uom = selected;
            }
            if (i == index && type == "specs") {
                o.specification = selected;
            }
            if (i == index && type == "item") {
                o.item = selected;
            }
            return o;
        });

        setTableRows(tempRows);
    };
    const handleAddRow = () => {
        let totalRow = rowCount + 1;
        const newItem = {
            row: totalRow,
            category_id: "",
            item: "",
            specification: "",
            qty: 1,
            uom: "",
            unit_price: 0,
            amount: 0,
        };

        setRowCount(totalRow);
        setTableRows([...tableRows, newItem]);
    }; 

    const calculateAmountEditOnly = (e, index, type) => {
        let value = 0;
        let totalMonth = 0;
        let checkedLicense = false;
        let is_license = 0;
        let checkedData = false;
       
        if (e == "license") {
            totalMonth = index;
            checkedLicense = true;
        } else {
            if (enableLicense) {
                checkedLicense = true;
                totalMonth = licenseMonth;
            }

            if (e == "unchecked") {
                checkedLicense = index;
                if (index) {
                    totalMonth = licenseMonth;
                }
            } else if (e != "removedrow") {
                value = e.target.value;
            }
        }
         
        let netAmount = 0;
        let curDiscount = 0;

        let tempRows = editOnlyRows.map((o, i) => {
            if (type == "qty") {
                let amount = o.unit_price;
                if (i == index) {
                    if (!amount) {
                        amount = 0;
                    }
                    o.amount = (value * amount).toFixed(2);
                    o.qty = value;
                } 
            } else if (type == "price") {
                let qty = o.qty;
                if (i == index) {
                    if (!qty) {
                        qty = 1;
                    }

                    o.amount = (value * qty).toFixed(2);
                    o.unit_price = value;
                } 
            }

            netAmount += parseFloat(o.amount);
           
            return o;
        });
        
        if(isNaN(netAmount)){
            netAmount= 0;
              tempRows = editOnlyRows.map((o, i) => {
               
                netAmount += o.qty * o.unit_price;
               
                return o;
            });
        }

        
        let dataAssign = Object.assign([], objData);

        if (type == "discount") {
            setDiscount(value);

            curDiscount = value;
        } else {
            curDiscount = discount;
        }

        if (netAmount < 0) {
            netAmount = 0;
        } else {
            netAmount = Math.round(netAmount * 100) / 100;
        }

        let totalAmount = netAmount;
        let totAmount = netAmount;
        
        setTotalamount(totalAmount.toFixed(2));

        if (checkedLicense) {
            is_license = 1;
            netAmount = totalMonth * totalAmount;
            netAmount = Math.round(netAmount * 100) / 100;
            setLicenseTotalAmount(netAmount);

            let amountValue = dataAssign.map((o, i) => {
                o.license_title_value_1 = totalMonth;
                o.license_title_value_2 = netAmount;
                return o;
            });

            setObjData(amountValue);
        } else {
            let amountValue = dataAssign.map((o, i) => {
                o.license_title_label_2 = "";
                o.license_title_label_1 = "";
                o.license_title_value_1 = "";
                o.license_title_value_2 = "";
                return o;
            });

            setObjData(amountValue);
        }

        totalAmount = netAmount - curDiscount;
        let totalVat = 0;
        if (type == "vat") {
            totalVat = value;
        } else {
            totalVat = totalAmount * defaultVat;
        }

        totalVat = Math.round(totalVat * 100) / 100;
        setVat(totalVat.toFixed(2));

        netAmount = Math.round(totalAmount * 100) / 100;
        netAmount = netAmount + totalVat;

        if (netAmount < 0) {
            netAmount = 0;
        } else {
            checkedData = true;
        }

        setEditOnlyRows(tempRows);
        setNetAmount(netAmount.toFixed(2));

        let amountValue = dataAssign.map((o, i) => {
            o.discount = curDiscount;
            o.net_amount = netAmount.toFixed(2);
            o.total_amount = totAmount;
            o.vat = totalVat.toFixed(2);
            o.is_license = is_license;
            return o;
        }); 
        
        setObjData(amountValue); 
    };

    const calculateAmount = (e, index, type) => {
        let value = 0;
        let totalMonth = 0;
        let checkedLicense = false;
        let is_license = 0;
        let checkedData = false;
        if (e == "license") {
            totalMonth = index;
            checkedLicense = true;
        } else {
            if (enableLicense) {
                checkedLicense = true;
                totalMonth = licenseMonth;
            }

            if (e == "unchecked") {
                checkedLicense = index;
                if (index) {
                    totalMonth = licenseMonth;
                }
            } else if (e != "removedrow") {
                value = e.target.value;
            }
        }

        let netAmount = 0;
        let curDiscount = 0;

        let tempRows = tableRows.map((o, i) => {
            if (type == "qty") {
                let amount = o.unit_price;
                if (i == index) {
                    if (!amount) {
                        amount = 0;
                    }
                    o.amount = (value * amount).toFixed(2);
                    o.qty = value;
                }
            } else if (type == "price") {
                let qty = o.qty;
                if (i == index) {
                    if (!qty) {
                        qty = 1;
                    }

                    o.amount = (value * qty).toFixed(2);
                    o.unit_price = value;
                }
            }

            netAmount += parseFloat(o.amount);

            return o;
        });

        let dataAssign = Object.assign([], objData);

        if (type == "discount") {
            setDiscount(value);

            curDiscount = value;
        } else {
            curDiscount = discount;
        }

        if (netAmount < 0) {
            netAmount = 0;
        } else {
            netAmount = Math.round(netAmount * 100) / 100;
        }

        let totalAmount = netAmount;
        let totAmount = netAmount;
        setTotalamount(totalAmount.toFixed(2));

        if (checkedLicense) {
            is_license = 1;
            netAmount = totalMonth * totalAmount;
            netAmount = Math.round(netAmount * 100) / 100;
            setLicenseTotalAmount(netAmount);

            let amountValue = dataAssign.map((o, i) => {
                o.license_title_value_1 = totalMonth;
                o.license_title_value_2 = netAmount;
                return o;
            });

            setObjData(amountValue);
        } else {
            let amountValue = dataAssign.map((o, i) => {
                o.license_title_label_2 = "";
                o.license_title_label_1 = "";
                o.license_title_value_1 = "";
                o.license_title_value_2 = "";
                return o;
            });

            setObjData(amountValue);
        }

        totalAmount = netAmount - curDiscount;
        let totalVat = 0;
        if (type == "vat") {
            totalVat = value;
        } else {
            totalVat = totalAmount * defaultVat;
        }

        totalVat = Math.round(totalVat * 100) / 100;
        setVat(totalVat.toFixed(2));

        netAmount = Math.round(totalAmount * 100) / 100;
        netAmount = netAmount + totalVat;

        if (netAmount < 0) {
            netAmount = 0;
        } else {
            checkedData = true;
        }

        setTableRows(tempRows);
        setNetAmount(netAmount.toFixed(2));

        let amountValue = dataAssign.map((o, i) => {
            o.discount = curDiscount;
            o.net_amount = netAmount.toFixed(2);
            o.total_amount = totAmount;
            o.vat = totalVat.toFixed(2);
            o.is_license = is_license;
            return o;
        });

        setObjData(amountValue); 
    };
  
    return (
        <Paper sx={{ px: 3, py: 3 }}>
            <Box sx={{ flexGrow: 1 }}  className="parent-container">
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
                            <>
                            { active ?  
                                    <>
                                    { !editEnable && items.status !== 'cancelled' && items.status !== 'closed' &&
                                        <LoadingButton
                                            className="btn-info"
                                            color="red"
                                            size="small"
                                            variant="contained"
                                            onClick={(e) =>
                                                changeStatus(e, "cancelled")
                                            }
                                            loading={loading}
                                            sx={{
                                                mx: 2,
                                                margin: "0 0 0 auto",
                                                mb: "10px",
                                                display: "block",
                                            }}
                                        >
                                            Cancel LPO
                                        </LoadingButton>
                                        }
                                        {!editEnable && 
                                        <LoadingButton
                                            className="btn-info"
                                            color="orange"
                                            size="small"
                                            variant="contained"
                                            onClick={(e) =>
                                                changeStatus(e, "onhold")
                                            }
                                            loading={loading}
                                            sx={{
                                                mx: 2,
                                                margin: "0 0 0 auto",
                                                mb: "10px",
                                                display: "block",
                                            }}
                                        >
                                            onHold
                                        </LoadingButton>
                                            } 
                                        {!editEnable && items.status !== 'onprocess'  &&
                                        <LoadingButton
                                            className="btn-info"
                                            color="secondary"
                                            size="small"
                                            variant="contained"
                                            hide="true"
                                            onClick={(e) =>
                                                changeStatus(e, "onprocess")
                                            }
                                            loading={loading}
                                            sx={{
                                                mx: 2,
                                                margin: "0 0 0 auto",
                                                mb: "10px",
                                                display: "block",
                                            }}
                                        >
                                            On Process
                                        </LoadingButton>
                                            }
                                        {!editEnable && items.status !== 'cancelled' && items.status !== 'closed' &&
                                        <LoadingButton
                                            className="btn-info"
                                            color="green"
                                            size="small"
                                            variant="contained"
                                            onClick={(e) =>
                                                changeStatus(e, "closed")
                                            }
                                            sx={{
                                                mx: 2,
                                                margin: "0 0 0 auto",
                                                mb: "10px",
                                                display: "block",
                                            }}
                                            loading={loading}
                                        >
                                            Closed
                                        </LoadingButton>
                                        }
                                        {/* {!editEnable && items.status !== 'cancelled' && items.status !== 'closed' && 
                                        <LoadingButton
                                            className="btn-info" 
                                            size="small"
                                            variant="contained"
                                            onClick={(e) =>
                                                editLPO(e, true)
                                            }
                                             
                                        >
                                            Edit LPO
                                        </LoadingButton> 
                                        }
                                        {editEnable &&
                                            <LoadingButton
                                            className="btn-info" 
                                            color="black"
                                            size="small"
                                            variant="contained"
                                            onClick={(e) => 
                                                editLPO(e, false)
                                            }
                                            
                                        >
                                            Close Edit
                                        </LoadingButton>
                                        } */}
                                    </>
                                :
                                 <div>Status: {items.status ? items.status : '' }</div> 
                                        }
                                </>
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
                                        <th>{items.location ? items.location.title : ""}</th>
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
                                        <th>
                                            {new Date(
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
                                        <th style={{ textAlign: "right" }}>
                                            {editEnable &&
                                                <>
                                                {netamount}
                                                </>
                                            }
                                            {!editEnable && items.net_amount
                                                ? items.net_amount.toFixed(2)
                                                : "0.00"}
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                        </Grid>
                    </Grid>
                    {/* Table - Items */}
                    <Grid container spacing={2} sx={{ py: 3 }}>
                        {editEnable && 
                        <Grid className="no-print" item md={1}>
                            <Button
                                id="addBtn"
                                variant="contained"
                                onClick={() => handleAddRow()}
                                size="small"
                            >
                                ADD
                            </Button>
                        </Grid>
                        }
                        <Grid item md={12} sm={12} xs={12} sx={{pt:"0 !important"}}>
                            {!editEnable && 
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
                                                        {row.unit_price
                                                            ? (
                                                                  row.qty *
                                                                  row.unit_price
                                                              ).toFixed(2)
                                                            : ""}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                            }
                            {editEnable && 
                                 <TableContainer className="no-print" sx={{ maxHeight: 600 }}>
                                 <Table
                                     stickyHeader
                                     aria-label="a dense table"
                                     className="dense-table"
                                 >
                                     <TableHead>
                                         <TableRow>
                                             <TableCell>Category</TableCell>
                                             <TableCell>Item</TableCell>
                                             <TableCell>Specification</TableCell>
                                             <TableCell>Qty</TableCell>
                                             <TableCell>UOM</TableCell>
                                             <TableCell>Unit Price</TableCell>
                                             <TableCell>Amount</TableCell>
                                             <TableCell></TableCell>
                                         </TableRow>
                                     </TableHead>
                                     <TableBody>
                                     {editOnlyRows.map((row, index) => {
                                             return (
                                                 <TableRow
                                                     id={`row-${row.row}`}
                                                     key={row.id+index}
                                                 >
                                                     <TableCell
                                                         sx={{
                                                             padding: "0 !important",
                                                         }}
                                                     >
                                                         <TextField
                                                             sx={{
                                                                 width: "100px !important",
                                                             }}
                                                             select
                                                             size="small"
                                                             label="Category*"
                                                             name="category"
                                                             value={row.category_id}
                                                             onChange={(e) =>
                                                                 handleEditOnlyCategory(
                                                                     e,
                                                                     index,
                                                                     "category"
                                                                 )
                                                             }
                                                             SelectProps={{
                                                                 native: true,
                                                             }}
                                                         >
                                                             <option value="">
                                                                 -
                                                             </option>
                                                             {categoryList.map(
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
                                                             label="Item"
                                                             size="small"
                                                             name="item"
                                                             value={row.item || ""}
                                                             variant="outlined"
                                                             onChange={(e) =>
                                                                handleEditOnlyCategory(
                                                                     e,
                                                                     index,
                                                                     "item"
                                                                 )
                                                             }
                                                         />
                                                     </TableCell>
                                                     <TableCell>
                                                         <TextField
                                                             label="Specification"
                                                             size="small"
                                                             name="specification"
                                                             variant="outlined"
                                                             value={row.specification || ""}
                                                             onChange={(e) =>
                                                                handleEditOnlyCategory(
                                                                     e,
                                                                     index,
                                                                     "specs"
                                                                 )
                                                             }
                                                         />
                                                     </TableCell>
                                                     <TableCell>
                                                         <TextField
                                                             type="number"
                                                             label="Qty"
                                                             size="small"
                                                             required
                                                             value={row.qty}
                                                             onChange={(e) =>
                                                                 calculateAmountEditOnly(
                                                                     e,
                                                                     index,
                                                                     "qty"
                                                                 )
                                                             }
                                                             variant="outlined"
                                                             name="qty"
                                                             sx={{
                                                                 width: "80px !important",
                                                             }}
                                                         />
                                                     </TableCell>
                                                     <TableCell
                                                         sx={{
                                                             padding: "0 !important",
                                                         }}
                                                     >
                                                         <TextField
                                                             label="UOM"
                                                             size="small"
                                                             variant="outlined"
                                                             value={row.uom || ""}
                                                             name="uom"
                                                             sx={{
                                                                 width: "80px !important",
                                                             }}
                                                             onChange={(e) =>
                                                                handleEditOnlyCategory(
                                                                     e,
                                                                     index,
                                                                     "uom"
                                                                 )
                                                             }
                                                         />
                                                     </TableCell>
                                                     <TableCell
                                                         sx={{
                                                             padding: "0 !important",
                                                         }}
                                                     >
                                                         <TextField
                                                             type="number"
                                                             label="Unit Price"
                                                             size="small"
                                                             value={row.unit_price || 0}
                                                             name="unit_price"
                                                             variant="outlined"
                                                             onChange={(e) =>
                                                                calculateAmountEditOnly(
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
                                                             value={row.amount ? row.amount :  (row.qty * row.unit_price).toFixed(2)}
                                                             
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
                                                     
                                                     </TableCell>
                                                 </TableRow>
                                             );
                                         })}
                                         {tableRows.map((row, index) => {
                                             return (
                                                 <TableRow
                                                     id={`row-${row.row}`}
                                                     key={row.row}
                                                 >
                                                     <TableCell
                                                         sx={{
                                                             padding: "0 !important",
                                                         }}
                                                     >
                                                         <TextField
                                                             sx={{
                                                                 width: "100px !important",
                                                             }}
                                                             select
                                                             size="small"
                                                             label="Category"
                                                             name="category"
                                                             value={row.category_id}
                                                             onChange={(e) =>
                                                                 handleCategory(
                                                                     e,
                                                                     index,
                                                                     "category"
                                                                 )
                                                             }
                                                             SelectProps={{
                                                                 native: true,
                                                             }}
                                                         >
                                                             <option value="">
                                                                 -
                                                             </option>
                                                             {categoryList.map(
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
                                                             label="Item"
                                                             size="small"
                                                             name="item"
                                                             value={row.item}
                                                             variant="outlined"
                                                             onChange={(e) =>
                                                                 handleCategory(
                                                                     e,
                                                                     index,
                                                                     "item"
                                                                 )
                                                             }
                                                         />
                                                     </TableCell>
                                                     <TableCell>
                                                         <TextField
                                                             label="Specification"
                                                             size="small"
                                                             name="specification"
                                                             variant="outlined"
                                                             value={row.specification}
                                                             onChange={(e) =>
                                                                 handleCategory(
                                                                     e,
                                                                     index,
                                                                     "specs"
                                                                 )
                                                             }
                                                         />
                                                     </TableCell>
                                                     <TableCell>
                                                         <TextField
                                                             type="number"
                                                             label="Qty"
                                                             size="small"
                                                             required
                                                             value={row.qty}
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
                                                                 width: "80px !important",
                                                             }}
                                                         />
                                                     </TableCell>
                                                     <TableCell
                                                         sx={{
                                                             padding: "0 !important",
                                                         }}
                                                     >
                                                         <TextField
                                                             label="UOM"
                                                             size="small"
                                                             variant="outlined"
                                                             value={row.uom}
                                                             name="uom"
                                                             sx={{
                                                                 width: "80px !important",
                                                             }}
                                                             onChange={(e) =>
                                                                 handleCategory(
                                                                     e,
                                                                     index,
                                                                     "uom"
                                                                 )
                                                             }
                                                         />
                                                     </TableCell>
                                                     <TableCell
                                                         sx={{
                                                             padding: "0 !important",
                                                         }}
                                                     >
                                                         <TextField
                                                             type="number"
                                                             label="Unit Price"
                                                             size="small"
                                                             value={row.unit_price}
                                                             name="unit_price"
                                                             variant="outlined"
                                                             onChange={(e) =>
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
                                                             value={row.amount ? row.amount :  (row.qty * row.unit_price).toFixed(2)}
                                                             
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
                            }
                        </Grid>
                    </Grid>

                    {/* Remarks - Net Amount */}
                    <Grid container spacing={2} sx={{ pb: 1 }}>
                        <Grid item md={12} xs={12} sx={{pt:"0 !important"}}>
                            <table className="normal-table" cellSpacing="0">
                                <tbody>
                                    <tr>
                                        <td
                                            width="68.2%"
                                            style={{ verticalAlign: "top" }}
                                        >
                                            <pre>{items.remarks_general}</pre>
                                        </td>
                                        <td style={{ padding: 0, margin: 0 }}>
                                            <table width="100%" border="0" cellSpacing="0" style={{minHeight:118}}>
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
                                                            {!editEnable &&
                                                            <>
                                                            {items.total_amount
                                                                ? items.total_amount.toFixed(
                                                                      2
                                                                  )
                                                                : "0.00"}
                                                                </>
                                                            }
                                                            {editEnable && 
                                                                <>
                                                                {totalamount}
                                                                </>
                                                            }
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
                                                    ) : null}
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
                                                            {items.discount ? items.discount.toFixed(
                                                                      2
                                                                  ) : "0.00"}
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
                                                            {editEnable && 
                                                             <TextField
                                                                value={vat ? vat : items.vat.toFixed(
                                                                    2
                                                                ) }
                                                                size="small"
                                                                onChange={(e) =>
                                                                    calculateAmount(
                                                                        e,
                                                                        null,
                                                                        "vat"
                                                                    )
                                                                }
                                                                variant="outlined"
                                                            /> 
                                                            }
                                                            {!editEnable &&
                                                            <> 
                                                             {items.vat ? items.vat.toFixed(
                                                                      2
                                                                  ) : "0.00"}
                                                            </>}

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
                                                            {editEnable && 
                                                            <> {netamount ? netamount : items.net_amount.toFixed(
                                                                2
                                                            )} </>}
                                                            {!editEnable && 
                                                            <>
                                                            {items.net_amount ? items.net_amount.toFixed(
                                                                      2
                                                                  ) : "0.00"}
                                                            </>
                                                            }
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
                    <Grid className="payment-container" container spacing={2} sx={{ pb: 1, maxHeight: 130 }}>
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
                                <h4 className="mb-2">PAYMENT TERMS</h4>
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={
                                                    items.payment_terms == 1
                                                        ? true
                                                        : false
                                                }
                                                size="small"
                                                sx={{padding: "0 10px !important"}}
                                            />
                                        }
                                        label="Credit"
                                        disabled={
                                            items.payment_terms == 1
                                                ? false
                                                : true
                                        }
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={
                                                    items.payment_terms == 2
                                                        ? true
                                                        : false
                                                }
                                                size="small"
                                                sx={{padding: "0 10px !important"}}
                                            />
                                        }
                                        label="Payment upon delivery"
                                        disabled={
                                            items.payment_terms == 2
                                                ? false
                                                : true
                                        }
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={
                                                    items.payment_terms == 3
                                                        ? true
                                                        : false
                                                }
                                                size="small"
                                                sx={{padding: "0 10px !important"}}
                                            />
                                        }
                                        label="Advance"
                                        disabled={
                                            items.payment_terms == 3
                                                ? false
                                                : true
                                        }
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
                                <h4 className="mb-2">PAYMENT MODE</h4>
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={
                                                    items.payment_mode == 1
                                                        ? true
                                                        : false
                                                }
                                                size="small"
                                                sx={{padding: "0 10px !important"}}
                                            />
                                        }
                                        label="Cheque/Bank Transfers"
                                        disabled={
                                            items.payment_mode == 1
                                                ? false
                                                : true
                                        }
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={
                                                    items.payment_mode == 2
                                                        ? true
                                                        : false
                                                }
                                                size="small"
                                                sx={{padding: "0 10px !important"}}
                                            />
                                        }
                                        label="Credit Card"
                                        disabled={
                                            items.payment_mode == 2
                                                ? false
                                                : true
                                        }
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={
                                                    items.payment_mode == 3
                                                        ? true
                                                        : false
                                                }
                                                size="small"
                                                sx={{padding: "0 10px !important"}}
                                            />
                                        }
                                        label="Cash"
                                        disabled={
                                            items.payment_mode == 3
                                                ? false
                                                : true
                                        }
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
                                    minHeight: 108,
                                    maxHeight: 108,
                                }}
                            >
                                <h4>DELIVERY TERMS</h4>
                                {items.delivery_terms}
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Billing / Shipping Details */}
                    <Grid container spacing={2} sx={{ pb: 1 }}>
                        <Grid item md={6}>
                            <table className="normal-table" cellSpacing="0">
                                <tbody>
                                    <tr>
                                        <td colSpan="2">BILLING DETAILS:</td>
                                    </tr>
                                    <tr>
                                        <td>COMPANY</td>
                                        <td>{items.company}</td>
                                    </tr>
                                    <tr>
                                        <td>TAX NO.</td>
                                        <td>
                                            {items.billing
                                                ? items.billing.tax_no
                                                : ""}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>CONTACT PERSON:</td>
                                        <td>
                                            {items.billing
                                                ? items.billing.contact_person
                                                : ""}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>ADDRESS</td>
                                        <td>
                                            {items.billing
                                                ? items.billing.address
                                                : ""}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>CONTACT NO.</td>
                                        <td>
                                            {items.billing
                                                ? items.billing.contact_no
                                                : ""}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>EMAIL</td>
                                        <td>
                                            {items.billing
                                                ? items.billing.email
                                                : ""}
                                        </td>
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
                                        <td>
                                            {items.billing
                                                ? items.billing.tax_no
                                                : ""}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>CONTACT PERSON:</td>
                                        <td>
                                            {items.contact_person
                                                ? items.contact_person.profile
                                                      .name
                                                : ""}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>ADDRESS</td>
                                        <td>
                                            {items.billing
                                                ? items.billing.address
                                                : ""}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>CONTACT NO.</td>
                                        <td>
                                            {items.billing
                                                ? items.billing.contact_no
                                                : ""}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>EMAIL</td>
                                        <td>
                                            {items.contact_person
                                                ? items.contact_person.email
                                                : ""}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </Grid>
                    </Grid>

                    {/* Remarks */}
                    <Grid container spacing={2} sx={{ pb: 1 }}>
                        <Grid item xs={12} md={12}>
                            <table className="normal-table" cellSpacing="0">
                                <tbody>
                                    <tr>
                                        <td width="15%">REMARKS: </td>
                                        <td width="85%">
                                            {items.remarks_optional}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="15%">FINANCE REMARKS: </td>
                                        <td width="85%"></td>
                                    </tr>
                                    <tr>
                                        <td width="15%">* PAYMENT TERMS: </td>
                                        <td width="85%">
                                            {items.remarks_payment_terms}
                                        </td>
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
                        sx={{ py: 1 }}
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
                                    <small>{row.type}</small> <br />
                                     <span className="approval-name">{row.name.toLowerCase()} </span>
                                    <br />
                                     {row.designation} 
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
