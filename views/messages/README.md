# Filenames

These template's filenames must match the name of class implementing the base Email class. See note on `Email#render` for why.

# Markdown

Emails proper (messages sent using SMTP, etc) are rendered using pug templates that generate HTML. Discourse messages are generated as markdown _without_ conversion to HTML. In order to keep the model roughly the same, Discourse message templates should be a file ending in `.md.js` and export a single function accepting the locals configured on the Email instance and returning a Markdown string. For example:

```javascript
module.exports = locals => `
## Hello ${locals.member.username},

A dispute administrator has updated your ${locals.dispute.disputeTool.readableName} Dispute!

> ${locals.disputeStatus.comment}
`;
```

