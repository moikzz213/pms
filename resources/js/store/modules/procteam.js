let state = {
    procTeam: [],
};
let getters = {
    proc_team: (state) => state.procTeam,
};
const actions = {
    async fetchProcTeam({ commit }) {
        const response = await axios.get("/d/admin/profile/procurements/list");  
        commit("setProcTeam", response.data);
    },
};
const mutations = {
    setProcTeam: (state, procTeam) => (state.procTeam = procTeam),
};

export default {
    // namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
