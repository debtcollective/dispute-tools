/* eslint-disable max-len */
/* global Stripe */

import merge from 'lodash/merge';
import Widget from '../lib/widget';
import { postStripePayment } from '../lib/api';

const Checkit = require('checkit');

const AMOUNT_PRESETS = [1000, 2000, 3000, 5000, 10000, 25000];

const FUND_GENERAL = 'FUND_GENERAL';
const FUND_STRIKE = 'FUND_STRIKE';

const PAGE_DONATE = 'PAGE_DONATE';
const PAGE_PAYMENT = 'PAGE_PAYMENT';
const PAGE_SUCCESS = 'PAGE_SUCCESS';
const PAGE_ERROR = 'PAGE_ERROR';

const formatCurrency = amount => `${amount.toFixed(2)}`;

export default class DonationFlow extends Widget {
  static get constraints() {
    return {
      email: ['required', 'email'],
      name: ['required'],
      phone: ['required'],
    };
  }

  constructor(config) {
    super(config);
    this.state = {
      amount: AMOUNT_PRESETS[0],
      busy: false,
      email: '',
      fund: FUND_GENERAL,
      name: '',
      page: PAGE_DONATE,
      phone: '',
    };

    this.donationFormEl = this.element;
    this.sectionDonateEl = this.donationFormEl.querySelector('section.Donate');
    this.sectionDonateSubmitEl = this.sectionDonateEl.querySelector('button');
    this.sectionDonateFundOptionGeneralEl = this.sectionDonateEl.querySelector(
      '.DonateOption[data-fund-option-general]',
    );
    this.sectionDonateFundOptionStrikeEl = this.sectionDonateEl.querySelector(
      '.DonateOption[data-fund-option-strike]',
    );
    this.sectionDonateAmountPickerEl = this.sectionDonateEl.querySelector('.AmountPicker');
    this.customDonationCustomInputEl = this.sectionDonateAmountPickerEl.querySelector(
      '[data-donation-custom-input]',
    );
    this.sectionPaymentEl = this.donationFormEl.querySelector('section.Payment');
    this.sectionPaymentMethodsEl = this.donationFormEl.querySelector('.PaymentMethods');
    this.sectionPaymentMethodCreditCardEl = this.donationFormEl.querySelector(
      '.PaymentMethod[data-payment-method="credit-card"]',
    );
    this.sectionPaymentMethodPayPalEl = this.donationFormEl.querySelector(
      '.PaymentMethod[data-payment-method="paypal"]',
    );
    this.sectionPaymentPayPalFormEl = this.sectionPaymentMethodPayPalEl.querySelector('form');
    this.sectionPaymentInputEmailEl = this.donationFormEl.querySelector('[name="email"]');
    this.sectionPaymentInputNumberEl = this.donationFormEl.querySelector('[name="number"]');
    this.sectionPaymentInputExpEl = this.donationFormEl.querySelector('[name="exp"]');
    this.sectionPaymentInputCvcEl = this.donationFormEl.querySelector('[name="cvc"]');
    this.sectionPaymentInputNameEl = this.donationFormEl.querySelector('[name="name"]');
    this.sectionPaymentSubmitEl = this.sectionPaymentEl.querySelector('button');
    this.sectionSuccessEl = this.donationFormEl.querySelector('section.Success');
    this.sectionDonateBtn = this.donationFormEl.querySelector('.js-donate-amount');
    this.sectionDonateValues = this.donationFormEl.querySelectorAll('.js-amount-value');
    this.sectionDonateMonthly = this.donationFormEl.querySelector('.js-donate-monthly');
    this.sectionErrorEl = this.donationFormEl.querySelector('section.Error');
    this.sectionErrorMessageEl = this.sectionErrorEl.querySelector('.DonationResponse p');
    this.sectionEls = Array.prototype.slice.call(this.donationFormEl.querySelectorAll('section'));

    // Continue button
    this.sectionDonateSubmitEl.addEventListener('click', () => {
      const { amount } = this.state;

      if (amount) {
        // Edit HTML for preview amount before final payment
        this.sectionDonateValues.forEach(node => {
          node.innerHTML = formatCurrency(amount / 100);
        });

        this.setState({ page: PAGE_PAYMENT });
      }
    });

    // Toggle fund to donate to
    this.sectionDonateFundOptionGeneralEl.addEventListener('click', () =>
      this.setState({ fund: FUND_GENERAL }),
    );
    this.sectionDonateFundOptionStrikeEl.addEventListener('click', () =>
      this.setState({ fund: FUND_STRIKE }),
    );

    // Pick donation amount (using presets)
    Array.prototype.slice
      .call(this.sectionDonateAmountPickerEl.querySelectorAll('.AmountOption'))
      .forEach(el => {
        const amount = parseInt(el.getAttribute('data-donation-amount'), 10);
        el.addEventListener('click', () => {
          this.customDonationCustomInputEl.value = formatCurrency(amount / 100);
          this.setState({ amount });
        });
      });

    this.customDonationCustomInputEl.addEventListener('input', () => {
      const match = /[\d.]+/.exec(this.customDonationCustomInputEl.value.trim());
      const amountParsed = parseFloat(match && match[0], 10);
      const amount = Math.round(amountParsed * 100); // rounded in cents
      this.setState({ amount });
    });

    // Make Payment
    this.sectionPaymentSubmitEl.addEventListener('click', () => {
      this.donate(error => {
        if (error) {
          console.error(error); // eslint-disable-line
          this.setState({ page: PAGE_ERROR, pageError: error.message });
        } else {
          this.setState({ page: PAGE_SUCCESS });
        }
      });
    });

    // Try another card button
    this.sectionErrorEl
      .querySelector('.btn-back')
      .addEventListener('click', () => this.setState({ page: PAGE_PAYMENT }));

    // Return to Donation options
    this.sectionPaymentEl
      .querySelector('.btn-back')
      .addEventListener('click', () => this.setState({ page: PAGE_DONATE }));

    // Initial render
    this.customDonationCustomInputEl.value = formatCurrency(this.state.amount / 100);
    this.render();

    this.listenInputEvents();

    // Init Stripe
    this.initStripe();
    this.initStripeElements();
  }

