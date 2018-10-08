/* global Checkit */
import Vue from 'vue';
import Pisces from 'pisces';
import assert from 'assert';
import get from 'lodash/get';
import flatpickr from 'flatpickr';
import Widget from '../../lib/widget';
import Button from '../../components/Button';
import ConfirmInline from '../../components/ConfirmInline';
import DebtAmounts from './DebtAmounts.vue';
import CurrencyInput from './CurrencyInput.vue';
import {
  getCustomSelector,
  getCheckitConfig,
  filterDependentFields,
  makeErrorsReadable,
} from '../../../../services/formValidation';
import disputeForms from '../../../../shared/utils/disputeForms';

export const mountDebtAmounts = config => {
  if (document.getElementById('debt-amounts-mount-point')) {
    const originalDebt = {
      type: get(disputeForms.getData(config.dispute.data), 'personal-information-form.debt-type'),
      amount: get(
        disputeForms.getData(config.dispute.data),
        'personal-information-form.debt-amount',
      ),
    };

    return new Vue({
      el: '#debt-amounts-mount-point',
      render() {
        return <DebtAmounts originalDebt={originalDebt} />;
      },
    }).$children[0];
  }
};

export const mountDebtAmount = config => {
  if (document.getElementById('debt-amount-mount-point')) {
    return new Vue({
      el: '#debt-amount-mount-point',
      render() {
        return (
          <CurrencyInput
            name="fieldValues[debt-amount]"
            initialAmount={get(
              disputeForms.getData(config.dispute.data),
              'personal-information-form.debt-amount',
            )}
          />
        );
      },
    }).$children[0];
  }
};

export default class DisputesInformationForm extends Widget {
  constructor(config) {
    super(config);

    this._setupDatePickers();

    this.appendChild(
      new Button({
        name: 'Button',
        element: this.element.querySelector('button'),
      }),
    );

    this.debtAmounts = mountDebtAmounts(config);
    this.debtAmount = mountDebtAmount(config);

    this.constraints = this._constraintsAll = getCheckitConfig(this.dispute);

    this.ui = {};
    Object.keys(this.constraints).forEach(key => {
      const query = `[name="fieldValues[${key}]"]`;
      this.ui[key] = this.element.querySelector(query);
    });

    this.form = this.element.querySelector('form');
    this._handleFormSubmitRef = this._handleFormSubmit.bind(this);
    this.form.addEventListener('submit', this._handleFormSubmitRef);

    this.togglers = [].slice.call(document.querySelectorAll('[data-toggle-radio]'));
    this._handleContentToggleRef = this._handleContentToggle.bind(this);
    this.togglers.forEach(t => {
      t.addEventListener('change', this._handleContentToggleRef);

      assert(['yes', 'no'].includes(t.value), 'this code assumes only yes/no answers');

      // show/hide the fieldset based on saved data
      if (t.value === 'no') {
        return; // the equivalent 'yes' toggle tells us to show or hide
      }

      if (t.checked) {
        // 'yes' was selected in the saved data
        this._showFieldset(t);
      } else {
        // there was no saved data for this question
        // OR 'no' was selected in the saved data
        this._hideFieldset(t);
      }
    });

    this.toggleRadios = [].slice.call(document.querySelectorAll('[data-partial-toggle-radio]'));
    this._toggleRadiosRef = {};
    this._handlePartialTogglerRef = this._handlePartialToggler.bind(this);
    this.toggleRadios.forEach(t => {
      t.addEventListener('change', this._handlePartialTogglerRef);
      if (t.checked) {
        this._initHiddenElements.call(this, t);
        if (t.value !== t.dataset.default) {
          t.checked = false;
          t.click();
        }
      }
    });

    this.handleAlertRadios = [].slice.call(document.querySelectorAll('[data-alert]'));
    if (this.handleAlertRadios.length) {
      this._handleAlertRadioChangeRef = this._handleAlertRadioChange.bind(this);
      this.handleAlertRadios.forEach(t => {
        t.addEventListener('change', this._handleAlertRadioChangeRef);
      });
    }

    this.handleConfirmRadios = [].slice.call(document.querySelectorAll('[data-confirm]'));
    if (this.handleConfirmRadios.length) {
      this._handleConfirmRadioChangeRef = this._handleConfirmRadioChange.bind(this);
      this.handleConfirmRadios.forEach(t =>
        t.addEventListener('change', this._handleConfirmRadioChangeRef),
      );
    }

    this.pisces = new Pisces(this.element.parentElement);
  }

