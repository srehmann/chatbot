var builder = require('botbuilder');
var restify = require('restify');
// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

//const ChangePasswordOption = 'Change Password';
const ResetPasswordOption = 'Reset Password';
const ServicesOption = 'Services';
const KnowledgeBaseOption = 'General Queries';

var bot = new builder.UniversalBot(connector, [
    function (session) {
        session.beginDialog('/prompt');
    }
]);

bot.dialog('/prompt', [
    (session) => {
        builder.Prompts.choice(session,
            'Hello, how can I help you today? Please select from options below. You may restart the conversation saying \'help\' or \'cancel\'',
            [KnowledgeBaseOption, ServicesOption, ResetPasswordOption],
            { listStyle: builder.ListStyle.button });
    },
    (session, result) => {
        if (result.response) {
            switch (result.response.entity) {
                case KnowledgeBaseOption:
                    session.beginDialog("faq:/")
                    break;
                case ServicesOption:
                    session.beginDialog('services:/');
                    break;
                case ResetPasswordOption:
                    session.beginDialog('resetPassword:/');
                    break;
            }
        } else {
            session.send('I am sorry but I didn\'t understand that. I need you to select one of the options below');
        }
    },
    (session, result) => {
        if (result.resume) {
            session.send('You identity was not verified and your password cannot be reset');
            session.reset();
        }
    }
]);

bot.dialog('help', function (session, args, next) {
    session.endDialog("This is a bot that can give you different options to navigate. <br/>Please say 'OK' to continue");
}).triggerAction({
        matches: /.?help.?|.?cancel.?/i,
});

//Sub-Dialogs
bot.library(require('./dialogs/reset-password'));
bot.library(require('./dialogs/services'));
bot.library(require('./dialogs/faq'));

//Validators
bot.library(require('./validators'));

server.post('/api/messages', connector.listen());
