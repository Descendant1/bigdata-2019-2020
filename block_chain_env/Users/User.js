class User{
    constructor(id,wallets,fullName){
        this.id = id;
        this.wallets = wallets;
        this.fullName = fullName;
        this.path = 'Wallets/'+fullName;
    }
}

module.exports={
    User
}