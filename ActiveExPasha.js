
vehicleRequiredFields = ["storageId","model"];
cargoRequiredFields =  ["name", "category", "amountKg","vehicleId"]

// use stu_1601321017

var dbw ={
    insertVehicle: (veh) =>{
        let bool = validator.validateVehicle(veh)
        if(!bool){
            return;
        }
        let storageIds = db.Vehicles.find({"storageId" : veh.storageId }).toArray();
        if(storageIds.length> 0){
            print("must be unique");
            return;
        }
        db.Vehicles.insert(veh);
    },
    updateVehicle: (veh) =>{
        if(!veh.storageId || !veh.model){
            return;
        }
        
        db.Vehicles.update({ _id: veh._id }, veh);
    },
    insertCargo: ( carg ,veh) =>{
        
        if(!validator.validateVehicle(veh) || !validator.validateCargo(carg)){
            return;
        }
        let fastDeleting = ["fruits","vegetables","meat","milk and dairy"]

        fastDeleting.forEach(cat => {
            if(carg.category ==  cat){
                db.priorityCargo.insert(carg);
            }
        });


        carg.vehicleId = veh._id
        db.Cargo.insert(carg);
    }
};
var validator = {
    validateVehicle : (veh) => {
        let vehErrors = [];
        vehicleRequiredFields.forEach(field => {
            if (!veh[field]) {
                vehErrors.push(field + " - is required(Vehicle collection)");
            }
        });

        if (vehErrors.length > 0) {
            vehErrors.forEach(error => {
                print(error);
            });
            return false;
        }
        return true;
    },
    validateCargo : (carg) => {
        let cargErrors = [];

        cargoRequiredFields.forEach(field => {
            if (!carg[field]) {
                cargErrors.push(field + " - is required(Cargo collection)");
            }
        });
        print(cargErrors.length)
        if (cargErrors.length > 0) {
            cargErrors.forEach(error => {
                print(error);
            });
            return false;
        }
        return true;
    },
}


var helper = {
    randomIntNext: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    arrayTakeRandomMember: (array) => {
        return array[helper.randomIntNext(0, array.length - 1)];
    }
}



init = {

    checkCollection: () =>{
        
        db.Vehicles.drop();
        db.createCollection("Vehicles");
        db.Cargo.drop();
        db.createCollection("Cargo");
        db.priorityCargo.drop();
        db.createCollection("priorityCargo");
    },
    populateVehicles: ()=>{
        dbw.insertVehicle({ "storageId": "785655" ,"model" : "BMW"  });
        dbw.insertVehicle({ "storageId": "785666" ,"model" : "Tesla"  });
        dbw.insertVehicle({ "storageId": "785677" ,"model" : "Audi"  });
        dbw.insertVehicle({ "storageId": "785688" ,"model" : "Lada"  });
        dbw.insertVehicle({ "storageId": "785699" ,"model" : "Gazel"  });
    }
}


init.checkCollection();
init.populateVehicles();

//part 2 
var updateSitCount = ()=>{
    db.Vehicles.find().forEach(veh=>{
        veh.sitCount =  2;
        dbw.updateVehicle(veh);
    });
}
updateSitCount();
//part 3 
var saveCargo = () =>{
    let vehicles = db.Vehicles.find().toArray();
    dbw.insertCargo( { "name" : "cucumber" , "category": "vegetables" , "amountKg" : 200 , "vehicleId": "0" } , helper.arrayTakeRandomMember(vehicles)  );
    dbw.insertCargo( { "name" : "tomato" , "category": "vegetables" , "amountKg" : 300 , "vehicleId": "0" } , helper.arrayTakeRandomMember(vehicles)  );
    dbw.insertCargo( { "name" : "potato" , "category": "vegetables" , "amountKg" : 500 , "vehicleId": "0" } , helper.arrayTakeRandomMember(vehicles)  );
    dbw.insertCargo( { "name" : "uran236" , "category": "food" , "amountKg" : 10 , "vehicleId":  "0" } , helper.arrayTakeRandomMember(vehicles)  );
    dbw.insertCargo( { "name" : "burgers" , "category": "milk and dairy" , "amountKg" : 30 , "vehicleId": "0" } , helper.arrayTakeRandomMember(vehicles)  );
}
saveCargo();
//part 4
var getWithJoin =() =>{
    let vehicles =  [];
    db.Vehicles.find().forEach(veh => {
        veh.cargos =  db.Cargo.find({"vehicleId" : veh._id}).toArray();
        vehicles.push(  veh );
    });
    return vehicles;
};