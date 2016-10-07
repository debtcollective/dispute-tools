import Widget from '../../../lib/widget';

export default class AdminDisputesAddStatusForm extends Widget {
  constructor(config) {
    super(config);
    this.test = this.element.querySelector('.test');
  }

  updateData(disputeData) {
    this.test.innerHTML = JSON.stringify(disputeData);
  }
}

