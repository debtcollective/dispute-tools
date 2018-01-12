/* eslint max-len: 0 */

const path = require('path');

const {
  personalInformationForTax,
  personalStatement,
  evidenceUploader,
  unauthorizedSignatureForm,
  atbForm,
  atbDisqualifyingForm,
} = require(path.join(__dirname, 'constants.js'));

const personalInformationA = Object.assign({}, personalInformationForTax);

const personalInformationC = Object.assign({}, personalInformationA);
personalInformationC.fieldSets = personalInformationC.fieldSets.concat(atbForm);

const personalInformationD = Object.assign({}, personalInformationA);
personalInformationD.fieldSets = personalInformationD.fieldSets.concat(
  atbDisqualifyingForm,
);

const personalInformationE = Object.assign({}, personalInformationA);
personalInformationE.fieldSets = personalInformationE.fieldSets.concat(
  unauthorizedSignatureForm,
);

module.exports = {
  nowWhat: `
    We do not have much more information about how long the dispute process takes because online dispute tools have not been used before. By making the dispute form easier to fill out, we are helping more people dispute their debts. This is a good thing! But it could affect the time that it takes for the Department to review each case. If you don't hear a response in a timely manner, this may be cause for legal action. We are watching what happens to these disputes very closely. And will we will prompt you to let us know what happens in your case so we can work together to develop collective strategies to fight back.
    <br><br>
    We will mail your dispute to the appropriate agency as soon as possible.
  `,
  signature:
    'I state under penalty of law that the statements made on this request are true and accurate to the best of my knowledge.',
  options: {
    A: {
      title:
        'I do not owe the full amount shown because I repaid some or all of this debt.',
      description:
        'Please attach any supporting documents proving that you paid, including checks or receipts.',
      steps: [personalInformationA, evidenceUploader],
    },

    B: {
      title:
        'I believe that this loan is not collectable because I was lied to or defrauded by my school.',
      description:
        'Attach a statement describing how you were lied to or defrauded and any documents that support your case, including news articles or a copy of your Defense to Repayment form',
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
          description:
            'Attach your <a href="/dispute-tools/defense-to-repayment" target="_blank" rel="noopener noreferrer">DTR</a> If you have previously filed.',
          uploadButtonText: 'Upload file',
          footerNotes: 'PDF format',
        },
        evidenceUploader,
      ],
    },
    C: {
      title:
        'I did not have a high school diploma or GED when I enrolled at the school.',
      description: 'Attach any supporting documents.',
      steps: [
        personalInformationC,
        {
          type: 'information',
          name: 'atb-form',
          title: 'Ability to benefit - False Certification Form',
          description:
            'With your previous information we already complete the ATB form for you. You will receive copies at the end.',
          footer:
            'This is an auto-generated form, you need to fill the {link to open the previous form} first.',
        },
        personalStatement,
        evidenceUploader,
      ],
    },
    D: {
      title:
        'When I borrowed to attend my college I had a condition (physical, mental, age, criminal record) that prevented me from using my degree.',
      description:
        'Write a statement explaining more about the <a href="http://www.studentloanborrowerassistance.org/loan-cancellation/school-related/false-certification/disqualifying-status/" target="_blank"  rel="noopener noreferrer">condition</a> that prevented you from using your degree. And attach any supporting documents.',
      steps: [
        personalInformationD,
        {
          type: 'information',
          name: 'atb-disqualifying-form',
          title: 'Ability to Benefit - Disqualifying Status form',
          description:
            'With your previous information we will complete the Ability to Benefit - Disqualifying Status form for you, you will receive copies at the end.',
          footer:
            'This is an auto-generated form, you need to fill the {link to open the previous form} first.',
        },
        personalStatement,
        evidenceUploader,
      ],
    },
    E: {
      title:
        'I believe that an official at the school without my permission signed my name or used my personal identification data to obtain this loan illegally in my name.',
      description:
        'Provide as much information as you can about why you believe the loan was issued fraudulently.',
      steps: [
        personalInformationE,
        {
          type: 'information',
          name: 'atb-disqualifying-form',
          title: 'UNAUTHORIZED SIGNATURE FORM',
          description:
            'With your previous information we will complete the Unauthorized Signature form for you, you will receive copies at the end.',
          footer:
            'This is an auto-generated form, you need to fill the {link to open the previous form} first.',
        },
        personalStatement,
        evidenceUploader,
      ],
    },
  },
};
