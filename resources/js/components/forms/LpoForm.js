import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Autocomplete from "@mui/material/Autocomplete";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import LoadingButton from "@mui/lab/LoadingButton";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import API from "../../services/api.js";
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
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
        company: "",
        location: "",
        request: "",
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

const LpoForm = ({ logged }) => {
   // const navigate = useNavigate();
    const defaultVat = 0.05; // 5% VAT
    const vatLabel = 5;

    const [customVAT, setCustomVAT] = useState(5);
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
    const [preparedBy, setPreparedBy] = useState({});

    const [dateValue, setDateValue] = useState(new Date().toLocaleDateString());
    const [prfDetails, setPrfDetails] = useState(funcSetPRF());
    const [supplierDetails, setSupplierDetails] = useState(funcSetSupplier());
    const [companyDefault, setCompanyDefault] = useState(funcSetCompany());
    const [shippingCompany, setShippingCompany] = useState(funcSetCompany());
    const [contactPersonDefault, setContactPersonDefault] = useState(
        funcSetContactPerson()
    );
    const [val, setVal] = useState({});
    const [department, setDepartment] = useState([
        {
            id: null,
            title: "",
        },
    ]);
    const [contactPersons, setContactPersons] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [shippingCompanies, setShippingCompanies] = useState([]);
    const [supplierList, setSuppliers] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [prfList, setPrfList] = useState([]);
    const [categoryList, setCategories] = useState([]);
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
            category_id: "",
            item: "",
            specification: "",
            qty: 1,
            uom: "",
            unit_price: 0,
            amount: 0,
        },
    ]);

    function fetchDepartments() {
        API.get("/v/departments/fetch-non-paginate")
            .then((response) => {
                let fetchItems = response.data.item;
                fetchItems = Object.assign([], fetchItems);

                setDepartment(fetchItems);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const [approvalRows, setApprovalRows] = useState([
        {
            row: 0,
            approval_type: "",
            user_id: "",
        },
    ]);

    useEffect(() => {
        // Fetch Suppliers
        API.get("/v/suppliers/fetch-non-paginate").then((response) => {
            let fetchItems = response.data.item;
            fetchItems = Object.assign([], fetchItems);

            setSuppliers(fetchItems);
        });

        // Fetch Companies
        API.get("/v/companies/fetch-non-paginate").then((response) => {
            let fetchItems = response.data.item;
            fetchItems = Object.assign([], fetchItems);

            setCompanies(fetchItems);
            setShippingCompanies(fetchItems);
        });

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
            setEmployees(newData);
        });

        API.get("/v/categories/fetch-non-paginate").then((response) => {
            let fetchItems = response.data.item;
            fetchItems = Object.assign([], fetchItems);

            setCategories(fetchItems);
        });

        fetchDepartments();
    }, []);

    useEffect(() => {
        API.get("/v/request/fetch-onprocess/pendings").then((response) => {
            let fetchItems = response.data.item;
            fetchItems = Object.assign([], fetchItems);

            let newData = [];

            fetchItems.map((o, i) => {
                newData[i] = {
                    id: o.id,
                    prf_no: o.prf_no,
                    company: o.company ? o.company.title : "",
                    company_id: o.company ? o.company.id : "",
                    code: o.company ? o.company.code : "",
                    location: o.location ? o.location.title : "",
                    location_id: o.location_id,
                    details: o.details,
                };
            });

            setPrfList(newData);
        });
    }, []);

    useEffect(() => {
        API.get("/v/profile/fetch/" + logged.id).then((response) => {
            setPreparedBy(response.data.item);
        });
    }, [logged]);

    const [payterms, setPayterms] = React.useState("");
    const [paymode, setPaymode] = React.useState("");
    const [totalamount, setTotalamount] = useState(0);
    const [rowCount, setRowCount] = useState(1);
    const [rowCountApproval, setRowCountApproval] = useState(1);
    const [netamount, setNetAmount] = useState(0);
    const [licenseMonth, setLicenseMonth] = useState(0);
    const [licenseTotalAmount, setLicenseTotalAmount] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [vat, setVat] = useState(0);
    const [supplier, setSupplier] = useState("");
    const [persons, setPersons] = useState("");
    const [company, setCompany] = useState("");
    const [shipping, setShipping] = useState("");
    const [prfs, setPrfs] = useState("");
    const [enableLicense, setEnableLicense] = useState(false);
    // Data to be submit
    const [objData, setObjData] = useState([{
        currency: "aed"
    }]);
    const [validate, setValidate] = useState([
        {
            supplier: "",
            prf: "",
            payment_term: "",
            payment_mode: "",
            contact_person: "",
            billing: "",
            net_amount: "",
            department: "",
        },
    ]);

    const handleSupplier = (event, val) => {
        let selected = val.id;
        let checkedData = false;
        if (!selected) {
            setSupplierDetails(funcSetSupplier());
        } else {
            let supp = mapFilterData(supplierList, selected);
            checkedData = true;
            setSupplierDetails(supp);
        }
        setSupplier(selected);

        let validatedData = validate.map((o, i) => {
            o.supplier = checkedData;
           
            if (
                o.supplier &&
                o.prf &&
                o.payment_term &&
                o.payment_mode &&
                o.contact_person &&
                o.billing &&
                o.net_amount &&
                o.department
            ) {
                setFieldState(false);
            }
            return o;
        });

        setValidate(validatedData);
    };

    const handleCompany = (event, direct) => {
        let selected = "";
        if (direct) {
            selected = event;
        } else {
            selected = event.target.value;
        }

        let checkedData = false;
        if (!selected) {
            setCompanyDefault(funcSetCompany());
        } else {
            let supp = mapFilterData(companies, selected);
            checkedData = true;
            setCompanyDefault(supp);
        }
        setCompany(selected);

        let validatedData = validate.map((o, i) => {
            o.billing = checkedData;

            if (
                o.supplier &&
                o.prf &&
                o.payment_term &&
                o.payment_mode &&
                o.contact_person &&
                o.billing &&
                o.net_amount &&
                o.department
            ) {
                setFieldState(false);
            }
            return o;
        });

        setValidate(validatedData);
    };

    const handleShippingCompany = (event, direct) => {
        let selected = "";
        if (direct) {
            selected = event;
        } else {
            selected = event.target.value;
        }

        if (!selected) {
            setShippingCompany(funcSetCompany());
        } else {
            let supp = mapFilterData(shippingCompanies, selected);
            setShippingCompany(supp);
        }
        setShipping(selected);
    };

    const handleContactPerson = (e, val) => {
        let selected = "";
        if (val) {
            selected = val.id;
        } else {
            selected = e.target.value;
        }

        let checkedData = false;
        if (!selected) {
            setContactPersonDefault(funcSetContactPerson());
        } else {
            let supp = mapFilterData(contactPersons, selected);
            checkedData = true;
            setContactPersonDefault(supp);
        }
        setPersons(selected);

        let validatedData = validate.map((o, i) => {
            o.contact_person = checkedData;

            if (
                o.supplier &&
                o.prf &&
                o.payment_term &&
                o.payment_mode &&
                o.contact_person &&
                o.billing &&
                o.net_amount &&
                o.department
            ) {
                setFieldState(false);
            }
            return o;
        });

        setValidate(validatedData);
    };

    const handlePrf = (event,val) => {
        let selected = val.id;
       
        let checkedData = false;
        if (!selected) {
            setPrfDetails(funcSetPRF());
        } else {
            let supp = mapFilterData(prfList, selected);
            checkedData = true;
          
            setPrfDetails(supp);
            handleShippingCompany(supp.company_id, "direct");
            handleCompany(supp.company_id, "direct");
        }
        setPrfs(selected);
        let validatedData = validate.map((o, i) => {
            o.prf = checkedData;

            if (
                o.supplier &&
                o.prf &&
                o.payment_term &&
                o.payment_mode &&
                o.contact_person &&
                o.billing &&
                o.net_amount &&
                o.department
            ) {
                setFieldState(false);
            }
            return o;
        });

        setValidate(validatedData);
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
                o.user_id = selected;
            }
            return o;
        });  
        setApprovalRows(tempRows);
    };

    const handleFreeText = (e, val, type) => {
        let value = e.target.value;

        let dataAssign = Object.assign([], objData);
        let newData = dataAssign.map((o, i) => {
            if (type == "remarks_general") {
                o.remarks_general = value;
            } else if (type == "remarks_optional") {
                o.remarks_optional = value;
            } else if (type == "remarks_finance") {
                o.remarks_finance = value;
            } else if (type == "remarks_payment_terms") {
                o.remarks_payment_terms = value;
            } else if (type == "delivery_terms") {
                o.delivery_terms = value;
            } else if (type == "supplier_ref_num") {
                o.supplier_ref_num = value;
            } else if (type == "license_title_label_2") {
                o.license_title_label_2 = value;
            } else if (type == "license_title_label_1") {
                o.license_title_label_1 = value;
            } else if (type == "prf_extension") {
                o.prf_extension = value;
            } else if (type == "department") {
                o.department_id = val ? val.id : "";
            }else if (type == "currency") {
                o.currency = value;
            }

            return o;
        });

        setObjData(newData);

        let checkedData = false;

        if (type == "department") {
            if (val && val.id) {
                checkedData = true;
            }
            let validatedData = validate.map((o, i) => {
                o.department = checkedData;

                if (
                    o.supplier &&
                    o.prf &&
                    o.payment_term &&
                    o.payment_mode &&
                    o.contact_person &&
                    o.billing &&
                    o.net_amount &&
                    o.department
                ) {
                    setFieldState(false);
                } else {
                    setFieldState(true);
                }
                return o;
            });

            setValidate(validatedData);
        }
    };

    const handlePayments = (e, type) => {
        let value = e.target.value;
        let checkedData = false;
        if (type == "payment_mode") {
            setPaymode(value);
            checkedData = true;
        } else if (type == "payment_terms") {
            setPayterms(value);
            checkedData = true;
        }

        let validatedData = validate.map((o, i) => {
            if (type == "payment_mode") {
                o.payment_mode = checkedData;
            } else if (type == "payment_terms") {
                o.payment_term = checkedData;
            }

            if (
                o.supplier &&
                o.prf &&
                o.payment_term &&
                o.payment_mode &&
                o.contact_person &&
                o.billing &&
                o.net_amount &&
                o.department
            ) {
                setFieldState(false);
            }
            return o;
        });

        setValidate(validatedData);
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

    const handleCustomVat = (e) => { 
        
        setCustomVAT(e.target.value);
    }

    const calculateAmount = (e, index, type) => {
        let value = 0;
        let totalMonth = 0;
        let checkVAT = parseFloat(customVAT)/100;
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
            totalVat = totalAmount * checkVAT;
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

        let validatedData = validate.map((o, i) => {
            o.net_amount = checkedData;

            if (
                o.supplier &&
                o.prf &&
                o.payment_term &&
                o.payment_mode &&
                o.contact_person &&
                o.billing &&
                o.net_amount &&
                o.department
            ) {
                setFieldState(false);
            }
            return o;
        });

        setValidate(validatedData);
    };

    const handleLicense = (e) => {
        
        setEnableLicense(e.target.checked);
        if (!e.target.checked) {
            setLicenseMonth(0);
        }
        calculateAmount("unchecked", e.target.checked);
    };

    const handleLicenseMonth = (e) => {
        setLicenseMonth(e.target.value);
        calculateAmount("license", e.target.value);
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

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();
        setLoading(true);
        setOpen(true);
        let newMessage = {
            title: "info",
            message: "Please wait...",
        };
        setSeverity(newMessage); 
        
        
        let dataAssign = Object.assign([], objData);
        let newData = dataAssign.map((o, i) => {
            o.supplier_id = supplier ? supplier : "";
            o.request_id = prfs ? prfs : "";
            o.location_id = prfDetails ? prfDetails.location_id : "";
            o.company = prfDetails ? prfDetails.company : "";
            o.company_id = prfDetails ? prfDetails.company_id : "";
            o.status = "onprocess";
            o.payment_mode = paymode;
            o.vat_custom = customVAT;
            o.payment_terms = payterms;
            o.contact_person = persons;
            o.billing_details_id = company;
            o.shipping_details_id = shipping;
            o.user_id = preparedBy.user_id;
            return o;
        });

        newData = Object.assign({}, newData);
        let newTablerow = Object.assign([], tableRows);
        let newItems = newTablerow.map((o, i) => {
            delete o["amount"];
            delete o["row"];
            return o;
        });

        let prepend_prepared_by = [{
            approval_type: "prepared_by",
            user_id: preparedBy.user_id,
        }];
         
        //approvalRows.unshift(prepend_prepared_by);
       
        let  newApproval = approvalRows.map((o, i) => {
            o['user_id'] = o.user_id.id
            delete o["row"];
            return o;
        });

        newApproval = [...prepend_prepared_by, ...newApproval];
        
        let dataSubmit = [
            {
                details: newData,
                items: newItems,
                approvals: newApproval,
                comp_code: prfDetails.code,
                supplier_code: supplierDetails.code,
                user_id: logged.id,
            },
        ];
        API.post("/v/local-purchase-order/new", dataSubmit)
            .then((response) => { 
                
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
                   
                    window.location.href =   "/d/procurement-team/local-purchase-orders/id/" +  response.data.id;
                }, 1000);
            })
            .catch((error) => {
                console.log(error);
                newMessage = {
                    title: "error",
                    message: "Kindly refresh the page.",
                };
                setSeverity(newMessage);
                setLoading(false);
            });
    };

    return (
        <Paper sx={{ px: 3, py: 3 }}>
            <Box sx={{ flexGrow: 1 }} className="lpo-form">
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
                        "& .MuiTextField-root": { m: 1, width: "90%" },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <Grid
                        container
                        spacing={2}
                        sx={{
                            borderBottom: "1px solid #cecece",
                            py: 3,
                            pb: 1,
                            mb: 1,
                        }}
                    >
                        <Grid item xs={12} md={12}>
                            <Box sx={{ py: 2 }} color="red">
                                Suppliers &amp; Company details can be added /
                                updated at Settings Section
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            TO
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Autocomplete
                                disablePortal
                                fullWidth
                                options={supplierList}
                                getOptionLabel={(supplier) => supplier.title}
                                size="small"
                                onChange={(e, value) =>
                                    handleSupplier(e, value)
                                }
                                renderOption={(props, option) => {
                                    return (
                                        <li {...props} key={option.id}>
                                            {option.title}
                                        </li>
                                    );
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Supplier*"
                                        fullWidth
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={2}>
                            LPO NO.
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
                            ADDRESS
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                label="Address"
                                size="small"
                                variant="outlined"
                                value={
                                    supplierDetails.address
                                        ? supplierDetails.address
                                        : ""
                                }
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            LPO DATE
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
                            TAX NO.
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                label="Tax No."
                                size="small"
                                variant="outlined"
                                value={
                                    supplierDetails.tax_no
                                        ? supplierDetails.tax_no
                                        : ""
                                }
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            SUPPLIER REFERENCE#
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                label="Reference No."
                                size="small"
                                variant="outlined"
                                onChange={(e) =>
                                    handleFreeText(e, null, "supplier_ref_num")
                                }
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            CONTACT NO.
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                label="Contact No."
                                size="small"
                                variant="outlined"
                                value={
                                    supplierDetails.contact_no
                                        ? supplierDetails.contact_no
                                        : ""
                                }
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            Company
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                label="Company"
                                size="small"
                                variant="outlined"
                                value={
                                    prfDetails.company ? prfDetails.company : ""
                                }
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            LOCATION
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                label="Location"
                                size="small"
                                variant="outlined"
                                value={prfDetails.location}
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            PRF NO. *
                        </Grid>
                        <Grid item xs={12} md={4} sx={{ display: "flex" }}>
                           
                            <Autocomplete
                                disablePortal
                                sx={{ width: "60% !important" }}
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


                            <TextField
                                label="PRF Ext.(Optional)"
                                size="small"
                                variant="outlined"
                                onChange={(e) =>
                                    handleFreeText(e, null, "prf_extension")
                                }
                                sx={{ width: "40% !important" }}
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            EMAIL
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                label="Email"
                                size="small"
                                variant="outlined"
                                value={
                                    supplierDetails.email
                                        ? supplierDetails.email
                                        : ""
                                }
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            TOTAL AMOUNT
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                label="Total Amount"
                                size="small"
                                variant="outlined"
                                value={netamount}
                            />
                        </Grid>
                    </Grid>
                    {/* Table - Items */}
                    <Grid container spacing={2} sx={{ py: 3 }}>
                        <Grid item md={1}>
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
                                onChange={(e) =>  handleFreeText(e, null, "currency")} 
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
                                    marginTop: "8px !important",
                                    marginLeft: "20px !important",
                                }}
                                
                            > 
                            </TextField>
                        </Grid>
                        <Grid item md={3}>
                            <Autocomplete
                                disablePortal
                                fullWidth
                                sx={{ m: 0 }}
                                options={department}
                                getOptionLabel={(department) =>
                                    department.title || ""
                                }
                                size="small"
                                onChange={(e, value) =>
                                    handleFreeText(e, value, "department")
                                }
                                renderOption={(props, option) => {
                                    return (
                                        <li {...props} key={option.id}>
                                            {option.title}
                                        </li>
                                    );
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Department*"
                                        fullWidth
                                    />
                                )}
                            />
                            
                        </Grid>
                       
                        <Grid item md={12}>  
                        <small className="text-warning">NOTE: SETUP THE VAT PERCENTAGE FIRST BEFORE UPDATING THE UNIT PRICE. 
                        <br/>DEFAULT VAT: {vatLabel}% </small>  </Grid>
                        <TableContainer >
                            <Table
                                stickyHeader
                                aria-label="a dense table"
                                className="dense-table"
                            >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Category*</TableCell>
                                        <TableCell>Item*</TableCell>
                                        <TableCell>Specification</TableCell>
                                        <TableCell>Qty</TableCell>
                                        <TableCell>UOM</TableCell>
                                        <TableCell>Unit Price</TableCell>
                                        <TableCell>Amount</TableCell>
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
                                                        label="Item*"
                                                        size="small"
                                                        name="item"
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
                                                    handleFreeText(
                                                        e,
                                                        null,
                                                        "remarks_general"
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
                                        <Grid item xs={12} md={12}>
                                            <FormControlLabel
                                                control={<Checkbox />}
                                                label="Licenses?"
                                                onChange={handleLicense}
                                            />
                                            <small className="text-warning">
                                                Be sure to uncheck if not for
                                                Licenses!
                                            </small>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            Total
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                size="small"
                                                label="Total"
                                                variant="outlined"
                                                disabled
                                                value={totalamount}
                                            />
                                        </Grid>
                                        {enableLicense && (
                                            <>
                                                <Grid item xs={12} md={6}>
                                                    <TextField
                                                        sx={{
                                                            width: "100% !important",
                                                        }}
                                                        size="small"
                                                        label="EX. FROM OCT 2021"
                                                        variant="outlined"
                                                        onChange={(e) =>
                                                            handleFreeText(
                                                                e,
                                                                null,
                                                                "license_title_label_1"
                                                            )
                                                        }
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <TextField
                                                        size="small"
                                                        variant="outlined"
                                                        onChange={(e) =>
                                                            handleLicenseMonth(
                                                                e
                                                            )
                                                        }
                                                    />
                                                </Grid>

                                                <Grid item xs={12} md={6}>
                                                    <TextField
                                                        size="small"
                                                        sx={{
                                                            width: "100% !important",
                                                        }}
                                                        label="EX. TOTAL UNTIL AUG 2022"
                                                        variant="outlined"
                                                        onChange={(e) =>
                                                            handleFreeText(
                                                                e,
                                                                null,
                                                                "license_title_label_2"
                                                            )
                                                        }
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <TextField
                                                        size="small"
                                                        disabled
                                                        value={
                                                            licenseTotalAmount
                                                        }
                                                        variant="outlined"
                                                    />
                                                </Grid>
                                            </>
                                        )}
                                        <Grid item xs={12} md={6}>
                                            Discount
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                label="Discount"
                                                size="small"
                                                type="number"
                                                variant="outlined"
                                                onChange={(e) =>
                                                    calculateAmount(
                                                        e,
                                                        null,
                                                        "discount"
                                                    )
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            {customVAT}% VAT
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                value={vat ? vat : 0}
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
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            Net Amount
                                        </Grid>
                                        <Grid item xs={12} md={6}>
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

                    {/* Payment Terms */}
                    <Grid container spacing={2} sx={{ pb: 3 }}>
                        <Grid
                            item
                            xs={12}
                            md={4}
                            sx={{
                                border: "1px solid #cecece",
                                pb: 1,
                                minHeight: 177,
                            }}
                        >
                            <h4>PAYMENT TERMS*</h4>

                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue="female"
                                name="radio-buttons-group"
                                value={payterms}
                                onChange={(e) =>
                                    handlePayments(e, "payment_terms")
                                }
                            >
                                <FormControlLabel
                                    value="1"
                                    control={<Radio />}
                                    label="Credit"
                                />
                                <FormControlLabel
                                    value="2"
                                    control={<Radio />}
                                    label="Payment upon delivery"
                                />
                                <FormControlLabel
                                    value="3"
                                    control={<Radio />}
                                    label="Advance"
                                />
                            </RadioGroup>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={4}
                            sx={{
                                border: "1px solid #cecece",
                                pb: 1,
                                minHeight: 177,
                            }}
                        >
                            <h4>PAYMENT MODE*</h4>

                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue="female"
                                name="radio-buttons-group"
                                value={paymode}
                                onChange={(e) =>
                                    handlePayments(e, "payment_mode")
                                }
                            >
                                <FormControlLabel
                                    value="1"
                                    control={<Radio />}
                                    label="Cheque/Bank Transfers"
                                />
                                <FormControlLabel
                                    value="2"
                                    control={<Radio />}
                                    label="Credit Card"
                                />
                                <FormControlLabel
                                    value="3"
                                    control={<Radio />}
                                    label="Cash"
                                />
                            </RadioGroup>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={4}
                            sx={{
                                border: "1px solid #cecece",
                                pb: 1,
                                minHeight: 177,
                            }}
                        >
                            <h4>DELIVERY TERMS</h4>
                            <TextareaAutosize
                                aria-label="minimum height"
                                minRows={5}
                                maxRows={5}
                                placeholder=""
                                onChange={(e) =>
                                    handleFreeText(e, null, "delivery_terms")
                                }
                                style={{
                                    width: "95%",
                                    border: "1px solid #cecece",
                                    padding: 10,
                                }}
                            />
                        </Grid>
                    </Grid>

                    {/* Billing / Shipping Details */}
                    <Grid container spacing={2} sx={{ pb: 3 }}>
                        <Grid item xs={12} md={12}>
                            <Grid container spacing={2} sx={{ py: 3 }}>
                                <Grid
                                    item
                                    xs={12}
                                    md={6}
                                    sx={{
                                        border: "1px solid #cecece",
                                        pl: "30px !important",
                                    }}
                                >
                                    <Grid container spacing={2} sx={{ py: 3 }}>
                                        <Grid
                                            item
                                            xs={12}
                                            md={12}
                                            sx={{
                                                borderBottom:
                                                    "1px solid #cecece",
                                                mr: "16px !important",
                                                pb: "5px !important",
                                            }}
                                        >
                                            BILLING DETAILS*
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            COMPANY
                                        </Grid>
                                        <Grid item xs={12} md={8}>
                                            <TextField
                                                fullWidth
                                                select
                                                size="small"
                                                label="Business Unit"
                                                value={company ? company : ""}
                                                onChange={(e) =>
                                                    handleCompany(e)
                                                }
                                                SelectProps={{
                                                    native: true,
                                                }}
                                            >
                                                <option value=""> - </option>
                                                {companies.map((option) => (
                                                    <option
                                                        key={option.id}
                                                        value={option.id}
                                                    >
                                                        {option.title}
                                                    </option>
                                                ))}
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            TAX NO.
                                        </Grid>
                                        <Grid item xs={12} md={8}>
                                            <TextField
                                                disabled
                                                size="small"
                                                value={
                                                    companyDefault.tax_no
                                                        ? companyDefault.tax_no
                                                        : ""
                                                }
                                                label=""
                                            ></TextField>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            CONTACT PERSON
                                        </Grid>
                                        <Grid item xs={12} md={8}>
                                            <TextField
                                                disabled
                                                value={
                                                    companyDefault.contact_person
                                                        ? companyDefault.contact_person
                                                        : ""
                                                }
                                                size="small"
                                                label=""
                                            ></TextField>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            ADDRESS
                                        </Grid>
                                        <Grid item xs={12} md={8}>
                                            <TextField
                                                disabled
                                                value={
                                                    companyDefault.address
                                                        ? companyDefault.address
                                                        : ""
                                                }
                                                size="small"
                                                label=""
                                            ></TextField>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            CONTACT NO.
                                        </Grid>
                                        <Grid item xs={12} md={8}>
                                            <TextField
                                                disabled
                                                value={
                                                    companyDefault.contact_no
                                                        ? companyDefault.contact_no
                                                        : ""
                                                }
                                                size="small"
                                                label=""
                                            ></TextField>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            EMAIL
                                        </Grid>
                                        <Grid item xs={12} md={8}>
                                            <TextField
                                                disabled
                                                value={
                                                    companyDefault.email
                                                        ? companyDefault.email
                                                        : ""
                                                }
                                                size="small"
                                                label=""
                                            ></TextField>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    md={6}
                                    sx={{
                                        border: "1px solid #cecece",
                                        pl: "30px !important",
                                    }}
                                >
                                    <Grid container spacing={2} sx={{ py: 3 }}>
                                        <Grid
                                            item
                                            xs={12}
                                            md={12}
                                            sx={{
                                                borderBottom:
                                                    "1px solid #cecece",
                                                mr: "16px !important",
                                                pb: "5px !important",
                                            }}
                                        >
                                            SHIPPING DETAILS*
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            COMPANY
                                        </Grid>
                                        <Grid item xs={12} md={8}>
                                            <TextField
                                                fullWidth
                                                select
                                                size="small"
                                                label="Business Unit"
                                                value={shipping ? shipping : ""}
                                                onChange={(e) =>
                                                    handleShippingCompany(e)
                                                }
                                                SelectProps={{
                                                    native: true,
                                                }}
                                            >
                                                <option value=""> - </option>
                                                {shippingCompanies.map(
                                                    (option) => (
                                                        <option
                                                            key={option.id}
                                                            value={option.id}
                                                        >
                                                            {option.title}
                                                        </option>
                                                    )
                                                )}
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            TAX NO.
                                        </Grid>
                                        <Grid item xs={12} md={8}>
                                            <TextField
                                                disabled
                                                size="small"
                                                value={
                                                    shippingCompany.tax_no
                                                        ? shippingCompany.tax_no
                                                        : ""
                                                }
                                                label=""
                                            ></TextField>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            CONTACT PERSON*
                                        </Grid>
                                        <Grid item xs={12} md={8}>
                                            <Autocomplete
                                                disablePortal
                                                fullWidth
                                                sx={{ m: 0 }}
                                                options={contactPersons}
                                                getOptionLabel={(contact) =>
                                                    contact.name || ""
                                                }
                                                size="small"
                                                onChange={(e, value) =>
                                                    handleContactPerson(
                                                        e,
                                                        value
                                                    )
                                                }
                                                renderOption={(
                                                    props,
                                                    option
                                                ) => {
                                                    return (
                                                        <li
                                                            {...props}
                                                            key={option.id}
                                                        >
                                                            {
                                                                option.contact_person
                                                            }
                                                        </li>
                                                    );
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Contact person"
                                                        fullWidth
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            ADDRESS
                                        </Grid>
                                        <Grid item xs={12} md={8}>
                                            <TextField
                                                disabled
                                                value={
                                                    shippingCompany.address
                                                        ? shippingCompany.address
                                                        : ""
                                                }
                                                size="small"
                                                label=""
                                            ></TextField>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            CONTACT NO.
                                        </Grid>
                                        <Grid item xs={12} md={8}>
                                            <TextField
                                                disabled
                                                value={
                                                    shippingCompany.contact_no
                                                        ? shippingCompany.contact_no
                                                        : ""
                                                }
                                                size="small"
                                                label=""
                                            ></TextField>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            EMAIL
                                        </Grid>
                                        <Grid item xs={12} md={8}>
                                            <TextField
                                                disabled
                                                value={
                                                    contactPersonDefault.email
                                                }
                                                size="small"
                                                label=""
                                            ></TextField>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Remarks */}
                    <Grid container spacing={2} sx={{ pb: 3 }}>
                        <Grid item xs={12} md={2}>
                            Remarks
                        </Grid>
                        <Grid item xs={12} md={10}>
                            <TextField
                                label=""
                                size="small"
                                variant="outlined"
                                className="full-width"
                                onChange={(e) =>
                                    handleFreeText(e, null, "remarks_optional")
                                }
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            Finance Remarks
                        </Grid>
                        <Grid item xs={12} md={10}></Grid>
                        <Grid item xs={12} md={2}>
                            * Payment Terms
                        </Grid>
                        <Grid item xs={12} md={10}>
                            <TextField
                                className="full-width"
                                label=""
                                size="small"
                                variant="outlined"
                                onChange={(e) =>
                                    handleFreeText(
                                        e,
                                        null,
                                        "remarks_payment_terms"
                                    )
                                }
                            />
                        </Grid>
                    </Grid>

                    {/* Approval Setup */}
                    <Grid
                        container
                        spacing={2}
                        sx={{ mt: 1, py: 3, borderTop: "1px solid #cecece" }}
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
                        <Grid item md={12} xs={12}>
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
                                            <TableCell></TableCell>
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
                                                    <TableCell
                                                        sx={{
                                                            padding:
                                                                "0 !important",
                                                        }}
                                                    >
                                                        <Autocomplete
                                                            disablePortal
                                                            fullWidth
                                                            sx={{ m: 0 }}
                                                            options={
                                                                contactPersons
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
                                variant="contained"
                                disabled={fieldState}
                                color="info"
                                onClick={(e) => handleSubmitForm(e)}
                                loading={loading}
                            >
                                SUBMIT FORM
                            </LoadingButton>
                        </Grid>
                        <Grid item md={12}>
                            <small>
                                Once form has been submitted, it cannot be
                                Edited.
                            </small>{" "}
                            <br />
                            <small>
                                Be sure to check the <b>approvals</b> before
                                submitting.
                            </small>
                        </Grid>
                        <Grid item md={4}>
                            <ul>
                                <li
                                    className={
                                        validate[0].supplier ? "active" : ""
                                    }
                                >
                                    Supplier:{" "}
                                    {validate[0].supplier ? "Ok" : "-"}
                                </li>
                                <li className={validate[0].prf ? "active" : ""}>
                                    PRF: {validate[0].prf ? "Ok" : "-"}
                                </li>
                                <li
                                    className={
                                        validate[0].department ? "active" : ""
                                    }
                                >
                                    Department:{" "}
                                    {validate[0].department ? "Ok" : "-"}
                                </li>
                                <li
                                    className={
                                        validate[0].net_amount ? "active" : ""
                                    }
                                >
                                    Items: {validate[0].net_amount ? "Ok" : "-"}
                                </li>
                                <li
                                    className={
                                        validate[0].billing ? "active" : ""
                                    }
                                >
                                    Billing/Shipping:{" "}
                                    {validate[0].billing ? "Ok" : "-"}
                                </li>
                                <li
                                    className={
                                        validate[0].contact_person
                                            ? "active"
                                            : ""
                                    }
                                >
                                    Contact Person:{" "}
                                    {validate[0].contact_person ? "Ok" : "-"}
                                </li>
                            </ul>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Paper>
    );
};

export default LpoForm;
