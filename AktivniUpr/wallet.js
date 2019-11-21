var fs = require('fs');
var crypto = require('crypto');

var dir =  '_meta';

var generateWallet = function(email) {

    var hash = crypto.createHash('sha256').update(email+pwd).digest('base64');
    return  {
        walletId:hash
    };
};

var saveWallet = function(walletObject) {
    createFile();
    
    var walletStringRepresentation = JSON.stringify(walletObject);
    fs.writeFileSync(dir+'/wallet.json', walletStringRepresentation);
};
var createFile=()=>{
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
}
var checkFileExists= ()=>{
    return fs.existsSync(dir+'/wallet.json');
}
var readFile=()=>{
    if(!checkFileExists())
    {               
        return 'ERRROR';                    
    }               
    var fileIn =  fs.readFileSync(dir+'/wallet.json');
    return JSON.parse(fileIn);
};

module.exports = {
    generateWallet  : generateWallet,
    saveWallet      : saveWallet,
    checkFileExists : checkFileExists,
    readFile        : readFile
}
