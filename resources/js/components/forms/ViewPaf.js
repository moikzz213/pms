import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
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
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Autocomplete from "@mui/material/Autocomplete";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import Modal from '@mui/material/Modal';
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function approvalLabelled(label) {
    if (label == "prepared_by") {
        return "Prepared By";
    } else if (label == "requested_by") {
        return "Requested By";
    } else if (label == "reviewed_by") {
        return "Reviewed By";
    } else if (label == "verified_by") {
        return "Verified By";
    } else if (label == "approved_by") {
        return "Approved By";
    }
}


var num = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split(" ");
var tens = "twenty thirty forty fifty sixty seventy eighty ninety".split(" ");
function number2words(n){
    if (n < 20) return num[n];
    var digit = n%10;
    if (n < 100) return tens[~~(n/10)-2] + (digit? " " + num[digit]: " ");
    if (n < 1000) return num[~~(n/100)] +" hundred " + (n%100 == 0? " ": number2words(n%100));
    if (n < 1000000) return number2words(~~(n/1000)) +" thousand " + (n%1000 == 0? " ": number2words(n%1000));
     return number2words(~~(n/1000000)) + " million " + (n%1000000 != 0? " " + number2words(n%1000000): "");
}
const ViewPaf = ({ id, logged }) => {
    const [files, setFiles] = useState("");
    const [logo, setLogo] = useState("");
    const [open, setOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [editEnable, setEditEnable] = useState(false);
    const [discount, setDiscount] = useState(0);
    const [severity, setSeverity] = useState({
        title: "",
        message: "",
    });
    const { vertical, horizontal } = {
        vertical: "bottom",
        horizontal: "center",
    };
    const [defaultMath, setDefaultMath] = useState("-"); 
    const [contactPersons, setContactPersons] = useState([]); 
    const [labelApproval, setLabelApproval] = useState([
        {
            id: "requested_by",
            title: "Requested By",
        },
        {
            id: "prepared_by",
            title: "Prepared By",
        },
        {
            id: "reviewed_by",
            title: "Reviewed By",
        },

        {
            id: "verified_by",
            title: "Verified By",
        },
        {
            id: "approved_by",
            title: "Approved By",
        },
    ]);

    const [totalamount, setTotalamount] = useState(0);

    const [editOnlyRows, setEditOnlyRows] = useState([]);
    const [netamount, setNetAmount] = useState(0);
    
    const [editDataObj, setEditDataObj] = useState([{}]);
    const [tempDataObj, setTempDataObj] = useState([{}]);
    const [tempEditTotal, setTempEditTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };
    const handleCloseModal = (e) => {
        e.preventDefault();
        setOpenModal(false);
        setReason("");
    };
    const [vat, setVat] = useState(0);
    const [tempVat, setTempVat] = useState(0);
    const [tempVat2, setTempVat2] = useState(0);
    const [approvalRows, setApprovalRows] = useState([]);
    const [customVAT, setCustomVAT] = useState(5);
     
    const [invoiceSubmit, setInvoiceSubmit] = useState([
        { invoices: "", invoice_date: new Date().toLocaleDateString() },
    ]);
    const [editTempTotal, setEditTempTotal] = useState(0);
    const [approvals, setApprovals] = useState([]);
    const [items, setItems] = useState({});
    const [image, setImage] = useState([]);
    const [itemSupplier, setItemSupplier] = useState([]);
    const [currency, setCurrency] = useState("aed");
    const [discountTitle, setDiscountTitle] = useState("");
    const [tableRows, setTableRows] = useState([]);
    const [rowCount, setRowCount] = useState(1);
    const [currencyRate, setCurrencyRate] = useState(1);
    const [supplierCount, setSupplierCount] = useState(0);
    const [reason, setReason] = useState("");
    function defaultFetch(logged) {
        setApprovals([]);
        setItems([]);
        API.get("/v/payment-approval-form/fetch/" + id).then((response) => {
            let fetchItems = response.data.item; 
            setItems(fetchItems);
            setCurrency(fetchItems.currency);
            setCurrencyRate(fetchItems.currency_rate);
            let img = "";
            if (
                fetchItems.company && fetchItems.company.images && fetchItems.company.images.length > 0  
            ) {
                img = '/file/'+fetchItems.company.images[0].path;
            }else if (
                fetchItems.company &&
                fetchItems.company.title.toLowerCase().includes("aboud group")
            ) {
                img = "/logo/gag.png";
            } else if (
                fetchItems.company &&
                fetchItems.company.title.toLowerCase().includes("gallega")
            ) {
                img = "/logo/gallega.png";
            } else if (
                fetchItems.company &&
                fetchItems.company.title.toLowerCase().includes("buygro")
            ) {
                img = "/logo/buygro.png";
            } else if (
                fetchItems.company &&
                fetchItems.company.title
                    .toLowerCase()
                    .includes("trade platform")
            ) {
                img = "/logo/buygro.png";
            } else if (
                fetchItems.company &&
                fetchItems.company.title.toLowerCase().includes("auto platform")
            ) {
                img = "/logo/autotrade.png";
            } else if (
                fetchItems.company &&
                fetchItems.company.title.toLowerCase().includes("catering")
            ) {
                img = "/logo/catering.png";
            } else if (
                fetchItems.company &&
                fetchItems.company.title.toLowerCase().includes("crystal")
            ) {
                img = "/logo/crystalbrook.png";
            } else if (
                fetchItems.company &&
                fetchItems.company.title.toLowerCase().includes("news")
            ) {
                img = "/logo/orient.png";
            } else if (
                fetchItems.company &&
                fetchItems.company.title.toLowerCase().includes("car trading")
            ) {
                img = "/logo/gac.png";
            } else if (
                fetchItems.company &&
                fetchItems.company.title.toLowerCase().includes("gaelan")
            ) {
                img = "/logo/gaelan.png";
            } else if (
                fetchItems.company &&
                fetchItems.company.title.toLowerCase().includes("point")
            ) {
                img = "/logo/livepoint.png";
            }else if (
                fetchItems.company &&
                fetchItems.company.title.toLowerCase().includes("spare parts")
            ) {
                img = "/logo/spareparts.png";
            } else if (
                fetchItems.company &&
                fetchItems.company.title.toLowerCase().includes("training")
            ) {
                img = "/logo/otc.png";
            } else if (
                fetchItems.company &&
                fetchItems.company.title.toLowerCase().includes("supermarket")
            ) {
                img = "/logo/supermarket.png";
            } else if (
                fetchItems.company &&
                fetchItems.company.title.toLowerCase().includes("olive")
            ) {
                img = "/logo/olive.png";
            } else {
                img = "/logo/gag.png";
            }

            setLogo(img);

            let approvals = [];
            fetchItems.paf_approvals.map((o, i) => {
                approvals[i] = {
                    id: o.user_id,
                    name: o.users.profile.name,
                    designation: o.users.profile.designation,
                    type: approvalLabelled(o.approval_type),
                };
            });
            setApprovals(approvals); 
            setImage(fetchItems.images);

            
            setCustomVAT(fetchItems.vat_custom); 
            setTempVat(fetchItems.total_vat);
            setVat(fetchItems.total_vat);
            setDiscountTitle(fetchItems.discount_title);
            setApprovalRows(fetchItems.paf_approvals);
            setDiscount(fetchItems.discount);
            setTempEditTotal(fetchItems.total_amount);
            setEditTempTotal(fetchItems.total_amount);
            setSupplierCount(fetchItems.supplier_count);
            setTempDataObj([
                {
                    remarks_general: fetchItems.remarks_general || "",
                    amount_in_words: fetchItems.amount_in_words || "",
                    approval_limit_payment:
                        fetchItems.approval_limit_payment || "",
                    remarks_finance: fetchItems.remarks_finance || "", 
                    total_vat: fetchItems.total_vat || 0,
                    vat_custom: fetchItems.vat_custom || 5,
                    discount: fetchItems.discount || 0,
                    discount_title: fetchItems.discount_title || "",
                    currency_rate: fetchItems.currency_rate || 1.00,
                    net_amount: fetchItems.net_amount || 0,
                    total_amount: fetchItems.total_amount || 0,
                    supplier_count: fetchItems.supplier_count,
                    currency: fetchItems.currency || 'aed'
                },
            ]);
            setEditDataObj([
                {
                    remarks_general: fetchItems.remarks_general || "",
                    amount_in_words: fetchItems.amount_in_words || "",
                    approval_limit_payment:
                        fetchItems.approval_limit_payment || "",
                    remarks_finance: fetchItems.remarks_finance || "", 
                    total_vat: fetchItems.total_vat || 0,
                    vat_custom: fetchItems.vat_custom || 5,
                    discount: fetchItems.discount || 0,
                    discount_title: fetchItems.discount_title || "",
                    currency_rate: fetchItems.currency_rate || 1.00,
                    net_amount: fetchItems.net_amount || 0,
                    total_amount: fetchItems.total_amount || 0,
                    supplier_count: fetchItems.supplier_count,
                    currency: fetchItems.currency || 'aed'
                },
            ]);
        });
    }

    const handleItemData = (e, index, type, isEdit) => {
        let value = '';
        
        if(e && e.target){
            value = e.target.value;
        } 
        let dataAssign = [];
        if(isEdit){
            dataAssign = Object.assign([], editOnlyRows);
        }else{
            dataAssign = Object.assign([], tableRows);
        }
        let newData = dataAssign.map((o, i) => {
            if (i == index && type == "location") {
                o.location = value;
            } else if (i == index && type == "supplier_invoice_num") {
                o.supplier_invoice_num = value;
            } else if (i == index && type == "description") {
                o.description = value;
            } else if (i == index && type == "lpo") {
                o.local_purchase_order_id = value;
            } else if (i == index && type == "serial") {
                o.serial_number = value;
            } else if (i == index && type == "supplier") {
                o.supplier_id = value;
                let newSuppCount = 0;
                if(value){
                    newSuppCount = supplierCount + 1;
                }else{
                    newSuppCount = supplierCount - 1;
                }
                setSupplierCount(newSuppCount);
                let assignObj = Object.assign([], tempDataObj); 
                assignObj.map((o,i) =>{
                    o.supplier_count = newSuppCount;
                    return o;
                });

                setEditDataObj(assignObj);
            }else if (i == index && type == "date") {
                o.invoice_date = e ? new Date(e).toLocaleDateString() : null;
            }
            return o;
        });

        if(isEdit){
            setEditOnlyRows(newData); 
        }else{
            setTableRows(newData);
        }
        console.log(editDataObj);
    };

    useEffect(() => { 
        defaultFetch(logged); 

         // Fetch Active Users
         API.get("/v/users/fetch-active-users").then((response) => {
            let fetchItems = response.data.item;
            fetchItems = Object.assign([], fetchItems);

            let newData = [];

            fetchItems.map((o, i) => {
                newData[i] = {
                    id: o.id,
                    user_id: o.id,
                    contact_person: o.profile ? o.profile.name : "",
                    email: o.email,
                    name: o.profile ? o.profile.name : "",
                };
            });

            setContactPersons(newData); 
           
        });

        
        API.get("/v/suppliers/fetch-non-paginate").then((response) => {
            let fetchItems = response.data.item;
            setItemSupplier(fetchItems);
        });
    }, [logged]);

    const [invoice_date, setInvoiceDate] = useState(
        new Date().toLocaleDateString()
    );

    const handleDateRow = (e, type) => {
        let dataAssign = Object.assign([], invoiceSubmit);
        if (type == "date") {
            setInvoiceDate(e);
            dataAssign[0].invoice_date = new Date(e).toLocaleDateString();
        } else {
            dataAssign[0].invoices = e.target.value;
        }

        setInvoiceSubmit(dataAssign);
    };

    //Dropzone

    const onDrop = useCallback(
        (acceptedFiles) => {
            setFiles(acceptedFiles);
        },
        [setFiles]
    );

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        onDrop,
    });

    const acceptedFileItems = acceptedFiles.map((file) => (
        <li key={file.path}>
            {file.path} -
            {parseInt(file.size / 1000) < 1000
                ? parseInt(file.size / 1000).toFixed(2) + " KB"
                : (parseInt(file.size / 1000) / 1000).toFixed(2) + "MB"}
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

        data.append("user_id", items.user_id);
        data.append("id", items.id);
        data.append("invoice_date", invoiceSubmit[0].invoice_date);
        data.append("invoices", invoiceSubmit[0].invoices);
        if (files) {
            files.forEach((file) => {
                data.append("images[]", file, file.name);
            });
        }

        API.post("/v/payment-approval-form/invoice-update", data)
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
    };

    const handleAddRow = () => {
        let totalRow = rowCount + 1;
        const newItem = {
            row: totalRow,
            local_purchase_order_id: "",
            supplier_id: "",
            location: "",
            serial_number: 1,
            supplier_invoice_num: "",
            description: "",
            invoice_date: "",
            qty: 1,
            unit_price: 0,
            total_amount: 0,
            amount: 0,
            vat: 0,
        };

        setRowCount(totalRow);
        setTableRows([...tableRows, newItem]);
    };

    const popUpCancelReason = () => {
        setOpenModal(true);
    }

    const handleCancelReason = (e) => {
        
        setReason(e.target.value);
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
        let reasonForCancellation = '';
        if(type == 'cancelled'){
            reasonForCancellation = reason;
        } 

        let data = { id: id, type: type, user_id: logged.id, reason: reasonForCancellation };
        API.post("/v/payment-approval-form/update-status", data).then(
            (response) => {
                setTimeout(() => {
                    newMessage = {
                        title: "success",
                        message: response.data.message,
                    };
                    setLoading(false);
                    setSeverity(newMessage);
                    if(type == 'cancelled'){
                        setOpenModal(false);
                    }
                    defaultFetch(logged);
                }, 1500);
            }
        );
    }; 

    const handleRemoveRow = (index) => {
        let rows = tableRows;
        rows.splice(index, 1);
        setTableRows([...rows]);

        calculateAmount("removedrow");
    };

    const handleSaveItem = (e, row,index, type) => {
        let data = { id: row.id, data: row, logged_id: logged.id, type: type};
        
        API.post("/v/payment-approval-form/item-update", data).then(
            (response) => {
                if(type == 'delete'){
                    let rows = editOnlyRows;
                    rows.splice(index, 1);
                    setEditOnlyRows([...rows]);
            
                    calculateAmountEditOnly("removedrow");
                }
            }
        );
    };

    const editPAF = (e, stats) => { 
        setEditEnable(stats);
        if (stats) { 
           
            setTotalamount(items.total_amount);
            setNetAmount(items.net_amount); 
            setEditOnlyRows([...items.paf_items]);
        } else {
            defaultFetch(logged);
        }
    };
    const updatePAF = (e) => {
        let addNewItems = {};
        
        if (tableRows.length > 0 && tableRows[0].amount > 0) {
            let newTablerow = Object.assign([], tableRows);
            let newItems = newTablerow.map((o, i) => { 
                delete o["row"];
                return o;
            });

            addNewItems = newItems;
        }

        let validateApprovals = {};
        if(approvalRows.length > 0){
            let newApprovals = Object.assign([], approvalRows);
            validateApprovals = newApprovals.map((o, i) => {
                delete o["created_at"];
                delete o["id"];
                delete o["payment_approval_form_id"];
                delete o["orders"];
                delete o["updated_at"];
                delete o["users"];
                delete o["row"];
                return o;
            });
        }

        setOpen(true);
        let newMessage = {
            title: "info",
            message: "Please wait...",
        };
        setSeverity(newMessage);

        let editObj = editDataObj;
       
        let data = {
            id: id,
            data: editObj[0],
            items: addNewItems,
            approvals: validateApprovals,
            logged_id: logged.id,
        };
        console.log(data);
       
        API.post("/v/payment-approval-form/paf-update", data).then(
            (response) => {
                setTimeout(() => {
                    newMessage = {
                        title: "success",
                        message: response.data.message,
                    };
                    setSeverity(newMessage);
                    setTableRows([]);
                    editPAF(null, false);
                }, 500);
            }
        );
    };

    const handleMath = (e) =>{ 
        setDefaultMath(e.target.value);
    }

    const handleApproveType = (event, index) => {
        let selected = event.target.value;

        let tempRows = approvalRows.map((o, i) => {
            if (i == index) {
                o.approval_type = selected;
            }
            return o;
        });
        setApprovalRows(tempRows);
    };

    const handleApproveEmployee = (e, index, val) => {
        let selected = val;
        
        let tempRows = approvalRows.map((o, i) => {
            if (i == index) {
                o.user_id = selected.user_id;
            }
            return o;
        });
        setApprovalRows(tempRows);
    };

    const handleAddApproval = () => {
        let totalRow = approvals.length + 1;
        const newItem = {
            row: totalRow,
            approval_type: "",
            user_id: "",
        };

        setApprovalRows([...approvalRows, newItem]);
    };

    const handleRemoveApprovalRow = (index) => {
        let rows = approvalRows;
        rows.splice(index, 1);
        setApprovalRows([...rows]);
    };

    const calculateAmountEditOnly = (e, index, type) => {
        let value = '';
        if(e !== 'removedrow'){
            value = e.target.value;
        }
        let checkVAT = parseFloat(customVAT)/100;
        let netAmountz = 0;
        let curDiscount = 0;
        let totalVat = 0;
        let tempRows = editOnlyRows.map((o, i) => {
            if (i == index && type == "qty") {
                let amount = o.unit_price;

                if (!amount) {
                    amount = 0;
                }
                o.qty = value;
                let totalAmountz = value * amount;
                o.amount = totalAmountz.toFixed(2);
                let getVat = totalAmountz * checkVAT;
                o.vat = getVat.toFixed(2);
                o.total_amount = (totalAmountz + getVat).toFixed(2);
                 
            } else if (i == index && type == "price") {
                let qty = o.qty;

                if (!qty) {
                    qty = 1;
                }

                let totalAmountz = value * qty;
                let getVat = totalAmountz * checkVAT;
                o.amount = totalAmountz.toFixed(2);

                o.vat = getVat.toFixed(2);
                o.total_amount = (totalAmountz + getVat).toFixed(2);
                o.unit_price = value;
            } else if (i == index && type == "vat") {
                let amount = o.amount;

                if (!value) {
                    value = 0;
                    2;
                }
                o.vat = value;
                let totalAmountz = parseFloat(amount) + parseFloat(value);

                o.total_amount = totalAmountz.toFixed(2);
            }

            totalVat += parseFloat(o.vat);
            netAmountz += parseFloat(o.total_amount);

            return o;
        });
        console.log(netAmountz);
        if (isNaN(netAmountz)) {
            netAmountz = 0;
            tempRows = editOnlyRows.map((o, i) => {
                netAmountz += o.qty * o.unit_price;

                return o;
            });
        }
        
        curDiscount = discount;
         
        if (netAmountz < 0) {
            netAmountz = 0;
        } else {
            netAmountz = Math.round(netAmountz * 100) / 100;
        }
        let totalAmnt = netAmountz.toFixed(2);
        
        setTotalamount(totalAmnt); 
        

        let tVat2 = totalVat;

        setTempVat(tVat2.toFixed(2));
        setVat(tVat2.toFixed(2));

        let multiplication = defaultMath;
        if(multiplication == "-"){
            netAmountz = (netAmountz - curDiscount) * currencyRate;
        }else if(multiplication == "*"){ 
            netAmountz = (netAmountz * curDiscount) * currencyRate;
        }else if(multiplication == "/"){
            netAmountz = (netAmountz / curDiscount) * currencyRate;
        }else if(multiplication == "+"){
            netAmountz = (parseFloat(netAmountz) + parseFloat(curDiscount)) * currencyRate;
        }
        
        netAmountz = Math.round(netAmountz * 100) / 100;

        if (netAmountz < 0) {
            netAmountz = 0;
        }

        setNetAmount(netAmountz.toFixed(2));  

        setEditOnlyRows(tempRows);
        let dataAssign = Object.assign([], tempDataObj); 

        dataAssign[0].discount = curDiscount; 

        dataAssign[0].total_amount = totalAmnt;
        dataAssign[0].total_vat = totalVat;
        
        let cents = netAmountz.toFixed(2).split(".");
        let amountWords = number2words(cents[0]);
        let withCents = "";
       
        if(cents.length > 1){
            let addZero = "";

            if(cents[1].length == 1){
                addZero = cents[1]+"0";
            }else{
                  addZero = String(cents[1]);
                if(addZero.charAt(0) === '0'){
                    addZero.substring(1);
                }
            }
          
            withCents = number2words(Number(addZero));
             
            withCents = " And "+withCents;
        }

        dataAssign[0].amount_in_words = amountWords + withCents; 
       
        let newData = dataAssign.map((o, i) => {
            o.discount = curDiscount;
            o.net_amount = netAmountz.toFixed(2);
            o.total_amount = totalAmnt;
            o.total_vat = totalVat.toFixed(2);
            return o;
        });
        setTempEditTotal(totalAmnt);
        setEditTempTotal(totalAmnt);
        setEditDataObj(newData);
    };

    const calculateAmount = (e, index, type) => {
        let value = 0;

        if (e != "removedrow") {
            value = e.target.value;
        }
        let checkVAT = parseFloat(customVAT)/100;
         
        let curDiscount = 0;
        let totalVat = 0;
        
        let netAmountz = parseFloat(editTempTotal);
        curDiscount = discount;
        
        let tempRows = tableRows.map((o, i) => {
            if (i == index && type == "qty") {
                let amount = o.unit_price;

                if (!amount) {
                    amount = 0;
                }
                o.qty = value;
                let totalAmountz = value * amount;
                o.amount = totalAmountz.toFixed(2);
                let getVat = totalAmountz * checkVAT;
                o.vat = getVat.toFixed(2);
                o.total_amount = (totalAmountz + getVat).toFixed(2);
                 
            } else if (i == index && type == "price") {
                let qty = o.qty;

                if (!qty) {
                    qty = 1;
                }

                let totalAmountz = value * qty;
                let getVat = totalAmountz * checkVAT;
                o.amount = totalAmountz.toFixed(2);

                o.vat = getVat.toFixed(2);
                o.total_amount = (totalAmountz + getVat).toFixed(2);
                o.unit_price = value;
            } else if (i == index && type == "vat") {
                let amount = o.amount;

                if (!value) {
                    value = 0;
                    2;
                }
                o.vat = value;
                let totalAmountz = parseFloat(amount) + parseFloat(value);

                o.total_amount = totalAmountz.toFixed(2);
            }

            totalVat += parseFloat(o.vat);
            netAmountz += parseFloat(o.total_amount);

            return o;
        });  
        
        let dataAssign = Object.assign([], tempDataObj); 
        if (netAmountz < 0) {
            netAmountz = 0;
        } else {
            netAmountz = Math.round(netAmountz * 100) / 100;
        }
        let totalAmnt = netAmountz.toFixed(2);
       
        setTotalamount(totalAmnt);

        let tVat = parseFloat(tempVat) + totalVat;

        setTempVat2(tVat.toFixed(2));
        setVat(tVat.toFixed(2)); 

        let multiplication = defaultMath;
        if(multiplication == "-"){
            netAmountz = (netAmountz - curDiscount) * currencyRate;
        }else if(multiplication == "*"){ 
            netAmountz = (netAmountz * curDiscount) * currencyRate;
        }else if(multiplication == "/"){
            netAmountz = (netAmountz / curDiscount) * currencyRate;
        }else if(multiplication == "+"){
            netAmountz = (parseFloat(netAmountz) + parseFloat(curDiscount)) * currencyRate;
        } 
          
        netAmountz = Math.round(netAmountz * 100) / 100;

        if (netAmountz < 0) {
            netAmountz = 0;
        }

        setNetAmount(netAmountz.toFixed(2));  

        setTableRows(tempRows); 
    
        dataAssign[0].net_amount = netAmountz; 
        dataAssign[0].discount = curDiscount;  
        dataAssign[0].total_amount = totalAmnt;
        dataAssign[0].total_vat = totalVat;
        
        let cents = netAmountz.toString().split(".");
        let amountWords = number2words(cents[0]);
        let withCents = "";
       
        if(cents.length > 1){
           let addZero = "";
            if(cents[1].length == 1){
                addZero = cents[1]+"0";
            }else{
                  addZero = String(cents[1]);
                if(addZero.charAt(0) === '0'){
                    
                    addZero.substring(1);
                }
                
            }
          
            withCents = number2words(Number(addZero));
             
            withCents = " And "+withCents;
        }
        dataAssign[0].amount_in_words = amountWords + withCents; 
       
        let newData = dataAssign.map((o, i) => {
            o.discount = curDiscount;
            o.net_amount = netAmountz.toFixed(2);
            o.total_amount = totalAmnt;
            o.total_vat = totalVat.toFixed(2);
            return o;
        });
        setTempEditTotal(totalAmnt);
        setEditDataObj(newData);
    }; 

    const calculateDiscount = (e) => {
        let value = e ? e.target.value : 0;
        let newNetAmount = 0;
        setDiscount(value);
        let dataAssign = Object.assign([], tempDataObj);
        let multiplication = defaultMath;
        let newVat = vat;
        let newData = dataAssign.map((o, i) => {
            o.discount = value;

           
            if(multiplication == "-"){
                o.net_amount = (o.total_amount - value) * o.currency_rate;
                newNetAmount = (o.total_amount - value) * o.currency_rate;           
            }else if(multiplication == "*"){ 
                o.net_amount = (o.total_amount * value) * o.currency_rate; 
                newNetAmount = ((o.total_amount * value) * o.currency_rate );    
               
            }else if(multiplication == "/"){
                o.net_amount = (o.total_amount / value) * o.currency_rate;
                newNetAmount = (o.total_amount / value) * o.currency_rate;           
            }else if(multiplication == "+"){
                o.net_amount = (parseFloat(o.total_amount) + parseFloat(value)) * o.currency_rate;
                newNetAmount = (parseFloat(o.total_amount) + parseFloat(value)) * o.currency_rate;           
            } 
            
            return o;
        }); 
        
        newVat = Math.round(newNetAmount * parseFloat(customVAT))/100;

        if(multiplication == "*"){
            setVat(newVat);
            newNetAmount = newNetAmount + newVat;
        }

        let netAmountz = newNetAmount.toFixed(2);
        let cents = netAmountz.toString().split(".");
        let amountWords = number2words(cents[0]);
        let withCents = "";
        
        if(cents.length > 1){
           let addZero = "";
            if(cents[1].length == 1){
                addZero = cents[1]+"0";
            }else{
                  addZero = String(cents[1]);
                if(addZero.charAt(0) === '0'){
                    
                    addZero.substring(1);
                }
                
            } 
          
            withCents = number2words(Number(addZero));
             
            withCents = " And "+withCents;
        }
        newData[0].amount_in_words = amountWords + withCents; 

       
        newData[0].total_vat =newVat;
        newData[0].net_amount =newNetAmount.toFixed(2);
         
        setEditDataObj(newData);
        setNetAmount(newNetAmount.toFixed(2));   
    }

    const handleCurrencyRate = (e, rate, totalAmnt, disc) => {
        let value = 1;
        let newRate = 1;

        if (e) {
            value = e.target.value;
            newRate = value;
        } else {
            value = rate;
            newRate = rate;
        }

        let amount = parseFloat(totalamount) - parseFloat(discount);
        if (totalAmnt) {
            let totAmount = totalAmnt - disc;
            amount = parseFloat(totAmount);
        }

        let newNetAmount = 0;

        if (!value && value <= 0) {
            value = 1;
        }

        newNetAmount = amount * value;
        Math.round(newNetAmount * 100) / 100;

        let dataAssign = Object.assign([], tempDataObj);
        dataAssign[0].currency_rate = newRate;
        setCurrencyRate(newRate);
        dataAssign[0].net_amount = newNetAmount;
        let netAmountz = newNetAmount.toFixed(2);
        let cents = netAmountz.toString().split(".");
        let amountWords = number2words(cents[0]);
        let withCents = "";
        
        if(cents.length > 1){
           let addZero = "";
            if(cents[1].length == 1){
                addZero = cents[1]+"0";
            }else{
                  addZero = String(cents[1]);
                if(addZero.charAt(0) === '0'){
                    
                    addZero.substring(1);
                }
                
            } 
          
            withCents = number2words(Number(addZero));
             
            withCents = " And "+withCents;
        }
        dataAssign[0].amount_in_words = amountWords + withCents; 

        setEditDataObj(dataAssign);
        setNetAmount(newNetAmount.toFixed(2)); 
    };

    const handleFreeText = (e, type) => {
        let value = e.target.value;

        let dataAssign = Object.assign([], tempDataObj);

        let newData = dataAssign.map((o, i) => {
            if (type == "general_remarks") {
                console.log(e);
                o.remarks_general = value;
            } else if (type == "amount_words") {
                o.amount_in_words = value;
            } else if (type == "discount_title") {
                o.discount_title = value;
                setDiscountTitle(value);
            }else if (type == "currency") {
                o.currency = value;
                setCurrency(value);
            } 

            return o;
        });

        setEditDataObj(newData);
    };
    const handleCustomVat = (e) => { 
        
        let value = e.target.value;

        let dataAssign = Object.assign([], tempDataObj);

        let newData = dataAssign.map((o, i) => { 
                o.vat_custom = value; 
            return o;
        });

        setEditDataObj(newData);
        setCustomVAT(e.target.value);
    }
    return (
        <Paper sx={{ px: 3, py: 3 }}>
            <Box sx={{ flexGrow: 1 }} className="paf-table">
                <Snackbar
                    open={open}
                    autoHideDuration={4000}
                    anchorOrigin={{ vertical, horizontal }}
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

                <Modal
                open={openModal} 
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
                >
                <Box sx={{ position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,}}>
                    <h2 style={{marginTop:0}} id="parent-modal-title">What is your reason?</h2>
                    <TextField 
                        size="small"
                        label="Reason?"
                        fullWidth
                        name="reason"
                        onChange={(e) => handleCancelReason(e)}  
                        sx={{mb:2}}
                    > 
                    </TextField>
                    <LoadingButton
                        className="btn-cancel"
                        onClick={(e) =>
                            handleCloseModal(e)
                        } 
                        variant="contained"
                        color="black"
                        size="small"
                        sx={{ mr: 2 }}
                    >
                        CANCEL
                    </LoadingButton>
                    <LoadingButton
                        className="btn-cancel"
                        onClick={(e) =>
                            changeStatus(e, "cancelled")
                        }
                        loading={loading}
                        variant="contained"
                        color="primary"
                        size="small"
                        
                    >
                        SUBMIT
                    </LoadingButton>
                   
                </Box>
                </Modal>
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
                                {items.company ? items.company.title : ""}
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
                            {!editEnable && items.status !== "cancelled" &&
                                items.status !== "closed" && (
                                    <LoadingButton
                                        className="btn-cancel"
                                        onClick={(e) =>
                                            popUpCancelReason()
                                        } 
                                        variant="contained"
                                        color="red"
                                        size="small"
                                        sx={{ mr: 1 }}
                                    >
                                        CANCEL PAF
                                    </LoadingButton>
                                )}
                            {!editEnable && items.status !== "onprocess" && ((
                                items.status !== "closed") || ( logged.role == 'admin')) && (
                                    <LoadingButton
                                        className="btn-cancel"
                                        onClick={(e) =>
                                            changeStatus(e, "onprocess")
                                        }
                                        loading={loading}
                                        variant="contained"
                                        color="orange"
                                        size="small"
                                        sx={{ mr: 1 }}
                                    >
                                        ON PROCESSED
                                    </LoadingButton>
                                )}
                            {!editEnable && items.status !== "onhold" &&
                                items.status !== "closed" && (
                                    <LoadingButton
                                        className="btn-cancel"
                                        color="orange"
                                        onClick={(e) =>
                                            changeStatus(e, "onhold")
                                        }
                                        loading={loading}
                                        variant="contained"
                                        size="small"
                                        sx={{ mr: 1 }}
                                    >
                                        ON HOLD
                                    </LoadingButton>
                                )}

                            {!editEnable &&
                                items.status !== "cancelled" &&
                                items.status !== "closed" && (
                                    <LoadingButton
                                        className="btn-info no-print"
                                        color="black"
                                        size="small"
                                        variant="contained"
                                        onClick={(e) => editPAF(e, true)}
                                    >
                                        Edit PAF
                                    </LoadingButton>
                                )}
                            {editEnable && (
                                <>
                                    <LoadingButton
                                        className="btn-info"
                                        color="black"
                                        size="small"
                                        variant="contained"
                                        onClick={(e) => editPAF(e, false)}
                                    >
                                        Close Edit
                                    </LoadingButton>
                                    <LoadingButton
                                        className="btn-info"
                                        color="green"
                                        size="small"
                                        sx={{ mx: 1 }}
                                        variant="contained"
                                        onClick={(e) => updatePAF(e)}
                                    >
                                        Update PAF
                                    </LoadingButton>
                                </>
                            )}
                            <div>PAYMENT APPROVAL FORM (PAF)</div>
                            <table
                                className="normal-table table-small "
                                cellSpacing="0"
                            >
                                <tbody>
                                    <tr>
                                        <th>PAF NO.</th>
                                        <th> {items.paf_no}</th>
                                    </tr>
                                    <tr>
                                        <th>VOUCHER DATE</th>
                                        <th>
                                            {new Date(
                                                items.created_at
                                            ).toLocaleDateString('en-GB')}
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                        </Grid>
                        {items.status == 'cancelled' &&
                         <Grid className="no-print" item md={12} sx={{borderTop:1, borderBottom: 1, mb:2, py: "10px !important"}}>
                             REASON: {items.reasons}
                        </Grid>
                        }
                        <Grid
                            item
                            md={6}
                            sx={{ paddingTop: "0 !important", maxHeight: 95 }}
                        >
                            <table
                                className="normal-table table-small"
                                cellSpacing="0"
                            >
                                <tbody>
                                    <tr>
                                        <th width="250">REQUESTED BY</th>
                                        <th>
                                            {items.process_by
                                                ? items.process_by.name
                                                : ""}
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>DEPARTMENT NAME</th>
                                        <th>PROCUREMENT</th>
                                    </tr>
                                    <tr>
                                        <th>PURCHASE LIMIT</th>
                                        <th>
                                            {items.purchase_limit !== 0
                                                ? items.purchase_limit
                                                : ""}
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>DOCUMENT NO. (FOR ACCOUNTS)</th>
                                        <th>{items.document_no_1}</th>
                                    </tr>
                                </tbody>
                            </table>
                        </Grid>
                        <Grid
                            item
                            md={6}
                            sx={{ paddingTop: "0!important", maxHeight: 95 }}
                        >
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
                                        <th>
                                            {items.cash_card_limit !== 0
                                                ? items.cash_card_limit
                                                : ""}
                                        </th>
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
                    <Grid
                        container
                        spacing={2}
                        sx={{ py: 3, my: "0 !important" }}
                    >
                          {editEnable && (
                            <>
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
                            <Grid item md={4} sx={{display: "flex"}}>
                            <TextField
                                    select
                                    size="small"
                                    label="Currency" 
                                    value={currency}
                                    onChange={(e) =>  handleFreeText(e, "currency")} 
                                    SelectProps={{
                                        native: true,
                                    }}
                                >
                                     <option value="aed"> AED </option>
                                <option value="aud"> AUD </option>
                                <option value="bhd"> BHD </option>
                                <option value="egp"> EGP </option>
                                <option value="eur"> EUR </option>
                                <option value="gbp"> GBP </option>
                                <option value="jod"> JOD </option>
                                <option value="lira"> LIRA </option>
                                <option value="usd"> USD </option>
                                </TextField>

                                <TextField 
                                size="small"
                                label="% VAT"
                                value={customVAT}
                                onChange={(e) => handleCustomVat(e)}
                                sx={{
                                    width: "90px !important;",
                                    marginTop: "08px !important",
                                    marginLeft: "20px !important",
                                }}
                                
                            > 
                            </TextField>
                            </Grid>
                            </>
                        )}
                        <Grid item md={12} sm={12} xs={12}>
                        {!editEnable && (
                            <table
                                className="normal-table table-small"
                                cellSpacing="0"
                            >
                                <thead>
                                    <tr>
                                        <th
                                            className="text-center"
                                            style={{ width: 35 }}
                                        >
                                            SR #
                                        </th>
                                        <th
                                            className="text-center"
                                            style={{ width: 100 }}
                                        >
                                            SUPPLIER NAME
                                        </th>
                                        <th className="text-center">
                                            LOCATION
                                        </th>
                                        <th className="text-center">
                                            SUPPLIER INV. NO.
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
                                            style={{ width: 50 }}
                                        >
                                            UNIT PRICE
                                        </th>
                                        <th className="text-center">
                                            TOTAL AMOUNT
                                        </th>
                                        <th className="text-center">
                                            VAT {items.vat_custom || "5"}%
                                        </th>
                                        <th
                                            className="text-center"
                                            style={{ width: 55 }}
                                        >
                                            TOTAL AMOUNT({items.currency})
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.paf_items &&
                                        items.paf_items.map((row, index) => {
                                            return (
                                                <tr
                                                    key={row.id + index}
                                                    id={row.id}
                                                >
                                                    <td className="text-center">
                                                        {index + 1}
                                                    </td>
                                                    {items.supplier_count < 2 &&
                                                        index == 0 && (
                                                            <td
                                                                className="text-center"
                                                                rowSpan={
                                                                    index <
                                                                    items
                                                                        .paf_items
                                                                        .length
                                                                        ? items
                                                                              .paf_items
                                                                              .length
                                                                        : ""
                                                                }
                                                            >
                                                                {row.supplier
                                                                    ? row
                                                                          .supplier
                                                                          .title
                                                                    : ""}
                                                            </td>
                                                        )}

                                                    {items.supplier_count >
                                                        1 && (
                                                        <td className="text-center">
                                                            {row.supplier
                                                                ? row.supplier
                                                                      .title
                                                                : ""}
                                                        </td>
                                                    )}

                                                    <td className="text-center">
                                                        {row.location}
                                                    </td>
                                                    <td className="text-center">
                                                        {
                                                            row.supplier_invoice_num
                                                        }
                                                    </td>
                                                    <td
                                                        style={{
                                                            maxWidth: 200,
                                                        }}
                                                    >
                                                        <pre
                                                            style={{
                                                                whiteSpace:
                                                                    "pre-wrap",
                                                            }}
                                                        >
                                                            {row.description}
                                                        </pre>
                                                    </td>
                                                    <td className="text-center">
                                                        { row.invoice_date ? new Date(
                                                            row.invoice_date
                                                        ).toLocaleDateString('en-GB') : ""}
                                                    </td>
                                                    <td className="text-center">
                                                        {row.qty}
                                                    </td>
                                                    <td className="text-center">
                                                        {(row.unit_price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                    </td>
                                                    <td className="text-right">
                                                        {(Number(row.amount)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                    </td>
                                                    <td className="text-center">
                                                        {row.vat.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                    </td>
                                                    <td className="text-right">
                                                        {row.total_amount
                                                            ? parseFloat(row.total_amount).toFixed(
                                                                  2
                                                              ).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                                            : "0.00"}
                                                    </td>
                                                </tr>
                                            );
                                        })} 
                                    <tr>
                                        <td
                                            style={{ verticalAlign: "top" }}
                                            rowSpan="4"
                                            colSpan="8"
                                        >
                                            <pre>{items.remarks_general}</pre>
                                        </td>
                                        <th className="text-right">
                                     
                                                {items.total_amount
                                                    ? (items.total_amount - items.total_vat).toFixed(
                                                            2
                                                        ).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                                    : "0.00"}
                                                              
                                        </th>
                                        <th className="text-right">
                                            {items.total_vat
                                                ? items.total_vat.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                                : "0.00"}
                                        </th>
                                        <th className="text-right">
                                            {items.total_amount
                                                ? (items.total_amount).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                                : "0.00"}
                                        </th>
                                    </tr>
                                    <tr>
                                        <td colSpan="2" className="text-right">
                                            {items.discount_title}
                                        </td>
                                        <th className="text-right">
                                            {items.discount
                                                ? items.discount.toFixed(2)
                                                : "0.00"}
                                        </th>
                                    </tr>
                                    {currency !== "aed" && (
                                        <tr>
                                            <td
                                                className="text-right"
                                                colSpan="2"
                                            >
                                                <span className="text-uppercase">{currency}</span> TO AED
                                            </td>
                                            <td className="text-right">
                                                {items.currency_rate}
                                            </td>
                                        </tr>
                                    )}
                                    <tr>
                                        <td colSpan="2" className="text-right">
                                            NET AMOUNT (AED)
                                        </td>
                                        <th className="text-right">
                                        {editEnable && (
                                                <>
                                                    {netamount
                                                        ? netamount
                                                        : items.net_amount.toFixed(
                                                              2
                                                          ).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                </>
                                            )}
                                            {!editEnable && (
                                                <>
                                                    {items.net_amount
                                                        ? items.net_amount.toFixed(
                                                              2
                                                          ).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                                        : "0.00"}
                                                </>
                                            )}
                                            
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                        )}
                       
                       {editEnable && (

                           <>
                            <small className="text-warning">NOTE: SETUP THE VAT PERCENTAGE FIRST BEFORE UPDATING THE UNIT PRICE.</small>  
                                            <TableContainer sx={{ maxHeight: 600 }}>
                                            <Table
                                                stickyHeader
                                                aria-label="a dense table"
                                                className="dense-table"
                                            >
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>LPO/PRF*</TableCell>
                                                        <TableCell>LOCATION</TableCell>
                                                        <TableCell>SUPPLIER*</TableCell>
                                                        <TableCell>SUPPLIER INVOICE#</TableCell>
                                                        <TableCell>DESCRIPTION</TableCell>
                                                        <TableCell>S/N</TableCell>
                                                        <TableCell>INVOICE DATE</TableCell>
                                                        <TableCell>QTY*</TableCell>
                                                        <TableCell>UNIT PRICE*</TableCell>
                                                        <TableCell>TOTAL AMOUNT</TableCell>
                                                        <TableCell>{customVAT}% VAT</TableCell>
                                                        <TableCell>
                                                            TOTAL AMOUNT ({tempDataObj[0].currency})
                                                        </TableCell>
                                                        <TableCell></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {editOnlyRows.map((row, index) => {
                                                        return (
                                                            <TableRow
                                                            id={row.id + index}
                                                            key={row.id + index}
                                                            >
                                                                <TableCell
                                                                    sx={{ px: "0 !important" }}
                                                                >
                                                                    <TextField
                                                                        select
                                                                        size="small"
                                                                        label="LPO/PRF*"
                                                                        value={
                                                                            row.local_purchase_order_id ||
                                                                            ""
                                                                        }
                                                                        onChange={(e) =>
                                                                            handleItemData(
                                                                                e,
                                                                                index,
                                                                                "lpo",
                                                                                true
                                                                            )
                                                                        }
                                                                        SelectProps={{
                                                                            native: true,
                                                                        }}
                                                                    >
                                                                        <option value="">-</option>
                                                                        {items.relation == "lpo" && items.lpos &&
                                                                            items.lpos.map(
                                                                                (option) => (
                                                                                    <option
                                                                                        key={
                                                                                            option.id+row.id
                                                                                        }
                                                                                        value={
                                                                                            option.id
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            option.lpo_no
                                                                                        }
                                                                                    </option>
                                                                                )
                                                                            )}
                                                                        {items.relation == "prf" && items.prfs &&
                                                                            items.prfs.map(
                                                                                (option) => (
                                                                                    <option
                                                                                        key={
                                                                                            option.id+row.id
                                                                                        }
                                                                                        value={
                                                                                            option.id
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            option.prf_no
                                                                                        }
                                                                                    </option>
                                                                                )
                                                                            )}
                                                                    </TextField>
                                                                </TableCell>
                                                                <TableCell
                                                                    sx={{ px: "0 !important" }}
                                                                >
                                                                    <TextField
                                                                        label="Location"
                                                                        size="small"
                                                                        variant="outlined"
                                                                        value={row.location || ""}
                                                                        onChange={(e) =>
                                                                            handleItemData(
                                                                                e,
                                                                                index,
                                                                                "location",true
                                                                            )
                                                                        }
                                                                    />
                                                                </TableCell>
                                                                <TableCell
                                                                    sx={{ px: "0 !important" }}
                                                                >
                                                                    <TextField
                                                                        select
                                                                        size="small"
                                                                        label="Supplier*"
                                                                        value={
                                                                            row.supplier_id ||
                                                                            ""
                                                                        }
                                                                        onChange={(e) =>
                                                                            handleItemData(
                                                                                e,
                                                                                index,
                                                                                "supplier", true
                                                                            )
                                                                        }
                                                                        SelectProps={{
                                                                            native: true,
                                                                        }}
                                                                    >
                                                                        <option value="">
                                                                            -
                                                                        </option>
                                                                        {itemSupplier &&
                                                                            itemSupplier.map(
                                                                                (option) => (
                                                                                    <option
                                                                                        key={
                                                                                            option.id+row.id
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
                                                                <TableCell
                                                                    sx={{ px: "0 !important" }}
                                                                >
                                                                    <TextField
                                                                        label=""
                                                                        size="small"
                                                                        value={row.supplier_invoice_num || ""}
                                                                        variant="outlined"
                                                                        placeholder="Inv no."
                                                                        onChange={(e) =>
                                                                            handleItemData(
                                                                                e,
                                                                                index,
                                                                                "supplier_invoice_num", true
                                                                            )
                                                                        }
                                                                    />
                                                                </TableCell>
                                                                <TableCell
                                                                    sx={{ px: "0 !important" }}
                                                                >
                                                                    <TextareaAutosize
                                                                        aria-label="minimum height"
                                                                        minRows={2}
                                                                        maxRows={15}
                                                                        placeholder="Description"
                                                                        value={row.description || ""}
                                                                        onChange={(e) =>
                                                                            handleItemData(
                                                                                e,
                                                                                index,
                                                                                "description", true
                                                                            )
                                                                        }
                                                                        style={{
                                                                            width: "100%",
                                                                            border: "1px solid #cecece",
                                                                            padding: 10,
                                                                        }}
                                                                    />
                                                                </TableCell>
                                                                <TableCell
                                                                    sx={{ px: "0 !important" }}
                                                                >
                                                                    <TextField
                                                                        label="S/N"
                                                                        size="small"
                                                                        value={row.serial_number || ""}
                                                                        variant="outlined"
                                                                        onChange={(e) =>
                                                                            handleItemData(
                                                                                e,
                                                                                index,
                                                                                "serial", true
                                                                            )
                                                                        }
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
                                                                            value={
                                                                                row.invoice_date || ""
                                                                            }
                                                                            clearable
                                                                            onChange={(e) =>
                                                                                handleItemData(
                                                                                    e,
                                                                                    index,
                                                                                    'date', true
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
                                                                            calculateAmountEditOnly(
                                                                                e,
                                                                                index,
                                                                                "qty"
                                                                            )
                                                                        }
                                                                        variant="outlined"
                                                                        name="qty"
                                                                        sx={{
                                                                            width: "70px !important",
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
                                                                        variant="outlined"
                                                                        value={row.unit_price}
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
                                                                        value={"" || (Number(row.amount)).toFixed(2)}
                                                                        variant="outlined"
                                                                        sx={{
                                                                            width: "70px !important",
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
                                                                        value={"" || row.vat}
                                                                        variant="outlined"
                                                                        onChange={(e) =>
                                                                            calculateAmountEditOnly(
                                                                                e,
                                                                                index,
                                                                                "vat"
                                                                            )
                                                                        }
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
                                                                        disabled
                                                                        size="small"
                                                                        value={
                                                                            "" ||
                                                                            (Number(row.total_amount)).toFixed(2)
                                                                        }
                                                                        variant="outlined"
                                                                        sx={{
                                                                            width: "70px !important",
                                                                        }}
                                                                    />
                                                                </TableCell>
                                                                <TableCell
                                                                    sx={{
                                                                        padding: "0 !important",
                                                                    }}
                                                                > 
                                                                    <IconButton
                                                                            onClick={(e) =>
                                                                                handleSaveItem(
                                                                                    e,
                                                                                    row,
                                                                                    index,
                                                                                    'save'
                                                                                )
                                                                            }
                                                                            color="green"
                                                                            className="savebtn"
                                                                        >
                                                                            <SaveAsIcon />
                                                                        </IconButton>
                                                                        <IconButton
                                                                            onClick={(e) =>
                                                                                handleSaveItem(
                                                                                    e,
                                                                                    row,
                                                                                    index,
                                                                                    'delete'
                                                                                )
                                                                            }
                                                                            color="inherit"
                                                                            className="remove"
                                                                        >
                                                                            <DeleteIcon />
                                                                        </IconButton>
                                                                        
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                {tableRows.map((row, index) => {
                                        return (
                                            <TableRow
                                            id={`row-${row.id}`}
                                            key={`row-${index}`}
                                            >
                                                <TableCell
                                                    sx={{ px: "0 !important" }}
                                                >
                                                    <TextField
                                                        select
                                                        size="small"
                                                        label="LPO/PRF*"
                                                        onChange={(e) =>
                                                            handleItemData(
                                                                e,
                                                                index,
                                                                "lpo", false
                                                            )
                                                        }
                                                        SelectProps={{
                                                            native: true,
                                                        }}
                                                    >
                                                        <option value=""> 
                                                            - 
                                                        </option>
                                                        {items.relation == "lpo" && items.lpos &&
                                                                            items.lpos.map(
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
                                                                        option.lpo_no
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                        {items.relation == "prf" && items.prfs &&
                                                                            items.prfs.map(
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
                                                                        option.prf_no
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </TextField>
                                                </TableCell>
                                                <TableCell
                                                    sx={{ px: "0 !important" }}
                                                >
                                                    <TextField
                                                        label="Location"
                                                        size="small"
                                                        variant="outlined"
                                                        onChange={(e) =>
                                                            handleItemData(
                                                                e,
                                                                index,
                                                                "location", false
                                                            )
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell
                                                    sx={{ px: "0 !important" }}
                                                >
                                                    <TextField
                                                        select
                                                        size="small"
                                                        label="Supplier*"
                                                        onChange={(e) =>
                                                            handleItemData(
                                                                e,
                                                                index,
                                                                "supplier", false
                                                            )
                                                        }
                                                        SelectProps={{
                                                            native: true,
                                                        }}
                                                    >
                                                        <option value=""> 
                                                            - 
                                                        </option>
                                                        { itemSupplier && itemSupplier.map(
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
                                                <TableCell
                                                    sx={{ px: "0 !important" }}
                                                >
                                                    <TextField
                                                        label=""
                                                        size="small"
                                                        variant="outlined"
                                                        placeholder="Inv no."
                                                        onChange={(e) =>
                                                            handleItemData(
                                                                e,
                                                                index,
                                                                "supplier_invoice_num", false
                                                            )
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell
                                                    sx={{ px: "0 !important" }}
                                                >
                                                  
                                                 <TextareaAutosize
                                                aria-label="minimum height"
                                                minRows={2}
                                                maxRows={15}
                                                placeholder="Description"
                                                onChange={(e) =>
                                                    handleItemData(
                                                        e,
                                                        index,
                                                        "description", false
                                                    )
                                                }
                                                style={{
                                                    width: "100%",
                                                    border: "1px solid #cecece",
                                                    padding: 10,
                                                }}
                                            />
                                                </TableCell>
                                                <TableCell
                                                    sx={{ px: "0 !important" }}
                                                >
                                                    <TextField
                                                        label="S/N"
                                                        size="small"
                                                        variant="outlined"
                                                        onChange={(e) =>
                                                            handleItemData(
                                                                e,
                                                                index,
                                                                "serial", false
                                                            )
                                                        }
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
                                                            value={row.invoice_date || null}
                                                            inputFormat="MM/dd/yyyy" 
                                                            clearable
                                                            onChange={(e) =>
                                                                handleItemData(
                                                                    e,
                                                                    index,
                                                                    'date', false
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
                                                            width: "70px !important",
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
                                                        value={"" || row.amount}
                                                        variant="outlined"
                                                        sx={{
                                                            width: "70px !important",
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
                                                        value={"" || row.vat}
                                                        variant="outlined"
                                                        onChange={(e) =>
                                                            calculateAmount(
                                                                e,
                                                                index,
                                                                "vat"
                                                            )
                                                        }
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
                                                        disabled
                                                        size="small"
                                                        value={
                                                            "" ||
                                                            row.total_amount
                                                        }
                                                        variant="outlined"
                                                        sx={{
                                                            width: "70px !important",
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
                                        </>
                                        )}
                        </Grid>
                    </Grid>

                    {editEnable &&
                      <>
                  
                        <Grid container spacing={2} sx={{ py: 0 }}>
                            <Grid item xs={12} md={8}>
                                <Grid container spacing={2} sx={{ py: 0 }}>
                                    <Grid item xs={12} md={12}>
                                        <TextareaAutosize
                                            aria-label="minimum height"
                                            minRows={12}
                                            maxRows={15}
                                            placeholder="Remarks"
                                            value={tempDataObj[0].remarks_general || ""}
                                            onChange={(e) =>
                                                handleFreeText(
                                                    e,
                                                    "general_remarks"
                                                )
                                            }
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
                                <Grid container spacing={2} sx={{ pb: 0 }}>
                                    <Grid item xs={12} md={4} sx={{pt: "0 !important"}}>
                                        Total
                                    </Grid>
                                    <Grid item xs={12} md={8} sx={{pt: "0 !important"}}>
                                        <TextField
                                            size="small"
                                            label="Total"
                                            variant="outlined"
                                            disabled
                                            value={totalamount} 
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4} sx={{pt: "0 !important"}}>
                                        Total VAT
                                    </Grid>
                                    <Grid item xs={12} md={8} sx={{pt: "0 !important"}}>
                                        <TextField
                                            value={vat}
                                            size="small"
                                            disabled
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4} sx={{pt: "0 !important"}}>
                                    <TextField
                                            label="Discount"
                                            value={discountTitle}
                                            size="small"
                                            variant="outlined"
                                            margin="dense"
                                            onChange={(e) =>
                                                handleFreeText( e, 'discount_title' )
                                            }
                                        />

                                            <TextField
                                                label="SIGN" 
                                                size="small"
                                                value={defaultMath}
                                                variant="outlined"
                                                margin="dense" 
                                                onChange={(e) =>
                                                    handleMath( e )
                                                }
                                            />
                                    </Grid>
                                    <Grid item xs={12} md={8} sx={{pt: "0 !important"}}>
                                        <TextField
                                            label="Discount"
                                            size="small"
                                            type="number"
                                            value={discount}
                                            variant="outlined"
                                            margin="dense"
                                            onChange={(e) =>
                                                calculateDiscount(e)
                                            }
                                        />
                                    </Grid>

                                    {(currency !== "aed") && (
                                        <>
                                            <Grid item xs={4} md={4} sx={{pt: "0 !important"}}>
                                                <span className="text-uppercase">{currency}</span> TO AED
                                            </Grid>
                                            <Grid item xs={8} md={8} sx={{pt: "0 !important"}}>
                                                <TextField
                                                    size="small"
                                                    type="number"
                                                    variant="outlined"
                                                    value={currencyRate}
                                                    onChange={(e) =>
                                                        handleCurrencyRate(
                                                            e
                                                        )
                                                    }
                                                />
                                            </Grid>
                                        </>
                                    )}
                                   
                                    <Grid item xs={12} md={4} sx={{pt: "0 !important"}}>
                                        Net Amount
                                    </Grid>
                                    <Grid item xs={12} md={8} sx={{pt: "0 !important"}}>
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
                   
                </>
                    }

                    {/* Remarks */}
                    <Grid
                        container
                        spacing={2}
                        className="remarks-bottom"
                        sx={{ pb: "2px" }}
                    >
                        <Grid item xs={12} md={12}>
                            <table
                                className="normal-table table-small"
                                cellSpacing="0"
                            >
                                <tbody>
                                    <tr>
                                        <td width="20%">AMOUNT IN WORDS </td>
                                        <td
                                            width="80%"
                                            className="amount-words"
                                        >
                                            {!editEnable && items.amount_in_words}
                                            {editEnable && 
                                             <TextField
                                             size="small"
                                             variant="outlined"
                                             value={tempDataObj[0].amount_in_words || ""}
                                             className="full-width amount-words"
                                             onChange={(e) =>
                                                handleFreeText(e, "amount_words")
                                             }
                                         />
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="20%">
                                            APPROVALS LIMIT FOR PAYMENT
                                        </td>
                                        <td width="80%">
                                            {items.approval_limit_payment}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="20%">COMMENTS</td>
                                        <td width="80%">
                                            {items.remarks_finance}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="20%">PRF's/LPO'S</td>
                                        <td width="80%">
                                            {items.prfs && items.prfs.length > 0 && items.prfs.map((o,i) => {
                                                return (
                                                 <span key={o.prf_no} style={{mr:2, borderRight:1}}>{o.prf_no} / </span>
                                                )
                                            })}
                                             {items.lpos && items.lpos.length > 0 && items.lpos.map((o,i) => {
                                                return (
                                                 <span  key={o.lpo_no} style={{mr:2, borderRight:1}}>{o.lpo_no}/</span> 
                                                )
                                            })}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </Grid>
                    </Grid>

                    <Box
                        className="budget-area"
                        sx={{
                            py: 0,
                            mt: 0,
                            mb: "2px",
                            backgroundColor: "#e7e7e7",
                            textAlign: "center",
                        }}
                    >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={items.budgeted == 1 ? true : false}
                                />
                            }
                            label="Budgeted according to policy"
                            disabled={items.budgeted == 1 ? false : true}
                        ></FormControlLabel>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={items.budgeted == 2 ? true : false}
                                />
                            }
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
                        {editEnable && (
                            <>
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
                            <TableContainer>
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
                                            <TableCell>Sort</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {approvalRows.map((row, index) => {
                                            return (
                                                <TableRow
                                                    id={row.id+"-" + index}
                                                    key={
                                                        index +"-" +
                                                        row.id  
                                                    }
                                                >
                                                    <TableCell>
                                                        {index + 1}
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
                                                            sx={{ m: 0 }}
                                                            value={
                                                                row.approval_type || ""
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
                                                            {labelApproval.map(
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
                                                    <TableCell
                                                        sx={{ padding: "0 !important" }}
                                                    >
                                                        
                                                        <Autocomplete
                                                            disablePortal  
                                                            fullWidth
                                                            defaultValue={contactPersons.filter((o,i)=>{
                                                                return o.user_id === row.user_id;
                                                            })[0] || row.user_id}
                                                            sx={{ m: 0 }}
                                                            
                                                            options={
                                                                contactPersons
                                                            }
                                                            getOptionLabel={(
                                                                contact
                                                            ) =>
                                                                contact.name ||
                                                                ""
                                                            }
                                                            size="small"
                                                            onChange={(
                                                                e,
                                                                val
                                                            ) =>
                                                                handleApproveEmployee(
                                                                    e,
                                                                    index,
                                                                    val
                                                                )
                                                            }
                                                            renderOption={(
                                                                props,
                                                                option
                                                            ) => {
                                                                return (
                                                                    <li
                                                                        {...props}
                                                                        key={
                                                                            option.id + index
                                                                        } 
                                                                    >
                                                                        {
                                                                            option.name
                                                                        }
                                                                    </li>
                                                                );
                                                            }}
                                                            renderInput={(
                                                                params
                                                            ) => (
                                                                <TextField
                                                                    {...params}
                                                                    label="Approval*"
                                                                    fullWidth
                                                                />
                                                            )}
                                                        />
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
                            </>
                        )}
                        {!editEnable && (
                            <>
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
                                        maxWidth: "160px",
                                    }}
                                    key={row.id}
                                >
                                    <Box
                                        sx={{ border: 1, minHeight: 50 }}
                                    ></Box>
                                    <br />
                                    <small>{row.type}</small> <br />
                                    <span className="approval-name">
                                        {row.name.toLowerCase()}
                                    </span>
                                    <br />
                                    <small>{row.designation}</small>
                                </Grid>
                            );
                        })}
                        </>
                        )}
                    </Grid>
                </Box>
                        {!editEnable &&
                        <>
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

                <Grid className="no-print" container spacing={2} sx={{ mt: 1 }}>
                    {items.status !== "closed" && (
                        <>
                            <Grid item xs={12} md={2}>
                                INVOICE NO.
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    size="small"
                                    required
                                    onChange={(e) =>
                                        handleDateRow(e, "inv_num")
                                    }
                                    variant="outlined"
                                ></TextField>
                            </Grid>

                            <Grid item xs={12} md={2}>
                                INVOICE DATE
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                md={4}
                                className="row-date-picker"
                            >
                                <LocalizationProvider
                                    dateAdapter={AdapterDateFns}
                                >
                                    <MobileDatePicker
                                        label="Invoice date"
                                        size="small"
                                        variant="outlined"
                                        inputFormat="MM/dd/yyyy"
                                        value={invoice_date}
                                        onChange={(e) =>
                                            handleDateRow(e, "date")
                                        }
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
                                    <p>
                                        Drag 'n' drop some files here, or click
                                        to select files
                                    </p>
                                    <em>
                                        (Only *.jpeg, *.jpg and *.png images
                                        will be accepted)
                                    </em>
                                </div>
                                <aside>
                                    <h4>Files</h4>
                                    <ul>{acceptedFileItems}</ul>
                                </aside>
                            </Grid>

                            <Grid item md={6}></Grid>
                            <Grid item md={12}>
                                <small>
                                    Note: SAVE INVOICE button will automatically
                                    change the status to Closed! <br />
                                    You cannot edit/upload this PAF number onced
                                    submitted!
                                </small>
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
                    {items.status == "closed" && (
                        <>
                            <Grid item xs={12} md={12}>
                                <strong>Attachment(s): </strong>
                                {image.map((row, index) => {
                                    return (
                                        <li key={row.id}>
                                            <Link
                                                to={"/file/" + row.path}
                                                target="_blank"
                                                className="underlined"
                                                download
                                            >
                                                {row.original_name}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </Grid>
                        </>
                    )}
                </Grid>
                </>
                }
            </Box>
        </Paper>
    );
};

export default ViewPaf;
