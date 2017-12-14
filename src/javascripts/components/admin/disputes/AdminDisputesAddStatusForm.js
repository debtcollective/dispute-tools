/* global Checkit */
import Widget from '../../../lib/widget';
import Button from '../../../components/Button';
import DisputeStatusItem from '../../../components/disputes/StatusItem';

export default class AdminDisputesAddStatusForm extends Widget {
  static get fields() {
    return ['comment', 'notify', 'status'];
  }

  static get constraints() {
    return {
      status: ['required'],
    };
  }

  static get updateUrlString() {
    return '/admin/disputes/${id}';
  }

  constructor(config) {
    super(config);

    this.ui = {};

    let query = '';
    AdminDisputesAddStatusForm.fields.forEach(key => {
      query = `[name="${key}"]`;
      this.ui[key] = this.element.querySelector(query);
    });

    this.appendChild(new Button({
      name: 'ButtonSubmit',
      element: this.element.querySelector('button[type="submit"]'),
    }));

    this.formElement = this.element.getElementsByTagName('form')[0];
    this.statusElement = this.formElement.querySelector('[name="status"]');
    this.statusOptions = [].slice.call(this.statusElement.options);
    this.userNameElement = this.element.querySelector('[data-user-name]');
    this.disputeNameElement = this.element.querySelector('[data-dispute-name]');
    this.userAvatarElement = this.element.querySelector('[data-user-avatar]');
    this.statusesWrapper = this.element.querySelector('[data-statuses-wrapper]');

    this._bindEvents();
    this._initCheckit();
  }

  _initCheckit() {
    const checkit = new Checkit(AdminDisputesAddStatusForm.constraints);

    // Only require comment if notify is true
    checkit.maybe({ comment: ['required'] }, (input) => input.notify);

    this._checkit = checkit;
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
    AdminDisputesAddStatusForm.fields.forEach(key => {
      parent = this.ui[key].parentNode;
      parent.classList.remove('error');
    });
  }

  _getFieldsData() {
    const data = {};
    AdminDisputesAddStatusForm.fields.forEach(key => {
      data[key] = this.ui[key].value;
    });

    // For checkboxes we need to use the checked attribute
    data.notify = this.ui.notify.checked;

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

    const lastStatus = dispute.statuses[0].status;
    const selectedStatus = this.statusOptions.filter(option => (option.value === lastStatus));
    const fragmentStatus = document.createDocumentFragment();
    let disputeToolName = dispute.disputeTool.name;

    if (selectedStatus.length) {
      selectedStatus[0].selected = true;
    }

    if (dispute.data.option !== 'none') {
      disputeToolName += ` / ${dispute.data.option}`;
    }

    this.formElement.action = this.constructor.updateUrlString.replace('${id}', dispute.id);
    this.userNameElement.textContent = dispute.user.account.fullname;
    this.disputeNameElement.textContent = disputeToolName;
    this.userAvatarElement.src = dispute.user.account.imageURL;

    while (this.statusesWrapper.firstChild) {
      this.statusesWrapper.removeChild(this.statusesWrapper.firstChild);
    }

    dispute.statuses.forEach(status => {
      fragmentStatus.appendChild(
        new DisputeStatusItem({
          data: { dispute, status },
        }).element
      );
    });

    this.statusesWrapper.appendChild(fragmentStatus);
  }
}

