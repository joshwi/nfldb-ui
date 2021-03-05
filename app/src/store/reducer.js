const { combineReducers } = require("redux")
const types = require("./types")

const keyReducer = (state = {}, action) => {
    switch (action.type) {
        case types.LOAD_KEYS:
            return { ...state, ...action.keys }
        default:
            return state
    }
}

const siteReducer = (state = {}, action) => {
    switch (action.type) {
        case types.LOAD_PARAMS:
            return { ...state, params: action.params }
        case types.SET_PARAMS:
            return { ...state, params: { ...state.params, ...action.params } }
        default:
            return state
    }
}

const rootReducer = combineReducers({
    site: siteReducer,
    keys: keyReducer
})

export default rootReducer