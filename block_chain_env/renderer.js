var popupS = require('popups');

var CurrencyManager =  require('./Currencies/CurrencyManager');
var UserManager =  require('./Users/UserManager');
var Wallet =  require('./Users/Wallet');

var currencyManager = new CurrencyManager.CurrencyManager();
var userManager =  new UserManager.UserManager();


// userManager.SignUpUser('pasha',   [ new Wallet.Wallet('BTC',550) ,new Wallet.Wallet('XRP',8000) , new Wallet.Wallet('LTC',800) ] )
// userManager.SignUpUser('max',     [ new Wallet.Wallet('BCH',900)  ] );
// userManager.SignUpUser('natasha', [ new Wallet.Wallet('ETH',5800) ,new Wallet.Wallet('BTC',100000) ] );


(function () {
     popupS.prompt({ 
        content: 'Login please with Id',
        onSubmit: function(val) { 
            if(!val) { 

            }
            var user = userManager.SignInUser(val);
            currencyManager.InitCurrencyList();
            userManager.ShowAllWallets(null);
            popupS.alert({ content: 'Hi, ' + user.fullName + '!' }); 
        },
        onClose: function(){ window.close(); } 
    }); 

})();