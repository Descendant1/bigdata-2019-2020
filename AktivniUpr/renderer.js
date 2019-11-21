var myWallet        = require('./wallet');

var registerPanel   =  document.getElementById('registerPanel');

var register = ()=>{
var message = document.getElementById('wallet-panel');
var walletId  = document.getElementById('wallet-id');

    if(myWallet.checkFileExists()){
        message.style.display ='block';
        walletId.innerHTML ='вече съществува генериран портфейл.';
        return;
    }

    var email =  document.getElementById('email').value;
    var pwd   = document.getElementById('pwd').value;
    
    var walletReference = myWallet.generateWallet(email,pwd);
    myWallet.saveWallet(walletReference);
    
    message.style.display ='block';
    walletId.innerHTML = walletReference.walletId;
};

var login =()=>{
    var message = document.getElementById('wallet-panel');
    var walletId  = document.getElementById('wallet-id');
    var hash   = document.getElementById('hash').value;
    
    var file = myWallet.readFile();

    if(file ==='ERRROR')
    {
        message.style.display ='block';
        walletId.innerHTML = 'Something went wrong try again';
    }

    console.log(file);

    if(hash === file.walletId){
        window.location.href =  './index.html'
    }

};