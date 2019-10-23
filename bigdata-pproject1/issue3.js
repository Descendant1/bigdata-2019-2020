
var addStatuses = () =>{
    let statuses =  [ "maternityLeave" ,"fired" ,"sick" ,"available" ,"vacation" ];

    dbw.getEmployees().forEach(emp => {
        
        emp.status =  helper.arrayTakeRandomMember(statuses);
        dbw.updateEmployee(emp);

    });
};
//part 1
dbw.getEmployees({ "status" : "fired" });
//part 2
dbw.getEmployees({ "status" : "maternityLeave" });

//part 3
dbw.getEmployees({ "status": { "$in": [ "vacation" ,"sick" ] } });
//part 4
dbw.getEmployees({"salary": {"$gte": 2000, "$lte": 3000}});
//part 5
dbw.getEmployees({salary: 2500});
dbw.getEmployees({salary: 3000});
dbw.getEmployees({salary: 3500});
dbw.getEmployees({salary: 5000});
//part 6
dbw.getEmployees({"boss": {"$exists": false}})
//part 7 Ill use Array.sort  because I'm returning arr not coll
dbw.getEmployees({"salary": {"$gt": 5000}}).sort((a,b) => (a.firstName > b.firstName) ? 1 : ((b.firstName > a.firstName) ? -1 : 0));

var  getHighestPaidByDep = () =>{
    let departs =  dbw.getDepartments();
    let res = [];

    departs.forEach(dep=>{
        let highestPaid = dbw.getEmployees( {"department.name" : dep}  )
        let sorted =  highestPaid.sort((a, b) => a.salary - b.salary);
        // let sliced =  sorted.slice(0, 5);
        res.push({ 
            "department" : dep.name,
            "employee" : sorted
        });

    });
    return res;
}