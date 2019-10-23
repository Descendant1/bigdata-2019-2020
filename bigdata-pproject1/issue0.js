//Data collections required fields.
const employeeRequiredFields = ["firstName", "lastName", "correspondenceAddress", "phoneNumber", "email", "post", "department"];
const clientRequiredFields = ["firstName", "lastName", "correspondenceAddress", "phoneNumber", "email"];
const departmentRequiredFields = ["name"];
const accountRequiredFields = ["idClient", "name", "currencyType", "amount"]

var helper = {
    randomIntNext: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    arrayTakeRandomMember: (array) => {
        return array[helper.randomIntNext(0, array.length - 1)];
    },
    //https://stackoverflow.com/questions/9035627/elegant-method-to-generate-array-of-random-dates-within-two-dates
    randomDate : (start, end) => {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }
}
var validator =
{
    validateEmployee: (emp) => {
        let empErrors = [];

        employeeRequiredFields.forEach(field => {
            if (!emp[field]) {
                empErrors.push(field + " - is required(Employee collection)");
            }
        });

        if (!validator.validateDepartment(emp.department)) {
            return false;
        }


        if (empErrors.length > 0) {
            empErrors.forEach(error => {
                print(error);
            });
            return false;
        }
        return true;
    },
    validateClient: (client) => {

        let cliErrors = [];

        clientRequiredFields.forEach(field => {
            if (!client[field]) {
                cliErrors.push(field + " - is required(Client collection)");
            }
        });

        //Accounts
        if (!client.accounts || client.accounts.length == 0) {
            cliErrors.push("accounts is required & need at least 1 account")
        }

        if (cliErrors.length > 0) {
            cliErrors.forEach(error => {
                print(error);
            });
            return false;
        }
        return true;
    },
    validateDepartment: (dep) => {
        let depErrors = [];

        departmentRequiredFields.forEach(field => {
            if (!dep[field] || dep[field].trim() == '') {
                depErrors.push(field + " - is required(Department collection)");
            }
        });

        if (depErrors.length > 0) {
            depErrors.forEach(error => {
                print(error);
            });
            return false;
        }
        return true;
    },
    validateAccounts: (accounts) => {
        let accErrors = [];

        accounts.forEach(acc => {
            accountRequiredFields.forEach(field => {
                if (!acc[field]) {
                    accErrors.push(field + " - is required(Accounts collection)");
                }
            });
            let checkUnique = db.Accounts.find({ "name": acc.name });
            if (checkUnique.length > 0) {
                accErrors.push("Account " + acc.name + " already taken");
            }

        });
        if (accErrors.length > 0) {
            accErrors.forEach(error => {
                print(error);
                return false;
            })
        }
        return true;
    }
}

var dbw =
{
    //Employee 
    getEmployees: (callback) => {
        let employees = db.Employees.find(callback).toArray()//.pretty();
        employees.forEach(currEmp=>{
            if(currEmp.bossId){
                let tempBoss =  dbw.getEmployeeById(currEmp.bossId);
                if(tempBoss){
                    currEmp.boss = tempBoss;
                }

            }
        });
        return employees; 
    },
    getEmployeeById: (id) => {

        if(!id){
            return;
        }
        let emp = db.Employees.findOne({ "_id": id });
        if (!emp) {
            return;
        }
        if( emp.bossId ){
            emp.boss =  db.Employees.findOne({ "_id" : emp.bossId});
        }
        return emp;
    },
    insertEmployee: (emp) => {
        if (!validator.validateEmployee(emp)) {
            return;
        }

        db.Employees.insert(emp);
    },
    updateEmployee: (emp) => {
        if (!validator.validateEmployee(emp)) {
            return;
        }
        let employee = dbw.getEmployeeById(emp._id);
        //Part 2
        if(emp.department.name != employee.department.name){
            db.EmployeeDepartmentMigrations.insert( {
                    "employeeMigratedId" : employee._id , 
                    "department" : emp.department,
                    "dateMigrated" :helper.randomDate( new Date(2000,0,1 ) , new Date() )
            } );
        };

        db.Employees.update({ _id: employee._id }, emp);
    },
    deleteEmployee: (id) => {
        db.Employees.deleteOne({ _id: id });
    },

    //Client
    getClients: (callback) => {
        return db.Clients.find(callback).pretty();
    },
    getClientById: (id) => {
        let client = db.Clients.findOne({ _id: id });
        if (!client) {
            print("Client with given Id not found;");
            return;
        }
        return client;
    },
    insertClient: (client) => {
        if (!validator.validateClient(client) || !validator.validateAccounts(client.accounts)) {
            return;
        }
        db.Clients.insert(client);
    },
    updateClient: (client) => {
        if (!validator.validateClient(client)) {
            return;
        }
        let cli = dbw.getClientById(client._id);

        db.Clients.update({ _id: cli._id }, client);
    },
    deleteClient: (id) => {
        db.Clients.deleteOne({ _id: id });
    },

    //Department
    getDepartments: () => {
        return db.Departments.find().toArray();
    },
    getDepartmentById: (id) => {
        let dep = db.Departments.findOne({ _id: id });
        if (!dep) {
            print("Department with given Id not found;");
            return;
        }
        return dep;
    },
    insertDepartment: (dep) => {
        if (!validator.validateDepartment(dep)) {
            return;
        }
        db.Departments.insert(dep);
    },
    updateDepartment: (dep) => {
        if (!validator.validateClient(dep)) {
            return;
        }
        let department = dbw    .getDepartmentById(dep._id);

        db.Departments.update({ _id: department._id }, dep);
    },
    deleteDepartment: (id) => {
        db.Departments.deleteOne({ _id: id });
    },

    //Accounts
    insertAccounts: (accounts) => {
        accounts.forEach(acc => {
            if (!validator.validateAccounts(accounts)) {
                return;
            }
            db.Accounts.insert(acc);
        });
    }

};

