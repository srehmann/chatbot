var builder = require('botbuilder');
const library = new builder.Library('faq');
var Store = require('./store');

library.dialog('/', [
    (session) => {
        session.send('Welcome to FAQs.');
        builder.Prompts.text(session, 'Please enter your query or say \'cancel\' to start again.');
    },
    (session, results, next) => {
        session.dialogData.question = results.response;
        next();
    },
    (session) => {
        session.send('Ok. Searching for your query in the Knowledge base...');
        var question = session.dialogData.question;
        Store.findKN('/qnamaker/v2.0/knowledgebases/6cc8a31e-c026-47ad-8932-a434dcc55647/generateAnswer', 'POST', {
            question: question
        }, function (data) {
            console.log(JSON.stringify(data));
            if(data.answers) {
                session.send(data.answers[0].answer);
            }
        });
    }
]);

module.exports = library;