  _setupDatePickers() {
    const flatpickrs = flatpickr('.date-form-control', {
      allowInput: true,
      dateFormat: 'm-d-Y',
      altFormat: 'm-d-Y',
    });

    // set the date when user uses keyboard to input, then tabs/clicks away
    // https://github.com/flatpickr/flatpickr/issues/828
    (Array.isArray(flatpickrs) ? flatpickrs : [flatpickrs]).forEach(picker => {
      picker._input.addEventListener('blur', () => {
        picker.setDate(picker._input.value);
      });
    });
  }

  _handleConfirmRadioChange({ target: { parentElement, dataset, value, name } }) {
    // Radios are nested two deep
    parentElement = parentElement.parentElement;
    const data = JSON.parse(dataset.confirm);
    const matched = data[value];

    if (!matched) return;

    const oppositeAction = value === 'yes' ? 'no' : 'yes';

    this.appendChild(
      new ConfirmInline({
        name: 'ConfirmInline',
        className: '-warning mt2',
        data: {
          text: `▲ ${matched.message}`,
          cancelButtonText: matched.cancelButtonText || 'No',
          okButtonText: matched.okButtonText || 'Yes',
        },
      }),
    );

    this.ConfirmInline.bind('onCancel', () => {
      parentElement.querySelector(`[name="${name}"][value="${oppositeAction}"]`).click();
    });

    this.ConfirmInline.bind('onOk', () => {} /* ConfirmInline handles deactivation */);

    this.ConfirmInline.render(parentElement).activate();
  }

  /**
   * Handle the `alert` radio change event.
   * If the value matches with the option that should display the `alert` it
   * creates a new ConfirmInline widget instance and subscribe to its customEvents.
   * @private
   * @listens @module:ConfirmInline~event:onCancel
   * @listens @module:ConfirmInline~event:onOk
   * @return undefined
   */
  _handleAlertRadioChange(ev) {
    const target = ev.target;
    const parentElement = target.parentElement.parentElement;
    const data = JSON.parse(target.dataset.alert);
    const matched = data[target.value];

    if (!matched) {
      return;
    }

    const oppositeAction = target.value === 'yes' ? 'no' : 'yes';

    this.appendChild(
      new ConfirmInline({
        name: 'ConfirmInline',
        className: '-warning mt2',
        data: {
          text: `▲ ${matched.message}`,
          cancelButtonText: `Select ${oppositeAction}`,
          okButtonText: 'Exit and deactivate dispute',
        },
      }),
    );

    this.ConfirmInline.bind('onCancel', () => {
      parentElement.querySelector(`[name="${ev.target.name}"][value="${oppositeAction}"]`).click();
    });

    this.ConfirmInline.bind('onOk', () => {
      this.dispatch('deactivateDispute');
    });

    this.ConfirmInline.render(parentElement).activate();
  }

  _handleContentToggle(ev) {
    const target = ev.currentTarget;
    assert(target.checked, 'this should only fire when the user has just checked "yes" or "no"');
    if (target.value === 'yes') {
      this._showFieldset(target);
    } else {
      this._hideFieldset(target);
    }
  }

  _extractFieldset(target) {
    const fieldset = target.parentElement.parentElement.querySelector('fieldset');
    if (fieldset) {
      const whitelist = 'input, select, textarea';
      const names = [].slice.call(fieldset.querySelectorAll(whitelist)).map(i => i.dataset.name);
      return { fieldset, names };
    }
    return { fieldset, names: [] };
  }

