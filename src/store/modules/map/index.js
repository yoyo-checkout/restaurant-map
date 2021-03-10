const state = {
  restaurants: [],
  markers: [], // 暫存標記，清除標記用
};

const actions = {
};

const mutations = {
  SET_RESTAURANTS(state, list) {
    state.restaurants = list;
  },
  SET_MARKERS(state, list) {
    state.markers = list;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