  listenInputEvents() {
    // We are updating error state here
    //
    // This method originally rerenders the form on a change
    // If needed, we can refactor this later
    this.donationFormEl.addEventListener('input', event => {
      const key = event.target.name;

      if (['email', 'name', 'phone'].indexOf(key) >= 0) {
        const value = event.target.value;
        const newState = merge({}, this.state);

        newState[key] = value;

        this.setState(newState);
      }

      // clear errors for key that just changed
      this.clearError(key);

      // rerender form
      this.render();
    });
  }

  initStripe() {
    this.stripe = window.Stripe(window.STRIPE_PUBLISHABLE_KEY);
  }

  initStripeElements() {
    const elements = this.stripe.elements();

    // Create an instance of the card Element.
    this.card = elements.create('card');
    const card = this.card;

    // Add an instance of the card Element into the `card-element` <div>.
    card.mount('#card-element');

    // Set card to invalid by default
    this.cardError = {
      message: 'Invalid Card information.',
    };

    // Handle real-time validation errors from the card Element.
    card.addEventListener('change', event => {
      // Clear errors on change
      // We do the validation when clicking submit
      this.clearError('card');

      if (event.error) {
        this.cardError = event.error;
      } else {
        this.cardError = null;
      }
    });
  }

  setState(newState) {
    this.state = merge(this.state, newState);
    this.render();
  }

  async validate() {
    // Validate personal data
    const checkit = new Checkit(DonationFlow.constraints);
    const { name, email } = this.state;
    const errors = {};

    const [err] = checkit.validateSync({ name, email });

    if (err) {
      merge(errors, err.errors);
    }

    // Validate stripe card
    if (this.cardError) {
      merge(errors, { card: this.cardError.message });

      this.renderErrors(errors);

      return {
        valid: false,
        errors,
      };
    }

    // Try to create the Stripe token to verify for other errors
    const cardResult = await this.stripe.createToken(this.card, this.tokenData());
    const cardError = cardResult.error;

    if (cardError) {
      errors.card = cardError.message;
    }

    const valid = Object.keys(errors).length === 0;

    this.renderErrors(errors);

    return { valid, errors };
  }

