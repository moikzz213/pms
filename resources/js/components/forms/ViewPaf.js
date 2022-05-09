import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import LoadingButton from "@mui/lab/LoadingButton";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import MobileDatePicker from "@mui/lab/MobileDatePicker";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import API from "../../services/api.js"; 
import { useDropzone } from "react-dropzone";
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
const ViewPaf = ({ id }) => { 
    const [files, setFiles] = useState("");
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
    
    const [invoiceSubmit, setInvoiceSubmit] = useState([{invoices: '', invoice_date: new Date().toLocaleDateString()}]);
    const [approvals, setApprovals] = useState([]);
    const [items, setItems] = useState({});
    const [image, setImage] = useState([]);
    useEffect(() => {
        let fetchApprovals = [];
        setApprovals(fetchApprovals);

        API.get("/v/payment-approval-form/fetch/" + id).then((response) => {
            let fetchItems = response.data.item;
            console.log(fetchItems);
            setItems(fetchItems);
            let img = "";
            if( fetchItems.company && (fetchItems.company.title).toLowerCase().includes("aboud group")){
                img = "/logo/gag.png";
            }else if( fetchItems.company && (fetchItems.company.title).toLowerCase().includes("gallega")){
                img = "/logo/gallega.png";
            }else if( fetchItems.company && (fetchItems.company.title).toLowerCase().includes("buygro")){
                img = "/logo/buygro.png";
            }else if( fetchItems.company && (fetchItems.company.title).toLowerCase().includes("catering")){
                img = "/logo/catering.png";
            }else if( fetchItems.company && (fetchItems.company.title).toLowerCase().includes("crystal")){
                img = "/logo/crystalbrook.png";
            }else if( fetchItems.company && (fetchItems.company.title).toLowerCase().includes("news")){
                img = "/logo/orient.png";
            }else if( fetchItems.company && (fetchItems.company.title).toLowerCase().includes("cars")){
                img = "/logo/gac.png";
            }else if( fetchItems.company && (fetchItems.company.title).toLowerCase().includes("gaelan")){
                img = "/logo/gaelan.png";
            }else if( fetchItems.company && (fetchItems.company.title).toLowerCase().includes("point")){
                img = "/logo/livepoint.png";
            }else if( fetchItems.company && (fetchItems.company.title).toLowerCase().includes("training")){
                img = "/logo/otc.png";
            }else if( fetchItems.company && (fetchItems.company.title).toLowerCase().includes("supermarket")){
                img = "/logo/supermarket.png";
            }else if( fetchItems.company && (fetchItems.company.title).toLowerCase().includes("olive")){
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

            setImage(fetchItems.images);
        });
    }, []);

    const [invoice_date, setInvoiceDate] = useState(
        new Date().toLocaleDateString()
    );
    
    const handleDateRow = (e, type) => {
        let dataAssign = Object.assign([], invoiceSubmit);
        if(type == 'date'){
            setInvoiceDate(e);
            dataAssign[0].invoice_date =  new Date(e).toLocaleDateString();
        }else{
            dataAssign[0].invoices =  e.target.value;
             
        }
        console.log(dataAssign);
        setInvoiceSubmit(dataAssign);
    }; 

    //Dropzone 
      
    const onDrop = useCallback((acceptedFiles) => {  
        setFiles(acceptedFiles);
    }, [setFiles]); 

    const {
        acceptedFiles, 
        getRootProps,
        getInputProps
      } = useDropzone({
        onDrop
      });
      
    const acceptedFileItems = acceptedFiles.map(file => ( 
        <li key={file.path}>
          {file.path} - {parseInt(file.size/ 1000) < 1000 ? (parseInt(file.size/ 1000)).toFixed(2) + " KB" : (parseInt(file.size/ 1000)/1000).toFixed(2) + "MB" }   
        </li>
      ));
    //   End Drop Zone

    const saveInvoice = (e) => {
        e.preventDefault();
        setLoading(true);
        let newMessage = {
            title: "info",
            message: "Please wait...",
        };
        setSeverity(newMessage);
        const data = new FormData(); 
        
        console.log(invoiceSubmit);
        data.append('user_id', items.user_id); 
        data.append('id', items.id); 
        data.append('invoice_date', invoiceSubmit[0].invoice_date); 
        data.append('invoices', invoiceSubmit[0].invoices); 
        if(files){
            files.forEach(file => {
                data.append('images[]', file, file.name);
            }); 
        }
     
        API
            .post("/v/payment-approval-form/invoice-update", data)
            .then((response) => {
                setOpen(true);
                setTimeout(() => {
                    newMessage = {
                        title: "success",
                        message: "This PAF Number is now closed!",
                    };
                    setLoading(false);
                    setSeverity(newMessage);
                }, 500); 
              
            })
            .catch((error) => {
                newMessage = {
                    title: "error",
                    message: "Kindly refresh the page.",
                };
                setSeverity(newMessage);
                setLoading(false);
            });
    }

    const changeStatus = (e, type) => {
        e.preventDefault();
        setOpen(true);
        setLoading(true);
        let newMessage = {
            title: "info",
            message: "Please wait...",
        };
        setSeverity(newMessage);  
        let data = {id : id, type: type};
        API.post('/v/payment-approval-form/update-status', data)
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
            <Box sx={{ flexGrow: 1 }} className="paf-table">
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
                        <Grid
                            item
                            sm={8}
                            xs={8}
                            md={8}
                            sx={{ display: "flex" }}
                        >
                            <img
                                src={logo}
                                srcSet={logo}
                                alt="Logo"
                                loading="lazy"
                                className="logo"
                            />

                            <h5 className="ma-0 paf-title">
                                {items.company ? items.company.title : ''}
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
                            {items.status !== 'cancelled' && items.status !== 'closed' && (
                            <LoadingButton
                                className="btn-cancel"
                                onClick={(e) => changeStatus(e, "cancelled")}
                                loading={loading}
                                variant="contained"
                                color="red"
                                size="small"
                                sx={{ mr: 1 }}
                            >
                                CANCEL PAF
                            </LoadingButton>
                            )}
                             {items.status !== 'onprocess'  && items.status !== 'closed' && (
                            <LoadingButton
                                className="btn-cancel"
                                onClick={(e) => changeStatus(e, "onprocess")}
                                loading={loading}
                                variant="contained"
                                color="orange"
                                size="small"
                                sx={{ mr: 1 }}
                            >
                                ON PROCESSED
                            </LoadingButton>
                            )}
                            {items.status !== 'onhold'  && items.status !== 'closed' && (
                            <LoadingButton
                                className="btn-cancel"
                                onClick={(e) => changeStatus(e, "onhold")}
                                loading={loading}
                                variant="contained" 
                                size="small"
                                sx={{ mr: 1 }}
                            >
                                ON HOLD
                            </LoadingButton>
                            )}
                            <div>PAYMENT APPROVAL FORM (PAF)</div>
                            <table
                                className="normal-table table-small "
                                cellSpacing="0"
                            >
                                <tbody>
                                    <tr>
                                        <th>PAF NO.</th>
                                        <th> {items.paf_no }</th>
                                    </tr>
                                    <tr>
                                        <th>VOUCHER DATE</th>
                                        <th> {new Date(
                                                items.created_at
                                            ).toLocaleDateString()} 
                                            </th>
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
                                        <th>{items.process_by ? items.process_by.name : "" }</th>
                                    </tr>
                                    <tr>
                                        <th>DEPARTMENT NAME</th>
                                        <th>PROCUREMENT</th>
                                    </tr>
                                    <tr>
                                        <th>PURCHASE LIMIT</th>
                                        <th>{items.purchase_limit}</th>
                                    </tr>
                                    <tr>
                                        <th>DOCUMENT NO. (FOR ACCOUNTS)</th>
                                        <th>{items.document_no_1}</th>
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
                                        <th>{items.department_head}</th>
                                    </tr>
                                    <tr>
                                        <th>MODE OF PAYMENT</th>
                                        <th>{items.mode_of_payment}</th>
                                    </tr>
                                    <tr>
                                        <th>CASH/CARD LIMIT</th>
                                        <th>{items.cash_card_limit}</th>
                                    </tr>
                                    <tr>
                                        <th>DOCUMENT NO (FOR ACCOUNTS)</th>
                                        <th>{items.document_no_2}</th>
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
                                            TOTAL AMOUNT IN {items.currency}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody> 
                                    {items.paf_items &&
                                        items.paf_items.map((row, index) => {
                                            return (
                                                <tr key={row.id+index} id={row.id}>
                                                    <td className="text-center">
                                                        {index + 1}
                                                    </td>
                                                    {index < items.paf_items.length-1 && ( 
                                                    <td className="text-center" rowSpan={index < items.paf_items.length-1  ? items.paf_items.length : ""}>
                                                      {items.supplier.title}
                                                    </td>
                                                    )}
                                                     {index == items.paf_items.length-1 && items.paf_items.length == 1 &&( 
                                                    <td className="text-center" >
                                                      {items.supplier.title}
                                                    </td>
                                                    )}
                                                    <td className="text-center">
                                                        {row.location}
                                                    </td>
                                                    <td className="text-center">
                                                        {row.supplier_invoice_num}
                                                    </td>
                                                    <td className="text-center">
                                                        {row.description}
                                                    </td>
                                                    <td className="text-right">
                                                    {new Date(
                                                            row.invoice_date
                                                        ).toLocaleDateString()}
                                                    </td>
                                                    <td className="text-center">{row.qty}</td>
                                                    <td className="text-center">{row.unit_price}</td>
                                                    <td className="text-right">
                                                        {(row.amount).toFixed(2)}
                                                    </td>
                                                    <td className="text-center">{row.vat}</td>
                                                    <td className="text-center">{row.total_amount ? (row.total_amount).toFixed(2) : '0.00'}</td>
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
                                        <td width="70%" style={{verticalAlign:"top"}}>{items.remarks_general}</td>
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
                                                           { items.total_amount  ? (items.total_amount).toFixed(2) : '0.00'}
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
                                                             {items.discount ? (items.discount).toFixed(2) : '0.00'}
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
                                                             {items.total_vat ? (items.total_vat).toFixed(2) : '0.00'}
                                                        </td>
                                                    </tr>
                                                    {items.currency == 'usd' && (
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
                                                           {items.currency_rate}
                                                        </td>
                                                    </tr>
                                                    )}
                                                    <tr>
                                                        <td
                                                            className="text-right"
                                                            width="60%"
                                                        >
                                                            NET AMOUNT (AED)
                                                        </td>
                                                        <td
                                                            className="text-right"
                                                            width="40%"
                                                        >
                                                           {items.net_amount ? (items.net_amount).toFixed(2) : '0.00'}
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
                                        <td width="80%">{items.amount_in_words}</td>
                                    </tr>
                                    <tr>
                                        <td width="20%">
                                            APPROVALS LIMIT FOR PAYMENT
                                        </td>
                                        <td width="80%">{items.approval_limit_payment}</td>
                                    </tr>
                                    <tr>
                                        <td width="20%">COMMENTS</td>
                                        <td width="80%">{items.remarks_finance}</td>
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
                            control={<Checkbox checked={items.budgeted == 1 ? true : false} />}
                            label="Budgeted according to policy"
                            disabled={items.budgeted == 1 ? false : true}
                        ></FormControlLabel>
                        <FormControlLabel
                            control={<Checkbox checked={items.budgeted == 2 ? true : false} />}
                            label="Not Budgeted"
                            disabled={items.budgeted == 2 ? false : true}
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
                    { items.status !== 'closed' && (
                    <>
                    <Grid item xs={12} md={2}>
                        INVOICE NO.
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            size="small"
                            required
                            onChange={(e) => handleDateRow(e, 'inv_num')}
                            variant="outlined"
                        ></TextField>
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
                                onChange={(e) => handleDateRow(e, 'date')}
                                sx={{
                                    padding: "8.5px 14px!important",
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} />
                                )}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} md={12} className="container">
                    <div {...getRootProps()} className="dropzone">
                                    <input {...getInputProps()} />
                                    <p>Drag 'n' drop some files here, or click to select files</p>
                                    <em>(Only *.jpeg, *.jpg and *.png images will be accepted)</em>
                                </div>
                                <aside>
                                    <h4>Files</h4>
                                    <ul>{acceptedFileItems}</ul>
                                </aside>
                    </Grid>
                  
                   
                    <Grid item md={6}></Grid>
                    <Grid item md={12}>
                        <small>Note: SAVE INVOICE button will automatically change the status to Closed! <br/>
                        You cannot edit/upload this PAF number onced submitted! </small>
                    </Grid>
                    <Grid item md={2}> 
                            <LoadingButton
                            className="btn-save-invoice"
                            color="primary"
                                    variant="contained"
                                   onClick={(e) => saveInvoice(e)}
                                    size="small"
                                    loading={loading}
                                >
                                    SAVE INVOICE
                                </LoadingButton>
                    </Grid>
                    </>
                    )}
                    { items.status == 'closed' && (
                        <>
                        <Grid item xs={12} md={12}>
                         <strong>Attachment(s): </strong>
                         {image.map((row, index) => {
                                  return(
                                      <li key={row.id} >
                                           <Link to={'/file/'+row.path} target="_blank" className="underlined" download>  {row.original_name}   </Link>
                                      </li>
                                      
                                  )
                              })
                             }
                             </Grid>
                             </>
                    )}
                </Grid>
            </Box>
        </Paper>
    );
};

export default ViewPaf;
