/**********************************************************************************************************************
* Module:     MqttHandler.js
* Purpose:    This file implements the module MqttHandler which is responsible for handling all the MQTT related
*             operations. 
**********************************************************************************************************************/
const mqtt = require("mqtt");
const config = require("../Config/Config.js");

var subscriptionList = [];
const mqttClient = mqtt.connect(config.mqttBrokerURL);
mqttClient.on('error', (err) => {
    console.log(err);
    mqttClient.end();
  });

mqttClient.on('connect', () => {
    console.log("Connected to broker");
    mqttClient.subscribe(subscriptionList);
});

mqttClient.on('message', mqqtMessageHandler);

/**************************************************************************************************
Method:     subscribe
Arguments:  newTopic
Returns:    None
  This method checks if the mqttClient is connected to the broker host URL. If already connected,
  the mqttClient subscribes to the newTopic, else the newTopic is stored in the subscription list
  to be subscribed after the connection has been established with the broker.
**************************************************************************************************/
function subscribe( newTopic ) {
    if(mqttClient != null && mqttClient.connected == true) {
        mqttClient.subscribe(newTopic);
    }
    else {
        subscriptionList.push(newTopic);
    }
}

/**************************************************************************************************
Method:     publish
Arguments:  topic, newMessage
Returns:    None
  This method publishes a message for a topic.
**************************************************************************************************/
function publish( topic, newMessage ) {
    mqttClient.publish(topic, newMessage);
}

/**************************************************************************************************
Method:     mqqtMessageHandler
Arguments:  topic, newMessage
Returns:    None
  This method is used as a callback function in case of a message event.
**************************************************************************************************/
function mqqtMessageHandler( topic, newMessage ) {
    console.log("Topic: "+ topic + "    Message: " + newMessage.toString());
}

/* Module exports */
module.exports = {
    subscribe,
    publish
}