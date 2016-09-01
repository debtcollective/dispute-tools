import Checkit from 'checkit';
import Widget from '../../lib/widget';
import Button from '../../components/Button';

export default class SessionsPasswordRecoverForm extends Widget {
  static get constraints() {
    return {
      email: ['required', 'email'],
    };
  }

  constructor(config) {
    super(config);

    this.ui = {};
    Object.keys(SessionsPasswordRecoverForm.constraints).forEach(key => {
      const query = `[name="${key}"]`;
      this.ui[key] = this.element.querySelector(query);
    });
    this._checkit = new Checkit(SessionsPasswordRecoverForm.constraints);

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
      this.ui[key].parentNode.classList.add('error');
    });
  }

  _clearFieldErrors() {
    Object.keys(SessionsPasswordRecoverForm.constraints).forEach(key => {
      this.ui[key].parentNode.classList.remove('error');
    });
  }

  _getFieldsData() {
    const data = {};
    Object.keys(SessionsPasswordRecoverForm.constraints).forEach(key => {
      data[key] = this.ui[key].value;
    });
    return data;
  }
}
