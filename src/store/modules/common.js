const getDefaultState = () => {
  return {
    account: {
      SELFRUN: [],
      FUND: [],
      MOM: [],
      BACKTEST: []
    }
  }
}

const state = getDefaultState()

const mutations = {
  SET_ACCOUNT: (state, { account, type }) => {
    state.account[type] = account
  }
}

export default {
  namespaced: true,
  state,
  mutations
}

