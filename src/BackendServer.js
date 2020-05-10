const express = require("express");
const config = require("../Config/Config.js");
const bodyParser = require("body-parser");
const pgdb = require("./PgDatabase");
const Constants = require('../Config/Constants');

app = express();
router = express.Router();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', router);

function begin() {
    app.listen(config.backendPort || 4000, () => {
        console.log('Server started');
    });
}

module.exports = {
    begin
}


/***************************************************************************************
 ***************************************************************************************
 *******************    Define Routes For various API's below   ************************
 ***************************************************************************************
 ***************************************************************************************/
// Test GET API
router.route('/test')
    .get((req, res) => {
        console.log('GET API Request', req.body);
        pgdb.getFromTable('people3', ['id', 'name', 'email'], null, 'id', 0)
        .then((rep) => {
            res.send(JSON.stringify(rep));
        });
    })
    .post((req, res) => {
        console.log('POST API Request: ' + JSON.stringify(req.body));
        res.send({type: 'POST'});
    })
    .put((req, res) => {
        console.log('Invalid PUT API call');
        res.send({error: 'Invalid PUT API call'});
    })
    .delete((req,res) => {
        console.log('Invalid DELETE API call');
        res.send({error: 'Invalid DELETE API call'});
    })
router.route('/test/:id')
    .get((req, res) => {
        console.log('GET API Request', req.body);
        pgdb.getFromTable('people3', ['id', 'name', 'email'], 'id='+req.params.id.toString(), 'id', 0)
        .then((rep) => {
            res.send(JSON.stringify(rep));
        });
    })
    .put((req, res) => {
        console.log('PUT API Request: ' + req.params.id + " " + JSON.stringify(req.body));
        res.send({type: 'PUT'});
    })    
    .delete((req,res) => {
        console.log('DELETE API Request: ',req.params.id + " "+ JSON.stringify(req.body));
        res.send({type: 'DELETE'});
    });

router.route('/device')
    .get((req, res) => {
        console.log('GET all devices');
        pgdb.getFromTable(Constants.TABLENAMES.deviceTable, null, null ,null, 0)
        .then((rep) => {
            res.send(JSON.stringify(rep));
        });
    })
    .post((req, res) => {
        console.log('Add a new device');
        var deviceData = [];
        req.body.MAC ? deviceData.push({name: 'MAC', value: req.body.MAC}) : '';
        req.body.deviceID ? deviceData.push({name: 'deviceID', value: req.body.deviceID}) : '';
        req.body.deviceName ? deviceData.push({name: 'deviceName', value: req.body.deviceName}) : '';
        pgdb.insertIntoTable(Constants.TABLENAMES.deviceTable, deviceData)
        .then((rep) => {
            res.send({'status': 'OK'});
        });
    });
router.route('/device/:id')
    .get((req, res) => {
        console.log('GET device: ' + req.params.id);
        pgdb.getFromTable(Constants.TABLENAMES.deviceTable, null, 'id='+req.params.id.toString() ,'id', 0)
        .then((rep) => {
            res.send(JSON.stringify(rep));
        });
    })
    .put((req, res) => {
        console.log("Edit device: " + req.params.id);
        var deviceData = [];
        req.body.MAC ? deviceData.push({name: 'MAC', value: req.body.MAC}) : '';
        req.body.deviceID ? deviceData.push({name: 'deviceID', value: req.body.deviceID}) : '';
        req.body.deviceName ? deviceData.push({name: 'deviceName', value: req.body.deviceName}) : '';
        pgdb.updateIntoTable(Constants.TABLENAMES.deviceTable, deviceData, 'id='+req.params.id.toString())
        .then((rep) => {
            res.send({'status' : 'OK'});
        })
    })
    .delete((req, res) => {
        console.log("Device delete: ", req.params.id);
        res.send({'status' : 'Yet To Implement'});
    });