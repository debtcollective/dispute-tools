import Checkit from 'checkit';
import Widget from '../../lib/widget';
import Button from '../../components/Button';

export default class UsersNewForm extends Widget {
  static get constraints() {
    return {
      fullname: ['required'],
      collectiveId: ['required'],
      state: ['required'],
      zip: ['required', {
        rule(val) {
          if (/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(val) === false) {
            throw new Error('Invalid zip code.');
          }
        },
      }],
      email: ['required', 'email'],
      password: ['required', 'minLength:8'],
    };
  }

  constructor(config) {
    super(config);

    this.ui = {};
    Object.keys(UsersNewForm.constraints).forEach(key => {
      const query = `[name="${key}"]`;
      this.ui[key] = this.element.querySelector(query);
    });
    this._checkit = new Checkit(UsersNewForm.constraints);

    this.appendChild(new Button({
      name: 'Button',
      element: this.element.querySelector('button'),
    }));

    this._bindEvents();
  }

  _bindEvents() {
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this.element.querySelector('form').addEventListener('submit', this._handleFormSubmit);
  }

  _handleFormSubmit(ev) {
    this.Button.disable();
    this._clearFieldErrors();

    const [err] = this._checkit.validateSync(this._getFieldsData());

    if (err) {
      ev.preventDefault();
      this.Button.enable();
      return this._displayFieldErrors(err.errors);
    }

    this.Button.updateText();

    return undefined;
  }

  _displayFieldErrors(errors) {
    Object.keys(errors).forEach(key => {
      const parent = this.ui[key].parentNode;
      let errorLabel = parent.querySelector('.-on-error');

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
    Object.keys(UsersNewForm.constraints).forEach(key => {
      this.ui[key].parentNode.classList.remove('error');
    });
  }

  _getFieldsData() {
    const data = {};
    Object.keys(UsersNewForm.constraints).forEach(key => {
      data[key] = this.ui[key].value;
    });
    return data;
  }
}
