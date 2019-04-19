/* global Checkit */
import Vue from 'vue';
import Pisces from 'pisces';
import _ from 'lodash';
import flatpickr from 'flatpickr';
import Widget from '../../lib/widget';
import Button from '../../components/Button';
import ConfirmInline from '../../components/ConfirmInline';
import DebtAmounts from './DebtAmounts.vue';
import { DebtTypesCollection } from '../../../../shared/enum/DebtTypes';
import CurrencyInput from './CurrencyInput.vue';
import {
  getCustomSelector,
  getCheckitConfig,
  filterDependentFields,
  makeErrorsReadable,
} from '../../../../services/formValidation';

export const mountDebtAmounts = config => {
  if (document.getElementById('debt-amounts-mount-point')) {
    // make it backwards compatible
    const oldDebtType = _.get(
      config.dispute.data._forms || config.dispute.data.forms,
      'personal-information-form.debt-type',
    );

    const oldDebtAmount = _.get(
      config.dispute.data._forms || config.dispute.data.forms,
      'personal-information-form.debt-amount',
    );

    let debts = _.get(
      config.dispute.data._forms || config.dispute.data.forms,
      'personal-information-form.debts',
    );

    if (_.isEmpty(debts) && (oldDebtAmount || oldDebtType)) {
      debts = [{ type: oldDebtType, amount: oldDebtAmount }];
    }

    // set typeSelected to render the debt type dropdown correctly
    const debtTypeKeys = DebtTypesCollection.map(a => a.key);
    _.forEach(
      debts,
      debt => (debt.typeSelected = debtTypeKeys.includes(debt.type) ? debt.type : 'other'),
    );

    // enable multiple debt types for for credit-report-dispute only
    // we will refactor this in the new version
    const multiple = ['credit-report-dispute'].includes(config.dispute.disputeTool.slug);

    return new Vue({
      el: '#debt-amounts-mount-point',
      render() {
        return <DebtAmounts multiple={multiple} intialDebts={debts} />;
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
            initialAmount={_.get(
              config.dispute.data._forms || config.dispute.data.forms,
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
          okButtonText: 'Exit and delete this dispute',
        },
      }),
    );

    this.ConfirmInline.bind('onCancel', () => {
      parentElement.querySelector(`[name="${ev.target.name}"][value="${oppositeAction}"]`).click();
    });

    this.ConfirmInline.bind('onOk', () => {});

    this.ConfirmInline.render(parentElement).activate();
  }

  _handleContentToggle(ev) {
    const target = ev.currentTarget;

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
    const normalizedConstrains = filterDependentFields(form, this.constraints);
    const [err] = new Checkit(normalizedConstrains).validateSync(form);

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
      Array.prototype.forEach.call(this._getElementsForKey(key), element => {
        const parent = element.parentNode;

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
      Array.prototype.forEach.call(this._getElementsForKey(key), element => {
        if (!element) {
          return;
        }

        if (element.dataset.customSelector) {
          data[key] = getCustomSelector(this.dispute, key).DOM();
          return;
        }

        switch (element.type) {
          case 'radio':
            val = element.checked ? element.value : null;
            break;
          case 'checkbox':
            val = element.checked ? 'yes' : 'no';
            break;
          default:
            val = element.value;
        }

        if (!val) {
          return;
        }

        if (data[key]) {
          data[key] = _.castArray(data[key]).concat(val);
          return;
        }

        data[key] = val;
      });

      if (_.includes(this.constraints[key], 'array')) {
        data[key] = _.castArray(data[key]);
      }
    });

    return data;
  }

  _getElementsForKey(key) {
    let nodes = this.element.querySelectorAll(`[name^="fieldValues[${key}]"]:not([type="hidden"])`);

    if (nodes.length) {
      return nodes;
    }

    // Here we handle flatpickr behaviour on mobile
    // It changes the type of the original input to hidden and creates a new one
    // We still want to retrieve the value of the hidden input
    nodes = this.element.querySelectorAll(`.date-form-control[name^="fieldValues[${key}]"]`);

    return nodes;
  }
}
