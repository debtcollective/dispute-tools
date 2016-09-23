import NodeSupport from '../../lib/widget/NodeSupport';
import DisputesInformation from './Information';
import DisputesProcess from './Process';
import DisputesSignature from './Signature';
import DisputesFollowUp from './FollowUp';

export default class DisputesController extends NodeSupport {
  constructor(config) {
    super();

    const InformationElement = document.querySelector('[data-dispute-information]');
    const ProcessElement = document.querySelector('[data-dispute-process]');
    const SignatureElement = document.querySelector('[data-dispute-signature]');
    const FollowUpElement = document.querySelector('[data-dispute-follow-up]');

    if (InformationElement) {
      this.appendChild(new DisputesInformation({
        name: 'DisputesInformation',
        element: InformationElement,
        dispute: config.dispute,
      }));
    }

    if (ProcessElement) {
      this.appendChild(new DisputesProcess({
        name: 'DisputesProcess',
        element: ProcessElement,
      }));
    }

    if (SignatureElement) {
      this.appendChild(new DisputesSignature({
        name: 'DisputesSignature',
        element: SignatureElement,
      }));
    }

    if (FollowUpElement) {
      this.appendChild(new DisputesFollowUp({
        name: 'DisputesFollowUp',
        element: FollowUpElement,
        dispute: config.dispute,
      }));
    }
  }
}
