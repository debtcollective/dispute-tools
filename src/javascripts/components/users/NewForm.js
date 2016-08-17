import Checkit from 'checkit';
import Widget from '../../lib/widget';

export default class UserNewForm extends Widget {
  static get constraints() {
    return {
      name: ['required'],
      state: ['required'],
      zip: ['required'],
      email: ['required', 'email'],
      password: ['required', 'minLength:8'],
    };
  }

  constructor(config) {
    super(config);

    Object.keys(UserNewForm.constraints).forEach(key => {
      const query = `[name="${key}"]`;
      this[key] = this.element.querySelector(query);
    });
    this._checkit = new Checkit(UserNewForm.constraints);

    this._bindEvents();
  }

  _bindEvents() {
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this.element.querySelector('form').addEventListener('submit', this._handleFormSubmit);
  }

  _handleFormSubmit(ev) {
    this._clearFieldErrors();

    const [err] = this._checkit.validateSync(this._getFieldsData());

    if (err) {
      ev.preventDefault();
      return this._displayFieldErrors(err.errors);
    }

    return undefined;
  }

  _displayFieldErrors(errors) {
    Object.keys(errors).forEach(key => {
      this[key].parentNode.classList.add('error');
    });
  }

  _clearFieldErrors() {
    Object.keys(UserNewForm.constraints).forEach(key => {
      this[key].parentNode.classList.remove('error');
    });
  }

  _getFieldsData() {
    const data = {};
    Object.keys(UserNewForm.constraints).forEach(key => {
      data[key] = this[key].value;
    });
    return data;
  }
}
