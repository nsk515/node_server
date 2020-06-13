const express = require("express");
const config = require("../Config/Config.js");
const bodyParser = require("body-parser");
const pgdb = require("./PgDatabase");
const cors = require('cors');
const Constants = require('../Config/Constants');

app = express();
app.use(cors());
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
// Test API Routes
router.route('/test')
    .get((req, res) => {
        console.log('GET API Request', req.body);
        pgdb.getFromTable('people3', ['id', 'name', 'email'], null, 'id', 0)
        .then((rep) => {
            res.send(JSON.stringify(rep));
        })
        .catch((error) => {
            res.statusMessage = "Database Operation failed";
            res.status(500).end();
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
        })
        .catch((error) => {
            res.statusMessage = "Database Operation failed";
            res.status(500).end();
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

// device API routes
router.route('/device')
    .get((req, res) => {
        console.log('GET all devices');
        pgdb.getFromTable(Constants.TABLENAMES.deviceTable, null, null , 'id', 0)
        .then((rep) => {
            res.send((rep));
        })
        .catch((error) => {
            res.statusMessage = "Database Operation failed";
            res.status(500).end();
        });
    })
    .post((req, res) => {
        console.log('Add a new device', req.body);
        var deviceData = [];
        req.body.mac ? deviceData.push({name: 'mac', value: req.body.mac}) : '';
        req.body.deviceid ? deviceData.push({name: 'deviceid', value: req.body.deviceid}) : '';
        req.body.devicename ? deviceData.push({name: 'devicename', value: req.body.devicename}) : '';
        pgdb.insertIntoTable(Constants.TABLENAMES.deviceTable, deviceData)
        .then((rep) => {
            res.send({'status': 'OK'});
        })
        .catch((error) => {
            res.statusMessage = "Database Operation failed";
            res.status(500).end();
        });
    });
router.route('/device/:id')
    .get((req, res) => {
        console.log('GET device: ' + req.params.id);
        pgdb.getFromTable(Constants.TABLENAMES.deviceTable, null, 'id='+req.params.id.toString() ,'id', 0)
        .then((rep) => {
            res.send(JSON.stringify(rep));
        })
        .catch((error) => {
            res.statusMessage = "Database Operation failed";
            res.status(500).end();
        });
    })
    .put((req, res) => {
        console.log("Edit device: " + req.params.id);
        console.log('body', req.body);
        var deviceData = [];
        req.body.mac ? deviceData.push({name: 'mac', value: req.body.mac}) : '';
        req.body.deviceid ? deviceData.push({name: 'deviceid', value: req.body.deviceid}) : '';
        req.body.devicename ? deviceData.push({name: 'devicename', value: req.body.devicename}) : '';
        req.body.favorite ? deviceData.push({name: 'favorite', value: req.body.favorite}) : '';
        req.body.widget ? deviceData.push({name: 'widget', value: req.body.widget}) : '';
        req.body.nodetype ? deviceData.push({name: 'nodetype', value: req.body.nodetype}) : '';
        req.body.protocol ? deviceData.push({name: 'protocol', value: req.body.protocol}) : '';
        pgdb.updateIntoTable(Constants.TABLENAMES.deviceTable, deviceData, 'id='+req.params.id.toString())
        .then((rep) => {
            res.send({'status' : 'OK'});
        })
        .catch((error) => {
            res.statusMessage = "Database Operation failed";
            res.status(500).end();
        });
    })
    .delete((req, res) => {
        console.log("Device delete: ", req.params.id);
        pgdb.deleteFromTable(Constants.TABLENAMES.deviceTable, 'id='+req.params.id.toString())
        .then((rep) => {
            res.send({'status' : 'OK'});
        })
        .catch((error) => {
            res.statusMessage = "Database Operation failed";
            res.status(500).end();
        })
    });


// data API routes
router.route('/data')
    .get((req, res) => {
        console.log('GET all data');
        pgdb.getDataForID(0)
        .then((rep) => {
            res.send((rep));
        })
        .catch((error) => {
            res.statusMessage = "Database Operation failed";
            res.status(500).end();
        });
    })
    .post((req, res) => {
        console.log('Add a new data', req.body);
        var deviceData = [];
        if(req.body.deviceid && req.body.value) {
            deviceData.push({name: 'deviceid', value: req.body.deviceid});
            deviceData.push({name: 'value', value: req.body.value});
            if(req.body.timestamp) {
                deviceData.push({name: 'timestamp', value: req.body.timestamp});
            }
            else {
                var date = new Date();
                var timestamp = date.getTime();
                deviceData.push({name: 'timestamp', value: Math.floor(timestamp/1000)});
            }
        }
        pgdb.insertIntoTable(Constants.TABLENAMES.dataTable, deviceData)
        .then((rep) => {
            res.send({'status': 'OK'});
        })
        .catch((error) => {
            res.statusMessage = "Database Operation failed";
            res.status(500).end();
        });
    });
router.route('/data/:id')
    .get((req, res) => {
        console.log('GET data: ' + req.params.id);
        pgdb.getDataForID(req.params.id)
        .then((rep) => {
            res.send(JSON.stringify(rep));
        })
        .catch((error) => {
            res.statusMessage = "Database Operation failed";
            res.status(500).end();
        });
    })
    .put((req, res) => {
        console.log("Edit data: " + req.params.id);
        var deviceData = [];
        if(req.body.deviceid && req.body.value) {
            deviceData.push({name: 'deviceid', value: req.body.deviceid});
            deviceData.push({name: 'value', value: req.body.value});
            if(req.body.timestamp) {
                deviceData.push({name: 'timestamp', value: req.body.timestamp});
            }
            else {
                var date = new Date();
                var timestamp = date.getTime();
                deviceData.push({name: 'timestamp', value: timestamp});
            }
        }
        pgdb.updateIntoTable(Constants.TABLENAMES.dataTable, deviceData, 'id='+req.params.id.toString())
        .then((rep) => {
            res.send({'status' : 'OK'});
        })
        .catch((error) => {
            res.statusMessage = "Database Operation failed";
            res.status(500).end();
        });
    })
    .delete((req, res) => {
        console.log("Device data: ", req.params.id);
        pgdb.deleteFromTable(Constants.TABLENAMES.dataTable, 'id='+req.params.id.toString())
        .then((rep) => {
            res.send({'status' : 'OK'});
        })
        .catch((error) => {
            res.statusMessage = "Database Operation failed";
            res.status(500).end();
        })
    });

// Chart API routes
router.route('/widget/:widgetType')
    .get((req, res) => {
        console.log('GET widget type: ' + req.params.widgetType);
        pgdb.getFromTable(Constants.TABLENAMES.deviceTable, ['id'], "widget="+ req.params.widgetType, 'id', 0)
        .then((rep) => {
            res.send((rep));
        })
        .catch((error) => {
            res.statusMessage = "Database Operation failed";
            res.status(500).end();
        });
    });

// Device Data API routes
router.route('/device/data/:deviceid')
    .get((req, res) => {
        console.log('GET device data: ' + req.params.deviceid);
        pgdb.getFromTable(Constants.TABLENAMES.dataTable, null, "deviceid IN ('"+ req.params.deviceid+"')", 'timestamp', 0)
        .then((rep) => {
            res.send((rep));
        })
        .catch((error) => {
            res.statusMessage = "Database Operation failed";
            res.status(500).end();
        });
    });
