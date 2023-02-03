let state = {
    departmentList: [],
};
let getters = {
    department_list: (state) => state.departmentList,
};
const actions = {
    async fetchDepartmentList({ commit }) {
        const response = await axios.get("/d/admin/fetch/non-paginate/departments");
        console.log("setDepartmentList", response.data);
        commit("setDepartmentList", response.data);
    },
};
const mutations = {
    setDepartmentList: (state, departmentList) => (state.departmentList = departmentList),
};

export default {
    // namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
