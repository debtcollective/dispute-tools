import Checkit from 'checkit';
import Widget from '../../../lib/widget';
import Button from '../../../components/Button';

export default class AdminDisputesAddStatusForm extends Widget {
  static get constraints() {
    return {
      status: ['required'],
      comment: ['required'],
    };
  }

  static get updateUrlString() {
    return '/admin/disputes/${id}';
  }

  constructor(config) {
    super(config);

    this.ui = {};

    let query = '';
    Object.keys(AdminDisputesAddStatusForm.constraints).forEach(key => {
      query = `[name="${key}"]`;
      this.ui[key] = this.element.querySelector(query);
    });
    this._checkit = new Checkit(AdminDisputesAddStatusForm.constraints);

    this.appendChild(new Button({
      name: 'ButtonSubmit',
      element: this.element.querySelector('button[type="submit"]'),
    }));

    this.formElement = this.element.getElementsByTagName('form')[0];
    this.a = this.element.querySelector('.a');
    this.b = this.element.querySelector('.b');
    this.c = this.element.querySelector('.c');

    this._bindEvents();
  }

  _bindEvents() {
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this.element.querySelector('form').addEventListener('submit', this._handleFormSubmit);
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

    this.ButtonSubmit.updateText();

    return undefined;
  }

  _displayFieldErrors(errors) {
    let parent;
    let errorLabel;

    Object.keys(errors).forEach(key => {
      parent = this.ui[key].parentNode;
      errorLabel = parent.querySelector('.-on-error');

      parent.classList.add('error');

      if (errorLabel) {
        errorLabel.innerText = `▲ ${errors[key].message}`;
        return;
      }

      errorLabel = parent.nextSibling;
      if (errorLabel && errorLabel.classList.contains('-on-error')) {
        errorLabel.innerText = `▲ ${errors[key].message}`;
      }
    });
  }

  _clearFieldErrors() {
    let parent;
    Object.keys(AdminDisputesAddStatusForm.constraints).forEach(key => {
      parent = this.ui[key].parentNode;
      parent.classList.remove('error');
    });
  }

  _getFieldsData() {
    const data = {};
    Object.keys(AdminDisputesAddStatusForm.constraints).forEach(key => {
      data[key] = this.ui[key].value;
    });
    return data;
  }

  /**
   * Resets the form fields and replace the dynamic form data using `disputeData`.
   * @param {Object} dispute - the dispute data to render
   */
  updateData(dispute) {
    this.ui.status.selectedIndex = 0;
    this.ui.comment.value = '';
    this._clearFieldErrors();

    let disputeToolName = dispute.disputeTool.name;

    if (dispute.data.option !== 'none') {
      disputeToolName += ` / ${dispute.data.option}`;
    }

    this.formElement.action = this.constructor.updateUrlString.replace('${id}', dispute.id);
    this.a.textContent = dispute.user.account.fullname;
    this.b.textContent = disputeToolName;
    this.c.src = dispute.user.account.imageURL;
  }
}

