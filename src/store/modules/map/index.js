const state = {
  restaurants: [],
};

const actions = {
};

const mutations = {
  SET_RESTAURANTS(state, list) {
    state.restaurants = list;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
