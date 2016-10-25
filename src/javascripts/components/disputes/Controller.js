import NodeSupport from '../../lib/widget/NodeSupport';
import DisputesInformation from './Information';
import DisputesProcess from './Process';
import DisputesSignature from './Signature';
import DisputesFollowUp from './FollowUp';

export default class DisputesController extends NodeSupport {
  constructor(config) {
    super();

    this._currentStep = config.currentStep;
    this.sidebarItems = [].slice.call(document.querySelectorAll('.Tool__sidebar-step'));
    this.contentItems = [];

    if (!config.dispute.data.signature) {
      this._registerSteps(config);
    } else {
      this._finalize(config);
    }
  }

  _registerSteps(config) {
    const InformationElement = document.querySelector('[data-dispute-information]');
    const ProcessElement = document.querySelector('[data-dispute-process]');
    const SignatureElement = document.querySelector('[data-dispute-signature]');

    if (InformationElement) {
      this.contentItems.push(this.appendChild(new DisputesInformation({
        name: 'DisputesInformation',
        element: InformationElement,
        dispute: config.dispute,
      })));

      this._showNextRef = this._showNext.bind(this);
      this.DisputesInformation.bind('showNext', this._showNextRef);
    }

    if (ProcessElement) {
      this.contentItems.push(this.appendChild(new DisputesProcess({
        name: 'DisputesProcess',
        element: ProcessElement,
      })));
    }

    if (SignatureElement) {
      this.contentItems.push(this.appendChild(new DisputesSignature({
        name: 'DisputesSignature',
        element: SignatureElement,
      })));
    }

    this._bindSidebarEvents();
  }

  _finalize(config) {
    const FollowUpElement = document.querySelector('[data-dispute-follow-up]');

    if (FollowUpElement) {
      this.contentItems.push(this.appendChild(new DisputesFollowUp({
        name: 'DisputesFollowUp',
        element: FollowUpElement,
        dispute: config.dispute,
      })));
    }
  }

  _bindSidebarEvents() {
    this._handleSidebarItemClickRef = this._handleSidebarItemClick.bind(this);
    this.sidebarItems.forEach(item => {
      if (item.disabled === false) {
        item.addEventListener('click', this._handleSidebarItemClickRef);
      }
    });
  }

  _handleSidebarItemClick(ev) {
    this._currentStep = ~~ev.currentTarget.dataset.index;
    this._showCurrentStep();
  }

  _showNext() {
    this._currentStep++;
    this._showCurrentStep();
  }

  _showCurrentStep() {
    this.sidebarItems.forEach((item, index) => {
      const _index = (index + 1);
      let _className = '';

      item.classList.remove('-done');
      item.classList.remove('-current');

      if (_index === 1) {
        _className = '-done';
      } else if (this._currentStep === _index) {
        _className = '-current';
      } else if (this._currentStep > _index) {
        _className = '-done';
      }

      if (_className) {
        item.classList.add(_className);
      }
    });

    this.contentItems.forEach((item, index) => {
      item.deactivate();

      if (index === (this._currentStep - 2)) {
        item.activate();
      }
    });
  }
}
