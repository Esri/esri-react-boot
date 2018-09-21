// ACTION TYPES //
export const types = {
    AUTH_SUCCESS: 'AUTH_SUCCESS',
    AUTH_FAIL: 'AUTH_FAIL',
    LOGOUT: 'LOGOUT',
    API_START: 'API_START',
    API_LOGIN: 'API_LOGIN',
    API_LOADED:'API_LOADED',
}

// REDUCERS //
export const initialState = {
    user: null,
    loaded: false,
    loggedIn: false,
    apiIsLoaded: false
}

export default (state = initialState, action) => {
    switch (action.type) {
        case types.AUTH_SUCCESS:
            const user = action.payload;
            delete user.portal;

            if (user.credential && user.credential._oAuthCred) {
                delete user.credential._oAuthCred;
            }

            return {
                ...state,
                user: user,
                loaded: true
            }
        case types.AUTH_FAIL:
            return {
                ...state,
                user: null,
                loaded: true
            }
        case types.LOGOUT:
            return {
                ...state,
                user: null
            }
        case types.API_LOADED:
            return {
                ...state,
                apiIsLoaded: true
            }
        default:
            return state;
    }
}

// ACTIONS //
export const actions = {
    startJSAPI: () => ({type: types.API_START}),
    login: () => ({type: types.API_LOGIN})
}
