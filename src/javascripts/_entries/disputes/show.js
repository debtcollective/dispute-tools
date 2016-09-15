import WebFont from 'webfontloader';
import NodeSupport from '../../lib/widget/NodeSupport';
import Header from '../../components/Header';
import Modal from '../../components/Modal';
import DisputeToolsPersonalInformationForm from '../../components/dispute-tools/personal-information-form';

class ViewDisputesShow extends NodeSupport {
  constructor(config) {
    super();

    this.appendChild(new Header({
      name: 'Header',
      currentUser: config.currentUser,
      currentURL: config.currentURL,
      element: document.querySelector('[data-component-header]'),
    }));

    this.appendChild(new Modal({
      name: 'ModalInformationForm',
      element: document.querySelector('[data-component-modal="personal-information-form"]'),
    })).appendChild(new DisputeToolsPersonalInformationForm({
      name: 'DisputeToolsPersonalInformationForm',
      dispute: config.dispute,
      element: document.querySelector('[data-component-dispute-tools-personal-information-form]'),
    }));

    this.personalInfoButton = document.querySelector('.js-trigger-personal-modal');
    this._handleButtonClickRef = this._handleButtonClick.bind(this);
    this.personalInfoButton.addEventListener('click', this._handleButtonClickRef);

    this.informationSection = document.querySelector('[data-dispute-information]');
    this.informationSubmitButton = document.getElementById('js-information-next-step');
    this._displayNextStepRef = this._displayNextStep.bind(this);
    this.informationSubmitButton.addEventListener('click', this._displayNextStepRef);
    // TODO:
    // - / pass dispute data on config
    // - current state controller
    //  - create and add gather information form
    //    - create and add form widget
    //      - display the modal
    //    - create and add upload widget
    //  - add process controller
    //  - add signature controller
    //  - add follow up controller

    WebFont.load({
      google: {
        families: ['Space Mono'],
      },
    });
  }

  _handleButtonClick() {
    this.ModalInformationForm.activate();
  }

  _displayNextStep() {
    const current = document.querySelector('.Tool__sidebar-steps > .-current');

    this.informationSection.classList.add('hide');
    this.informationSection.nextElementSibling.classList.remove('hide');

    current.classList.remove('-current');
    current.classList.add('-done');

    current.nextElementSibling.classList.add('-current');
  }
}

window.ViewDisputesShow = ViewDisputesShow;

