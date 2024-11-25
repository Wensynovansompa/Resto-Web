export default {
    namespaced: true,
    state: {
        setting    : {},
    },
    mutations: {
        set: (state, payload) => {
            state.setting  = payload
        },
    },
    actions: {
        set: ({commit}, payload) => {
            commit('set', payload)
        },
    },
    getters: {
        setting  : state => state.setting,
    }
}