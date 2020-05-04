const express = require("express");
const config = require("../Config/Config.js");
const bodyParser = require("body-parser");

app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function begin() {
    app.listen(config.backendPort || 4000, () => {
        console.log('Server started');
    });

    app.get('/api', GET_APIhandler);
    app.post('/api', POST_APIhandler);
}

function GET_APIhandler(req, res) {
    console.log('GET Request');
    res.send({name: 'Roshnee'});
}

function POST_APIhandler(req, res) {
    console.log('POST Request: ' + JSON.stringify(req.body));
    res.send({name: 'Roshnee'});
}

module.exports = {
    begin
}