let state = {
    profileList: [],
};
let getters = {
    profile_list: (state) => state.profileList,
};
const actions = {
    async fetchProfileList({ commit }) {
        const response = await axios.get("/d/profile/procurements/profile_users");  
        commit("setProfileList", response.data);
    },
};
const mutations = {
    setProfileList: (state, profileList) => (state.profileList = profileList),
};

export default {
    // namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
