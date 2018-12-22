import DonationFlow from '../../components/DonationFlow';

class ViewDonateIndex {
  constructor() {
    this.donationFlow = new DonationFlow({
      name: 'donationFlow',
      element: document.querySelector('[data-component-donationform]'),
    });
  }
}

window.ViewDonateIndex = ViewDonateIndex;
