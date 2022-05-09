import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import * as CryptoJS from "crypto-js";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import ContentPasteGoIcon from "@mui/icons-material/ContentPasteGo";
import SettingsIcon from "@mui/icons-material/Settings";
import LayersIcon from "@mui/icons-material/Layers";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Divider from "@mui/material/Divider";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import LogoutIcon from "@mui/icons-material/Logout";
const listItems = ({ slug, page, page2 }) => {
    const navigate = useNavigate();
    const zlug = slug.toLowerCase().replaceAll(" ", "-");
    const [open, setOpen] = useState(false);
    const [allow, setAllow] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };

    function logout() {
        let token = localStorage.getItem('auth_token');
        axios.post("/v/users/logout/"+token).then((response) => { 
            if(response.data.success){
                navigate("/login");
            }
        }); 
        
    }

    useEffect(() => {
        if (
            zlug == "suppliers" ||
            page == "suppliers" ||
            page2 == "suppliers" ||
            zlug == "companies" ||
            page == "companies" ||
            page2 == "companies" ||
            zlug == "departments" ||
            page == "departments" ||
            page2 == "departments" ||
            zlug == "categories" ||
            page == "categories" ||
            page2 == "categories" ||
            zlug == "locations" ||
            page == "locations" ||
            page2 == "locations"
        )
            setOpen(true);

        let getRole = localStorage.getItem("auth_role");
        getRole = getRole
            ? CryptoJS.AES.decrypt(getRole, "Moikzz").toString(
                  CryptoJS.enc.Utf8
              )
            : null;

        if (getRole && (getRole == "procurement" || getRole == "admin")) {
            setAllow(true);
        }
    }, []);

    return (
        <>
            <Link to="/d/dashboard">
                <ListItemButton
                    className={`nav-item ${
                        zlug == "dashboard" ? "active" : ""
                    }`}
                >
                    <ListItemIcon>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="DASHBOARD" />
                </ListItemButton>
            </Link>
            <Link to="/d/requests">
                <ListItemButton
                    className={`nav-item ${
                        zlug == "requests"
                            ? "active"
                            : zlug == "new-request"
                            ? "active"
                            : ""
                    }`}
                >
                    <ListItemIcon>
                        <AssignmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="MY REQUEST" />
                </ListItemButton>
            </Link>
            { allow ?
            <>
            <Divider sx={{ my: 1 }} />
            <ListSubheader component="div" inset>
                Procurement Only
            </ListSubheader>
            <Link to="/d/procurement-team">
                <ListItemButton
                    className={`nav-item ${
                        zlug == "procurement-team"
                            ? "active"
                            : page == "request"
                            ? "active"
                            : ""
                    }`}
                >
                    <ListItemIcon>
                        <MenuBookIcon />
                    </ListItemIcon>
                    <ListItemText primary="PROCUREMENT" />
                </ListItemButton>
            </Link>
            <Link to="/d/procurement-team/local-purchase-orders">
                <ListItemButton
                    className={`nav-item ${
                        zlug == "local-purchase-orders" ||
                        page == "local-purchase-orders"
                            ? "active"
                            : page == "procurement-team" &&
                              page2 == "local-purchase-orders"
                            ? "active"
                            : ""
                    }`}
                >
                    <ListItemIcon>
                        <ContentPasteGoIcon />
                    </ListItemIcon>
                    <ListItemText primary="LPO" />
                </ListItemButton>
            </Link>
            <Link to="/d/procurement-team/payment-approval-forms">
                <ListItemButton
                    className={`nav-item ${
                        zlug == "payment-approval-forms" ||
                        page == "payment-approval-forms" ||
                        page2 == "payment-approval-forms"
                            ? "active"
                            : ""
                    }`}
                >
                    <ListItemIcon>
                        <CreditCardIcon />
                    </ListItemIcon>
                    <ListItemText primary="PAF" />
                </ListItemButton>
            </Link>

            <ListItemButton onClick={handleClick}>
                <ListItemIcon>
                    <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="SETTINGS" />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <Link to="/d/settings/suppliers">
                        <ListItemButton
                            sx={{ pl: 4 }}
                            className={`nav-item ${
                                zlug == "suppliers" ||
                                page == "suppliers" ||
                                page2 == "suppliers"
                                    ? "active"
                                    : ""
                            }`}
                        >
                            <ListItemIcon>
                                <StarBorder />
                            </ListItemIcon>
                            <ListItemText primary="Suppliers" />
                        </ListItemButton>
                    </Link>
                    <Link to="/d/settings/companies">
                        <ListItemButton
                            sx={{ pl: 4 }}
                            className={`nav-item ${
                                zlug == "companies" ||
                                page == "companies" ||
                                page2 == "companies"
                                    ? "active"
                                    : ""
                            }`}
                        >
                            <ListItemIcon>
                                <StarBorder />
                            </ListItemIcon>
                            <ListItemText primary="Business Unit" />
                        </ListItemButton>
                    </Link>
                    <Link to="/d/settings/departments">
                        <ListItemButton
                            sx={{ pl: 4 }}
                            className={`nav-item ${
                                zlug == "departments" ||
                                page == "departments" ||
                                page2 == "departments"
                                    ? "active"
                                    : ""
                            }`}
                        >
                            <ListItemIcon>
                                <StarBorder />
                            </ListItemIcon>
                            <ListItemText primary="Departments" />
                        </ListItemButton>
                    </Link>
                    <Link to="/d/settings/locations">
                        <ListItemButton
                            sx={{ pl: 4 }}
                            className={`nav-item ${
                                zlug == "locations" ||
                                page == "locations" ||
                                page2 == "locations"
                                    ? "active"
                                    : ""
                            }`}
                        >
                            <ListItemIcon>
                                <StarBorder />
                            </ListItemIcon>
                            <ListItemText primary="Locations" />
                        </ListItemButton>
                    </Link>
                    <Link to="/d/settings/categories">
                        <ListItemButton
                            sx={{ pl: 4 }}
                            className={`nav-item ${
                                zlug == "categories" ||
                                page == "categories" ||
                                page2 == "categories"
                                    ? "active"
                                    : ""
                            }`}
                        >
                            <ListItemIcon>
                                <StarBorder />
                            </ListItemIcon>
                            <ListItemText primary="Categories" />
                        </ListItemButton>
                    </Link>
                </List>
            </Collapse>

            <Link to="/d/reports">
                <ListItemButton
                    className={`nav-item ${zlug == "reports" ? "active" : ""}`}
                >
                    <ListItemIcon>
                        <LayersIcon />
                    </ListItemIcon>
                    <ListItemText primary="REPORTS" />
                </ListItemButton>
            </Link>
            <Link to="/d/users">
                <ListItemButton
                    className={`nav-item ${
                        zlug == "users" || page == "users" ? "active" : ""
                    }`}
                >
                    <ListItemIcon>
                        <PeopleAltIcon />
                    </ListItemIcon>
                    <ListItemText primary="USERS" />
                </ListItemButton>
            </Link>
</>
            : ''}

            <ListItemButton
                onClick={() => {
                    logout();
                }}
            >
                <ListItemIcon>
                    <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="LOGOUT" />
            </ListItemButton>
        </>
    );
};

export default listItems;
