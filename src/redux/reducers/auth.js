// ACTION TYPES //
export const types = {
    AUTH_SUCCESS: 'AUTH_SUCCESS',
    AUTH_FAIL: 'AUTH_FAIL',
    AUTH_CHECK: 'AUTH_CHECK',
    LOGOUT: 'LOGOUT',
}

// REDUCERS //
export const initialState = {
    user: null,
    loaded: false,
    loggedIn: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.AUTH_SUCCESS:
      const user = action.payload;

      return {
        ...state,
        user,
        loaded: true,
        loggedIn: true
      };

    case types.AUTH_FAIL:
      return {
        ...state,
        user: null,
        loaded: true,
        loggedIn: false
      };

    default:
      return state;
  }
}

// ACTIONS //
export const actions = {
  checkAuth: (url) => ({
    type: types.AUTH_CHECK,
    payload: {
      portalUrl: url,
    }
  }),

  logout: (url) => ({
    type: types.LOGOUT,
    payload: {
      portalUrl: url,
    }
  }),
}
