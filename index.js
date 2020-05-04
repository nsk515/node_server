const BackendServer = require('./src/BackendServer');
const MqttHandler = require('./src/MqttHandler')

BackendServer.begin();
MqttHandler.subscribe('Rosh');