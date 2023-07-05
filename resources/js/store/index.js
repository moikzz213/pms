import Vue from "vue";
import Vuex from "vuex";
import authUser from "./modules/authUser";

/**
 * Articles
 */
import singleArticle from "./modules/front/singleArticle";
import companies from "./modules/companies";
import departments from "./modules/departments";
import profiles from "./modules/profiles";
import suppliers from "./modules/suppliers";
import procteam from "./modules/procteam";
Vue.use(Vuex);
const store = new Vuex.Store({
    modules: {
        authUser,
        singleArticle,
        companies,
        departments,
        profiles,
        suppliers,
        procteam
    },
});

export default store;
