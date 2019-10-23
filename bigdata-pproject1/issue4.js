//part 1
dbw.getClients(
    { "accounts":{
            "$not": {
                "$elemMatch": {
                    "currencyType": "BGN"
                }
            }
        } 
    }
);

//part 2
dbw.getClients({"accounts": {"$elemMatch": {"amount": 0}}})

//part 3

var updateAccountName = () =>{
    let clients =  dbw.getClients();

    clients.forEach(client => {
        
        client.accounts.forEach( acc => {

            acc.name =  client.firstName + "cметка" + acc.amount;
            db.Accounts.update( { _id: acc._id }, acc )
        });
        dbw.updateClient(client);
    });

}