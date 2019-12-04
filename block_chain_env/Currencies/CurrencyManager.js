var Currency = require('./Currency');
var fs =  require('fs');


class  CurrencyManager{
    constructor(){
        this.CurrencyList= this.InitCurrencies();
    }
    GetCurrencyList (){
        return this.CurrencyList;
    }
    InitCurrencyList(){
       
        var ul =  document.getElementById('allCurr');
        var mainLi =  document.createElement('li')
        mainLi.className = 'header';
        mainLi.innerText = 'Currencies'
        ul.appendChild(mainLi);

        ul.className = 'sidebar-navigation';

        this.CurrencyList.forEach(curr => {
            var li =  document.createElement('li')
            var Span =  document.createElement('span');

            Span.onclick = (ev) =>{
                userManager.ShowAllWallets(ev.target.innerText);
            }

            Span.innerText = curr.name;            
            li.appendChild(Span);
            ul.appendChild(li);
        });
    }
    InitCurrencies(){
       if(fs.existsSync('Currencies/Currencies.json')){
            var temp = [];
            JSON.parse(fs.readFileSync('Currencies/Currencies.json')).forEach(el=>{
            temp.push(new Currency.Currency(el.name));
        });
        return temp;
       }
       else{
            var temp =  [ new Currency.Currency('BTC'),new Currency.Currency('ETH' ),new Currency.Currency('XRP'),new Currency.Currency('BCH'),new Currency.Currency('LTC') ];
            fs.writeFileSync('Currencies' +'/Currencies.json' , JSON.stringify( temp ));
            return temp;
       }
    }
}

module.exports = {
    CurrencyManager  
};