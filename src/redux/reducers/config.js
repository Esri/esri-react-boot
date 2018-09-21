// ACTION TYPES //
export const types = {
    SET_CONFIG: 'SET_CONFIG',
    CONFIG_FETCH: 'CONFIG_FETCH',
}

// REDUCERS //
export const initialState = {
    loaded: false
}

export default (state = initialState, action) => {
    switch (action.type) {
        case types.SET_CONFIG:
            return {
                ...state,
                ...action.payload,
                loaded: true
            }
        default:
            return state;
    }
}

// ACTIONS //
export const actions = {
    fetchConfig: () => ({type: types.CONFIG_FETCH}),
};
