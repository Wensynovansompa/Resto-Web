export default {
    namespaced: true,
    state: {
        chairId    : {},
        chairName    : {},
    },
    mutations: {
        setName: (state, payload) => {
            state.chairName  = payload
        },
        setId: (state, payload) => {
            state.chairId  = payload
        },
    },
    actions: {
        setName: ({commit}, payload) => {
            commit('setName', payload)
        },
        setId: ({commit}, payload) => {
            commit('setId', payload)
        },
    },
    getters: {
        chairName: state => state.chairName,
        chairId: state => state.chairId,
    }
}