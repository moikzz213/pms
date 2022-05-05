import * as React from 'react';
import { useLocation } from "react-router-dom";
import Container from '@mui/material/Container';  
 
// Pages
import Dashboard from "../pages/Dashboard";
import Procurement from "../pages/Procurement";
import Reports from "../pages/Reports";
import Request from "../pages/Request";
import Settings from "../pages/Settings";
import Lpo from "../pages/Lpo";
import Paf from "../pages/Pafs";
import Suppliers from "../pages/Suppliers";
import Companies from "../pages/Companies";
import Departments from "../pages/Departments";
import Categories from "../pages/Categories";
import Users from "../pages/Users";
import Locations from "../pages/Locations";

import ViewRequest from "../forms/ViewRequest";
import ProcessRequest from "../forms/ProcessRequest";
import ViewLpo from "../forms/ViewLpo";
import ViewPaf from "../forms/ViewPaf";
// Forms
import RequestForm from "../forms/RequestForm";
import LpoForm from "../forms/LpoForm";
import PafForm from "../forms/PafForm";
import SupplierForm from "../forms/SupplierForm";
import SupplierFormEdit from "../forms/SupplierFormEdit";
import CompanyForm from "../forms/CompanyForm";
import CompanyFormEdit from "../forms/CompanyFormEdit";
import DepartmentForm from "../forms/DepartmentForm";
import DepartmentFormEdit from "../forms/DepartmentFormEdit";
import CategoryForm from "../forms/CategoryForm";
import CategoryFormEdit from "../forms/CategoryFormEdit";
import UserForm from "../forms/UserForm";
import UserFormEdit from "../forms/UserFormEdit";

import LocationForm from "../forms/LocationForm";
import LocationFormEdit from "../forms/LocationFormEdit";
import Error from "../common/Error";
function renderElement(logged){
  const location = useLocation(); 
  let slug = "";
  let pathName = "";
  let procSlug1 = "";
  let procSlug2 = "";
  pathName = location.pathname.split("/");
  slug = pathName[pathName.length - 1];

  procSlug1 =   pathName[pathName.length - 3];
  procSlug2 =   pathName[pathName.length - 2];  

  let allow = false;

  if(logged.role == 'admin' || logged.role == 'procurement'){
    allow = true;
  } 

  if(slug == 'dashboard' ){
     return <Dashboard logged={logged}/>;
  }else if(slug == 'requests'){
    return  <Request logged={logged}/>;
  }else if(slug == 'users' && allow){
    return  <Users/>;
  }else if(slug == 'locations' && allow){
    return  <Locations/>;
  }else if(slug == 'procurement-team' && allow){
    return  <Procurement/>;
  }else if(slug == 'settings' && allow){
    return  <Settings/>;
  }else if(slug == 'reports' && allow){
    return  <Reports/>;
  }else if(slug == 'new-request'){
    return  <RequestForm logged={logged}/>;
  }else if(slug == 'suppliers' && allow){
    return  <Suppliers/>;
  }else if(slug == 'companies' && allow){
    return  <Companies/>;
  }else if(slug == 'departments' && allow){
    return  <Departments/>;
  }else if(slug == 'categories' && allow){
    return  <Categories/>;
  }else if(slug == 'local-purchase-orders' && allow){
    return  <Lpo/>;
  }else if(slug == 'payment-approval-forms' && allow){
    return  <Paf/>;
  }else if(procSlug1 == 'requests' && procSlug2 == 'id'){
    return  <ViewRequest id={slug}/>;
  }else if(procSlug1 == 'request' && procSlug2 == 'id' && allow){
    return  <ProcessRequest id={slug}/>;
  }else if(procSlug1 == 'local-purchase-orders' && procSlug2 == 'id' && allow){
    return  <ViewLpo id={slug}/>;
  }else if(procSlug2 == 'local-purchase-orders' && slug == 'create' && allow){
    return  <LpoForm logged={logged}/>;
  }else if(procSlug1 == 'payment-approval-forms' && procSlug2 == 'id' && allow){
    return  <ViewPaf id={slug}/>;
  }else if(procSlug2 == 'payment-approval-forms' && slug == 'create' && allow){
    return  <PafForm logged={logged}/>;
  }else if(procSlug2 == 'suppliers' && slug == 'create' && allow){
    return  <SupplierForm/>;
  }else if(procSlug1 == 'suppliers' && procSlug2 == 'id' && allow) {
    return  <SupplierFormEdit id={slug} />;
  }else if(procSlug2 == 'companies' && slug == 'create' && allow) {
    return  <CompanyForm/>;
  }else if(procSlug1 == 'companies' && procSlug2 == 'id' && allow) {
    return  <CompanyFormEdit id={slug} />;
  }else if(procSlug2 == 'departments' && slug == 'create' && allow){
    return  <DepartmentForm/>;
  }else if(procSlug1 == 'departments' && procSlug2 == 'id' && allow) {
    return  <DepartmentFormEdit id={slug} />;
  }else if(procSlug2 == 'categories' && slug == 'create' && allow){
    return  <CategoryForm/>;
  }else if(procSlug1 == 'categories' && procSlug2 == 'id' && allow) {
    return  <CategoryFormEdit id={slug} />;
  }else if(procSlug2 == 'users' && slug == 'create' && allow){
    return  <UserForm/>;
  }else if(procSlug1 == 'users' && procSlug2 == 'id' && allow) {
    return  <UserFormEdit id={slug} />;
  }else if(procSlug2 == 'locations' && slug == 'create' && allow){
    return  <LocationForm/>;
  }else if(procSlug1 == 'locations' && procSlug2 == 'id' && allowl) {
    return  <LocationFormEdit id={slug} />;
  }
  return  <Error/>;
   
}

const Content = ({logged}) => {
  return (
    <Container className="main-container" maxWidth="lg" sx={{ mt: 4, mb: 4 }}> 
    { renderElement(logged) }
    </Container>
  )
}

export default Content 