let state = {
    companyList: [],
};
let getters = {
    company_list: (state) => state.companyList,
};
const actions = {
    async fetchCompanyList({ commit }) {
        const response = await axios.get("/d/admin/fetch/non-paginate/companies");  
        commit("setCompanyList", response.data);
    },
};
const mutations = {
    setCompanyList: (state, companyList) => (state.companyList = companyList),
};

export default {
    // namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
