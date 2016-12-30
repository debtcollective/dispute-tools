import Checkit from 'checkit';
import Widget from '../lib/widget';
import API from '../lib/api';
import Button from '../components/Button';

const AMOUNT_PRESETS = [1000, 2000, 3000, 5000, 10000, 25000];

const FUND_GENERAL = 'FUND_GENERAL';
const FUND_STRIKE = 'FUND_STRIKE';

const PAGE_DONATE = 'PAGE_DONATE';
const PAGE_PAYMENT = 'PAGE_PAYMENT';
const PAGE_SUCCESS = 'PAGE_SUCCESS';
const PAGE_ERROR = 'PAGE_ERROR';

const PAYMENT_METHOD_CREDIT_CARD = 'PAYMENT_METHOD_CREDIT_CARD';
const PAYMENT_METHOD_PAYPAL = 'PAYMENT_METHOD_PAYPAL';

export default class DonationFlow extends Widget {
  static get constraints() { return { email: ['required', 'email']}; }
  constructor(config) {
    super(config);
    this.state = {
      busy: false,
      amount: AMOUNT_PRESETS[0],
      page: PAGE_PAYMENT,
      fund: FUND_GENERAL,
      paymentMethod: null,
      email: '',
      number: '',
      cvc: '',
      exp: '',
    };
    this.donationFormEl = this.element;
    this.sectionDonateEl = this.donationFormEl.querySelector('section.Donate');
    this.sectionDonateSubmitEl = this.sectionDonateEl.querySelector('button');
    this.sectionDonateFundOptionGeneralEl = this.sectionDonateEl.querySelector('.DonateOption[data-fund-option-general]');
    this.sectionDonateFundOptionStrikeEl = this.sectionDonateEl.querySelector('.DonateOption[data-fund-option-strike]');
    this.sectionDonateAmountPickerEl = this.sectionDonateEl.querySelector('.AmountPicker');
    this.customDonationCustomInputEl = this.sectionDonateAmountPickerEl.querySelector('[data-donation-custom-input]');
    this.sectionPaymentEl = this.donationFormEl.querySelector('section.Payment');
    this.sectionPaymentMethodsEl = this.donationFormEl.querySelector('.PaymentMethods');
    this.sectionPaymentMethodCreditCardEl = this.donationFormEl.querySelector('.PaymentMethod[data-payment-method="credit-card"]');
    this.sectionPaymentMethodPayPalEl = this.donationFormEl.querySelector('.PaymentMethod[data-payment-method="paypal"]');
    this.sectionPaymentSubmitEl = this.sectionPaymentEl.querySelector('button');
    this.sectionSuccessEl = this.donationFormEl.querySelector('section.Success');
    this.sectionErrorEl = this.donationFormEl.querySelector('section.Error');
    this.sectionEls = Array.prototype.slice.call(this.donationFormEl.querySelectorAll('section'));



    // Continue button
    this.sectionDonateEl.querySelector('button').addEventListener('click', () => {
      const {amount} = this.state;
      if (amount) this.setState({page: PAGE_PAYMENT});
    });

    // Toggle fund to donate to
    this.sectionDonateFundOptionGeneralEl.addEventListener('click', () => this.setState({fund: FUND_GENERAL}));
    this.sectionDonateFundOptionStrikeEl.addEventListener('click', () => this.setState({fund: FUND_STRIKE}));

    // Pick donation amount (using presets)
    Array.prototype.slice.call(this.sectionDonateAmountPickerEl.querySelectorAll('.AmountOption'))
    .forEach(el => {
      const amount = parseInt(el.getAttribute('data-donation-amount'), 10);
      el.addEventListener('click', () => this.setState({amount: amount}));
    });

    this.customDonationCustomInputEl.addEventListener('input', () => {
      const match = /[\d.]+/.exec(this.customDonationCustomInputEl.value.trim());
      const amountParsed = parseFloat( match && match[0], 10);
      const amount = Math.round(amountParsed * 100); // rounded in cents
      this.setState({amount});
    });

    // Make Payment
    this.sectionPaymentSubmitEl.addEventListener('click', () => this.setState({page: PAGE_SUCCESS}));

    // Return to Donation options
    this.sectionPaymentEl.querySelector('.btn-back').addEventListener('click', () => this.setState({page: PAGE_DONATE}));

    // Toggle Payment option (paypal will trigger redirect, other will enable form inputs)
    this.sectionPaymentMethodCreditCardEl.addEventListener('click', () => this.setState({paymentMethod: PAYMENT_METHOD_CREDIT_CARD}));
    this.sectionPaymentMethodPayPalEl.addEventListener('click', () => this.setState({paymentMethod: PAYMENT_METHOD_PAYPAL}));

    // Initial render
    this.render();
  }
  setState(newState) {
    this.state = Object.assign({}, this.state, newState);
    this.render();
  }
  render() {
    const {page, fund, amount, paymentMethod} = this.state;

    // Page
    this.sectionEls.forEach(el => el.style.display = 'none');
    switch(page) {
      case PAGE_DONATE:
        this.sectionDonateEl.style.display = 'block';
        if (amount) {
          this.sectionDonateSubmitEl.setAttribute('disabled', 'disabled');
        } else {
          this.sectionDonateSubmitEl.setAttribute('disabled', 'disabled');
        }
      break;
      case PAGE_PAYMENT:
        this.sectionPaymentEl.style.display = 'block';
        // this.sectionPaymentSubmitEl.setAttribute('disabled', 'disabled');
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
    const matchingPreset = this.sectionDonateAmountPickerEl.querySelector(`.AmountOption[data-donation-amount="${amount}"]`);
    if (matchingPreset) matchingPreset.classList.add('active');

    // Data: Custom amount input
    this.customDonationCustomInputEl.value = `$${(amount/100).toFixed(2)}`;

    // Set Amount Preset or input..
    // Disable button if user tries enters invalid input?

    // Data: Fund to donate to
    if (paymentMethod) {
      if (paymentMethod === PAYMENT_METHOD_CREDIT_CARD) {
        this.sectionPaymentMethodCreditCardEl.classList.add('active');
        this.sectionPaymentMethodPayPalEl.classList.remove('active');
      } else {
        this.sectionPaymentMethodPayPalEl.classList.add('active');
        this.sectionPaymentMethodCreditCardEl.classList.remove('active');
      }
    } else {
      this.sectionPaymentMethodPayPalEl.classList.remove('active');
      this.sectionPaymentMethodCreditCardEl.classList.remove('active');
    }
  }
  sendPayment(args) {
    if (this.state.busy) return;
    this.setState({busy: true});
    API.postStripePayment(args, () => {
      this.setState({busy: false});
      console.log('DONE API call');
    });
  }
}
