const get = async function(url){
    let headers = new Headers()
    headers.set('Accept', 'application/json')
    headers.set('Content-Type', 'application/json')
    if(url){
        let response = await fetch(url, {
            method: "GET",
            headers: headers,
        }).catch((error) => {
            throw error;
        });
        let data = await response.json()
        return data
    }
}

const post = async function(url, body){
    let headers = new Headers()
    headers.set('Accept', 'application/json')
    headers.set('Content-Type', 'application/json')
    if(url){
        let response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body),
        }).catch((error) => {
            throw error;
        });
        let data = await response.json()
        return data
    }
}

export {get, post}