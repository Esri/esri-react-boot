// ACTION TYPES //
export const types = {
    MAP_LOADED: 'MAP_LOADED',
    SET_FEATURES: 'SET_FEATURES',
}

// REDUCERS //
export const initialState = {
    loaded: false,
    features: []
};

export default(state = initialState, action) => {
    switch (action.type) {
        case types.MAP_LOADED:
            return {
                ...state,
                loaded: true
        }
        case types.SET_FEATURES:
            return {
                ...state,
                features: action.payload.features
            }
        default:
            return state;
    }
}

// ACTIONS //
export const actions = {
    mapLoaded: () => ({
        type: types.MAP_LOADED,
        payload: {}
    }),
    setFeatures: (features) => ({
        type: types.SET_FEATURES,
        payload: {
            features
        }
    })
};
