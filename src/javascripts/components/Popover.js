import Widget from '../lib/widget';
import { APP } from '../lib/constants';

export default class Popover extends Widget {
  static _createBackdrop() {
    Popover.backdrop = document.createElement('div');
    Popover.backdrop.className = 'Popover__backdrop';
    Popover.backdrop.addEventListener('click', Popover._handleBackdropClick);
  }

  static _handleBackdropClick() {
    Popover._activeDropdown.deactivate();
  }

  constructor(config) {
    super(config);

    if (!Popover.backdrop) {
      Popover._createBackdrop();
    }

    this.closeButton = this.element.querySelector('.-k-popover__close');

    this._bindEvents();
  }

  _bindEvents() {
    this._handleCloseClickRef = this.deactivate.bind(this);
    this.closeButton.addEventListener('click', this._handleCloseClickRef);
  }

  appendTo(element) {
    element.classList.add('-k-has-popover');
    element.appendChild(this.element);
  }

  activate() {
    this.active = true;
    APP.SCROLLING_BOX.style.overflow = 'hidden';
    this.element.setAttribute('aria-hidden', !this.active);
    this.element.parentElement.appendChild(Popover.backdrop);
    Popover._activeDropdown = this;
    return null;
  }

  /**
   * @override
   */
  deactivate() {
    this.active = false;
    APP.SCROLLING_BOX.style.overflow = 'auto';
    this.element.setAttribute('aria-hidden', true);
    this.element.parentElement.removeChild(Popover.backdrop);
    Popover._activeDropdown = null;

    this._transitionEndRef = this.destroy.bind(this);
    this.element.addEventListener('transitionend', this._transitionEndRef);

    return null;
  }

  destroy() {
    this.closeButton.removeEventListener('click', this._closeHandlerRef);
    this._handleCloseClickRef = null;

    this.element.removeEventListener('transitionend', this._transitionEndRef);
    this._transitionEndRef = null;

    this.closeButton = null;

    super.destroy();
  }
}

Popover._backdrop = null;
Popover._activeDropdown = null;
