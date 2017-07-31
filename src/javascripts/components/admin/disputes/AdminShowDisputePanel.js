/* global Checkit */
import Widget from '../../../lib/widget';
import DisputeStatusItem from '../../../components/disputes/StatusItem';
import DisputeFormView from '../../../components/disputes/FormView';

export default class AdminShowDisputePanel extends Widget {
  constructor(config) {
    super(config);
    this.disputeElement = this.element.querySelector('[data-dispute-wrapper]');

    this._bindEvents();
  }

  _bindEvents() {
  }

  /**
   * Resets the form fields and replace the dynamic form data using `disputeData`.
   * @param {Object} dispute - the dispute data to render
   */
  updateData(dispute) {
    this.dispute = dispute
    while (this.disputeElement.firstChild) {
      this.disputeElement.removeChild(this.disputeElement.firstChild);
    }

    if (!this.dispute.data || !this.dispute.data.forms) {
      var blankMessage = document.createElement('div')
      blankMessage.innerHTML = 'No saved form data.'
      this.disputeElement.appendChild(blankMessage)
      return
    }

    const disputeTable = document.createDocumentFragment();

    var forms = this.dispute.data.forms
    for (var name in forms) {
      var form = forms[name]
      disputeTable.appendChild(
        new DisputeFormView({
          data: {form, name}
        }).element
      )
    }


    this.disputeElement.appendChild(disputeTable);
  }
}
