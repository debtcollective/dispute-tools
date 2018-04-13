const DisputeStatuses = require('../../shared/enum/DisputeStatuses');

const creditReportDisputeAddresses = `
You elected to mail the dispute documents yourself. Please send your dispute to one or more of the following addresses:

\`\`\`text
Experian
National Consumer Assistance Center
P.O. Box 2002
Allen, TX 75013
\`\`\`

\`\`\`text
Equifax Credit Information Services, Inc.
P.O. Box 740241
Atlanta, GA 30374
\`\`\`

\`\`\`text
TransUnion LLC
Consumer Disclosure Center
P.O. Box 1000
Chester, PA 19022
\`\`\`

---

*Please let us know whether you got a response from the credit reporting agencies so we can continue organizing together.*`;

const wageGarnishmentDisputeAddresses = `
You elected to mail the dispute documents yourself. Please send your dispute the following address:

\`\`\`
US DEPARTMENT OF EDUCATION
ATTN: AWG HEARINGS BRANCH
PO BOX 5227
GREENVILLE TX 75403-5227
\`\`\`

If you have a FFEL loan, you should also send a copy to your guarantor. If you do not know the name and address of your guarantor, please call the DOE hotline: \`+1 800-621-3115\`.

*Once you get a response from the DOE, please log back into your Debt Collective profile to let us know so we can continue organizing together.*`;

const taxOffsetReviewAddresses = `
You elected to mail the dispute documents yourself. Please send your dispute the following address:

\`\`\`text
US DEPARTMENT OF EDUCATION
FEDERAL OFFSET UNIT
PO BOX PO Box 5227
GREENVILLE TX 75403-5227
\`\`\`

If you have a FFEL loan, you should also send a copy to your guarantor. If you do not know the name and address of your guarantor, please call the DOE hotline: \`+1 800-621-3115\`.

*Once you get a response from the DOE, please log back into your Debt Collective profile to let us know so we can continue organizing together.*`;

const getAddresses = readableName => {
  switch (readableName) {
    case 'Credit Report Dispute':
      return creditReportDisputeAddresses;
    case 'Wage Garnishment Dispute':
      return wageGarnishmentDisputeAddresses;
    case 'Tax Offset Dispute':
      return taxOffsetReviewAddresses;
    default:
      return false;
  }
};

module.exports = ({ member, dispute, disputeStatus }) =>
  `
### Hi ${member.name || member.username},

An admin has written a new comment for you about your **${disputeStatus.status}** _${
    dispute.disputeTool.readableName
  }_.

> ${disputeStatus.comment.replace(/\n/g, '> ')}

${
    disputeStatus.status === DisputeStatuses.completed &&
    !dispute.data.pendingSubmission &&
    getAddresses(dispute.disputeTool.readableName)
      ? getAddresses(dispute.disputeTool.readableName)
      : ''
  }

If you have any questions, please reply directly to this message to contact the organizer assigned to your dispute.
`;
