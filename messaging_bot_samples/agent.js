'use strict';

const Winston = require('winston');
var request = require('request');
//const custom_bot = require('./bot/custom_bot.js');
const Bot = require('./bot/bot.js');

const log = new Winston.Logger({
    name: 'bot_agent_log',
    transports: [new Winston.transports.Console({
        timestamp: true,
        colorize: true,
        level: process.env.loglevel || 'info'
    })]
});

let agent_config = {};
try {
    //agent_config = require('./config/ucg_lp_config.js')[process.env.LP_ACCOUNT][process.env.LP_USER];
    //** Use next row for creating docker container **//
    agent_config = require('./container_config/ucg_lp_config.js')[process.env.LP_ACCOUNT][process.env.LP_USER];
} catch (ex) {
    log.warn(`[agent.js] Error loading config: ${ex}`)
}

/**
 * The agent bot starts in the default state ('ONLINE') and subscribes only to its own conversations
 *
 * Bot configuration is set via a config file (see config/example_config.js)
 * and environment variables LP_ACCOUNT and LP_USER
 *
 * transferSkill should be set to the ID of the skill you want the bot to transfer to
 *
 * @type {Bot}
 */

const agent = new Bot(agent_config);
const transferSkill = 'escalation-agent'; //'1292037414' | '277498214';;

agent.on(Bot.const.CONNECTED, data => {
    log.info(`[agent.js] CONNECTED ${JSON.stringify(data)}`);
});

agent.on(Bot.const.ROUTING_NOTIFICATION, data => {
    log.info(`[agent.js] ROUTING_NOTIFICATION ${JSON.stringify(data)}`);

    // Accept all waiting conversations
    agent.acceptWaitingConversations(data);
});

agent.on(Bot.const.CONVERSATION_NOTIFICATION, event => {
    log.info("-----------------------------CONVERSATION_NOTIFICATION --------------------");
    log.info(`[agent.js] CONVERSATION_NOTIFICATION ${JSON.stringify(event)}`);
    log.info("-----------------------------CONVERSATION_NOTIFICATION END --------------------");
  
});

agent.on(Bot.const.AGENT_STATE_NOTIFICATION, event => {
    log.info(`[agent.js] AGENT_STATE_NOTIFICATION ${JSON.stringify(event)}`);
   
});

