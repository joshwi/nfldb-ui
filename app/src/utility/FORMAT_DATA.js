function format_table_data(data) {
    let output = []
    if(data.length > 0){
        for(var n in data){
            let object = {}
            var label = data[n]
            for (var m in label) {
                if(label[m].value){
                    object[label[m].name] = label[m].value
                }
            }
            output.push(object)
        }
    }
    return output
}

export { format_table_data }