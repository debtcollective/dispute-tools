/* eslint-disable max-len, no-unused-vars */
// TODO: remove unused-vars, find out where they're really used

const personalInformationFieldSets = [
  {
    title: 'Personal Information',
    subtitle: 'Let’s get started',
    fields: [
      [
        {
          name: 'name',
          label: 'Your Name',
          columnClassName: 'md-col-8',
          validations: ['required', 'maxLength:128'],
        },
        {
          name: 'ssn',
          label: 'Social Security Number',
          placeholder: 'AAA-GG-SSSS',
          columnClassName: 'md-col-4',
          validations: ['required', 'alphaDash', 'minLength:9', 'maxLength:11'],
        },
      ],
      [
        {
          name: 'address1',
          label: 'Your Mailing Address',
          validations: ['required', 'maxLength:128'],
        },
      ],
      [
        {
          name: 'address2',
          label: 'City, State, Zip Code',
          validations: ['required', 'maxLength:128'],
        },
      ],
      [
        {
          name: 'email',
          label: 'Your email',
          placeholder: 'you@example.com',
          columnClassName: 'md-col-6',
          validations: ['required', 'email', 'maxLength:128'],
        },
        {
          name: 'phone',
          label: 'Your telephone',
          placeholder: '(555) 555-5555',
          columnClassName: 'md-col-6',
          validations: ['required', 'maxLength:20'],
        },
      ],
    ],
  },
  {
    title: 'Your School',
    fields: [
      [
        {
          name: 'schoolName',
          label: 'Name of the school where you incurred the debt',
          columnClassName: 'md-col-8',
          validations: ['required', 'maxLength:128'],
        },
      ],
    ],
  },
  {
    title: 'FFEL Loan',
    yesno: true,
    yesNoLabel: 'Are you a FFEL holder?',
    yesNoCaption:
      'If you have FFEL loans, you will need to provide the name and address of the originator of your loan. If you don’t know the name of the guarantor, you can call the Department of the Treasury and ask them for the name and address of your guarantor. Their number is: <span class="-white">1-800-304-3107</span>.',
    fields: [
      [
        {
          name: 'guarantyAgency',
          label: 'Name of Guaranty Agency',
          columnClassName: 'md-col-6',
          validations: ['required', 'maxLength:128'],
        },
        {
          name: 'guarantyAgencyMailingAddress',
          label: 'Guaranty Agency mailing address',
          columnClassName: 'md-col-6',
          validations: ['required', 'maxLength:128'],
        },
      ],
    ],
  },
  {
    title: 'Employment',
    yesno: true,
    yesNoLabel: 'Are You Currently employed?',
    fields: [
      [
        {
          name: 'employer',
          label: 'Current Employer',
          columnClassName: 'md-col-8',
          validations: ['required', 'maxLength:128'],
        },
        {
          name: 'employmentDate',
          type: 'date',
          label: 'Beggining Date',
          placeholder: 'mm-dd-yyyy',
          columnClassName: 'md-col-4',
          validations: ['required', 'maxLength:20'],
        },
      ],
      [
        {
          name: 'employerAddress1',
          label: 'Employer Mailing Address 1',
          columnClassName: 'md-col-8',
          validations: ['required', 'maxLength:128'],
        },
        {
          name: 'employerAddress2',
          label: 'Employer City, State, Zip Code',
          columnClassName: 'md-col-8',
          validations: ['required', 'maxLength:128'],
        },
        {
          name: 'employerPhone',
          label: 'Employer Phone',
          placeholder: '(555) 555-5555',
          columnClassName: 'md-col-4',
          validations: ['required', 'maxLength:20'],
        },
      ],
    ],
  },
];

const personalInformation = {
  type: 'form',
  name: 'personal-information-form',
  title: 'Personal Information',
  description: 'Here we need some personal, school and employment information.',
  fieldSets: personalInformationFieldSets,
};

