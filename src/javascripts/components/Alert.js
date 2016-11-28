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

    this._closeHandlerRef = this.deactivate.bind(this);
    this.closeButton.addEventListener('click', this._closeHandlerRef);
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
    this.closeButton.removeEventListener('click', this._closeHandlerRef);
    this._closeHandlerRef = null;

    this.element.removeEventListener('transitionend', this._transitionEndRef);
    this._transitionEndRef = null;

    this.closeButton = null;

    super.destroy();
  }
}
