import store from "../store";
import Dashboard from "../components/admin/Dashboard";
import ForbiddenPage from "../components/admin/ForbiddenPage";
import NotFoundPage from "../components/admin/NotFoundPage";
import Users from "../components/admin/users/Users";
import EditUser from "../components/admin/users/EditUser";
import NewUser from "../components/admin/users/NewUser";

import Profile from "../components/admin/users/Profile";

import Departments from "../components/admin/department/Departments";
import EditDepartment from "../components/admin/department/EditDepartment";
import NewDepartment from "../components/admin/department/NewDepartment";

import Companies from "../components/admin/company/Companies";
import EditCompany from "../components/admin/company/EditCompany";
import NewCompany from "../components/admin/company/NewCompany";

import Suppliers from "../components/admin/suppliers/Suppliers";
import EditSupplier from "../components/admin/suppliers/EditSupplier";
import NewSupplier from "../components/admin/suppliers/NewSupplier";

import Categories from "../components/admin/categories/Categories";
import EditCategory from "../components/admin/categories/EditCategory";
import NewCategory from "../components/admin/categories/NewCategory";

import Locations from "../components/admin/locations/Locations";
import EditLocation from "../components/admin/locations/EditLocation";
import NewLocation from "../components/admin/locations/NewLocation";

import Requests from "../components/admin/requests/List";
import EditRequest from "../components/admin/requests/EditData";
import NewRequest from "../components/admin/requests/NewData";

import Lpo from "../components/admin/lpo/List";
import EditLpo from "../components/admin/lpo/EditData";
import NewLpo from "../components/admin/lpo/NewData";

import Paf from "../components/admin/paf/List";
import EditPaf from "../components/admin/paf/EditData";
import NewPaf from "../components/admin/paf/NewData";

import ProcRequests from "../components/admin/procurement/List";
import ViewRequest from "../components/admin/procurement/EditData"; 

import ImportsData from "../components/admin/ImportsData";
import Settings from "../components/admin/Settings";
 
import Reports from "../components/admin/reports/data";
let adminOnly = ["admin", "procurement"];

import Comparisons from "../components/admin/comparison/List";
import EditComparison from "../components/admin/comparison/EditData";
import QuotationComparison from "../components/admin/comparison/Quotation";
import NewComparison from "../components/admin/comparison/NewData";

import Quotations from "../components/quotations/comparison/List";
import EditQuotation from "../components/quotations/comparison/EditData";
 
