import _ from 'lodash';
import { updateDisputeData } from '../../lib/api';
import Widget from '../../lib/widget';
import DisputesInformationForm from './InformationForm';
import Modal from '../../components/Modal';

export default class DisputesInformation extends Widget {
  constructor(config) {
    super(config);

    this.appendChild(
      new Modal({
        name: 'ModalInformationForm',
        element: document.querySelector('[data-component-modal="personal-information-form"]'),
      }),
    );

    this.appendChild(
      new DisputesInformationForm({
        name: 'DisputesInformationForm',
        dispute: config.dispute,
        element: document.querySelector('[data-component-form="dispute-personal-information"]'),
      }),
    );

    this.appendChild(
      new Modal({
        name: 'UploadSpinnerModal',
        element: document.querySelector('[data-component-modal="block-while-uploading-modal"]'),
      }),
    );

    this.appendChild(
      new Modal({
        name: 'RemoveUploadModal',
        element: document.querySelector(
          '[data-component-modal="block-while-removing-upload-modal"]',
        ),
      }),
    );

    this.saveForLater = this.ModalInformationForm.element.querySelector('.save-for-later');

    this.personalInfoButton = this.element.querySelector('.js-trigger-personal-modal');
    this.informationSubmitButton = document.getElementById('js-information-next-step');

    this.uploadButtons = document.querySelectorAll('[data-upload-button]');
    this.removeUploadButtons = document.querySelectorAll('[data-remove-upload-button]');

    this.deactivateDisputeForm = this.element.querySelector(
      '[data-component-form="deactivate-dispute"]',
    );

    this._bindMoreInfoModal();
    this._bindEvents();
  }

  _fileInputOnChange(button) {
    const files = button.files;

    if (!files.length) {
      return;
    }

    // validate size
    const MAX_FILE_SIZE = 6000000;
    const allFilesUnderMaxSize = _.every(files, file => file.size < MAX_FILE_SIZE);

    // show error message
    if (!allFilesUnderMaxSize) {
      const form = button.form;
      const footerNotes = form.parentElement.querySelector('[data-footer-notes]');
      footerNotes.innerText = 'Max file size is 6MB';
      footerNotes.classList.add('error');

      return;
    }

    this.UploadSpinnerModal.activate();
    button.form.submit();
  }

  _bindEvents() {
    this._handleSaveForLater = this._handleSaveForLater.bind(this);
    this.saveForLater.addEventListener('click', this._handleSaveForLater);

    this._handleButtonClick = this._handleButtonClick.bind(this);
    this.personalInfoButton.addEventListener('click', this._handleButtonClick);

    this._handleDeactivateDispute = this._handleDeactivateDispute.bind(this);
    this.deactivateDisputeForm.addEventListener('submit', this._handleDeactivateDispute);

    if (this.informationSubmitButton) {
      this._displayNextStepRef = this._displayNextStep.bind(this);
      this.informationSubmitButton.addEventListener('click', this._displayNextStepRef);
    }

    for (const button of this.uploadButtons) {
      button.onchange = this._fileInputOnChange.bind(this, button);
    }

    for (const button of this.removeUploadButtons) {
      button.onclick = () => {
        this.RemoveUploadModal.activate();
        button.form.submit();
      };
    }
  }

  _handleSaveForLater() {
    const data = new FormData(this.DisputesInformationForm.form);
    data.set('_isDirty', true);

    updateDisputeData({
      disputeId: this.dispute.id,
      body: data,
    }).then(() => window.location.replace('/disputes/my'));
  }

  _handleDeactivateDispute(event) {
    const { data } = this.dispute;
    const disputeHasData = _.has(data, 'forms') || _.has(data, '_forms');

    if (!disputeHasData) {
      return this.deactivateDisputeForm.submit();
    }

    if (!confirm('Are you sure you want to delete this dispute?')) {
      event.preventDefault();
    }
  }

  _bindMoreInfoModal() {
    this.moreModalTrigger = this.element.querySelector('[id*=common-cases-toggler]');
    this.moreModalElement = document.querySelector('[data-component-modal="dispute-more-modal"]');

    if (!this.moreModalTrigger || !this.moreModalElement) {
      return;
    }

    this.appendChild(
      new Modal({
        name: 'ModalMore',
        element: this.moreModalElement,
      }),
    );

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
