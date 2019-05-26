'use strict';

const Winston = require('winston');
var request = require('request');
const Bot = require('./bot.js');
const log = new Winston.Logger({
    name: 'bot_log',
    transports: [new Winston.transports.Console({
        timestamp: true,
        colorize: true,
        level: process.env.loglevel || 'warn'
    })]
});

/*
let agent_config = {};
try {
    agent_config = require('./config/region_config.js')[process.env.LP_ACCOUNT][process.env.LP_USER];
} catch (ex) {
    log.warn(`[custom_bot.js] Error loading config: ${ex}`)
}
*/



class custom_bot extends Bot {

    

    constructor(config, initialState = 'ONLINE', subscribeAllConversations = false) {
        super(config);
    }

    

     // log.info( " SEND to SOE :" +`${event.message}`);
      watson_response(utterance) {
          var resp;
        var lp_payload = {
            "_msgid" : "3837",
            "team_id" : "0886",
            "team_domain" : "ibm_ls",
            "text" : utterance,
            "user_id" : "93udj3hd",
            "user_name" : "jgothan",
            "source" : "Chat",
            "region" : "US-South",
            "primary_workspace_id" : "7a0198fa-ad29-4",
            "primary_region" : "US-SOUTH"
         }
         log.info("About to receive the message ---> "+utterance);
        request.post(
            'https://region-sandbox.mybluemix.net/addChat',
            { json: lp_payload },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    log.info("About to receive the message...");
                    log.info(' Text: '+body.text);
                    log.info(body);
                    resp=body.text;
                  // return body.text;
                }
            }
        );
        return resp;
     }; 
     watson_response1(utterance) {
        var resp;
      var lp_payload = {
          "_msgid" : "3837",
          "team_id" : "0886",
          "team_domain" : "ibm_ls",
          "text" : utterance,
          "user_id" : "93udj3hd",
          "user_name" : "jgothan",
          "source" : "Chat",
          "region" : "US-South",
          "primary_workspace_id" : "7a0198fa-ad29-4",
          "primary_region" : "US-SOUTH"
       }
       log.info("About to receive the message ---> "+utterance);
      
      return "resp";
   }; 
}
module.exports = custom_bot;