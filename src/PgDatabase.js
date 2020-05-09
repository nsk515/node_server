const Constants = require('../Config/Constants');
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'pi',
  host: '192.168.5.1',
  database: 'test',
  password: 'raspberry',
  port: 5432
});


// Basic API to create table
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
                console.log('insertIntoTable: ', error);
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
        {name: 'deviceName',    type: 'VARCHAR(15)',    cond: 'NOT NULL'}
        // {name: 'timeFormat',    type: 'VARCHAR(15)',    cond: ''},
        // {name: 'favorite',      type: 'BOOLEAN',        cond: ''},
    ]
    // var deviceTableData = [
    //     {name: 'MAC',       value: 'a1:b2:c3:d4:e5:d6'},
    //     {name: 'deviceID',  value: 'ME01002345'},
    //     {name: 'deviceName', value: 'My Test Device2'}
    // ]
    createTable(Constants.TABLENAMES.deviceTable, deviceTableFields).then(() => {
        // insertIntoTable(Constants.TABLENAMES.deviceTable, deviceTableData);
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


// Create more tables here as needed





module.exports = {
    createTable,
    insertIntoTable,
    getFromTable,
    updateIntoTable
}
