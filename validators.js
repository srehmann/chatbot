var builder = require('botbuilder');

const PhoneRegex = new RegExp(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/);

const library = new builder.Library('validators');

library.dialog('phonenumber',
    builder.DialogAction.validatedPrompt(builder.PromptType.text, (response) =>
        PhoneRegex.test(response)));

library.dialog('consumerno',
                    builder.DialogAction.validatedPrompt(builder.PromptType.text,
                        (response) => response === '123456789')
                );

module.exports = library;
module.exports.PhoneRegex = PhoneRegex;