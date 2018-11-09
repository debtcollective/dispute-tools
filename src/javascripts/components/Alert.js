import Widget from '../lib/widget';

export default class Alert extends Widget {
  constructor(config) {
    super(config);
    this.closeButton = this.element.querySelector('.Alert__close');
    this._bindEvents();
  }

  _bindEvents() {
    if (!this.closeButton) {
      return;
    }

    this.deactivate = this.deactivate.bind(this);
    this.closeButton.addEventListener('click', this.deactivate);

    // remove after 3 seconds
    this.autoClose = setTimeout(this.deactivate, 3000);
  }

  /**
   * @override
   */
  deactivate() {
    this.element.setAttribute('aria-hidden', true);

    this._transitionEndRef = this.destroy.bind(this);
    this.element.addEventListener('transitionend', this._transitionEndRef);
  }

  destroy() {
    clearTimeout(this.autoClose);

    this.closeButton.removeEventListener('click', this._closeHandlerRef);
    this._closeHandlerRef = null;

    this.element.removeEventListener('transitionend', this._transitionEndRef);
    this._transitionEndRef = null;

    this.closeButton = null;

    super.destroy();
  }
}
