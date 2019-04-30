const fs = require('fs');
const path = require('path');

function dfsReader (root, files = [], prefix = ''){
    const dir = path.join(root, prefix);
    if (!fs.existsSync(dir)){
        return files
    } else if (fs.statSync(dir).isDirectory()){
        fs.readdirSync(dir).forEach(name => {
            dfsReader(root, files, path.join(prefix, name));
        });
    } else {
        files.push(prefix);
    }
    return files;
}

function matchFile (fileName, reg){
    return fileName.match(reg);
}

module.exports = {
    dfsReader,
    matchFile
};