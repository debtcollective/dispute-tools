/* eslint-disable max-len  */

const id = '11111111-1111-3333-1111-111111111111';

exports.seed = knex =>
  knex('DisputeTools')
    .where({ id })
    .update({
      about:
        `### General Debt Dispute Letter

#### For any personal debt except student loans

This tool generates a dispute letter demanding that the creditor or collector send documentation to you proving that they own the debt and have the right to collect it. There is no risk to you in filing this dispute. Creditors and collectors are required by law to provide you with this information.

If you are not in default on the debt you wish to dispute, this tool will assist you to ask the creditor for the original contract or promissory note. If you are in default on the debt, this tool will assist you to demand that the collector send a series of documents called the "chain of title." If you are not sure whether or not you are in default, you can still use this dispute.

Before you begin you will need the name and address of the creditor or the collector that is billing you. After you complete the dispute, you will receive a copy of the dispute by email which you can print and mail the yourself. You will also be given a chance to ask us to mail it for you. We also encourage all debt disputers to use our online system to report the responses you get from the collector. The more information we have about how creditors and collectors are responding to individual disputes, the better we can organize collectively against them.`,
    });
