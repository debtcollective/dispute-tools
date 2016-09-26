import Widget from '../../lib/widget';
import Popover from '../Popover';
import API from '../../lib/api';

export default class DisputesFollowUp extends Widget {
  /**
   * Creates a DisputesFollowUp.
   * @param {Object} config - the configuration object for the widget.
   * @param {Object} config.dispute - the current dispute model’s data.
   * @param {HTMLElement} config.element - the widget’s DOM element reference.
   * @param {string} config.name - the widget’s name.
   */
  constructor(config) {
    super(config);

    if (!this.dispute.data.signature || this.dispute.data.disputeConfirmFollowUp) {
      return null;
    }

    this.popoverElement = document.querySelector('[data-component-popover="dispute-completed"]');

    if (!this.popoverElement) {
      return null;
    }

    this._displayCompletedPopover();

    return this;
  }

  /**
   * Creates a new Popover instance, append the Popover element to the header
   * Dropdown or the hamburger menu (depending which one is visible at the time)
   * and register to its `destroy`.
   * @private
   * @return undefined
   */
  _displayCompletedPopover() {
    const header = document.querySelector('.Header .Dropdown');

    this._handlePopoverDestroyedRef = this._handlePopoverDestroyed.bind(this);

    this.appendChild(new Popover({
      name: 'Popover',
      element: this.popoverElement,
    })).bind('destroy', this._handlePopoverDestroyedRef);

    if (header.offsetParent) {
      this.Popover.appendTo(header);
    } else {
      this.Popover.appendTo(document.querySelector('.js-hamburger-menu').parentElement);
    }

    this.Popover.activate();
  }

  /**
   * Sets the `dispute.data.setConfirmFollowUp` model value to `true`.
   * @private
   * @listens @module:Popover~event:destroy
   * @return undefined
   */
  _handlePopoverDestroyed() {
    this._handlePopoverDestroyedRef = null;
    this.Popover = null;

    API.updateDisputeData({
      disputeId: this.dispute.id,
      body: {
        command: 'setConfirmFollowUp',
      },
    });
  }
}
