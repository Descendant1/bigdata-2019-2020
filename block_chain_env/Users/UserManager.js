var fs =  require('fs');
var crypto = require('crypto');
var User  =  require('./User');
var popupS = require('popups');

class UserManager{

    constructor(){
        if (!fs.existsSync('Wallets')){
            fs.mkdirSync('Wallets');
        }
        this.CurrentUser =  null;
        this.UserList = [];
        var wallets = this.getDirectories('Wallets');
        wallets.forEach(user => {
            var dir  = JSON.parse(fs.readFileSync('Wallets/'+user+'/identity.json'));
            this.UserList.push(new User.User( dir.id,dir.wallets,dir.fullName ) );
        });
    }
    SignInUser(id){
        var title = document.getElementById('userName');

        if(! fs.existsSync('Wallets/'+id))
            return false;
            
        let fileId = JSON.parse(fs.readFileSync('Wallets/'+id+'/identity.json'));

        if(id !== fileId.id)
            return false;

        let user =  this.UserList.find(item=>item.id == id);
        this.CurrentUser =  user;
        title.innerText =  user.fullName;
        this.InitUserWallets();
        return this.CurrentUser;
    }
    SignUpUser(fullname,wallets){

        if(fullname == '' || fullname == null) 
            return false;
        
        let id = crypto.createHash('sha256').update(fullname).digest('hex');
        let path =  'Wallets/'+id;
        
        if (!fs.existsSync(path)){
            fs.mkdirSync(path);
        }
        var temp = {
            'id': id,
            'wallets': wallets,
            'fullName': fullname
        }
        fs.writeFileSync(path +'/identity.json' , JSON.stringify( temp ));

        let user  =  new User.User(id,wallets,fullname);

        this.CurrentUser = user;
        this.UserList.push(user);
        return true;
    }
    getDirectories(source){
       return fs.readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
    }
    ShowAllWallets(Opt){
        var wallets  =  document.getElementById('wallets');
        wallets.innerHTML = '';
        var ul =  document.createElement('ul');
        ul.className = 'sidebar-navigation';
        
        var h2 =  document.createElement('h2');
        h2.innerText = 'All Wallets';
        h2.onclick = () =>{ this.ShowAllWallets(null) }
        h2.style.color='#fff';

        ul.appendChild(h2);

        this.UserList.forEach(user => {

                if(user.id == this.CurrentUser.id )
                    return;
                user.wallets.forEach(wallet=>{
                    if( Opt !=  null && wallet.name != Opt )
                        return;
                    
                    var li =  document.createElement('li');
                    var span =  document.createElement('span');
                    
                    span.onclick = (ev) =>{
                        this.prepareTran(user.fullName,wallet.name);
                    }
                    span.className = 'walletS';
                    span.innerText = wallet.name +' '+user.fullName  + ' - $'+ wallet.amount; 
                    li.appendChild(span);
                    ul.appendChild(li);
                });
            });
        
        wallets.appendChild(ul);
    }
    prepareTran(text,wallet){
        popupS.prompt({
            content:     'Are sure that you want to send money to ' + text,
            onSubmit: function(val) {
                if(val && !isNaN(val)  ) {
                    userManager.performTram(text , val, wallet);
                }
                else {
                    popupS.alert({
                        content: 'Enter num please'
                    });
                }
            },
            onClose: function() {
                console.log(':(');
            }
        });
    }
    performTram( to , val, wallet){
        var wallet =  this.CurrentUser.wallets.find(item=>item.amount >= val);

        if(!wallet)
            return 'You have no wallet with enoght money';
        
        this.UserList.find(item =>item.fullName == to).wallets.forEach(item=>{
            if(item.name == wallet.name){
                item.amount += val;
            }
        } );
        this.CurrentUser.wallets.forEach(it=>{
            if(it.amount >= val)
            {
                it.amount  -= val;
            }
        });
        return 'Success';
    }
    InitUserWallets(){
        var ul = document.getElementById('userCurr');
        var mainLi =  document.createElement('li')
        mainLi.className = 'header';
        mainLi.innerText = 'Your wallets';
        ul.appendChild(mainLi);

        ul.className = 'sidebar-navigation';

        this.CurrentUser.wallets.forEach(curr => {
            var li =  document.createElement('li')
            var Span =  document.createElement('span');

            Span.innerText = curr.name + ' - $'+ curr.amount;            
            li.appendChild(Span);
            ul.appendChild(li);
        });
    }

}



module.exports={
    UserManager
}