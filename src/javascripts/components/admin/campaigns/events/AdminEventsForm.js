import Checkit from 'checkit';
import qs from 'query-string';
import debounce from 'lodash/debounce';
import Widget from '../../../../lib/widget';
import Button from '../../../../components/Button';

export default class AdminEventsForm extends Widget {
  static get constraints() {
    return {
      name: ['required'],
      description: ['required'],
      date: ['required'],
      timespan: ['required'],
      locationName: ['required'],
    };
  }

  constructor(config) {
    super(config);

    this.ui = {};
    Object.keys(this.constructor.constraints).forEach(key => {
      const query = `[name="${key}"]`;
      this.ui[key] = this.element.querySelector(query);
    });
    this._checkit = new Checkit(this.constructor.constraints);

    this.iframeMap = document.getElementById('iframeMap');
    this.locationAnchor = document.createElement('a');
    this.locationAnchor.href = this.iframeMap.src;
    this.locationBaseURL = this.locationAnchor.origin + this.locationAnchor.pathname;
    this.locationQuery = qs.parse(this.locationAnchor.search);

    this.appendChild(new Button({
      name: 'Button',
      element: this.element.querySelector('button[type="submit"]'),
    }));

    this._bindEvents();
  }

  _bindEvents() {
    this._handleLocationNameInput = this._handleLocationNameInput.bind(this);
    this.ui.locationName.addEventListener('input', debounce(this._handleLocationNameInput, 500));

    this._handleFormSubmitRef = this._handleFormSubmit.bind(this);
    this.element.addEventListener('submit', this._handleFormSubmitRef);
  }

  _handleLocationNameInput(ev) {
    this.locationQuery.q = ev.target.value || 'new york';
    this.iframeMap.src = `${this.locationBaseURL}?${qs.stringify(this.locationQuery)}`;
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

    return null;
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
