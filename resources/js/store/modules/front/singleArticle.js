let state = {
    articleObject: {},
};
let getters = {
    single_article: (state) => state.articleObject,
};
const actions = {
    async fetchSingleArticle({ commit }, id) {
        const response = await axios.get("/e/fetch/article/single/" + id);
        commit("setSingleArticle", response.data);
    },
};
const mutations = {
    setSingleArticle: (state, articleObject) =>
        (state.articleObject = articleObject),
};

export default {
    // namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
