import Vue from "vue";
import Vuex from "vuex";
import authUser from "./modules/authUser";

/**
 * Articles
 */
import singleArticle from "./modules/front/singleArticle";
import companies from "./modules/companies";
import departments from "./modules/departments";

Vue.use(Vuex);
const store = new Vuex.Store({
    modules: {
        authUser,
        singleArticle,
        companies,
        departments,
    },
});

export default store;
