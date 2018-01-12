/* global Checkit */
import Widget from '../../lib/widget';
import Button from '../../components/Button';

export default class SessionsChangePasswordForm extends Widget {
  static get constraints() {
    return {
      password: ['required', 'minLength:8'],
      confirmPassword: ['required', 'minLength:8', 'matchesField:password'],
    };
  }

  constructor(config) {
    super(config);

    this.ui = {};
    Object.keys(SessionsChangePasswordForm.constraints).forEach(key => {
      const query = `[name="${key}"]`;
      this.ui[key] = this.element.querySelector(query);
    });
    this._checkit = new Checkit(SessionsChangePasswordForm.constraints);

    this.appendChild(
      new Button({
        name: 'Button',
        element: this.element.querySelector('button'),
      }),
    );

    this._bindEvents();
  }

  _bindEvents() {
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this.element
      .querySelector('form')
      .addEventListener('submit', this._handleFormSubmit);
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
      this.ui[key].parentNode.classList.add('error');
    });
  }

  _clearFieldErrors() {
    Object.keys(SessionsChangePasswordForm.constraints).forEach(key => {
      this.ui[key].parentNode.classList.remove('error');
    });
  }

  _getFieldsData() {
    const data = {};
    Object.keys(SessionsChangePasswordForm.constraints).forEach(key => {
      data[key] = this.ui[key].value;
    });
    return data;
  }
}