  renderErrors(errors) {
    // find input
    Object.keys(errors).forEach(key => {
      const error = errors[key];

      this.renderError(key, error);
    });
  }

  renderError(key, error) {
    switch (key) {
      case 'card': {
        const input = document.querySelector('#card-element');
        input.classList.add('error');

        const errorContainer = document.querySelector('#card-element + p');
        errorContainer.textContent = `▲ ${error}`;

        break;
      }
      case 'email':
      case 'name': {
        const input = document.querySelector(`input[name="${key}"]`);
        input.classList.add('error');
        break;
      }
      default:
    }
  }

  clearError(key) {
    switch (key) {
      case 'card': {
        const input = document.querySelector('#card-element');
        input.classList.remove('error');
        break;
      }
      case 'email':
      case 'name': {
        const input = document.querySelector(`input[name="${key}"]`);
        input.classList.remove('error');
        break;
      }
      default:
    }
  }

  /**
   * Returns donator information to be sent to Stripe
   */
  tokenData() {
    const { name } = this.state;

    return {
      name,
    };
  }

  createStripeToken(callback) {
    this.stripe.createToken(this.card, this.tokenData()).then(result => {
      const { email, amount } = this.state;

      if (result.error) {
        const { message } = result.error;

        this.resetState();

        callback(new Error(message));
      } else {
        const { token } = result;
        const chargeObject = {
          amount,
          client_ip: token.client_ip,
          email,
          subscribe: this.sectionDonateMonthly.checked ? 1 : 0,
          token: token.id,
        };

        postStripePayment({ body: chargeObject }, (error, result) => {
          this.setState({ busy: false });
          this.sectionDonateBtn.disabled = false;
          if (result && result.body && result.body.error) {
            callback(new Error(result.body.error.message));
          } else {
            callback(error, result);
          }
        });
      }
    });
  }

  async donate(callback) {
    if (this.state.busy) return;
    this.setState({ busy: true });
    this.sectionDonateBtn.disabled = true;

    const validation = await this.validate();

    if (!validation.valid) {
      this.resetState();

      return;
    }

    this.createStripeToken(callback);
  }

  resetState() {
    this.setState({ busy: false });
    this.sectionDonateBtn.disabled = false;
  }

  render() {
    const { page, fund, amount } = this.state;

    // Page
    this.sectionEls.forEach(el => {
      el.style.display = 'none';
    }); // hide all

    switch (page) {
      case PAGE_DONATE:
        this.sectionDonateEl.style.display = 'block';
        if (amount) {
          this.sectionDonateSubmitEl.removeAttribute('disabled');
        } else {
          this.sectionDonateSubmitEl.setAttribute('disabled', 'disabled');
        }
        break;
      case PAGE_PAYMENT:
        this.sectionPaymentEl.style.display = 'block';
        this.sectionPaymentSubmitEl.removeAttribute('disabled');
        this.sectionPaymentInputNameEl.removeAttribute('disabled');

        break;
      case PAGE_SUCCESS:
        this.sectionSuccessEl.style.display = 'block';
        break;
      case PAGE_ERROR:
        this.sectionErrorEl.style.display = 'block';
        break;
      default:
        throw new Error(`page: '${page}', is not supported`);
    }

    // Data: Fund to donate to
    if (fund === FUND_GENERAL) {
      this.sectionDonateFundOptionGeneralEl.classList.add('active');
      this.sectionDonateFundOptionStrikeEl.classList.remove('active');
    } else {
      this.sectionDonateFundOptionStrikeEl.classList.add('active');
      this.sectionDonateFundOptionGeneralEl.classList.remove('active');
    }

    // Data: AmountPicker
    const amountOptActive = this.sectionDonateAmountPickerEl.querySelector('.AmountOption.active');
    if (amountOptActive) amountOptActive.classList.remove('active');
    const matchingPreset = this.sectionDonateAmountPickerEl.querySelector(
      `.AmountOption[data-donation-amount="${amount}"]`,
    );
    if (matchingPreset) matchingPreset.classList.add('active');

    this.sectionPaymentMethodCreditCardEl.classList.add('active');
    this.sectionPaymentMethodPayPalEl.classList.remove('active');
  }

  reset() {
    this.setState({
      page: PAGE_DONATE,
    });
  }
}
