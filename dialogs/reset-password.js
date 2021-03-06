var builder = require('botbuilder');
const uuid = require('uuid');

const library = new builder.Library('resetPassword');

library.dialog('/', [
        (session) => {
            session.beginDialog('validators:consumerno', {
                prompt: 'Please enter your consumer no: (valid value is 123456789; retry attempts:2)',
                retryPrompt: 'We could not find the provided consumer no. Please try again.',
                maxRetries: 2
            });
        },
    (session, args) => {
        if (args.resumed) {
            session.send('You have tried to enter your consumer no many times. Please try again later.');
            session.endDialogWithResult({ resumed: builder.ResumeReason.notCompleted });
            return;
        }
        session.beginDialog('validators:phonenumber', {
            prompt: 'Please enter your phone number: (foramt (xyz) xyz-wxyz)',
            retryPrompt: 'The value entered is not phone number. Please try again using the following format (xyz) xyz-wxyz:',
            maxRetries: 2
        });
    },
    (session, args) => {
        if (args.resumed) {
            session.send('You have tried to enter your phone number many times. Please try again later.');
            session.endDialogWithResult({ resumed: builder.ResumeReason.notCompleted });
            return;
        }

        session.dialogData.phoneNumber = args.response;
        session.send('The phone you provided is: ' + args.response);

        builder.Prompts.time(session, 'Please enter your date of birth (MM/dd/yyyy):', {
            retryPrompt: 'The value you entered is not a valid date. Please try again:',
            maxRetries: 2
        });
    },
    (session, args) => {
        if (args.resumed) {
            session.send('You have tried to enter your date of birth many times. Please try again later.');
            session.endDialogWithResult({ resumed: builder.ResumeReason.notCompleted });
            return;
        }

        session.send('The date of birth you provided is: ' + args.response.entity);

        var newPassword = uuid.v1();
        session.send('Thanks! Your new password is _' + newPassword + '_');

        session.endDialogWithResult({ resumed: builder.ResumeReason.completed });
        session.reset();
    }
]);

module.exports = library;