
// 1 part
dbw.getDepartments();

// 2 part
var listSalaries = () =>{
    let salaries = [];
    dbw.getEmployees().forEach(emp => {
        salaries.push({ 
            "firstName" : emp.firstName,
            "lastName" : emp.lastName,
            "salary" : emp.salary 
         });
    });
    return salaries;
};
// 3 part
var listEmails = () =>{
    let newEmps = [];
    dbw.getEmployees().forEach(emp =>{
        newEmps.push({
            "firstName" : emp.firstName,
            "lastName" : emp.lastName,
            "email" : emp.firstName.toLowerCase()+"."+ emp.lastName.toLowerCase()+"@bankoftomarow.bg"
        });
    });
    return newEmps;
};
//4 part
var listOldEmployees = ()=>{
    //$lte == '<=' https://docs.mongodb.com/manual/reference/operator/query/lte/
    let date  =  new Date().setFullYear( new Date().getFullYear() - 5 );
    return dbw.getEmployees({dateStarted : {$lte:date}});
};
//5 part
var listEmployeesStartWithS = () =>{
    //$regex -  match cond. /^S/
    return dbw.getEmployees({firstName: {$regex: /^S/}});
};
//6 part
// Foreign employees, do I need to have birth dates in Employees collection?
var getForeignEmployees = () =>{
    //$ne = '!='
    return dbw.getEmployees({country : {$ne:"Bulgaria"}});
    // return dbw.getEmployees({birthCountry : {$ne:"Bulgaria"}});
};
//7 part
var listEmployeesContainI=()=>{
    //https://stackoverflow.com/questions/25177645/combining-regex-and-or-operators-in-mongo
    // without /i we'll seek only for case of starting I 
    return dbw.getEmployees({ $or: [
        { "firstName":  { $regex: /I/i} }, 
        { "lastName":   { $regex: /I/i} }, 
        { "middleName": { $regex: /I/i}}
    ]})
};
listSalaries();
listEmails();
listOldEmployees();
listEmployeesStartWithS();
getForeignEmployees();
listEmployeesContainI();