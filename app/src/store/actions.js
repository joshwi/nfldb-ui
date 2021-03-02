const { get } = require("../utility/REST")
const types = require("./types")

export function loadKeys(){
    return function(dispatch){
        return get("/api/db/neo4j/keys").then(keys => {
            dispatch({type: types.LOAD_KEYS, keys: keys})
        }).catch(error => {
            throw error
        })
    }
}

