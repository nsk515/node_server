const Constants = require('../Config/Constants');
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'pi',
  host: '192.168.5.1',
  database: 'test',
  password: 'raspberry',
  port: 5432
});


// Basic APIs
// API to create a table
createTable = (tableName, fields) => {
    return new Promise(function(resolve, reject) {
        var queryString = "CREATE TABLE IF NOT EXISTS " + tableName + " (";
        fields.forEach(element => {
            queryString += element.name + " " + element.type + " " + (element.cond?element.cond:"") + ", ";
        });
        queryString += "PRIMARY KEY (" + fields[0].name + ")";
        queryString += ")"
        console.log('createTable: ', queryString);
        pool.query(queryString, (error, result) => {
            if(error) {
                console.log('createTable: ', error);
                reject(error);
            }
            else {
                resolve(result.rows);
            }
        });
    });
}

// API to drop a table
dropTable = (tableName) => {
    return new Promise(function(resolve, reject) {
        var queryString = "DROP TABLE IF EXISTS " + tableName;
        console.log('dropTable: ', queryString);
        pool.query(queryString, (error, result) => {
            if(error) {
                console.log('dropTable: ', error);
                reject(error);
            }
            else {
                resolve();
            }
        });
    });
}

// API to insert data into table
insertIntoTable = (tableName, fieldData) => {
    return new Promise(function(resolve, reject) {
        var queryString = "INSERT INTO " + tableName + " (";
        var fieldNames = [];
        var fieldValues = [];
        fieldData.forEach(element => {
            fieldNames.push(element.name);
            fieldValues.push("'" + element.value + "'");
        });
        queryString += fieldNames.join(',') + ") VALUES (" + fieldValues.join(',') + ")";
        console.log('insertIntoTable: ', queryString);
        pool.query(queryString, (error, result) => {
            if(error) {
                console.log('insertIntoTable: ', 'failed');
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
}

// API to fetch data from table
getFromTable = (tableName, fieldData, cond, orderBy, limit) => {
    return new Promise(function(resolve, reject) {
        var queryString = "SELECT " + (Array.isArray(fieldData)?fieldData.join(','):'*') + " FROM " + tableName;
        queryString += (cond ? (" WHERE " + cond) : '');
        queryString += (orderBy ? (" ORDER BY " + orderBy) : '');
        queryString += (limit ? (" LIMIT " + limit.toString()) : '');
        console.log('getFromTable: ', queryString);
        pool.query(queryString, (error, result) => {
            if(error) {
                console.log('getFromTable: ', error);
                reject(error);
            }
            else {
                console.log(result.rows);
                resolve(result.rows);
            }
        });
    });
}

// API to update a row/rows in a table
updateIntoTable = (tableName, fieldData, cond) => {
    return new Promise(function(resolve, reject) {
        var queryString = "UPDATE " + tableName + " SET ";
        var fieldNames = [];
        fieldData.forEach(element => {
            fieldNames.push(element.name + "='" + element.value + "'");
        });
        queryString += fieldNames.join(',');
        queryString += cond ? " WHERE " + cond : '' ;
        console.log('updateIntoTable: ', queryString);
        pool.query(queryString, (error, result) => {
            if(error) {
                console.log('updateIntoTable: ', error);
                reject(error);
            }
            else {
                resolve(result.rows);
            }
        });
    });
}

// API to delete row in a table
deleteFromTable = (tableName, cond) => {
    return new Promise(function(resolve, reject) {
        if(cond != null) {
            var queryString = "DELETE FROM " + tableName + " ";
            queryString += "WHERE " + cond;
            console.log('deleteFromTable: ', queryString);
            pool.query(queryString, (error, result) => {
                if(error) {
                    console.log('deleteFromTable failed');
                    reject(error);
                }
                else {
                    resolve(result.rows);
                }
            })
        }
        else {
            reject('No condition specified');
        }
    });
}


/*
// TEST DATABASE API's
// Test create API
var peopleFields = [
    {name: 'id', type: 'SERIAL', cond: ''},
    {name: 'name', type: 'varchar(15)', cond: 'NOT NULL'},
    {name: 'email', type: 'varchar(15)', cond: 'NOT NULL'},
];
createTable('people3', peopleFields);

// Test insert API
var peopleData = [
    {name: 'name', value: 'Neeraj'},
    {name: 'email', value: 'neeraj@kale.com'}
];
insertIntoTable('people3', peopleData);

// Test get API
var fieldData = ['id', 'name', 'email'];
getFromTable('people3', fieldData, "name='Neeraj'", 'id', 5);

// Test update API
var peopleData = [
    {name: 'name', value: 'Neeraj'},
    {name: 'email', value: 'neeraj@kale.com'}
];
updateIntoTable('people3', peopleData, "id=1");
*/


// Create initial tables
// Create Device Table
{
    var deviceTableFields = [
        {name: 'id',            type: 'SERIAL',         cond: ''},
        {name: 'MAC',           type: 'VARCHAR(20)',    cond: ''},
        {name: 'deviceID',      type: 'VARCHAR(15)',    cond: 'NOT NULL'},
        {name: 'deviceName',    type: 'VARCHAR(15)',    cond: 'NOT NULL'},
        // {name: 'timeFormat',    type: 'VARCHAR(15)',    cond: ''},
         {name: 'favorite',      type: 'BOOLEAN',       cond: 'DEFAULT FALSE'},
         {name: 'widget',       type: 'INTEGER',        cond: 'DEFAULT 1'},
         {name: 'nodetype',     type: 'INTEGER',        cond: 'DEFAULT 1'}
    ]
    // var deviceTableData = [
    //     {name: 'MAC',       value: 'a1:b2:c3:d4:e5:d6'},
    //     {name: 'deviceID',  value: 'ME01002345'},
    //     {name: 'deviceName', value: 'My Test Device2'}
    // ]
    createTable(Constants.TABLENAMES.deviceTable, deviceTableFields).then(() => {
        // insertIntoTable(Constants.TABLENAMES.deviceTable, deviceTableData);
        console.log("Device table create then");
    });
}


// Create Data Table
{
    var dataTableFields = [
        {name: 'id',            type: 'SERIAL',         cond: ''},
        {name: 'deviceID',      type: 'VARCHAR(15)',    cond: 'NOT NULL'},
        {name: 'Value',         type: 'INTEGER',        cond: ''},
        {name: 'timeStamp',     type: 'BIGINT',      cond: ''}
    ]
    // var dataTableData = [
    //     {name: 'deviceID',  value: 'ME01001234'},
    //     {name: 'Value', value: 1698},
    //     {name: 'timeStamp', value: 1589019445}
    // ]
    createTable(Constants.TABLENAMES.dataTable, dataTableFields).then(() => {
        // insertIntoTable(Constants.TABLENAMES.dataTable, dataTableData);
    });
}

// Drop NodeTypes table and create again
{
    var nodeTypeFields = [
        {name: 'id',        type: 'SERIAL',             cond: ''},
        {name: 'nodeType',  type: 'VARCHAR(20)',        cond: ''}
    ];

    var nodeTypeData = [
        [{name: 'nodeType',  value: 'Invalid'}],
        [{name: 'nodeType',  value: 'Analog Sensor'}],
        [{name: 'nodeType',  value: 'Digital Sensor'}],
        [{name: 'nodeType',  value: 'Analog Actuator'}],
        [{name: 'nodeType',  value: 'Digital Actuator'}]
    ]

    dropTable(Constants.TABLENAMES.nodeTypesTable).then(() => {
        createTable(Constants.TABLENAMES.nodeTypesTable, nodeTypeFields).then(() => {
            // nodeTypeData.forEach((e)=>{
            //     insertIntoTable(Constants.TABLENAMES.nodeTypesTable, e);
            // });
            insertIntoTable(Constants.TABLENAMES.nodeTypesTable, nodeTypeData[0]).then(()=>{
                insertIntoTable(Constants.TABLENAMES.nodeTypesTable, nodeTypeData[1]).then(()=>{
                    insertIntoTable(Constants.TABLENAMES.nodeTypesTable, nodeTypeData[2]).then(()=>{
                        insertIntoTable(Constants.TABLENAMES.nodeTypesTable, nodeTypeData[3]).then(()=>{
                            insertIntoTable(Constants.TABLENAMES.nodeTypesTable, nodeTypeData[4]);      // This is a shitty way
                        });
                    });
                });
            });
        });
    });
}

// Drop Protocol table and create again
{
    var protocolFields = [
        {name: 'id',        type: 'SERIAL',             cond: ''},
        {name: 'protocol',  type: 'VARCHAR(10)',        cond: ''}
    ];

    var protocolData = [
        [{name: 'protocol',  value: 'Invalid'}],
        [{name: 'protocol',  value: 'HTTP'}],
        [{name: 'protocol',  value: 'MQTT'}],
        [{name: 'protocol',  value: 'XBEE'}]
    ]

    dropTable(Constants.TABLENAMES.protocolTypesTable).then(() => {
        createTable(Constants.TABLENAMES.protocolTypesTable, protocolFields).then(() => {
            // nodeTypeData.forEach((e)=>{
            //     insertIntoTable(Constants.TABLENAMES.nodeTypesTable, e);
            // });
            insertIntoTable(Constants.TABLENAMES.protocolTypesTable, protocolData[0]).then(()=>{
                insertIntoTable(Constants.TABLENAMES.protocolTypesTable, protocolData[1]).then(()=>{
                    insertIntoTable(Constants.TABLENAMES.protocolTypesTable, protocolData[2]).then(()=>{
                        insertIntoTable(Constants.TABLENAMES.protocolTypesTable, protocolData[3]);  // Seriously this is a shitty way
                    });
                });
            });
        });
    });
}

// Drop Widget table and create again
{
    var widgetTypeFields = [
        {name: 'id',        type: 'SERIAL',             cond: ''},
        {name: 'widget',    type: 'VARCHAR(10)',        cond: ''}
    ];

    var widgetTypeData = [
        [{name: 'widget',   value: 'None'}],
        [{name: 'widget',   value: 'Chart'}],
        [{name: 'widget',   value: 'Widget 2'}],
        [{name: 'widget',   value: 'Widget 3'}]
    ]

    dropTable(Constants.TABLENAMES.widgetTypesTable).then(() => {
        createTable(Constants.TABLENAMES.widgetTypesTable, widgetTypeFields).then(() => {
            // nodeTypeData.forEach((e)=>{
            //     insertIntoTable(Constants.TABLENAMES.nodeTypesTable, e);
            // });
            insertIntoTable(Constants.TABLENAMES.widgetTypesTable, widgetTypeData[0]).then(()=>{
                insertIntoTable(Constants.TABLENAMES.widgetTypesTable, widgetTypeData[1]).then(()=>{
                    insertIntoTable(Constants.TABLENAMES.widgetTypesTable, widgetTypeData[2]).then(()=>{
                        insertIntoTable(Constants.TABLENAMES.widgetTypesTable, widgetTypeData[3]);  // Seriously this is a shitty way
                    });
                });
            });
        });
    });
}


// Create more tables here as needed


// App Specific APIs
getDataForID = (id) => {
    return new Promise(function(resolve, reject) {
        var queryString = "SELECT da.id,d.deviceid,d.devicename,da.value,da.timestamp FROM devicedb d join datadb da ON d.deviceid=da.deviceid ";
        queryString += id ? "WHERE da.id="+id.toString() : '' ;
        queryString += " ORDER BY da.timestamp";
        console.log('getDataForID', queryString);
        pool.query(queryString, (error, result) => {
            if(error) {
                console.log('getDataForID: ', error);
                reject(error);
            }
            else {
                console.log(result.rows);
                resolve(result.rows);
            }
        });
    });
}


module.exports = {
    createTable,
    insertIntoTable,
    getFromTable,
    updateIntoTable,
    deleteFromTable,
    getDataForID
}