const personalStatement = {
  type: 'upload',
  name: 'personal-statement-uploader',
  multiple: false,
  optional: false,
  mimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
  maxFileSize: 5242880,
  title: 'Personal Statement',
  description:
    'In addition to providing evidence against the school, you can write a personal statement describing how your school lied to and defrauded you and upload it here.',
  uploadButtonText: 'Upload file',
  footerNotes: 'JPEG, PNG, PDF format',
};

const evidenceUploader = {
  type: 'upload',
  name: 'evidence-uploader',
  multiple: true,
  optional: true,
  mimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
  maxFileSize: 5242880,
  title: 'Evidence',
  description: 'Complement your case by attaching any supporting documents.',
  uploadButtonText: 'Upload files',
  footerNotes: 'JPEG, PNG, PDF format',
};

exports.seed = knex =>
  knex('DisputeTools')
    .del()
    .then(() => {
      const tools = [
        {
          id: '11111111-1111-1111-1111-111111111111',
          name: 'Dispute Your Wages Being Taken',
          excerpt:
            'Use this tool if you have a federal student loan that is being garnished or if you have been threatened with garnishment.',
          about: `### Dispute Your Wages Being Taken

If your wages are being garnished or if you received a letter threatening wage garnishment, you have a lot in common with thousands of other people whose wages are seized every year. This is wrong, since no one should have to go into debt for education!

You can use this form to submit a dispute to the Department of Education (for Direct Loans) and to the guaranty agency (for FFEL loans). We streamlined this form for our members because the Department's form is unnecessarily complicated.

PLEASE NOTE: **Before you begin the wage garnishment dispute process, you should find out who owns your student loans.**

If you have Direct loans, we will send your dispute to the Department of Education. If you have FFEL loans, you will need to provide the name and address of the originator of your loan. If you don't know the name of the guarantor, you can call the Department of the Treasury and ask them for the name and address of your guarantor.<br/>
The number is: 1-800-304-3107.`,
          completed: 0,
        },
        {
          id: '11111111-1111-2222-1111-111111111111',
          name: 'Dispute Your Tax Return Being Taken',
          excerpt:
            'Use this tool if your tax return is being seized for an unpaid federal student loan.',
          about: `### Dispute Your Tax Return Being Taken

If your taxes are being seized ("offset") or if you have been threatened with offset, you have a lot in common with thousands of other people whose taxes are offset each year. This is wrong, since no one should have to go into debt for education!

You can use this form to submit a dispute to the Department of Education. The Department's form is unnecessarily complicated. We have streamlined the process for our members. You can make sure your offset is placed on hold if you file this dispute by 65 days after the date you received the offset notice. You can also stop an offset that has already begun if you receive a favorable decision from the Department.

**What if I suspect that my taxes will be offset but I haven't received a notice?**

The Department of Education usually sends offset notices once per year in the summer. If you want to know whether your taxes will be offset as a result of a federal student loan, you can call the Bureau of the Fiscal Service at 1-800-304-3107. Making this call does not make it more likely that your taxes will be offset.`,
          completed: 0,
        },
        {
          id: '11111111-1111-3333-1111-111111111111',
          name: 'Dispute Any Debt in Collections',
          excerpt:
            'Use this tool to dispute any debt (except a student loan) that has been sent to collections. Make them prove it!',
          about:
            `### General Debt Dispute Letter

#### For any personal debt except student loans

This tool generates a dispute letter demanding that the creditor or collector send documentation to you proving that they own the debt and have the right to collect it. There is no risk to you in filing this dispute. Creditors and collectors are required by law to provide you with this information.

If you are not in default on the debt you wish to dispute, this tool will assist you to ask the creditor for the original contract or promissory note. If you are in default on the debt, this tool will assist you to demand that the collector send a series of documents called the "chain of title." If you are not sure whether or not you are in default, you can still use this dispute.

Before you begin you will need the name and address of the creditor or the collector that is billing you. After you complete the dispute, you will receive a copy of the dispute by email which you can print and mail the yourself. You will also be given a chance to ask us to mail it for you. We also encourage all debt disputers to use our online system to report the responses you get from the collector. The more information we have about how creditors and collectors are responding to individual disputes, the better we can organize collectively against them.`,
          completed: 0,
        },

        {
          id: '11111111-1111-4444-1111-111111111111',
          name: 'Dispute Errors on Your Credit Report',
          excerpt:
            'Most of us have been victims of bad credit reporting. Use this tool to send a dispute.',
          about: `### Dispute Errors on Your Credit Report

Millions of us have errors on our credit reports, which makes it harder to do basic things like get a job or rent an apartment. Fight back! You can get a free copy of your credit report once per year at <a href="http://annualcreditreport.com" target="_blank" rel="noopener noreferrer">annualcreditreport.com</a> or call 1-877- 322-8228. For a list of common errors to look for, go <a href="http://www.consumerfinance.gov/askcfpb/1339/if-credit-reporting-error-corrected-how-long-will-it-take-i-find-out-results.html" target="_blank" rel="noopener noreferrer">here</a>. Once you have determined that there are errors on your report, you can use this tool to ask for a correction. This tool will help you write a dispute letter to the three main credit reporting agencies. The Debt Collective will submit the letters your behalf. For more information about the process, go <a href="http://www.consumerfinance.gov/askcfpb/1261/what-are-errors-show-credit-reports-out-having-creditors-report-your-accounts-credit-bureaus.html" target="_blank" rel="noopener noreferrer">here</a>. Please have a photo of your picture ID ready to upload (taking a picture with your camera phone is fine).
`,
          completed: 0,
        },

        //         {
        //           id: '11111111-1111-5555-1111-111111111111',
        //           name: 'Defense to Repayment for Federal Student Loans',
        //           excerpt: 'Most of us have been victims of bad credit reporting. Use this tool to send a dispute.',
        //           about: `### Defense to Repayment for Federal Student Loans
        //
        // If your taxes are being seized ("offset") or if you have been threatened with offset, you have a lot in common with thousands of other people whose taxes are offset each year. This is wrong, since no one should have to go into debt for education!
        //
        // You can use this form to submit a dispute to the Department of Education. The Department's form is unnecessarily complicated. We have streamlined the process for our members. You can make sure your offset is placed on hold if you file this dispute by 65 days after the date you received the offset notice. You can also stop an offset that has already begun if you receive a favorable decision from the Department.
        //
        // What if I suspect that my taxes will be offset but I haven't received a notice?
        //
        // The Department of Education usually sends offset notices once per year in the summer. If you want to know whether your taxes will be offset as a result of a federal student loan, you can call the Bureau of the Fiscal Service at 1-800-304-3107. Making this call does not make it more likely that your taxes will be offset.
        // `,
        //           completed: 0,
        //         },

        {
          id: '11111111-1111-6666-1111-111111111111',
          name: 'Dispute an Unpaid Private Student Loan',
          excerpt:
            'Use this tool to send a dispute to a private student loan in collections.',
          about: `### Dispute an Unpaid Private Student Loan

#### For any defaulted private student loan debt that has been sent to collections.

Private student loans are those issued by a company not working on behalf of the government. These companies often contract with a servicer to collect the debt. Some of them break the law when trying to collect. What is more, because of sloppy paperwork, the new owners of the debt often can’t prove they own it. Demanding proof of ownership, or “chain of title,” is the first step to getting debt collectors off our backs.

If you are in default on a student loan, this tool will assist you to generate a letter that will be automatically sent to the debt collector asking them to prove that they have the right to collect on the debt they have been bugging you about. You have a right to this evidence. If the debt collector cannot prove that you owe them money, they will be less likely to sue you or continue to collect).

This tool should **not** be used in response to a Complaint/Summons letter letting you know that the collector is actively seeking a judgment against you in court. If you are being sued, you should seek legal advice.

Before you begin to use this tool, you should make sure you have the name and address of the collections agency that is attempting to collect from you.

If you don't have the name and address of the collection agency, you will not be able to file this dispute.

`,
          completed: 0,
        },
      ];

      return knex('DisputeTools').insert(
        tools.map(tool => ({
          id: tool.id,
          name: tool.name,
          about: tool.about,
          completed: tool.completed,
          created_at: new Date(),
          updated_at: new Date(),
        }))
      );
    });