  _hideFieldset(toggle) {
    // also disables constraints
    const { fieldset, names } = this._extractFieldset(toggle);

    fieldset.style.display = 'none';
    names.forEach(name => {
      const el = this.ui[name];

      if (el) {
        el.disabled = true;
      }

      if (this.constraints[name]) {
        delete this.constraints[name];
      }
    });
  }

  _showFieldset(toggle) {
    // also enables constraints
    const { fieldset, names } = this._extractFieldset(toggle);
    fieldset.style.display = 'initial';
    names.forEach(name => {
      const el = this.ui[name];
      const vals = this._constraintsAll[name];

      if (el) el.disabled = false;
      if (vals) this.constraints[name] = vals;
    });
  }

  _initHiddenElements(element) {
    const names = JSON.parse(element.dataset.partialToggleRadio);

    names.forEach(name => {
      const el = this.ui[name];
      let parent = el.parentElement;

      if (parent.classList.contains('col') === false) {
        parent = parent.parentElement;
      }

      if (el.dataset.hidden === 'true') {
        el.disabled = true;
        parent.classList.add('hide');

        if (this.constraints[name]) {
          delete this.constraints[name];
        }
      }

      this._toggleRadiosRef[name] = {
        el,
        parent,
      };
    });
  }

  _handlePartialToggler(ev) {
    const target = ev.currentTarget;
    const names = JSON.parse(target.dataset.partialToggleRadio);

    names.forEach(name => {
      const ref = this._toggleRadiosRef[name];

      if (ref.el.dataset.hidden === 'true') {
        const vals = this._constraintsAll[name];
        if (vals) {
          this.constraints[name] = vals;
        }

        ref.el.dataset.hidden = 'false';
        ref.parent.classList.remove('hide');
        ref.el.disabled = false;

        return;
      }

      ref.el.dataset.hidden = 'true';
      ref.el.disabled = true;
      ref.parent.classList.add('hide');

      if (this.constraints[name]) {
        delete this.constraints[name];
      }

      return;
    });
  }

  _handleFormSubmit(ev) {
    this.Button.disable();
    this._clearFieldErrors();

    const form = this._getFieldsData();
    const [err] = new Checkit(filterDependentFields(form, this.constraints)).validateSync(form);

    if (err) {
      ev.preventDefault();
      this.Button.enable();
      return this._displayFieldErrors(makeErrorsReadable(this.dispute, err.errors));
    }

    this.Button.updateText();

    return undefined;
  }

  _displayFieldErrors(errors) {
    Object.keys(errors).forEach(key => {
      if (!this.ui[key]) return;

      // Select this each time to avoid dynamically added fields getting left out
      const parent = this._getElementForKey(key).parentNode;
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

    const firstErrorKey = Object.keys(errors)[0];

    if (firstErrorKey) {
      const element = this.ui[firstErrorKey];
      if (!element) return;
      const parent = element.parentElement;
      let y = parent.getBoundingClientRect().top;

      y = y >= 0 ? `+${y}` : y.toString();

      this.pisces.scrollToPosition(
        { y },
        {
          onComplete: () => {
            element.focus();
          },
        },
      );
    }
  }

  _clearFieldErrors() {
    Object.keys(this.constraints).forEach(key => {
      if (this.ui[key]) {
        this.ui[key].parentNode.classList.remove('error');
      }
    });
  }

  _getFieldsData() {
    const data = {};
    let val;

    Object.keys(this.constraints).forEach(key => {
      /**
       * @type {HTMLInputElement}
       */
      // Select this each time to avoid dynamically added fields getting left out
      const element = this._getElementForKey(key);
      if (element.dataset.customSelector) {
        data[key] = getCustomSelector(this.dispute, key).DOM();
      } else if (element) {
        if (element.type === 'radio') {
          val = document.querySelector(`[name="${element.name}"]:checked`).value;
        } else if (element.type === 'checkbox') {
          val = element.checked === true ? 'yes' : 'no';
        } else {
          val = element.value;
        }
        data[key] = val;
      }
    });

    return data;
  }

  _getElementForKey(key) {
    return this.element.querySelector(`[for="fieldValues[${key}]"]`);
  }
}
