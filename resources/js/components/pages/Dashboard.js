import React, { useState, useEffect } from "react";
import * as CryptoJS from "crypto-js";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import API from "../../services/api.js";

const columns = [
    { id: "status", label: "STATUS", minWidth: 20 },
    { id: "created_at", label: "RQST DATE", minWidth: 20 },
    { id: "prf_no", label: "PRF NO.", minWidth: 30 },
    { id: "company", label: "BUSINESS UNIT", minWidth: 50 },
    { id: "requested_by", label: "REQUESTED BY", minWidth: 50 },
    { id: "process_by", label: "PROCESSED BY", minWidth: 50 },
    { id: "urgency", label: "URGENCY", minWidth: 50 },
];

const Dashboard = ({ logged }) => {
    const [rows, setRows] = useState([]);
    const [countPending, setCountPending] = useState(0);
    const [countProcess, setCountProcess] = useState(0);
    const [countNew, setCountNew] = useState(0);
    const [countHold, setCountHold] = useState(0); 
    const [countTotal, setCountTotal] = useState(0);
    const [countClosed, setCountClosed] = useState(0);

    useEffect(() => {
        let getRole = localStorage.getItem("auth_role");
        getRole = getRole
            ? CryptoJS.AES.decrypt(getRole, "Moikzz").toString(
                  CryptoJS.enc.Utf8
              )
            : null;
    }, []);

    useEffect(() => {
        let token = localStorage.getItem("auth_token");
        if (token) {
            API.get("/v/request/dashboard/" + token)
                .then((response) => {
                    let fetchItems = response.data;

                    dataWithRelations(fetchItems.item);
                    setCountPending(fetchItems.pending);
                    setCountProcess(fetchItems.process);
                    setCountNew(fetchItems.new);
                    setCountHold(fetchItems.hold);
                    setCountClosed(fetchItems.closed);
                    setCountTotal(fetchItems.totalcount);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, []);

    function dataWithRelations(data) {
        let newData = [];

        data = Object.assign([], data);
        data.map((o, i) => {
            newData[i] = {
                id: o.id,
                status: o.status,
                prf_no: o.prf_no,
                company: o.company ? o.company.title : "",
                requested_by: o.profile ? o.profile.name : "",
                process_by: o.process_by ? o.process_by.name : "",
                urgency: o.urgency,
                created_at: new Date(o.created_at).toLocaleDateString(),
            };
        });

        setRows(newData);
    }
    return (
        <>
            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                <Box
                    sx={{
                        width: "auto",
                        minWidth: 170,
                        backgroundColor: "#fff",
                        padding: "20px 20px",
                        textAlign: "center",
                        mx: 1,
                        my: 1,
                    }}
                >
                    TODAY'S REQUESTS
                    <h2>{countNew}</h2>
                </Box>
                <Box
                    sx={{
                        width: "auto",
                        minWidth: 170,
                        backgroundColor: "#fff",
                        padding: "20px 20px",
                        textAlign: "center",
                        mx: 1,
                        my: 1,
                    }}
                >
                    OPEN REQUESTS
                    <h2>{countPending}</h2>
                </Box>
                <Box
                    sx={{
                        width: "auto",
                        minWidth: 170,
                        backgroundColor: "#fff",
                        padding: "20px 20px",
                        textAlign: "center",
                        mx: 1,
                        my: 1,
                    }}
                >
                    ONHOLD REQUESTS
                    <h2>{countHold}</h2>
                </Box>
                <Box
                    sx={{
                        width: "auto",
                        minWidth: 170,
                        backgroundColor: "#fff",
                        padding: "20px 20px",
                        textAlign: "center",
                        mx: 1,
                        my: 1,
                    }}
                >
                    ON PROCESS REQUESTS
                    <h2>{countProcess}</h2>
                </Box>
                <Box
                    sx={{
                        width: "auto",
                        minWidth: 170,
                        backgroundColor: "#fff",
                        padding: "20px 20px",
                        textAlign: "center",
                        mx: 1,
                        my: 1,
                    }}
                >
                    CLOSED REQUESTS
                    <h2>{countClosed}</h2>
                </Box>
                <Box
                    sx={{
                        width: "auto",
                        minWidth: 170,
                        backgroundColor: "#fff",
                        padding: "20px 20px",
                        textAlign: "center",
                        mx: 1,
                        my: 1,
                    }}
                >
                    TOTAL REQUESTS
                    <h2>{countTotal}</h2>
                </Box>
            </Box>
            <Paper sx={{ px: 3, py: 3, mt: 3 }}>
                <h4 className="text-uppercase mt-0">recent ACTIVITIES</h4>

                <TableContainer sx={{ maxHeight: 600 }}>
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
                            {rows.map((row) => {
                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={row.prf_no}
                                    >
                                        {columns.map((column) => {
                                            const value = row[column.id];

                                            return (
                                                <TableCell
                                                    key={column.id}
                                                    align={column.align}
                                                >
                                                    <span className={value}>
                                                        {column.format &&
                                                        typeof value ===
                                                            "number"
                                                            ? column.format(
                                                                  value
                                                              )
                                                            : value}
                                                    </span>
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </>
    );
};

export default Dashboard;
