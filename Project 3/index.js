const listenPort = 3333;
let express = require("express");
let path = require('path');
let app = express();
app.set("view engine","ejs");
app.use(express.static('images'));

app.use(express.urlencoded({extended:true}));

let knex = require("knex") ({
    client: "pg",
    connection:{
        host: "localhost",
        server: "PostgreSQL 14",
        user: "postgres",
        password: "IS303SQL",
        database: "postgres",
        port: 5432
    },
    useNullAsDefault: true
})

app.listen(listenPort, function() {console.log("Listener active on port " +
listenPort); });

app.get("/", (req,res) => {
    res.render("index")
})

app.get("/displayVehicle", (req,res) => {
    knex('Vehicle').orderBy("vehicle_ID")
    .then(vehicleInfo => {
        res.render("displayVehicle", {vehicleData: vehicleInfo});
    }).catch(err => {
        console.log(err)
        res.status(500).json({err});
    });
});


app.get("/editVehicle/:vehicle_ID", (req,res) => {
    knex("Vehicle").where('vehicle_ID', req.params.vehicle_ID)
        .then(vehicleInfo => {
            res.render('editVehicle', {vehicleData: vehicleInfo});
        }).catch(err =>{
            console.log(err)
            res.status(500).json({err});
        });
});

app.post("/editVehicle", (req,res)=>{
    knex("Vehicle").where("vehicle_ID", parseInt(req.body.vehicle_ID))
        .update({
            vDescription: req.body.vDescription,
            vType: req.body.vType,
            vMileage: req.body.vType == "B" ? 0 : req.body.vMileage,
            vYear: req.body.vYear,
            vStillUsing: req.body.vStillUsing ? "Y" : "N"
        })
        .then(results => {
            res.redirect("displayVehicle")
        }).catch(err =>{
            console.log(err);
            res.status(500).json({err});
    });     
});

app.get("/addVehicle", (req,res) => {
    res.render("addVehicle")
})

app.post("/addVehicle", (req,res) => {
    knex('Vehicle')
        .insert({vDescription: req.body.vDescription,
        vType: req.body.vType,
        vYear: req.body.vYear,
        vMileage: req.body.vType == "B" ? 0 : req.body.vMileage,
        vStillUsing: req.body.vStillUsing  ? "Y" : "N"})
        .then(myvehicle => {
            res.redirect("/displayVehicle")
        })
})

app.get('/delVehicle/:vehicle_ID', (req, res) => {
    knex('Vehicle').where('vehicle_ID', req.params.vehicle_ID).del()
        .then(delResult => {
            res.redirect("/displayVehicle");
        }).catch(err => {
            console.log(err);
            res.status(500).json({ err });
        });
});