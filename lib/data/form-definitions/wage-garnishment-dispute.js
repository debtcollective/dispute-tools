/* eslint max-len: 0 */

const {
  wageGarnishmentForm,
  personalStatement,
  evidenceUploader,
  unauthorizedSignatureForm,
  atbForm,
  atbDisqualifyingForm,
} = require('./constants');

const privacyRelease = require('./shared-fields/privacyRelease');

const personalInformationOneC = Object.assign({}, wageGarnishmentForm);
const personalInformationOneD = Object.assign({}, wageGarnishmentForm);
const personalInformationOneE = Object.assign({}, wageGarnishmentForm);

personalInformationOneC.fieldSets = personalInformationOneC.fieldSets.concat(atbForm);

personalInformationOneD.fieldSets = personalInformationOneD.fieldSets.concat(atbDisqualifyingForm);

personalInformationOneE.fieldSets = personalInformationOneE.fieldSets.concat(
  unauthorizedSignatureForm,
);

[
  wageGarnishmentForm,
  personalInformationOneC,
  personalInformationOneD,
  personalInformationOneE,
].forEach(({ fieldSets }) => fieldSets.push(privacyRelease));

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
        'I do not owe the full amount I am being billed for because I repaid some or all of this debt.',
      description:
        'Why do you believe you already paid this debt? Attach a detailed statement and upload any documents that prove you paid.',
      steps: [wageGarnishmentForm, personalStatement, evidenceUploader],
    },
    B: {
      title: 'I should not have to pay this debt because I was lied to or defrauded by my school.',
      description: 'See the <a href="#" id="common-cases-toggler-B">common cases</a> of fraud.',
      more: `### Common causes of fraud include:

- Improper charges to your student account
- Aggressive recruiting practices by the school
- False graduation statistics given by the school
- False job placement and wage statistics given by the school
- Housing overcharges
- Poor quality/lack of supplies (computers, software, utensils, etc.) provided by the school
- Poor teaching practices by school faculty, such as "Watch this YouTube video to learn."
- Anything else that you can think of that would help strengthen your claim`,
      steps: [
        wageGarnishmentForm,
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
      title: 'I did not have a high school diploma or GED when I enrolled at the school.',
      description: 'Attach any supporting documents.',
      steps: [
        personalInformationOneC,
        {
          type: 'information',
          name: 'atb-form',
          title: 'Ability to benefit / False Certification Form',
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
        'When I borrowed to attend I had a condition (physical, mental, age, criminal record) that prevented me from meeting State requirements. ',
      description:
        'Write a statement explaining more about the <a href="http://www.studentloanborrowerassistance.org/loan-cancellation/school-related/false-certification/disqualifying-status/" target="_blank" rel="noopener noreferrer">condition</a> that prevented you from using your degree. And attach any supporting documents.',
      steps: [
        personalInformationOneD,
        {
          type: 'information',
          name: 'atb-disqualifying-form',
          title: 'Ability to Benefit - Disqualifying Status form',
          description:
            'With your previous information we will complete the Ability to Benefit - Disqualifying Status form for you, you will receive copies at the end.',
          footer:
            'This is an auto-generated form, you need to fill the {link to open the previous form} first.',
        },
        evidenceUploader,
      ],
    },
    E: {
      title:
        'I believe that an official at the school without my permission signed my name or used my personal identification data to obtain this loan illegally in my name. ',
      description:
        'Provide as much information as you can about why you believe the loan was issued fraudulently.',
      steps: [
        personalInformationOneE,
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
