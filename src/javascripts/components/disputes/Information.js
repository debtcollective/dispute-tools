import Widget from '../../lib/widget';
import DisputesInformationForm from './InformationForm';
import Modal from '../../components/Modal';

export default class DisputesInformation extends Widget {
  constructor(config) {
    super(config);

    this.appendChild(new Modal({
      name: 'ModalInformationForm',
      element: document.querySelector('[data-component-modal="personal-information-form"]'),
    }));

    this.appendChild(new DisputesInformationForm({
      name: 'DisputesInformationForm',
      dispute: config.dispute,
      element: document.querySelector('[data-component-form="dispute-personal-information"]'),
    }));

    this.personalInfoButton = this.element.querySelector('.js-trigger-personal-modal');
    this.informationSubmitButton = document.getElementById('js-information-next-step');
    this.destroyDisputeForm = this.element.querySelector('[data-component-form="delete-dispute"]');

    this._bindMoreInfoModal();
    this._bindEvents();
  }

  _bindEvents() {
    this._handleButtonClickRef = this._handleButtonClick.bind(this);
    this.personalInfoButton.addEventListener('click', this._handleButtonClickRef);

    this._handleDeleteDisputeRef = this._handleDeleteDispute.bind(this);
    this.DisputesInformationForm.bind('deleteDispute', this._handleDeleteDisputeRef);

    if (this.informationSubmitButton) {
      this._displayNextStepRef = this._displayNextStep.bind(this);
      this.informationSubmitButton.addEventListener('click', this._displayNextStepRef);
    }
  }

  /**
   * Submits the `delete-dispute` form.
   * @private
   * @listens @module:DisputesInformationForm~event:deleteDispute
   * @return undefined
   */
  _handleDeleteDispute() {
    this.destroyDisputeForm.submit();
  }

  _bindMoreInfoModal() {
    this.moreModalTrigger = this.element.querySelector('.js-Dispute__more-modal-trigger');
    this.moreModalElement = document.querySelector('[data-component-modal="dispute-more-modal"]');

    if (!this.moreModalTrigger || !this.moreModalElement) {
      return;
    }

    this.appendChild(new Modal({
      name: 'ModalMore',
      element: this.moreModalElement,
    }));

    this._handleMoreModalTriggerClickRef = this._handleMoreModalTriggerClick.bind(this);
    this.moreModalTrigger.addEventListener('click', this._handleMoreModalTriggerClickRef);
  }

  _handleMoreModalTriggerClick(ev) {
    ev.preventDefault();
    this.ModalMore.activate();
  }

  _handleButtonClick() {
    this.ModalInformationForm.activate();
  }

  _displayNextStep() {
    this.dispatch('showNext');
  }

  activate() {
    this.active = true;
    this.element.setAttribute('aria-hidden', !this.active);
  }

  deactivate() {
    this.active = false;
    this.element.setAttribute('aria-hidden', !this.active);
  }
}
