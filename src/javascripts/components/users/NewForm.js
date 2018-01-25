/* global Checkit */
import Widget from '../../lib/widget';
import Button from '../../components/Button';

export default class UsersNewForm extends Widget {
  static get constraints() {
    return {
      fullname: ['required'],
      collectiveIds: ['required', 'array', 'minLength:1'],
      state: ['required'],
      zip: [
        'required',
        {
          rule(val) {
            if (/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(val) === false) {
              throw new Error('Invalid zip code.');
            }
          },
        },
      ],
      email: ['required', 'email'],
      password: ['required', 'minLength:8'],
    };
  }

  constructor(config) {
    super(config);

    this.ui = {};
    const _pluralRe = new RegExp(/s$/);
    let query = '';
    Object.keys(UsersNewForm.constraints).forEach(key => {
      query = `[name="${key}"]`;
      if (_pluralRe.test(key)) {
        this.ui[key] = [].slice.call(this.element.querySelectorAll(query));
      } else {
        this.ui[key] = this.element.querySelector(query);
      }
    });
    this._checkit = new Checkit(UsersNewForm.constraints);

    this.appendChild(
      new Button({
        name: 'ButtonSubmit',
        element: this.element.querySelector('button[type="submit"]'),
      }),
    );

    this.collectivesOptions = [].slice.call(
      this.element.querySelectorAll('[name="collectiveIds"]'),
    );
    this.collectivesWithDebt = this.collectivesOptions.filter(
      option => option.dataset.hasDebt === 'true',
    );
    this.collectivesWithoutDebt = this.collectivesOptions.filter(
      option => option.dataset.hasDebt === 'false',
    );
    this.step1Layer = this.element.querySelector('.js-step-1');
    this.step2Layer = this.element.querySelector('.js-step-2');
    this.nextBtn = this.element.querySelector('#sign-up-btn-next');
    this.prevBtn = this.element.querySelector('#sign-up-btn-back');

    this.appendChild(
      new Button({
        name: 'ButtonContinue',
        element: this.nextBtn,
      }),
    );

    this._bindEvents();
  }

  _bindEvents() {
    this._handleCollectiveOptionsChangeRef = this._handleCollectiveOptionsChange.bind(
      this,
    );
    for (let i = 0, len = this.collectivesOptions.length; i < len; i++) {
      this.collectivesOptions[i].addEventListener(
        'change',
        this._handleCollectiveOptionsChangeRef,
      );
    }

    this._hadnleShowNextStepRef = this._handleShowNextStep.bind(this);
    this.nextBtn.addEventListener('click', this._hadnleShowNextStepRef);

    this._handleShowPrevStepRef = this._handleShowPrevStep.bind(this);
    this.prevBtn.addEventListener('click', this._handleShowPrevStepRef);

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this.element
      .querySelector('form')
      .addEventListener('submit', this._handleFormSubmit);
  }

  _handleCollectiveOptionsChange(ev) {
    const selected = this.collectivesOptions
      .filter(c => c.checked)
      .map(v => v.value);

    if (ev.target.dataset.hasDebt === 'true') {
      this.collectivesWithoutDebt.map(option => (option.checked = false));
    } else {
      this.collectivesWithDebt.map(option => (option.checked = false));
    }

    this.ButtonContinue[selected.length ? 'enable' : 'disable']();
  }

  _handleShowNextStep() {
    this.step1Layer.classList.add('hide');
    this.step2Layer.classList.remove('hide');
  }

  _handleShowPrevStep() {
    this.step1Layer.classList.remove('hide');
    this.step2Layer.classList.add('hide');
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
      parent = this.ui[key].parentNode || this.ui[key][0].parentNode;
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
    Object.keys(UsersNewForm.constraints).forEach(key => {
      parent = this.ui[key].parentNode || this.ui[key][0].parentNode;
      parent.classList.remove('error');
    });
  }

  _getFieldsData() {
    const data = {};
    Object.keys(UsersNewForm.constraints).forEach(key => {
      if (this.ui[key] instanceof Array) {
        data[key] = this.ui[key].filter(c => c.checked).map(v => v.value);
      } else {
        data[key] = this.ui[key].value;
      }
    });
    return data;
  }
}
