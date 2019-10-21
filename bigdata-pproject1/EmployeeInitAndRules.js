//Fields:  firstName, lastName, middleName, correspondenceAddress, phoneNumber, email, post, department



//init function
const EmployeesCollectionInit = () => {
    print("hello huiking");
    db.createCollection("Employees", {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["firstName", "lastName", "correspondenceAddress", "phoneNumber", "email", "post", "department"],
                properties: {
                    firstName: {
                        bsonType: "string",
                        description: "Required; Type = string"
                    },
                    lastName: {
                        bsonType: "string",
                        description: "Required; Type = string"
                    },
                    middleName: {
                        bsonType: "string",
                        description: "Type = string"
                    },
                    correspondenceAddress: {
                        bsonType: "string",
                        description: "Required; Type = string"
                    },
                    phoneNumber: {
                        bsonType: "string",
                        description: "Required; Type = string"
                    },
                    email: {
                        bsonType: "string",
                        pattern: "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
                        description: "Required; Type = email"
                    },
                    department: {
                        bsonType: "string",
                        description: "Required; Type = string"
                    },
                    post: {
                        bsonType: "string",
                        description: "Required; Type = string"
                    },
                }
            }
        }
    });
}

// Model Class

// class Employee {

//     constructor
//         (
//             firstName, lastName, middleName, correspondenceAddress, phoneNumber, email, post, department
//         ) {
//         this.firstName = firstName;
//         this.lastName = lastName;
//         this.lastName = middleName;
//         this.correspondenceAddress = correspondenceAddress;
//         this.phoneNumber = phoneNumber;
//         this.email = email;
//         this.post = post;
//         this.department = department;
//     }
//     static insert :  function(emp)  {
//         db.Employees.insert({ 
            // firstName : emp.firstName,
            // lastName : emp.lastName,
            // lastName : mp.lastName,
            // correspondenceAddress : emp.correspondenceAddress,
            // phoneNumber : emp.phoneNumber,
            // email : emp.email,
            // post : emp.post,
            // department : emp.department
//         });
//     }
// }


// var valera  =  {
//     firstName : 'valera',
//     lastName : 'valera',
//     lastName : 'valera',
//     correspondenceAddress : 'valera',
//     phoneNumber : null,
//     email : 'valeravalera.valera',
//     post : 'valera',
//     department : 'valera'
// }