let auth = store.state.authUser;
 
 
function validateAccess(slug) {
    let hasAccess = false;
    if (
        auth.userObject.status == "active" &&
        adminOnly.includes(auth.userObject.role) == true 
    ) {
        hasAccess = true;
    }
    return hasAccess;
}
export const routes = [
    /**
     * Admin Pages
     */
    {
        path: "/forbidden",
        component: ForbiddenPage,
        name: "ForbiddenPage",
    },
    {
        path: "/notfound",
        component: NotFoundPage,
        name: "NotFoundPage",
    },
    {
        path: "/d/admin/dashboard",
        component: Dashboard,
        name: "dashboard"
    },
    /**
     * Users
     *
     */

    {
        path: "/d/admin/profile",
        component: Profile,
        name: "profile"
    },
    {
        path: "/d/admin/users",
        component: Users,
        name: "Users",
        beforeEnter: (to, from, next) => {
            validateAccess("users") ? next() : next({ name: "ForbiddenPage" });
        },
    },
    {
        path: "/d/admin/users/page/:page",
        component: Users,
        name: "page-users",
        beforeEnter: (to, from, next) => {
            validateAccess("users") ? next() : next({ name: "ForbiddenPage" });
        },
    },
    {
        path: "/d/admin/users/new",
        component: NewUser,
        name: "NewUser",
        beforeEnter: (to, from, next) => {
            validateAccess("users") ? next() : next({ name: "ForbiddenPage" });
        },
    },
    {
        path: "/d/admin/users/edit/:id",
        component: EditUser,
        name: "EditUser",
        beforeEnter: (to, from, next) => {
            validateAccess("users") ? next() : next({ name: "ForbiddenPage" });
        },
    },

    /**
     * Reports
     */
    {
        path: "/d/admin/reports",
        component: Reports,
        name: "Reports",
        beforeEnter: (to, from, next) => {
            validateAccess("reports") ? next() : next({ name: "ForbiddenPage" });
        }
    },
    /**
     * Local Purchase Orders
     */

    {
        path: "/d/admin/local-purchase-orders",
        component: Lpo,
        name: "lpo",
        beforeEnter: (to, from, next) => {
            validateAccess("lpo") ? next() : next({ name: "ForbiddenPage" });
        }
    },
    {
        path: "/d/admin/local-purchase-orders/page/:page",
        component: Lpo,
        name: "page-lpo",
        beforeEnter: (to, from, next) => {
            validateAccess("lpo") ? next() : next({ name: "ForbiddenPage" });
        }
    },
    {
        path: "/d/admin/local-purchase-orders/new",
        component: NewLpo,
        name: "NewLpo",
        beforeEnter: (to, from, next) => {
            validateAccess("lpo") ? next() : next({ name: "ForbiddenPage" });
        }
    },
    {
        path: "/d/admin/local-purchase-orders/edit/:id",
        component: EditLpo,
        name: "EditLpo",
        beforeEnter: (to, from, next) => {
            validateAccess("lpo") ? next() : next({ name: "ForbiddenPage" });
        }
    },


    /**
     * Payment Approval Forms
     */

    {
        path: "/d/admin/payment-approval-forms",
        component: Paf,
        name: "paf",
        beforeEnter: (to, from, next) => {
            validateAccess("paf") ? next() : next({ name: "ForbiddenPage" });
        }
    },
    {
        path: "/d/admin/payment-approval-forms/page/:page",
        component: Paf,
        name: "page-paf",
        beforeEnter: (to, from, next) => {
            validateAccess("paf") ? next() : next({ name: "ForbiddenPage" });
        }
    },
    {
        path: "/d/admin/payment-approval-forms/new",
        component: NewPaf,
        name: "NewPaf",
        beforeEnter: (to, from, next) => {
            validateAccess("paf") ? next() : next({ name: "ForbiddenPage" });
        }
    },
    {
        path: "/d/admin/payment-approval-forms/edit/:id",
        component: EditPaf,
        name: "EditPaf",
        beforeEnter: (to, from, next) => {
            validateAccess("paf") ? next() : next({ name: "ForbiddenPage" });
        }
    }, 

    /**
     * Comparisons
     */

    {
        path: "/d/admin/comparisons",
        component: Comparisons,
        name: "comparisons",
        beforeEnter: (to, from, next) => {
            validateAccess("comparisons") ? next() : next({ name: "ForbiddenPage" });
        }
    },
    {
        path: "/d/admin/comparisons/page/:page",
        component: Comparisons,
        name: "page-comparisons",
        beforeEnter: (to, from, next) => {
            validateAccess("comparisons") ? next() : next({ name: "ForbiddenPage" });
        }
    },
    {
        path: "/d/admin/comparisons/new",
        component: NewComparison,
        name: "NewComparison",
        beforeEnter: (to, from, next) => {
            validateAccess("comparisons") ? next() : next({ name: "ForbiddenPage" });
        }
    },
    {
        path: "/d/admin/comparisons/edit/:id",
        component: EditComparison,
        name: "EditComparison",
        beforeEnter: (to, from, next) => {
            validateAccess("comparisons") ? next() : next({ name: "ForbiddenPage" });
        }
    },

    {
        path: "/d/admin/comparisons/quotations/:id",
        component: QuotationComparison,
        name: "QuotationComparison",
        beforeEnter: (to, from, next) => {
            validateAccess("comparisons") ? next() : next({ name: "ForbiddenPage" });
        }
    },
    

    /**
     * Requests
     */

    {
        path: "/d/admin/requests",
        component: Requests,
        name: "requests",
        beforeEnter: (to, from, next) => {
             auth.userObject.status == 'active'
                ? next()
                : next({ name: "ForbiddenPage" });
        }
    },
    {
        path: "/d/admin/requests/page/:page",
        component: Requests,
        name: "page-requests",
        beforeEnter: (to, from, next) => {
             auth.userObject.status == 'active'
                ? next()
                : next({ name: "ForbiddenPage" });
        }
    },
    {
        path: "/d/admin/requests/new",
        component: NewRequest,
        name: "NewRequest"
    },
    {
        path: "/d/admin/requests/edit/:id",
        component: EditRequest,
        name: "EditRequest"
    },

    /**
     * Procurement Team - Requests
     */

    {
        path: "/d/admin/procurement-team",
        component: ProcRequests,
        name: "procurement-team",
        beforeEnter: (to, from, next) => {
            validateAccess("procurement-team") ? next() : next({ name: "ForbiddenPage" });
        }
    },
    {
        path: "/d/admin/procurement-team/page/:page",
        component: ProcRequests,
        name: "page-procurement-team",
        beforeEnter: (to, from, next) => {
            validateAccess("procurement-team") ? next() : next({ name: "ForbiddenPage" });
        }
    },
   
    {
        path: "/d/admin/procurement-team/edit/:id",
        component: ViewRequest,
        name: "viewRequest",
        beforeEnter: (to, from, next) => {
            validateAccess("procurement-team") ? next() : next({ name: "ForbiddenPage" });
        }
    },
    
    
    /**
     * Suppliers
     */

    {
        path: "/d/admin/suppliers",
        component: Suppliers,
        name: "Suppliers",
        beforeEnter: (to, from, next) => {
            validateAccess("suppliers") ? next() : next({ name: "ForbiddenPage" });
        }
    },
    {
        path: "/d/admin/suppliers/page/:page",
        component: Suppliers,
        name: "page-suppliers",
        beforeEnter: (to, from, next) => {
            validateAccess("suppliers") ? next() : next({ name: "ForbiddenPage" });
        }
    },
    {
        path: "/d/admin/suppliers/new",
        component: NewSupplier,
        name: "NewSupplier",
        beforeEnter: (to, from, next) => {
            validateAccess("suppliers") ? next() : next({ name: "ForbiddenPage" });
        }
    },
    {
        path: "/d/admin/suppliers/edit/:id",
        component: EditSupplier,
        name: "EditSupplier",
        beforeEnter: (to, from, next) => {
            validateAccess("suppliers") ? next() : next({ name: "ForbiddenPage" });
        }
    },

    /**
     * Companies
     */

     {
        path: "/d/admin/companies",
        component: Companies,
        name: "Companies",
        beforeEnter: (to, from, next) => {
            validateAccess("lpo") ? next() : next({ name: "ForbiddenPage" });
        }
    },
    {
        path: "/d/admin/companies/page/:page",
        component: Companies,
        name: "page-companies",
        beforeEnter: (to, from, next) => {
            validateAccess("lpo") ? next() : next({ name: "ForbiddenPage" });
        }
    },
    {
        path: "/d/admin/companies/new",
        component: NewCompany,
        name: "NewCompany",
        beforeEnter: (to, from, next) => {
            validateAccess("lpo") ? next() : next({ name: "ForbiddenPage" });
        }
    },
    {
        path: "/d/admin/companies/edit/:id",
        component: EditCompany,
        name: "EditCompany",
        beforeEnter: (to, from, next) => {
            validateAccess("lpo") ? next() : next({ name: "ForbiddenPage" });
        }
    },
    /**
     * Departments
     */

     {
        path: "/d/admin/departments",
        component: Departments,
        name: "Departments",
        beforeEnter: (to, from, next) => {
            validateAccess("lpo") ? next() : next({ name: "ForbiddenPage" });
        }
    },
    {
        path: "/d/admin/departments/page/:page",
        component: Departments,
        name: "page-departments",
        beforeEnter: (to, from, next) => {
            validateAccess("lpo") ? next() : next({ name: "ForbiddenPage" });
        }
    },
    {
        path: "/d/admin/departments/new",
        component: NewDepartment,
        name: "NewDepartment",
        beforeEnter: (to, from, next) => {
            validateAccess("lpo") ? next() : next({ name: "ForbiddenPage" });
        }
    },
    {
        path: "/d/admin/departments/edit/:id",
        component: EditDepartment,
        name: "EditDepartment",
        beforeEnter: (to, from, next) => {
            validateAccess("lpo") ? next() : next({ name: "ForbiddenPage" });
        }
    },
    /**
     * Locations
     */

    {
        path: "/d/admin/locations",
        component: Locations,
        name: "Locations",
        beforeEnter: (to, from, next) => {
            validateAccess("lpo") ? next() : next({ name: "ForbiddenPage" });
        }
    },
    {
        path: "/d/admin/locations/page/:page",
        component: Locations,
        name: "page-locations",
        beforeEnter: (to, from, next) => {
            validateAccess("lpo") ? next() : next({ name: "ForbiddenPage" });
        }
    },
    {
        path: "/d/admin/locations/new",
        component: NewLocation,
        name: "NewLocation",
        beforeEnter: (to, from, next) => {
            validateAccess("lpo") ? next() : next({ name: "ForbiddenPage" });
        }
    },
    {
        path: "/d/admin/locations/edit/:id",
        component: EditLocation,
        name: "EditLocation",
        beforeEnter: (to, from, next) => {
            validateAccess("lpo") ? next() : next({ name: "ForbiddenPage" });
        }
    },
   
    /**
     * Categories
     */

     {
        path: "/d/admin/categories",
        component: Categories,
        name: "Categories",
        beforeEnter: (to, from, next) => {
            validateAccess("lpo") ? next() : next({ name: "ForbiddenPage" });
        }
    },
    {
        path: "/d/admin/categories/page/:page",
        component: Categories,
        name: "page-categories",
        beforeEnter: (to, from, next) => {
            validateAccess("lpo") ? next() : next({ name: "ForbiddenPage" });
        }
    },
    {
        path: "/d/admin/categories/new",
        component: NewCategory,
        name: "NewCategory",
        beforeEnter: (to, from, next) => {
            validateAccess("lpo") ? next() : next({ name: "ForbiddenPage" });
        }
    },
    {
        path: "/d/admin/categories/edit/:id",
        component: EditCategory,
        name: "EditCategory",
        beforeEnter: (to, from, next) => {
            validateAccess("lpo") ? next() : next({ name: "ForbiddenPage" });
        }
    },

    // Imports
    {
        path: "/d/admin/imports",
        component: ImportsData,
        name: "ImportsData",
        beforeEnter: (to, from, next) => {
             validateAccess("users") ? next() : next({ name: "ForbiddenPage" });
        },
    },

     // Imports
     {
        path: "/d/admin/settings",
        component: Settings,
        name: "Settings",
        beforeEnter: (to, from, next) => {
            validateAccess("users") ? next() : next({ name: "ForbiddenPage" });
        },
    }, 

    {
        path: "/home",
        beforeEnter() { 
            window.location.href = "/d/admin/dashboard";
        },
    }, 

    /**
     * SUPPLIER QUOTATION
     */
    {
        path: "/suppliers/add-quotation",
        component: EditQuotation,
        name: "EditQuotation"        
    },
]; 