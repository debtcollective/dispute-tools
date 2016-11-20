import debounce from 'lodash/debounce';
import Widget from '../../lib/widget';

export default class CollectiveStickyTabs extends Widget {
  constructor(config) {
    super(config);

    this.state = {
      default: true,
      sticky: false,
    };

    this.stickyElement = this.element;
    this.siblingElement = this.stickyElement.nextElementSibling;
    this.stickySection = document.querySelector('[data-hit-sticky]');
    this.headerElement = document.querySelector('.Header');

    this.headerHeight = 0;
    this.stickyElementHeight = 0;
    this.stickyElementWidth = 0;

    this._setup()._bindEvents();
  }

  /**
   * Updates the variables that relies on the viewport size and will be used
   * when toggling the `sticky` state of the tabs.
   * @private
   * @chainable
   */
  _setup() {
    this.headerHeight = this.headerElement.offsetHeight;
    this.stickyElementHeight = this.stickyElement.offsetHeight;
    this.stickyElementWidth = this.stickyElement.offsetWidth;

    return this;
  }

  _bindEvents() {
    this._resizeHandlerRef = this._resizeHandler.bind(this);
    window.addEventListener('resize', debounce(this._resizeHandlerRef, 200));

    this._scrollHandlerRef = this._scrollHandler.bind(this);
    window.addEventListener('scroll', this._scrollHandlerRef);
  }

  _resizeHandler() {
    this.state = {
      default: false,
      sticky: false,
    };

    this._setDefaultState()
      ._setup()
      ._scrollHandler();
  }

  /**
   * `window.scroll` event handler.
   * Checks if the tabs‘ `position: fixed` needs to be toggle using
   * document method `elementFromPoint`.
   * @private
   */
  _scrollHandler() {
    const p = document.elementFromPoint(0, this.headerHeight);

    if (p === this.stickySection) {
      if (this.state.sticky) {
        return this;
      }

      return this._setStickyState();
    }

    if (this.state.default) {
      return this;
    }

    return this._setDefaultState();
  }

  /**
   * Sets the tabs container to its initial position.
   * @private
   * @chainable
   */
  _setDefaultState() {
    this.state.default = true;
    this.state.sticky = false;

    this.stickyElement.style.position = '';
    this.stickyElement.style.zIndex = '';
    this.stickyElement.style.top = '';
    this.stickyElement.style.width = '';
    this.siblingElement.style.paddingTop = '';

    return this;
  }

  /**
   * Sets the tabs container `position: fixed` on, emulating the effect found
   * with `position: sticky`.
   * @private
   * @chainable
   */
  _setStickyState() {
    this.state.sticky = true;
    this.state.default = false;

    this.stickyElement.style.position = 'fixed';
    this.stickyElement.style.zIndex = 1;
    this.stickyElement.style.top = `${this.headerHeight}px`;
    this.stickyElement.style.width = `${this.stickyElementWidth}px`;
    this.siblingElement.style.paddingTop = `${this.stickyElementHeight}px`;

    return this;
  }
}