agent.on(Bot.const.CONTENT_NOTIFICATION, event => {
    log.info(`[agent.js] CONTENT_NOTIFICATION ${JSON.stringify(event)}`);
    console.log("--------Trace-point-01-----------------");
    console.log(agent.getRole(agent.myConversations[event.dialogId].conversationDetails));
    console.log("--------Trace-point-01 end--------------");

    // Respond to messages from the CONSUMER
    if (event.originatorMetadata.role === 'CONSUMER'
        && agent.getRole(agent.myConversations[event.dialogId].conversationDetails) === 'ASSIGNED_AGENT') {
            log.info(`[agent.js] INSIDE IF LOOP `);
            log.info(event.message);
        switch (event.message.toLowerCase()) {
            case 'transfer':
                agent.sendText(event.dialogId, 'transferring you to a new skill');
                agent.transferConversation(event.dialogId, transferSkill);
                break;

            case 'close':
                agent.closeConversation(event.dialogId);
                break;

            case 'time':
                agent.sendText(event.dialogId, (new Date()).toTimeString());
                break;

            case 'date':
                agent.sendText(event.dialogId, (new Date()).toDateString());
                break;

            case 'online':
                agent.setAgentState({ availability: 'ONLINE' }, () => {});
                break;

            case 'back soon':
                agent.setAgentState({ availability: 'BACK_SOON' }, () => {});
                break;

            case 'away':
                agent.setAgentState({ availability: 'AWAY' }, () => {});
                break;

            case 'offline':
                agent.setAgentState({ availability: 'OFFLINE' }, () => {});
                break;

            case 'content':
                agent.sendRichContent(event.dialogId, {
                    id: Math.floor(Math.random() * 100000).toString(),
                    content: {
                        'type': 'vertical',
                        'elements': [
                            {
                                'type': 'text',
                                'text': 'Product Name',
                                'tooltip': 'text tooltip',
                                'style': {
                                    'bold': true,
                                    'size': 'large'
                                }
                            },
                            {
                                'type': 'text',
                                'text': 'Product description',
                                'tooltip': 'text tooltip'
                            },
                            {
                                'type': 'button',
                                'tooltip': 'button tooltip',
                                'title': 'Add to cart',
                                'click': {
                                    'actions': [
                                        {
                                            'type': 'link',
                                            'name': 'Add to cart',
                                            'uri': 'http://www.google.com'
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                });
                break;

            default:
          //  var ll = agent.watson_response1(event.message);
            //log.info(`[agent.js] ll `+ll);
         //   agent.transferConversation(event.dialogId, transferSkill);

           /** var lp_payload = {
                "_msgid" : "3837",
                "team_id" : "0886",
                "team_domain" : "ibm_ls",
                "text" : event.message,
                "user_id" : "93udj3hd",
                "user_name" : "jgothan",
                "source" : "Chat",
                "region" : "US-South",
                "primary_workspace_id" : "7a0198fa-ad29-4",
                "primary_region" : "US-SOUTH"
             } */
             log.info("--------------Received the message ---> "+event.message + "---------------");
             log.info(event);
             log.info("SOE Endpoint---> "+agent_config.soeEndPoint);
             log.info("--------------event message end-------------------------->");
             var bot_logo_url = agent_config.botLogo;
             console.log(bot_logo_url);
             request.post({
                url:     agent_config.soeEndPoint,
                form:    { dialogId: event.dialogId, utterance: event.message }
              }, function(error, response, body){
                if (!error && response.statusCode == 200) {

                    log.info("About to receive the message...");
                    log.info(body);
                    //log.info(' Text: '+body.text);
                    //log.info(body);
                    log.info("-------------- receive message end ---------------");

                    //var watsonResponse = JSON.parse(body);
                    var watsonResponse = {output : {text : body}};
                    //watsonResponse.output = body; //{body; //{output : {text : body.text}};
                    //log.info(watsonResponse);
                    log.info(' ================NAK - Text: '+watsonResponse.output.text);
              //      agent.sendText(event.dialogId, 'Watson : '+body.text);
                  // return body.text;
                  agent.sendRichContent(event.dialogId, {
                    id: Math.floor(Math.random() * 100000).toString(),
                    content: {
                        'type': 'vertical',
                        'elements': [
                            {
                                'type': 'text',
                                'text': 'Watson',
                                'tooltip': 'text tooltip',
                                'style': {
                                    'bold': true,
                                    'size': 'small'
                                }
                            },
                            
                            {
                                "type": "image",
                                "url" : agent_config.botLogo,
                                //"url": "https://s3-us-west-2.amazonaws.com/slack-files2/bot_icons/2018-11-02/470054445840_48.png",
                                //"url": "https://ibm.box.com/s/tzbhpqft3u47ehmi05uth7qv6jnye6lh",
                                "tooltip": "image tooltip",
                                "click": {
                                  
                                }

                              }, 
                            {
                                'type': 'text',
                                'text': new String(watsonResponse.output.text),
                                'tooltip': 'text tooltip'
                            }
                        ]
                    }
                });

                }
              });

              //* working form with JSON data
           /*
              request.post(
                agent_config.soeEndPoint,
                { json: lp_payload },
                function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        log.info("About to receive the message...");
                        log.info(' Text: '+body.text);
                        log.info(body);
                  //      agent.sendText(event.dialogId, 'Watson : '+body.text);
                      // return body.text;
                      agent.sendRichContent(event.dialogId, {
                        id: Math.floor(Math.random() * 100000).toString(),
                        content: {
                            'type': 'vertical',
                            'elements': [
                                {
                                    'type': 'text',
                                    'text': 'Watson',
                                    'tooltip': 'text tooltip',
                                    'style': {
                                        'bold': true,
                                        'size': 'large'
                                    }
                                },
                                {
                                    "type": "image",
                                    "url": "https://s3-us-west-2.amazonaws.com/slack-files2/bot_icons/2018-11-02/470054445840_48.png",
                                    "tooltip": "image tooltip",
                                    "click": {
                                      
                                    }
                                  },
                                {
                                    'type': 'text',
                                    'text': body.text,
                                    'tooltip': 'text tooltip'
                                }
                            ]
                        }
                    });

                    }
                }
            );
            */
            
            break;
        }
    }
});

agent.on(Bot.const.SOCKET_CLOSED, event => {
    log.info(`[agent.js] SOCKET_CLOSED ${JSON.stringify(event)}`);
});

agent.on(Bot.const.ERROR, error => {
    log.error(`[agent.js] ERROR ${JSON.stringify(error)}`);
});