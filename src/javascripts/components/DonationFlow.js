/* eslint-disable max-len */
/* global Stripe */

import Widget from '../lib/widget';
import { postStripePayment } from '../lib/api';

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
    return { email: ['required', 'email'] };
  }

  constructor(config) {
    super(config);
    this.state = {
      busy: false,
      amount: AMOUNT_PRESETS[0],
      page: PAGE_DONATE,
      fund: FUND_GENERAL,
      name: '',
      phone: '',
      email: '',
      number: '',
      cvc: '',
      exp: '',
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
          this.setState({ page: PAGE_ERROR });
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

    // Render on any change
    this.donationFormEl.addEventListener('input', () => {
      this.render();
    });

    // Init Stripe
    this.initStripe();
    this.initStripeElements();
  }

  initStripe() {
    this.stripe = window.Stripe(window.STRIPE_PUBLISHABLE_KEY);
  }

  initStripeElements() {
    const elements = this.stripe.elements();

    const style = {
      base: {
        color: '#32325d',
        fontFamily:
          "'Libre Franklin', 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji', Segoe UI Emoji', 'Segoe UI Symbol'",
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    };

    // Create an instance of the card Element.
    const card = elements.create('card', { style });

    // Add an instance of the card Element into the `card-element` <div>.
    card.mount('#card-element');

    this.card = card;
  }

  setState(newState) {
    this.state = Object.assign({}, this.state, newState);
    this.render();
  }

  validate() {
    return { valid: false };
  }

  createStripeToken(callback) {
    Stripe.card.createToken(
      {
        number: this.sectionPaymentInputNumberEl.value,
        cvc: this.sectionPaymentInputCvcEl.value,
        exp: this.sectionPaymentInputExpEl.value,
      },
      (status, response) => {
        if (status === 200 && response.type === 'card') {
          const chargeObject = {
            token: response.id,
            email: this.sectionPaymentInputEmailEl.value.trim(),
            amount: this.state.amount,
            subscribe: this.sectionDonateMonthly.checked ? 1 : 0,
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
        } else {
          callback(new Error('Could not create Stripe token'));
        }
      },
    );
  }

  donate(callback) {
    if (this.state.busy) return;
    this.setState({ busy: true });
    this.sectionDonateBtn.disabled = true;

    const validation = this.validate();

    if (validation.valid === false) {
      // handle errors

      // reset state
      this.setState({ busy: false });
      this.sectionDonateBtn.disabled = false;

      return;
    }

    this.createStripeToken(callback);
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
