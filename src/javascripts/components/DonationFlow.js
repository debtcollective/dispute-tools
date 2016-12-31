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

const formatCurrency = (amount) => `${(amount).toFixed(2)}`;

export default class DonationFlow extends Widget {
  static get constraints() { return { email: ['required', 'email']}; }
  constructor(config) {
    super(config);
    this.state = {
      busy: false,
      amount: AMOUNT_PRESETS[0],
      page: PAGE_DONATE,
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
    this.sectionPaymentPayPalFormEl = this.sectionPaymentMethodPayPalEl.querySelector('form');
    this.sectionPaymentInputEmailEl = this.donationFormEl.querySelector('[name="email"]');
    this.sectionPaymentInputNumberEl = this.donationFormEl.querySelector('[name="number"]');
    this.sectionPaymentInputExpEl = this.donationFormEl.querySelector('[name="exp"]');
    this.sectionPaymentInputCvcEl = this.donationFormEl.querySelector('[name="cvc"]');
    this.sectionPaymentSubmitEl = this.sectionPaymentEl.querySelector('button');
    this.sectionSuccessEl = this.donationFormEl.querySelector('section.Success');
    this.sectionErrorEl = this.donationFormEl.querySelector('section.Error');
    this.sectionEls = Array.prototype.slice.call(this.donationFormEl.querySelectorAll('section'));

    // Continue button
    this.sectionDonateSubmitEl.addEventListener('click', () => {
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
      el.addEventListener('click', () => {
        this.customDonationCustomInputEl.value = formatCurrency(amount/100);
        this.setState({amount: amount});
      });
    });

    this.customDonationCustomInputEl.addEventListener('input', () => {
      const match = /[\d.]+/.exec(this.customDonationCustomInputEl.value.trim());
      const amountParsed = parseFloat( match && match[0], 10);
      const amount = Math.round(amountParsed * 100); // rounded in cents
      this.setState({amount});
    });

    // Make Payment
    this.sectionPaymentSubmitEl.addEventListener('click', () => {
      // TODO: Test if can donate first
      this.donate((error) => {
        if (error) {
          console.error(error);
          this.setState({page: PAGE_ERROR});
        } else {
          this.setState({page: PAGE_SUCCESS});
        }
      });
    });

    // Return to Donation options
    this.sectionPaymentEl.querySelector('.btn-back').addEventListener('click', () => this.setState({page: PAGE_DONATE}));

    // Toggle Payment option (paypal will trigger redirect, other will enable form inputs)
    this.sectionPaymentMethodCreditCardEl.addEventListener('click', () => this.setState({paymentMethod: PAYMENT_METHOD_CREDIT_CARD}));
    this.sectionPaymentMethodPayPalEl.addEventListener('click', () => {
      this.setState({paymentMethod: PAYMENT_METHOD_PAYPAL});
      this.sectionPaymentPayPalFormEl.submit();
    });

    // Initial render
    this.customDonationCustomInputEl.value = formatCurrency(this.state.amount/100);
    this.render();
  }
  setState(newState) {
    this.state = Object.assign({}, this.state, newState);
    this.render();
  }
  render() {
    const {page, fund, amount, paymentMethod} = this.state;
    console.log('render', this.state, amount)

    // Page
    this.sectionEls.forEach(el => el.style.display = 'none'); // hide all
    switch(page) {
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
        if (paymentMethod) {
          if (paymentMethod === PAYMENT_METHOD_CREDIT_CARD) {
            this.sectionPaymentSubmitEl.removeAttribute('disabled');
            this.sectionPaymentInputNameEl.removeAttribute('disabled');
            this.sectionPaymentInputNumberEl.removeAttribute('disabled');
            this.sectionPaymentInputExpEl.removeAttribute('disabled');
            this.sectionPaymentInputCvcEl.removeAttribute('disabled');
          } else {
            this.sectionPaymentSubmitEl.setAttribute('disabled', 'disabled');
          }
        } else {
          this.sectionPaymentSubmitEl.setAttribute('disabled', 'disabled');
          this.sectionPaymentInputNameEl.setAttribute('disabled', 'disabled');
          this.sectionPaymentInputNumberEl.setAttribute('disabled', 'disabled');
          this.sectionPaymentInputExpEl.setAttribute('disabled', 'disabled');
          this.sectionPaymentInputCvcEl.setAttribute('disabled', 'disabled');
        }
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

    // Data: Credit Card Inputs
    const emailIsValid = !!this.sectionPaymentInputEmailEl.value.trim() // TODO: checkit?
    const numberIsValid = Stripe.card.validateCardNumber(this.state.number);
    const expiryIsValid = Stripe.card.validateExpiry(this.state.exp);
    const cvcIsValid = Stripe.card.validateCVC(this.state.cvc);
    if (emailIS && numberIsValid && expiryIsValid && cvcIsValid) {
      this.sectionPaymentSubmitEl.removeAttribute('disabled');
    } else {
      this.sectionPaymentSubmitEl.setAttribute('disabled', 'disabled');
    }
  }
  donate(callback) {
    if (this.state.busy) return;
    this.setState({busy: true});
    const chargeObject = { token: null, email: null, amount: 0 };
    API.postStripePayment(chargeObject, (error, result) => {
      console.log('DONE API call', error, result);
      this.setState({busy: false});
      callback(error, result);
    });
  }
}
