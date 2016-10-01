var fs = require('fs');
var path = require('path');

function copyFileSync(source, target) {

    var targetFile = target;

    //if target is a directory a new file with the same name will be created
    if (fs.existsSync(target)) {
        if (fs.lstatSync(target).isDirectory()) {
            targetFile = path.join(target, path.basename(source));
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync(source, target) {
    var files = [];

    //check if folder needs to be created or integrated
    var targetFolder = path.join(target, path.basename(source));
    if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder);
    }

    //copy
    if (fs.lstatSync(source).isDirectory()) {
        files = fs.readdirSync(source);
        files.forEach(function(file) {
            var curSource = path.join(source, file);
            if (fs.lstatSync(curSource).isDirectory()) {
                copyFolderRecursiveSync(curSource, targetFolder);
            } else {
                copyFileSync(curSource, targetFolder);
            }
        });
    }
}

var deleteFolderRecursiveSync = function(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file, index) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursiveSync(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

function formatCodeSnippet(htmlStr) {
    let outStr = '';
    let startIndex = htmlStr.indexOf('<code>');
    let endIndex = htmlStr.indexOf('</code>');
    if (startIndex === -1) return htmlStr;

    outStr += htmlStr.substr(0, startIndex);
    outStr += htmlStr.substr(startIndex, (endIndex - startIndex) + 7).replace(/\n/g, '<br>\n').replace(/    /g, '&emsp;');
    outStr += formatCodeSnippet(htmlStr.substr(endIndex + 7));
    return outStr;
}

module.exports = {
    copyFileSync: copyFileSync,
    copyFolderRecursiveSync: copyFolderRecursiveSync,
    deleteFolderRecursiveSync: deleteFolderRecursiveSync,
    formatCodeSnippet: formatCodeSnippet
}