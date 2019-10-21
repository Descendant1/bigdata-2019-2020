
load('../../mngo/bigdata-pproject1/EmployeeInitAndRules.js');

//Homework 1.
// db.createCollection('test', function(err, collection) {});
//Entities
//          EMPLOYEES load("../../mngo/bigdata-pproject1/main.js")


var dbm = {
    createEmpCollections : () => {
        EmployeesCollectionInit();
    }
}
dbm.createEmpCollections();
