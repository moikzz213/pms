import React, { useState, useEffect } from "react";
//import { useNavigate } from "react-router-dom";
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
import Autocomplete from "@mui/material/Autocomplete";
import DeleteIcon from "@mui/icons-material/Delete";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import MobileDatePicker from "@mui/lab/MobileDatePicker";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import LoadingButton from "@mui/lab/LoadingButton";

import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import API from "../../services/api.js";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
 
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
 
function getStyles(name, lpo, theme) {
    return {
        fontWeight:
            lpo.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};
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

const PafForm = ({ logged }) => {
   // const navigate = useNavigate();
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [fieldState, setFieldState] = useState(true);
    const [severity, setSeverity] = useState({
        title: "",
        message: "",
    });

    const { vertical, horizontal } = {
        vertical: "bottom",
        horizontal: "center",
    };

    const [loading, setLoading] = useState(false);
    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };

    //const defaultVat = 0.05; // 5% VAT
    // PAF HERE
    const [relation, setRelation] = useState("lpo");
    const [currency, setCurrency] = useState("AED");
    // End PAF
    
    const vatLabel = 5;
    const [customVAT, setCustomVAT] = useState(5);
    const [discountTitle, setDiscountTitle] = useState("Discount");
    const [defaultMath, setDefaultMath] = useState("-"); 
    const [dateValue, setDateValue] = useState(new Date().toLocaleDateString());
    const [preparedBy, setPreparedBy] = useState({ name: "", user_id: "" });
    const [supplierList, setSuppliers] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [prfList, setPrfList] = useState([]);
    const [lpoList, setLpoList] = useState([]);
    const [validate, setValidate] = useState([
        {
            supplier: "",
            payment_mode: "",
            net_amount: "",
            prf_lpo: "",
            approval: "",
            lpo: "",
        },
    ]); 


    const [approvalLabelled, setApprovalLabelled] = useState([
        {
            id: "requested_by",
            title: "Requested By",
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

    const [tableRows, setTableRows] = useState([
        {
            row: 0,
            local_purchase_order_id: "",
            supplier_id: "",
            location: "",
            supplier_invoice_num: "",
            description: "",
            invoice_date: null,
            qty: 1,
            unit_price: 0,
            amount: 0,
            vat: 0,
            total_amount: 0,
        },
    ]);
    
    const [approvalRows, setApprovalRows] = useState([
        {
            row: 0,
            approval_type: "",
            user_id: "",
        },
    ]);

    const [itemLPO, setItemLPO] = useState([]);
    const [itemSupplier, setItemSupplier] = useState([]);
    const [itemPRF, setItemPRF] = useState([]);
    const [totalamount, setTotalamount] = useState(0);
    const [rowCount, setRowCount] = useState(1);
    const [rowCountApproval, setRowCountApproval] = useState(1);
    const [netamount, setNetAmount] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [vat, setVat] = useState(0);
    const [supplier, setSupplier] = useState([]);

    const [prfs, setPrfs] = useState([]);
    const [lpo, setLpo] = useState([]);
    
    // Data to be submit
    const [objData, setObjData] = useState([
        {
            currency_rate: 1,
            currency: "aed",
            relation: "lpo", 
            vat_custom: 5,
            user_id: "",
            department_head: "Saleh Al Chalabi",
            department_name: "Procurement",
            budgeted: "",
            mode_of_payment: "",
            purchase_limit: 0,
            cash_card_limit: 0,
            document_no_1: "",
            document_no_2: "", 
            supplier_count: 0,
            total_amount: 0,
            total_vat: 0,
            discount: 0,
            net_amount: 0,
            remarks_general: "",
            amount_in_words: "",
            approval_limit_payment: "Up to AED 50,000 by Finance Manager, above AED 50,000 to AED 200,000 by Finance Director & all above by CEO & CFO Jointly.",
            remarks_finance: "",
            status: "onprocess",
        },
    ]);

    const handleSupplier = (event) => { 
         
        let selected = event.target.value;
        let checkedData = false; 
 
        if (selected.length <= 0) {
            
            setItemSupplier([]);
        } else {
            checkedData = true;
            let fff = [];
            selected.map((o, i) => {
                fff[i] = mapFilterData(supplierList, o);
            });
            setItemSupplier(fff); 
        }

        setSupplier(
            // On autofill we get a stringified value.
            typeof selected === "string" ? selected.split(",") : selected
        );

        let validatedData = validate.map((o, i) => { 
            o.supplier = checkedData;
            if (o.supplier && o.payment_mode && o.net_amount && o.prf_lpo && o.approval && o.lpo) {
                setFieldState(false);
            }
            return o;
        });

        setValidate(validatedData); 

        
    };

    const handlePrf = (event, val) => {
         
        let selected = val;
        let checkedData = false; 
 
        if (selected.length <= 0) {
            setSupplier([]);
            setItemPRF([]);
        } else {
            checkedData = true;
            let fff = [];
            selected.map((o, i) => {
                fff[i] = mapFilterData(prfList, o.id);
            });
            
            setItemPRF(fff); 

            if (selected.length == 1) { 
                let dataAssign = Object.assign([], objData); 
                dataAssign[0].company_id = fff[0].company_id; 
                setObjData(dataAssign);
            }
        }
        
        setPrfs( selected );

        let validatedData = validate.map((o, i) => { 
            o.prf_lpo = checkedData; 
            if (o.supplier && o.payment_mode && o.net_amount && o.prf_lpo && o.approval && o.lpo) {
                setFieldState(false);
            }
            return o;
        });

        setValidate(validatedData); 
         
    };

    const handleLpo = (event, val) => {
        let selected = val;
        
        let supplier = "";
        let company = "";
        let checkedData = false;
        if (selected.length <= 0) {
            setSupplier([]);
            setItemLPO([]);
        } else {
            checkedData = true;
            let fff = [];
            selected.map((o, i) => {
                fff[i] = mapFilterData(lpoList, o.id);
            });
            setItemLPO(fff);

            if (selected.length == 1) {
                let supp = mapFilterData(lpoList, selected[0].id);
               
                supplier = supp.supplier_id;
                company = supp.billing_details_id;
                setSupplier([supplier]);
                 
                let zzz = [];
                [supplier].map((o, i) => {
                    zzz[i] = mapFilterData(supplierList, o);
                });
                setItemSupplier(zzz); 

                let dataAssign = Object.assign([], objData); 
                dataAssign[0].company_id = company; 
                setObjData(dataAssign);
            }
        }

        setLpo(selected);

        let validatedData = validate.map((o, i) => {
            o.supplier = checkedData;
            o.prf_lpo = checkedData;

            if (o.supplier && o.payment_mode && o.net_amount && o.prf_lpo && o.approval && o.lpo) {
                setFieldState(false);
            }
            return o;
        });

        setValidate(validatedData);
    };

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

    const handleApproveEmployee = (event, index, val) => {
        let selected = val;
        
        let tempRows = approvalRows.map((o, i) => {
            if (i == index) {
                o.user_id = selected;
            }
            return o;
        });  
        setApprovalRows(tempRows);

        let validatedData = validate.map((o, i) => {
            o.approval = true;

            if (o.supplier && o.payment_mode && o.net_amount && o.prf_lpo && o.approval && o.lpo) {
                setFieldState(false);
            }
            return o;
        }); 

        setValidate(validatedData);
    };

    const handleDateRow = (value, index) => {
        let tempRows = tableRows.map((o, i) => {
            if (i == index) {
                o.invoice_date = value ? new Date(value).toLocaleDateString() : null;
            }

            return o;
        });
        console.log(tempRows);
        setTableRows(tempRows);
    };

    const handleCurrencyRate = (e, rate, totalAmnt, discount) => {
        let value = 1;
        let newRate = 1;
        let totalVat = vat;
        if (e) {
            value = e.target.value;
            newRate = value;
        } else {
            value = rate;
            newRate = rate;
        }

        let amount = parseFloat(totalamount);
        if (totalAmnt) {
            let totAmount = 0;
            let multiplication = defaultMath;
            if(multiplication == "-"){
                totAmount = totalAmnt - discount;
            }else if(multiplication == "*"){ 
                totAmount = totalAmnt * discount;
                totalVat = (netAmountz * parseFloat(customVAT))/100;
                totAmount = parseFloat(totAmount) + totalVat; 
            }else if(multiplication == "/"){
                totAmount = totalAmnt / discount;
            }else if(multiplication == "+"){
                totAmount = parseFloat(totalAmnt) + parseFloat(discount);
            }
              
            amount = parseFloat(totAmount);
        }

        let newNetAmount = 0;

        if (!value && value <= 0) {
            value = 1;
        }

        newNetAmount = amount * value;
        Math.round(newNetAmount * 100) / 100;

        let dataAssign = Object.assign([], objData);
        dataAssign[0].currency_rate = newRate;
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

        setObjData(dataAssign);
        setNetAmount(newNetAmount.toFixed(2)); 
     
    };

    const handleAddRow = () => {
        let totalRow = rowCount + 1;
        const newItem = {
            row: totalRow,
            location: "",
            supplier_invoice_num: "",
            supplier_id: "",
            invoice_date: null,
            description: "",
            qty: 1,
            unit_price: 0,
            amount: 0,
            vat: 0,
            total_amount: 0,
        };

        setRowCount(totalRow);
        setTableRows([...tableRows, newItem]);
    };

    const handleAddApproval = () => {
        let totalRow = rowCountApproval + 1;
        const newItem = {
            row: totalRow,
            approval_type: "",
            user_id: "",
        };

        setRowCountApproval(totalRow);
        setApprovalRows([...approvalRows, newItem]);
    };

    const handleObjData = (e, type) => {
        let value = e.target.value;
       
        let dataAssign = Object.assign([], objData);
        let newData = dataAssign.map((o, i) => {
            if (type == "purchase_limit") {
                o.purchase_limit = value;
            } else if (type == "mode_of_payment") {
                o.mode_of_payment = value; 
            } else if (type == "cash_card_limit") {
                o.cash_card_limit = value;
            } else if (type == "docs_account_1") {
                o.document_no_1 = value;
            } else if (type == "docs_account_2") {
                o.document_no_2 = value;
            } else if (type == "general_remarks") {
                o.remarks_general = value;
            } else if (type == "amount_words") {
                o.amount_in_words = value;
            } else if (type == "approval_limit") {
                o.approval_limit_payment = value;
            } else if (type == "finance_comment") {
                o.remarks_finance = value;
            }
            // else if(type == 'budget'){
            //     o.budgeted = value;
            // }
            else if (type == "dept_head") {
                o.department_head = value;
            }

            return o;
        }); 

        if (type == "mode_of_payment") {
             
            let validatedData = validate.map((o, i) => {
                o.payment_mode = true;

                if (o.supplier && o.payment_mode && o.net_amount && o.prf_lpo && o.approval && o.lpo) {
                    setFieldState(false);
                }
                return o;
            });
           
            setValidate(validatedData);
        }

        setObjData(newData);
    };

    const handleItemData = (e, index, type) => {
        let value = e.target.value;

        let dataAssign = Object.assign([], tableRows);
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
            }
            return o;
        });

        setTableRows(newData);

        if (type == "lpo") {
             
            let validatedData = validate.map((o, i) => {
                o.lpo = true;

                if (o.supplier && o.payment_mode && o.net_amount && o.prf_lpo && o.approval && o.lpo) {
                    setFieldState(false);
                }
                return o;
            });
           
            setValidate(validatedData);
        }
    };

    const calculateAmount = (e, index, type) => {
        let value = 0;

        if (e != "removedrow") {
            value = e.target.value;
        }
        let checkVAT = parseFloat(customVAT)/100;
        let netAmountz = 0;
        let curDiscount = 0;
        let totalVat = 0;
        let tempRows = tableRows.map((o, i) => {
            if (i == index && type == "qty") {
                let amount = o.unit_price;

                if (!amount) {
                    amount = 0;
                }
                o.amount = (value * amount).toFixed(2);
                o.qty = value;
                o.total_amount = (
                    parseFloat(o.amount) + parseFloat(checkVAT)
                ).toFixed(2);
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

        let multiplication = defaultMath;
        if(multiplication == "-"){
            netAmountz = netAmountz - curDiscount;
        }else if(multiplication == "*"){ 
            netAmountz = parseFloat(netAmountz) * parseFloat(curDiscount); 
            totalVat = (netAmountz * parseFloat(customVAT))/100;
            netAmountz = parseFloat(netAmountz) + totalVat; 
        }else if(multiplication == "/"){
            netAmountz = netAmountz / curDiscount;
        }else if(multiplication == "+"){
            netAmountz = parseFloat(netAmountz) + parseFloat(curDiscount);
        }
        netAmountz = Math.round(netAmountz * 100) / 100;

        if (netAmountz < 0) {
            netAmountz = 0;
        }

        setVat(totalVat.toFixed(2));
        setNetAmount(netAmountz.toFixed(2));   

        setTableRows(tempRows);
        let dataAssign = Object.assign([], objData);
        
        if (currency !== "aed" && currency !== "AED") {
            
            handleCurrencyRate(
                null,
                objData[0].currency_rate,
                totalAmnt,
                curDiscount
            );
        } else {
            dataAssign[0].net_amount = netAmountz;
        }

        let validatedData = validate.map((o, i) => {
            o.net_amount = true;

            if (o.supplier && o.payment_mode && o.net_amount && o.prf_lpo && o.approval && o.lpo) {
                setFieldState(false);
            }
            return o;
        }); 

        setValidate(validatedData);

        dataAssign[0].discount = curDiscount; 

        dataAssign[0].total_amount = totalAmnt;
        dataAssign[0].total_vat = totalVat;
        
        console.log(netAmountz);
        let cents = netAmountz.toString().split(".");
        console.log(cents);
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
       
        setObjData(dataAssign);
    }; 

    const handleDiscountTitle = (e) => {
        setDiscountTitle(e.target.value);
    }

    const handleMath = (e) =>{ 
        setDefaultMath(e.target.value);
    }

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
        let value = e.target.value;
        setCurrency(value);

        if (value == "aed") {
            handleCurrencyRate(null, 1, totalamount, discount);
        }

        let dataAssign = Object.assign([], objData);
        dataAssign[0].currency = value;

        setObjData(dataAssign);
    };

    const handleCustomVat = (e) => { 
        
        setCustomVAT(e.target.value);
    }

    const handleSubmitForm = (e) => {
        e.preventDefault();
        setLoading(true);
        let newMessage = {
            title: "info",
            message: "Please wait...",
        };
        setSeverity(newMessage);

        let suppCount = supplier;

        let dataAssign = Object.assign([], objData);
        let newData = dataAssign.map((o, i) => {
            o.status = "onprocess";
            o.supplier_count = suppCount.length;
            o.vat_custom = customVAT;
            o.discount_title = discountTitle;
            return o;
        });

        newData = Object.assign({}, newData);
        let newTablerow = Object.assign([], tableRows);
        let newItems = newTablerow.map((o, i) => { 
            delete o["row"];
            return o;
        });

        let prepend_prepared_by = [{
            approval_type: "prepared_by",
            user_id: preparedBy.user_id,
        }]; 
       
        
        let newApproval = approvalRows.map((o, i) => {
            o['user_id'] = o.user_id.id
            delete o["row"];
            return o;
        });

        newApproval = [...prepend_prepared_by, ...newApproval];

        let newLPO = [];
        lpo.map((o,i) => {
            newLPO[i] = o.id;
        });

        let newPRF = [];
        prfs.map((o,i) => {
            newPRF[i] = o.id;
        });

        let dataSubmit = [
            {
                lpo: newLPO,
                prfs: newPRF,
                details: newData,
                items: newItems,
                approvals: newApproval,
                user_id: logged.id,
            },
        ];
        
        API.post("/v/payment-approval-form/new", dataSubmit)
            .then((response) => {
               
                setOpen(true);
                setTimeout(() => {
                    newMessage = {
                        title: "success",
                        message: response.data.message,
                    };
                    setLoading(false);
                    setSeverity(newMessage);
                }, 500);

                setTimeout(() => {
                    // Route to Edit by id
                    // navigate(
                    //     "/d/procurement-team/payment-approval-forms/id/" +
                    //         response.data.id
                    // );
                    window.location.href =    "/d/procurement-team/payment-approval-forms/id/" +  response.data.id;
                }, 1000);
            })
            .catch((error) => {
                console.log(error);
                newMessage = {
                    title: "error",
                    message: error.message,
                };
                setSeverity(newMessage);
                setLoading(false);
            });
    };

    const handleRelation = (e) => {
        setRelation(e.target.value);
        setSupplier([]);
        if (e.target.value == "prf") { 
            setLpo([]);
            setItemLPO([]);
        } else {
            setPrfs([]); 
            setItemPRF([]);
        }

        let dataAssign = Object.assign([], objData);
        dataAssign[0].relation = e.target.value;

        setObjData(dataAssign);
    };

    useEffect(() => {
        API.get("/v/local-purchase-order/onprocess-status/fetch").then(
            (response) => {
                let fetchItems = response.data.item;
                setLpoList(fetchItems);
            }
        );

        API.get("/v/request/fetch-onprocess/pendings").then((response) => {
            let fetchItems = response.data.item;
            setPrfList(fetchItems);
        });

        API.get("/v/suppliers/fetch-non-paginate").then((response) => {
            let fetchItems = response.data.item;
            setSuppliers(fetchItems);
        });

        API.get("/v/users/fetch-active-users").then((response) => {
            let fetchItems = response.data.item;
            fetchItems = Object.assign([], fetchItems);

            let newData = [];

            fetchItems.map((o, i) => {
                newData[i] = {
                    id: o.id,
                    contact_person: o.profile ? o.profile.name : "",
                    email: o.email,
                    name: o.profile ? o.profile.name : "",
                };
            });

            setEmployees(newData);
        });
    }, []);

    useEffect(() => {
        API.get("/v/profile/fetch/" + logged.id).then((response) => {
            setPreparedBy(response.data.item);

            let dataAssign = Object.assign([], objData);
            dataAssign[0].user_id = response.data.item.user_id;

            setObjData(dataAssign);
        });
    }, [logged]);

    return (
        <Paper sx={{ px: 3, py: 3 }}>
            <Box sx={{ flexGrow: 1 }} className="paf-form">
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
                <Box
                    component="form"
                    onSubmit={(e) => handleSubmitForm(e)}
                    sx={{
                        "& .MuiTextField-root": { mx: 1, width: "90%" },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <Grid
                        container
                        spacing={2}
                        sx={{
                            borderBottom: "1px solid #cecece",
                            pb: 1,
                            mb: 1,
                            py: 3,
                        }}
                    >
                        <Grid item xs={12} md={12}>
                            <small> RELATION: </small> 
                            <small className="text-warning">
                                IF THERE IS LPO, SELECT LPO. OTHERWISE
                                SELECT PRF. 
                            </small>
                            <br/>
                            <small>PRF/LPO NO:</small>
                            <small className="text-warning"> ONLY ONPROCESS STATUS WILL BE SHOWN
                                ON DROPDOWN SELECTION!</small>
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
                                    PRF NO.*
                                </Grid>
                                <Grid item xs={12} md={4}>  

                                    <Autocomplete
                                            disablePortal
                                            fullWidth
                                            multiple
                                            options={prfList}
                                            disableClearable
                                            getOptionLabel={(data) => data.prf_no || ""}
                                            size="small"
                                            onChange={(e, value) =>
                                                handlePrf(e, value)
                                            }
                                            renderOption={(props, option) => {
                                                return (
                                                    <li {...props} key={option.id}>
                                                        {option.prf_no}
                                                    </li>
                                                );
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="PRF No*"
                                                    fullWidth
                                                />
                                            )}
                                        />
                                </Grid>
                            </>
                        )}
                        {relation == "lpo" && (
                            <>
                                <Grid item xs={12} md={2}>
                                    LPO NO.*
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    
                                    <Autocomplete
                                            disablePortal
                                            fullWidth
                                            multiple
                                            options={lpoList}
                                            disableClearable
                                            getOptionLabel={(data) => data.lpo_no || ""}
                                            size="small" 
                                            onChange={(e, value) =>
                                                handleLpo(e, value)
                                            }
                                            renderOption={(props, option) => {
                                                return (
                                                    <li {...props} key={option.id}>
                                                        {option.lpo_no}
                                                    </li>
                                                );
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="LPO No*"
                                                    fullWidth
                                                />
                                            )}
                                        />
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
                                value={preparedBy ? preparedBy.name : ""}
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            DEPARTMENT HEAD NAME*
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                size="small"
                                variant="outlined"
                                value={objData[0].department_head}
                                onChange={(e) => handleObjData(e, "dept_head")}
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
                            MODE OF PAYMENT*
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                size="small"
                                variant="outlined"
                                placeholder="Required"
                                onChange={(e) =>
                                    handleObjData(e, "mode_of_payment")
                                }
                            />
                        </Grid>

                        <Grid item xs={12} md={2}>
                            PURCHASE LIMIT
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                size="small"
                                type="number"
                                variant="outlined"
                                onChange={(e) =>
                                    handleObjData(e, "purchase_limit")
                                }
                            />
                        </Grid>

                        <Grid item xs={12} md={2}>
                            CASH/CREDIT CARD LIMIT
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                size="small"
                                variant="outlined"
                                type="number"
                                onChange={(e) =>
                                    handleObjData(e, "cash_card_limit")
                                }
                            />
                        </Grid>

                        <Grid item xs={12} md={2}>
                            DOCUMENT NO. (FOR ACCOUNTS)
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                size="small"
                                variant="outlined"
                                onChange={(e) =>
                                    handleObjData(e, "docs_account_1")
                                }
                            />
                        </Grid>

                        <Grid item xs={12} md={2}>
                            DOCUMENT NO. (FOR ACCOUNTS)
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                size="small"
                                variant="outlined"
                                onChange={(e) =>
                                    handleObjData(e, "docs_account_2")
                                }
                            />
                        </Grid>

                        <Grid item xs={12} md={2}>
                            SUPPLIER NAME*
                        </Grid>
                        <Grid item xs={12} md={4}> 
                        <FormControl
                                        fullWidth
                                        sx={{ width: "90%", ml: "9px" }}
                                    >
                                        <InputLabel sx={{ top: "-6px" }}>
                                        Supplier*
                                        </InputLabel>
                            <Select
                                            multiple
                                            size="small"
                                           
                                            value={supplier}
                                            onChange={(e) => handleSupplier(e)}
                                            input={
                                                <OutlinedInput label="Supplier" />
                                            }
                                            MenuProps={MenuProps}
                                        >
                                            {supplierList.map((option) => (
                                                <MenuItem
                                                    key={option.id}
                                                    value={option.id}
                                                    style={getStyles(
                                                        option,
                                                        supplier,
                                                        theme
                                                    )}
                                                >
                                                    {option.title}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        </FormControl>
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
                                    marginTop: "0 !important",
                                    marginLeft: "20px !important",
                                }}
                                
                            > 
                            </TextField>
                            <br/>
                        <small className="text-warning">NOTE: SETUP THE VAT PERCENTAGE FIRST BEFORE UPDATING THE UNIT PRICE. 
                        <br/>DEFAULT VAT: {vatLabel}% </small>  
                        </Grid>
                        <TableContainer>
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
                                                        select
                                                        size="small"
                                                        label="LPO/PRF*"
                                                        onChange={(e) =>
                                                            handleItemData(
                                                                e,
                                                                index,
                                                                "lpo"
                                                            )
                                                        }
                                                        SelectProps={{
                                                            native: true,
                                                        }}
                                                    >
                                                        <option value="">
                                                            {" "}
                                                            -{" "}
                                                        </option>
                                                        { itemLPO && itemLPO.map(
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
                                                        { itemPRF && itemPRF.map(
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
                                                                "location"
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
                                                                "supplier"
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
                                                                "supplier_invoice_num"
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
                                                        "description"
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
                                                                "serial"
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
                                                onChange={(e) =>
                                                    handleObjData(
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
                                                value={"" || totalamount}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            Total VAT
                                        </Grid>
                                        <Grid item xs={12} md={8}>
                                            <TextField
                                                value={"" || vat}
                                                size="small"
                                                disabled
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                        <TextField
                                                label="Discount"
                                                value={discountTitle}
                                                size="small"
                                                variant="outlined"
                                                margin="dense"
                                                onChange={(e) =>
                                                    handleDiscountTitle( e )
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
                                        <Grid item xs={12} md={8}>
                                            <TextField
                                                label="Discount"
                                                size="small"
                                                type="number"
                                                variant="outlined"
                                                margin="dense"
                                                onChange={(e) =>
                                                    calculateAmount(
                                                        e,
                                                        null,
                                                        "discount"
                                                    )
                                                }
                                            />
                                        </Grid>

                                        {(currency == "usd" || currency == "aud" || currency == "bhd"
                                        || currency == "jod" || currency == "egp" || currency == "lira" || currency == "eur" || currency == "gbp") && (
                                            <>
                                                <Grid item xs={4} md={4}>
                                                    <span className="text-uppercase">{currency}</span> TO AED
                                                </Grid>
                                                <Grid item xs={8} md={8}>
                                                    <TextField
                                                        size="small"
                                                        type="number"
                                                        variant="outlined"
                                                        value={
                                                            objData.currency_rate
                                                        }
                                                        onChange={(e) =>
                                                            handleCurrencyRate(
                                                                e
                                                            )
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
                                                value={"" || netamount}
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
                                size="small"
                                variant="outlined"
                                value={objData[0].amount_in_words || ""}
                                className="full-width amount-words"
                                onChange={(e) =>
                                    handleObjData(e, "amount_words")
                                }
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            APPROVALS LIMIT FOR PAYMENT
                        </Grid>
                        <Grid item xs={12} md={10}>
                            <TextField
                                className="full-width"
                                size="small"
                                value="Up to AED 50,000 by Finance Manager, above AED 50,000 to AED 200,000 by Finance Director &amp; all above by CEO &amp; CFO Jointly."
                                variant="outlined"
                                onChange={(e) =>
                                    handleObjData(e, "approval_limit")
                                }
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            FINANCE COMMENTS
                        </Grid>
                        <Grid item xs={12} md={10}>
                            <TextField
                                className="full-width"
                                onChange={(e) =>
                                    handleObjData(e, "finance_comment")
                                }
                                size="small"
                                variant="outlined"
                            />
                        </Grid>
                    </Grid>

                    <Box
                        sx={{
                            mb: 2,
                            backgroundColor: "#cecece",
                            textAlign: "center",
                        }}
                    >
                        <FormControl>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                onChange={(e) => handleObjData(e, "budget")}
                            >
                                <FormControlLabel
                                    value="1"
                                    control={<Radio />}
                                    label="BUDGETED"
                                />
                                <FormControlLabel
                                    value="2"
                                    control={<Radio />}
                                    label="NOT BUDGETED"
                                />
                            </RadioGroup>
                        </FormControl>
                    </Box>

                    {/* Approval Setup */}
                    <Grid container spacing={2} sx={{ py: 2 }}>
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
                        <Grid item md={10} xs={12}>
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
                                            <TableCell>-</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>1</TableCell>
                                            <TableCell>Prepared By</TableCell>
                                            <TableCell>
                                                {preparedBy
                                                    ? preparedBy.name
                                                    : ""}
                                            </TableCell>
                                        </TableRow>
                                        {approvalRows.map((row, index) => {
                                            return (
                                                <TableRow
                                                    id={`row-${row.user_id}`}
                                                    key={row.user_id + index}
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
                                                            value={
                                                                row.approval_type
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
                                                    <Autocomplete
                                                            disablePortal
                                                            fullWidth
                                                            sx={{ m: 0 }}
                                                            options={
                                                                employees
                                                            }
                                                            getOptionLabel={(
                                                                contact
                                                            ) =>
                                                                contact
                                                                    ? contact.name
                                                                    : ""
                                                            }
                                                            value={row.user_id || ""}
                                                            size="small"
                                                            onChange={( e, val ) =>
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
                                                                            option.id
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
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} sx={{ py: 2 }}>
                        <Grid item md={12}>
                        <LoadingButton
                                id="addBtn"
                                variant="contained"
                                color="secondary"
                                disabled={fieldState}
                                onClick={(e) => handleSubmitForm(e)}
                                loading={loading}
                            >
                                SUBMIT FORM
                                </LoadingButton>
                        </Grid>
                        <Grid item md={12}>
                            <small>Once form has been submitted, it cannot be Edited.</small> <br/>
                            <small>Be sure to check the <b>approvals</b> before submitting.</small>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Paper>
    );
};

export default PafForm;
