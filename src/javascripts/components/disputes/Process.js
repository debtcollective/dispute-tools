/* global Checkit */
import Widget from '../../lib/widget';
import Button from '../Button';

const IN_PERSON_HEARING_ID = '2';

export default class DisputesProcess extends Widget {
  static get constraints() {
    return {
      process: ['required'],
    };
  }

  constructor(config) {
    super(config);

    this.ui = {};
    this.ui.radioOptions = [].slice.call(this.element.querySelectorAll('[type="radio"]'));
    this.ui.processCity = this.element.querySelector('[name="processCity"]');

    this.constraints = DisputesProcess.constraints;
    this._checkit = new Checkit(this.constraints);

    this.appendChild(new Button({
      name: 'Button',
      element: this.element.querySelector('[type="submit"]'),
    }));

    this._bindEvents();

    const selected = this._getSelectedProcessOption();
    if (selected && (selected.value === IN_PERSON_HEARING_ID)) {
      selected.checked = false;
      selected.click();
    }
  }

  _bindEvents() {
    this._handleProcessChangeRef = this._handleProcessChange.bind(this);
    this.ui.radioOptions.forEach(option => {
      option.addEventListener('change', this._handleProcessChangeRef);
    });

    this._handleFormSubmitRef = this._handleFormSubmit.bind(this);
    this.element.querySelector('form').addEventListener('submit', this._handleFormSubmitRef);
  }

  _handleProcessChange(ev) {
    this.Button.enable();

    if (!this.ui.processCity) {
      return;
    }

    this._clearFieldErrors();

    if (ev.currentTarget.value === IN_PERSON_HEARING_ID) {
      this.constraints.processCity = ['required'];
    } else {
      this.ui.processCity.selectedIndex = 0;
      delete this.constraints.processCity;
    }

    this._checkit = new Checkit(this.constraints);
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

    this.Button.updateText('Saving...');

    return undefined;
  }

  _displayFieldErrors(errors = {}) {
    Object.keys(errors).forEach(key => {
      const x = this.ui[key];
      if (x) x.parentNode.classList.add('error');
    });
  }

  _clearFieldErrors() {
    Object.keys(this.constraints).forEach(key => {
      const x = this.ui[key];
      if (x) x.parentNode.classList.remove('error');
    });
  }

  _getSelectedProcessOption() {
    return this.ui.radioOptions.filter(option => {
      return option.checked;
    })[0];
  }

  _getSelectedProcessValue() {
    const selected = this._getSelectedProcessOption();
    return selected ? selected.value : null;
  }

  _getFieldsData() {
    return {
      process: this._getSelectedProcessValue(),
      processCity: this.ui.processCity && this.ui.processCity.value,
    };
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
