//  load("../../mngo/bigdata-pproject1/issue0.js");

// 1 part
initializer.randomlyMigrateEmployees();

//part 2
//explanation 
// setting date -> taking all distinct Id's from linktable and pushing obj via id into resultset 
var getEmployeesWith2MonthMovements = () => {
    
    let date = new Date();
    date.setMonth(date.getMonth()-2);
    let result = []

    db.EmployeeDepartmentMigrations.distinct(  "employeeMigratedId" , {"dateMigrated" :  { $gte : date } } ).forEach(idEmp => {
        result.push( dbw.getEmployeeById(idEmp ) );  
    });

    return result;
};

//part 3 
var getNotMigratedEmployees = () =>{

    let migrateds = db.EmployeeDepartmentMigrations.distinct(  "employeeMigratedId" );
    let all = dbw.getEmployees();
      for (let i = 0; i < all.length; i++) {
        for (let j = 0; j < migrateds.length; j++) {
            if( all[i]._id  ==  migrateds[j] )
            {
                all.splice( all.indexOf( all[i] ) , 1)
            }
        }
      }
     return all;
};

