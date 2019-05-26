'use strict';

const express = require('express');

let agent_config = {};
try {
    agent_config = require('./ucg_webpage_config/ucg_webpage_config.js');
} catch (ex) {
    log.warn(`[agent.js] Error loading config: ${ex}`)
}
console.log(agent_config);

// App
const app = express();
app.use(express.static(__dirname + '/public'));


app.listen(agent_config.port,'0.0.0.0');
console.log(`Running on ${agent_config.url}`);