var initializer = {
    checkCollections: () => {
        db.Employees.drop();
        db.createCollection("Employees");
        db.Clients.drop();
        db.createCollection("Clients");
        db.Departments.drop();
        db.createCollection("Departments");
        db.Accounts.drop();
        db.createCollection("Accounts");
        db.EmployeeDepartmentMigrations.drop();
        db.createCollection("EmployeeDepartmentMigrations");
    },
    generateDepartments: () => {
        let departmentNames = ["CEOs", "CTOs", "COOs", "CFOs", "CMOs", "HRs", "Developers", "QAs"]
        for (let index = 0; index < departmentNames.length; index++) {
            let dep = { "_id": index + 1 * 3, "name": departmentNames[index] }
            if (validator.validateDepartment(dep)) {
                dbw.insertDepartment(dep);
            }
        }
    },
    generateEmployees: (quantity) => {
        var departments = dbw.getDepartments();
        let firstNames = ["Pasha", "Sasha", "Dasha", "Natasha", "Katerina", "Alosha", "Anton", "Konstantin", "Jora", "Valera"];
        let lastNames = ["Arelav", "Aroj", "Nitnatsnok", "Notna", "Ahsola", "Aniretak", "Nhsatan", "Dhsad", "Shsas", "Ahsap"];
        let middleNames = ["Pashaarelav", "Sashsaroj", "Dashdnitnatsnok", "Natashnnotna", "Katerinaahsola", null, null, null, null, null, null, null, null, null];
        let addresses = ["6 BARR RD", "54 LOWDEN AVE", "3 LAMBERT TER", "21807 COUNTY RD", "333 CARLTON DR", "200 Cider Brook Dr.", "1231 N WATER RD", "12615 S CENTRAL PARK AV", "18 HAMPTON ST", "5656 S 56TH ST", "W BROWN DEER RD", "654 CONT WAY", "60 INMAN DR", "74 WATER ST", "P O BOX NWBOX 99149", "2661 330TH ST", "100 WATER ST", "ADDL ADDRESS TEST", "29 Industrial Dr E", "2118 OPAL DR", "THERESA L GUAY", "123 MAIN STREET", "PO BOX 938", "5588 MAINCOON RD", "129 TIMSON ST", "205 DOLLAR ST", "W204 N5681 LANNON RD", "232 B ST", "1616 NORTH AVE"]
        let emailDomains = ["@yahoo.com", "@yandex.com", "@gmail.com", "@mail.ru", "@abv.bg"];
        let posts = ["CEO", "CTO", "COO", "CFO", "CMO", "HR", "Developer", "QA"];
        let countries = ["Bulgaria","USA","Ukraine","Russia","Belarus"];

        let bosses = [];

        while (quantity > 0) {
            let employee =
            {
                "_id": quantity * 3,
                "firstName": helper.arrayTakeRandomMember(firstNames),
                "lastName": helper.arrayTakeRandomMember(lastNames),
                "middleName": helper.arrayTakeRandomMember(middleNames),
                "correspondenceAddress": helper.arrayTakeRandomMember(addresses),
                "phoneNumber": "+35989" + helper.randomIntNext(100000, 999999),
                "post": helper.arrayTakeRandomMember(posts),
                "department": helper.arrayTakeRandomMember(departments),
                //Part 1 addition
                "salary": Math.round( helper.randomIntNext(1000,15000) /1000) *1000,
                "dateStarted" : helper.randomDate( new Date(2000,0,1 ) , new Date() ),
                "country" : helper.arrayTakeRandomMember(countries)
                //"birthCountry" :helper.arrayTakeRandomMember(countries)
            };
            employee.email = employee.firstName.toLowerCase() + helper.arrayTakeRandomMember(emailDomains);

            //defining bosses
            if (helper.randomIntNext(1, 100) <= 45) {
                bosses.push(employee);
            }
            //random push the employee to boss
            if (bosses.length > 0 && helper.randomIntNext(1, 100) <= 50 ) {
                let tempBoss = helper.arrayTakeRandomMember(bosses);
                if(tempBoss._id != employee._id){
                    employee.bossId = helper.arrayTakeRandomMember(bosses)._id;
                }
            }

            dbw.insertEmployee(employee);

            --quantity;
        }
    },
    generateClients: (quantity) => {
        let firstNames = ["Pasha", "Sasha", "Dasha", "Natasha", "Katerina", "Alosha", "Anton", "Konstantin", "Jora", "Valera"];
        let lastNames = ["Arelav", "Aroj", "Nitnatsnok", "Notna", "Ahsola", "Aniretak", "Nhsatan", "Dhsad", "Shsas", "Ahsap"];
        let middleNames = ["Pashaarelav", "Sashsaroj", "Dashdnitnatsnok", "Natashnnotna", "Katerinaahsola", null, null, null, null, null, null, null, null, null];
        let addresses = ["6 BARR RD", "54 LOWDEN AVE", "3 LAMBERT TER", "21807 COUNTY RD", "333 CARLTON DR", "200 Cider Brook Dr.", "1231 N WATER RD", "12615 S CENTRAL PARK AV", "18 HAMPTON ST", "5656 S 56TH ST", "W BROWN DEER RD", "654 CONT WAY", "60 INMAN DR", "74 WATER ST", "P O BOX NWBOX 99149", "2661 330TH ST", "100 WATER ST", "ADDL ADDRESS TEST", "29 Industrial Dr E", "2118 OPAL DR", "THERESA L GUAY", "123 MAIN STREET", "PO BOX 938", "5588 MAINCOON RD", "129 TIMSON ST", "205 DOLLAR ST", "W204 N5681 LANNON RD", "232 B ST", "1616 NORTH AVE"]
        let emailDomains = ["@yahoo.com", "@yandex.com", "@gmail.com", "@mail.ru", "@abv.bg"];
        let currencyTypes = ["BGN", null, null, null, null, null, null, null, null, null, null, "EUR", "USD"];

        while (quantity > 0) {
            let client =
            {
                "_id": quantity * 4,
                "firstName": helper.arrayTakeRandomMember(firstNames),
                "lastName": helper.arrayTakeRandomMember(lastNames),
                "middleName": helper.arrayTakeRandomMember(middleNames),
                "correspondenceAddress": helper.arrayTakeRandomMember(addresses),
                "phoneNumber": "+35989" + helper.randomIntNext(10000, 99999),
                "accounts": []
            }
            client.email = client.firstName.toLowerCase() + helper.arrayTakeRandomMember(emailDomains);

            accQuantity = helper.randomIntNext(1, 3);
            for (let index = 0; index < accQuantity; index++) {

                let acc =
                {
                    "_id": quantity * 4 - 3,
                    "name": Math.random().toString(32).slice(2),
                    "currencyType": helper.arrayTakeRandomMember(currencyTypes) || "BGN",
                    "amount": helper.randomIntNext(0, 10000),
                    "idClient": client._id
                }
                client.accounts.push(acc);
            }

            dbw.insertClient(client);

            dbw.insertAccounts(client.accounts);

            --quantity;
        }

    },
    //Part 2
    randomlyMigrateEmployees: () =>{
        let migrationsCount = helper.randomIntNext(2,3);
        let departmets = dbw.getDepartments();
        let employees = dbw.getEmployees();
        for (let index = 0; index < migrationsCount; index++) {
            let tempEmp =  helper.arrayTakeRandomMember( employees );
            tempEmp.department =  helper.arrayTakeRandomMember(departmets );
            dbw.updateEmployee(tempEmp);
        }

    }
}

initializer.checkCollections();
initializer.generateDepartments();
initializer.generateEmployees(10);
initializer.generateClients(20);
initializer.randomlyMigrateEmployees();
