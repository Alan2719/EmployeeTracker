const getRoles = function(res){
    console.log("Res in Index.js",res);
    for (let i = 0; i < res.length; i++) {
        let roleArray = [];
        roleArray.push(res[i].title);
        console.log(roleArray);
    }
    return roleArray;
}

module.exports = getRoles();

