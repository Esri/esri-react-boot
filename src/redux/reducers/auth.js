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
      const authObject = action.payload;

      console.log('AUTH_SUCCESS: ', authObject)

      // Previously took the approach of deleting unserializable stuff, but
      // any JSAPI release could introduce more, so switching to instead only
      // pull off known/needed properties

      const _user = authObject;
      const user = {
        fullName: _user.fullName,
        thumbnail: _user.thumbnail,
        thumbnailUrl: _user.thumbnailUrl,
        url: _user.portal.url,
        username: _user.username
      };

      return {
        ...state,
        user,
        loaded: true
      };

    case types.AUTH_FAIL:
      return {
        ...state,
        user: null,
        loaded: true
      };

    case types.LOGOUT:
      return {
        ...state,
        user: null
      };

    default:
      return state;
  }
}

// ACTIONS //
export const actions = {
    checkAuth: () => ({type: types.AUTH_CHECK}),
}
