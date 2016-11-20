/**
 * Progressively enhance the Campaign Tabs to be `position: fixed` when the
 * script is executed.
 */

import debounce from 'lodash/debounce';
import Widget from '../../../lib/widget';

export default class FixedTabs extends Widget {
  constructor(config) {
    super(config);

    this.siblingElement = this.element.nextElementSibling;

    this.stickyElementHeight = 0;
    this.stickyElementWidth = 0;

    this._setup()._bindEvents()._setFixedState();
  }

  /**
   * Updates the variables that relies on the viewport size and will be used
   * to correclty position the Tabs width and siblingElement top padding
   * based on these dimensions.
   * @private
   * @chainable
   */
  _setup() {
    this.stickyElementHeight = this.element.offsetHeight;
    this.stickyElementWidth = this.siblingElement.offsetWidth;

    return this;
  }

  /**
   * @private
   * @chainable
   */
  _bindEvents() {
    this._resizeHandlerRef = this._resizeHandler.bind(this);
    window.addEventListener('resize', debounce(this._resizeHandlerRef, 200));

    return this;
  }

  _resizeHandler() {
    this._setDefaultState()._setup()._setFixedState();
  }

  /**
   * Sets the tabs container to its initial position.
   * Useful to calculate the tabs dimensions when the viewport sizes are
   * changed (e.i.: window.resize).
   * @private
   * @chainable
   */
  _setDefaultState() {
    this.element.style.position = '';
    this.element.style.width = '';

    return this;
  }

  /**
   * Sets the tabs container `position: fixed` on, emulating the effect found
   * with `position: sticky`.
   * @private
   * @chainable
   */
  _setFixedState() {
    this.element.style.position = 'fixed';
    this.element.style.zIndex = 1;
    this.element.style.width = `${this.stickyElementWidth}px`;
    this.siblingElement.style.paddingTop = `${this.stickyElementHeight}px`;

    return this;
  }
}
