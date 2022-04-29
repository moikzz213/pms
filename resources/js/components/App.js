import * as React from "react";
import {  BrowserRouter as Router,Routes,  Route } from "react-router-dom";
import Login from "./Login";
import Theme from "./common/Theme";
export default function MediaCard() {
  return (
    <Router basename="/">   
      <Routes>
        <Route  exact  path="/"  element={<Login />} />
        <Route  exact  path="/login"  element={<Login />} />
        <Route  path="/d/:slug"  element={<Theme />} /> 
        <Route  path="/d/:slug/:slug2"  element={<Theme />} /> 
        <Route  path="/d/:slug/:slug2/:slug3"  element={<Theme />} /> 
        <Route  path="/d/:slug/:slug2/:slug3/:id"  element={<Theme />} /> 
      </Routes>
    </Router>
  );
}