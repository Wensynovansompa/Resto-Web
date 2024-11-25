export default {
  namespaced: true,
  state: {
    carts: [],
  },
  mutations: {
    insert: (state, payload) => {
      state.carts.push({
        id: payload.id,
        title: payload.title,
        cover: payload.cover,
        price: payload.price,
        weight: payload.weight,
        quantity: 1,
        stock: payload.stock
      })
    },
    update: (state, payload) => {
      let idx = state.carts.indexOf(payload);
      state.carts.splice(idx, 1, {
        id: payload.id,
        title: payload.title,
        cover: payload.cover,
        price: payload.price,
        weight: payload.weight,
        quantity: payload.quantity,
        stock: payload.stock
      });
      if (payload.quantity <= 0) {
        state.carts.splice(idx, 1)
      }
    },
    set: (state, payload) => {
      state.carts = payload
    },
  },
  actions: {
    add: ({ state, commit }, payload) => {
      if (payload.id == null) {
        payload.id = payload.get('id');
        payload.title = payload.get('title');
        payload.cover = payload.get('cover');
        payload.price = payload.get('price');
        payload.weight = payload.get('weight');
        payload.quantity = payload.get('quantity');
        payload.stock = payload.get('stock');

      }

      let cartItem = state.carts.find(item => item.id === payload.id)
      if (!cartItem && payload.stock > 0) {
        commit('insert', payload)
      }
      else {
        let stock_opname = payload.stock - payload.quantity;
        if (stock_opname > 0) {
          cartItem.quantity++
          commit('update', cartItem)
        }
      }
    },
    remove: ({ state, commit }, payload) => {
      let cartItem = state.carts.find(item => item.id === payload.id)
      if (cartItem) {
        cartItem.quantity--
        commit('update', cartItem)
      }
    },
    set: ({ commit }, payload) => {
      commit('set', payload)
    },
  },
  getters: {
    carts: state => state.carts,
    count: (state) => {
      return state.carts.length
    },
    totalPrice: (state) => {
      let total = 0
      state.carts.forEach(function (cart) {
          total += cart.price * cart.quantity
        
      })
      return total
    },
    totalQuantity: (state) => {
      let total = 0
      state.carts.forEach(function (cart) {
        total += cart.quantity
      })
      return total
    },
    totalWeight: (state) => {
      let total = 0
      state.carts.forEach(function (cart) {
        total += cart.weight
      })
      return total
    }
  }
}