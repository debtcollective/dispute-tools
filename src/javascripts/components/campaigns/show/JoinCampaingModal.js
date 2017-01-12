// import Widget from '../../../lib/widget';
import Checkit from 'checkit';
import NodeSupport from '../../../lib/widget/NodeSupport';
import Modal from '../../Modal';
import Button from '../../Button';
import { KEYCODES } from '../../../lib/constants';

export default class JoinCampaignModal extends NodeSupport {
  /**
   * Checkit form’s validations.
   */
  static get constraints() {
    return {
      debt_amount: ['required', 'numeric'],
    };
  }

  /**
   * Handles the JoinCampaignModal interactions. e.i: modal display, form validation and submit.
   * @param {Object} config - the class’ configuration object.
   * @param {HTMLElement} config.modal - the modal's DOM reference.
   * @param {HTMLElement} config.trigger - the modal's trigger DOM reference.
   */
  constructor(config) {
    super(config);

    Object.assign(this, config);

    this.ui = {};
    this._checkit = {};

    this.appendChild(new Modal({
      name: 'Modal',
      element: this.modal,
    }));

    this.appendChild(new Button({
      name: 'ButtonSubmit',
      element: this.modal.querySelector('button[type="submit"]'),
    })).disable();

    let query = '';
    Object.keys(this.constructor.constraints).forEach(key => {
      query = `[name="${key}"]`;
      this.ui[key] = this.modal.querySelector(query);
    });
    this._checkit = new Checkit(this.constructor.constraints);

    this._bindEvents();
  }

  _bindEvents() {
    this._handleTriggerClick = this._handleTriggerClick.bind(this);
    this.trigger.addEventListener('click', this._handleTriggerClick);

    this._handleModalActivate = this._handleModalActivate.bind(this);
    this.Modal.bind('activate', this._handleModalActivate);

    this._handleAmountInputKeyUp = this._handleAmountInputKeyUp.bind(this);
    this.ui.debt_amount.addEventListener('keyup', this._handleAmountInputKeyUp);

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this.modal.querySelector('form').addEventListener('submit', this._handleFormSubmit);
  }

  _handleTriggerClick() {
    this.Modal.activate();
  }

  _handleModalActivate() {
    this.ui.debt_amount.focus();
  }

  _handleAmountInputKeyUp(ev) {
    if (ev.which === KEYCODES.ENTER) return;

    const value = ev.currentTarget.value;

    if (value.length > 0) this.ButtonSubmit.enable();
    else this.ButtonSubmit.disable();
  }

  _handleFormSubmit(ev) {
    this.ButtonSubmit.disable();
    this._clearFieldErrors();

    const [err] = this._checkit.validateSync(this._getFieldsData());

    if (err) {
      ev.preventDefault();
      this.ButtonSubmit.enable();
      return this._displayFieldErrors(err.errors);
    }

    this.ButtonSubmit.updateText('Joining...');

    return undefined;
  }

  _displayFieldErrors(errors) {
    Object.keys(errors).forEach(key => {
      this.ui[key].parentNode.classList.add('error');
    });
  }

  _clearFieldErrors() {
    Object.keys(this.constructor.constraints).forEach(key => {
      this.ui[key].parentNode.classList.remove('error');
    });
  }

  _getFieldsData() {
    const data = {};
    Object.keys(this.constructor.constraints).forEach(key => {
      data[key] = this.ui[key].value;
    });
    return data;
  }
}
