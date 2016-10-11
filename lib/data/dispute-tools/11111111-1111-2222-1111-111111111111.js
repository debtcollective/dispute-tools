/* eslint max-len: 0 */

const path = require('path');

const {
  personalInformationForTax,
  personalStatement,
  evidenceUploader,
  unauthorizedSignatureForm,
  atbForm,
} = require(path.join(__dirname, 'constants.js'));

const personalInformationA = Object.assign({}, personalInformationForTax);
personalInformationA.fieldSets = personalInformationA.fieldSets.concat(
  {
    title: 'Tax Offset Dispute',
    subtitle: 'This is the part of the dispute where you will explain why you are disputing your federal student debt. Choose the option that best applies to you. There is no benefit to choosing one option over the others. It\'s up to you! Unfortunately, the Department of Education makes the ultimate decision on what kind of review you will receive, so you should provide as much evidence as you can on this form in case your request for a telephone or in-person hearing is denied.',
    fields: [
      [
        {
          type: 'group',
          fields: [
            [
              {
                name: 'tod-section2-option1',
                label: 'I do not owe the full amount shown because I repaid some or all of this debt. Please attach, later when you finish this form, any supporting documents proving that you paid, including checks or receipts.',
                type: 'checkbox',
              },
            ],
            [
              {
                name: 'tod-section2-option2',
                label: 'I believe that this loan is not collectable because I was lied to or defrauded by my school. Attach a statement, later when you finish this form, describing how you were lied to or defrauded and any documents that support your case, including news articles or a copy of your Defense to Repayment form.',
                type: 'checkbox',
              },
            ],
            [
              {
                name: 'tod-section2-option3',
                label: 'My school closed before I graduated.',
                type: 'checkbox',
              },
            ],
            [
              {
                name: 'tod-section2-option4',
                label: 'I did not have a high school diploma or GED when I enrolled at the school.',
                type: 'checkbox',
              },
            ],
            [
              {
                name: 'tod-section2-option5',
                label: 'When I borrowed this guaranteed student loan to attend the school, I had a condition (physical, mental, age, criminal record) that prevented me from meeting State requirements for performing the occupation for which it trained me. For examples, go <a href="http://www.studentloanborrowerassistance.org/loan-cancellation/school-related/false-certification/disqualifying-status/" rel="noopener noreferrer" target="_blank">here.</a> <br />Attach, later when you finish this form, a statement describing in detail the condition that prevented you from using your degree and any supporting documents.',
                type: 'checkbox',
              },
            ],
            [
              {
                name: 'tod-section2-option6',
                label: ' I believe that someone signed my name or used my personal identification data to illegally obtain this loan in my name.',
                type: 'checkbox',
              },
            ],

          ],
        },
      ],
    ],
  }
);

const personalInformationC = Object.assign({}, personalInformationA);
personalInformationC.fieldSets = personalInformationC.fieldSets.concat(
  atbForm
);

const personalInformationD = Object.assign({}, personalInformationA);
personalInformationD.fieldSets = personalInformationD.fieldSets.concat(
  unauthorizedSignatureForm
);

module.exports = {
  nowWhat: `
    We do not have much more information about how long the dispute process takes because online dispute tools have not been used before. By making the dispute form easier to fill out, we are helping more people dispute their debts. This is a good thing! But it could affect the time that it takes for the Department to review each case. If you don't hear a response in a timely manner, this may be cause for legal action. We are watching what happens to these disputes very closely. And will we will prompt you to let us know what happens in your case so we can work together to develop collective strategies to fight back.
    <br><br>
    We will mail your dispute to the appropriate agency as soon as possible.
  `,
  signature: 'I state under penalty of law that the statements made on this request are true and accurate to the best of my knowledge.',
  options: {
    A: {
      title: 'I do not owe the full amount shown because I repaid some or all of this debt.',
      description: 'Please attach any supporting documents proving that you paid, including checks or receipts.',
      steps: [
        personalInformationA,
        evidenceUploader,
      ],
    },

    B: {
      title: 'I believe that this loan is not collectable because I was lied to or defrauded by my school.',
      description: 'Attach a statement describing how you were lied to or defrauded and any documents that support your case, including news articles or a copy of your Defense to Repayment form',
      steps: [
        personalInformationA,
        personalStatement,
        {
          type: 'upload',
          name: 'dtr-uploader',
          multiple: false,
          optional: true,
          mimeTypes: ['application/pdf'],
          maxFileSize: 5242880,
          title: 'Defense to Repayment',
          description: 'Attach your DTR If you have previously filed.',
          uploadButtonText: 'Upload file',
          footerNotes: 'PDF format',
        },
        evidenceUploader,
      ],
    },
    C: {
      title: 'I did not have a high school diploma or GED when I enrolled at the school.',
      description: 'Attach any supporting documents.',
      steps: [
        personalInformationC,
        {
          type: 'information',
          name: 'atb-form',
          title: 'Ability to benefit / ATB Form',
          description: 'With your previous information we already complete The ATB form for you, you will receive copies at the end.',
          footer: 'This is an auto-generated form, you need to fill the {link to open the previous form} first.',
        },
        personalStatement,
        evidenceUploader,
      ],
    },
    D: {
      title: 'When I borrowed to attend my college I had a condition (physical, mental, age, criminal record) that prevented me from using my degree.',
      description: 'Write a statement explaining more about the <a href="http://www.studentloanborrowerassistance.org/loan-cancellation/school-related/false-certification/disqualifying-status/" target="_blank"  rel="noopener noreferrer">condition</a> that prevented you from using your degree. And attach any supporting documents.',
      steps: [
        personalInformationD,
        {
          type: 'information',
          name: 'signature-form',
          title: 'Unauthorized Signature form',
          description: 'With your previous information we will complete the Unauthorized Signature form for you, you will receive copies at the end.',
          footer: 'This is an auto-generated form, you need to fill the {link to open the previous form} first.',
        },
        personalStatement,
        evidenceUploader,
      ],
    },
    E: {
      title: 'I believe that an official at the school without my permission signed my name or used my personal identification data to obtain this loan illegally in my name.',
      description: 'Provide as much information as you can about why you believe the loan was issued fraudulently.',
      steps: [
        personalInformationA,
        personalStatement,
        evidenceUploader,
      ],
    },
  },
};
