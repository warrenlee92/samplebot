/*-----------------------------------------------------------------------------
This template demonstrates how to use an IntentDialog with a LuisRecognizer to add
natural language support to a bot.
For a complete walkthrough of creating this type of bot see the article at
https://aka.ms/abs-node-luis
-----------------------------------------------------------------------------*/
"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var path = require('path');

var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var bot = new builder.UniversalBot(connector);
bot.localePath(path.join(__dirname, './locale'));

// Make sure you add code to validate these fields
var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisAPIHostName = process.env.LuisAPIHostName;

const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v1/application?id=' + luisAppId + '&subscription-key=' + luisAPIKey;
bot.on('conversationUpdate', function (message) {
    if (message.membersAdded) {
        message.membersAdded.forEach(function (identity) {
            if (identity.id === message.address.bot.id) {
                bot.send(new builder.Message()
                    .address(message.address)
                    .text("Hi there!\n\n"+"I am Daisy, Diversus very own virtual assistant. \n\n"+ "How can i help you today?")
                    )
            }
        });
    }
});

// Main dialog with LUIS
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
var intents = new builder.IntentDialog({ recognizers: [recognizer] })

/*
.matches('<yourIntent>')... See details at http://docs.botframework.com/builder/node/guides/understanding-natural-language/
*/
.matches('Greetings', (session,args) => {
    session.send({text:'Howdy! How are you today?',
                attachments:[{
                    contentType:'image/png',
                    contentUrl:'http://www.free-icons-download.net/images/qq-penguin-icon-92197.png',
                    size:"small",
                    name: 'Diversus'
                    }]
    })
})
.matches('joke', (session,args) => {
    session.send({text:'**Q:** What computer sings really loud?\n\n'+'**A:** A dell\n\n'+'Get it?\n\n',
                attachments:[{
                    contentType:'image/png',
                    contentUrl:'https://ih0.redbubble.net/image.113387703.8727/flat,800x800,075,f.jpg',
                    size:"small"
                    }]
    })
})
.matches('Diversus_Background', (session,args) => {
    session.send({text:'We are an IT service company that provides quality technology and business transformation consulting.\n\r'+'Check out the video below on one of the projects we\'re involved in!\n\n'+'\n\n',
                 attachments:[{
                     contentType:'video/mp4',
                     contentUrl:'https://dms.licdn.com/playback/B56AQGuZ2J5n-Fo3A/fa8411c3f79a472bb79e960c51ce13e2/feedshare-mp4_500-migrate-1/1479932728445-v0ch3x?e=1512201296&v=alpha&t=Z3ddYxypcfND-G4rpFAuc_K6vgo0Fs5gQep_OEtBziM',
                     name: 'Perth Stadium'
                    }]
    })
})
.matches('Diversus_Location', (session,args) => {
    session.send("We are based in West Perth at - 16 Thelma Street, West Perth.\n\n"+"\n\n"+"You can find us **[here](https://www.google.com.au/maps/place/Diversus/)**")
})
.matches('Diversus_know', (session,args) => {
    session.send("I'm 3 days old so i can only answer some of your questions.\n\n"+"You can ask me topics related to:\n\n"+"* Our Background\n\n"+"* Our Location\n\n"+"* Our Clients\n\n"+"* Contact info\n\n"+"* random jokes\n\n")
})
.matches('Diversus_contact', (session,args) => {
    session.send({text:"",
                 attachmentLayout: "list",
                 attachments:[{
                     contentType:'application/vnd.microsoft.card.hero',
                     content:{
                         text: "You can reach us via phone or e-mail.\n\n",
                         buttons: [
          {
            "type": "call",
            "title": "Phone Call",
            "value": "tel:1300888900"// is for normal telephone call. Skpe for business was updated as the default program for protocol 'tel:'
           //value": "lync15:wlee"//initiate skype for business
          },
          {
            "type": "openUrl",
            "title": "E-mail",
            "value": "mailto:adminops@diversus.com.au?Subject=External Query: Diversus"  //this opens up Outlook and have a pre-defined subject field and send to field
          }]
}}]
})
})
.matches('Diversus_Clients', (session,args) => {
    session.send({text:'',
                attachments:[{
                     contentType:'application/vnd.microsoft.card.adaptive',
                     content:{
  "type": "AdaptiveCard",
  "version": "1.0",
  "body": [
{
  "type": "TextBlock",
  "text": "Our Success Stories",
  "size": "medium",
  "weight": "bolder"
},
{
  "type": "TextBlock",
  "text": "These are some of the clients we serve.\n\n"+"click to **Learn More**\n\n",
  "wrap": true,
  "spacing": "yes"
},
{
  "type": "ColumnSet",
  "columns":[
    {"type": "Column",
      "width": "auto",
      "items":[
        {
          "type": "Image",
          "url": "http://healthierworkplacewa.com.au/media/112937/hbf-logo.jpg",
          "size":"Large"
        },
        {
          "type": "Image",
          "url": "https://royallifesavingwa.com.au/-/media/images/rlsswa/news/feature-image/rlsswa_logo_1000x400.jpg?h=400&la=en&w=1000&hash=6D832DB61C51A35DEB2B950ADB558D7AA4335168",
          "size":"Large"
        },
        {
          "type": "Image",
          "url": "https://s0.whitepages.com.au/da4b0107-b755-4695-b283-004a638078d3/fremantle-ports-logo.jpg",
          "size":"Large"
        }
      ]}]}],
"actions": [
{
  "type": "Action.OpenUrl",
  "title": "Learn More..",
  "url": "https://www.diversus.com.au/Case-Studies"
}]
}}]
})
})
.onDefault((session) => {
    session.send('Sorry, I am not yet trained with the specific request.\n\n'+'Apologies if i have not been of assistance\n\n'+'![Apology](http://www.news.gatech.edu/sites/default/files/styles/740_x_scale/public/uploads/mercury_images/apology-crop_3.jpg?itok=RqVJBg4_)');
});
bot.dialog('/', intents);
//this section below is where the dialog for the bot is created for non-LUIS interaction
intents.matches(/^good/i, [
    function (session) {
        session.beginDialog('/respond');
    }
]);

bot.dialog('/respond', [
    function (session) {
        session.send("That's good to hear!");
        session.endDialog();
    }
]);
if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());
} else {
    module.exports = { default: connector.listen() }
}
