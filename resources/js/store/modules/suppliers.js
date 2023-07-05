let state = {
    supplierList: [],
};
let getters = {
    supplier_list: (state) => state.supplierList,
};
const actions = {
    async fetchSupplierList({ commit }) {
        const response = await axios.get("/d/admin/fetch/non-paginate/suppliers");  
        commit("setSupplierList", response.data);
    },
};
const mutations = {
    setSupplierList: (state, supplierList) => (state.supplierList = supplierList),
};

export default {
    // namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
