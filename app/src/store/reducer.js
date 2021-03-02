const {combineReducers} = require("redux")
const types = require("./types")

const keyReducer = (state = {}, action) => {
    switch(action.type){
        case types.LOAD_KEYS:
            return { ...state, ...action.keys}
        default:
            return state
    }
}

const rootReducer = combineReducers({
    keys: keyReducer
})

export default rootReducer