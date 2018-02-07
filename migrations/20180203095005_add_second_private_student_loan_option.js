exports.up = k =>
  k('DisputeTools')
    .update({
      name: 'Dispute a Private Student Loan',
      readable_name: 'Private Student Loan Dispute',
      excerpt: 'Use this tool to dispute any private student loan.',
      about: `### Dispute an Unpaid Private Student Loan

#### For any private student loan debt

Private student loans are those issued by a company not working on behalf of the government. These companies often contract with a servicer to collect the debt. Some of them break the law when trying to collect. What is more, because of sloppy paperwork, the owners of the debt often can’t prove they own it. Demanding proof of ownership is the first step to getting debt collectors off our backs.

If you have a private student loan, this tool will assist you to generate a letter that will be automatically sent to the creditor or to the debt collector asking them to prove that they have the right to collect on the debt they have been bugging you about. You have a right to this evidence. If the creditor or collector cannot prove that you owe them money, they will be less likely to sue you or continue to collect.

This tool should not be used in response to a Complaint/Summons letter letting you know that the collector is actively seeking a judgment against you in court. If you are being sued, you should seek legal advice.
Before you begin to use this tool, you should make sure you have the name and address of the collections agency that is attempting to collect from you.

If you don't have the name and address of the collection agency, you will not be able to file this dispute.`,
    })
    .where({ id: '11111111-1111-6666-1111-111111111111' });

exports.down = k =>
  k('DisputeTools')
    .update({
      name: 'Dispute an Unpaid Private Student Loan',
      readable_name: 'Private Student Loan Dispute',
      excerpt: 'Use this tool to send a dispute to a private student loan in collections.',
      about: `### Dispute an Unpaid Private Student Loan

      #### For any defaulted private student loan debt that has been sent to collections.

      Private student loans are those issued by a company not working on behalf of the government. These companies often contract with a servicer to collect the debt. Some of them break the law when trying to collect. What is more, because of sloppy paperwork, the new owners of the debt often can’t prove they own it. Demanding proof of ownership, or “chain of title,” is the first step to getting debt collectors off our backs.

      If you are in default on a student loan, this tool will assist you to generate a letter that will be automatically sent to the debt collector asking them to prove that they have the right to collect on the debt they have been bugging you about. You have a right to this evidence. If the debt collector cannot prove that you owe them money, they will be less likely to sue you or continue to collect).

      This tool should **not** be used in response to a Complaint/Summons letter letting you know that the collector is actively seeking a judgment against you in court. If you are being sued, you should seek legal advice.

      Before you begin to use this tool, you should make sure you have the name and address of the collections agency that is attempting to collect from you.

      If you don't have the name and address of the collection agency, you will not be able to file this dispute.`,
    })
    .where({ id: '11111111-1111-6666-1111-111111111111' });
