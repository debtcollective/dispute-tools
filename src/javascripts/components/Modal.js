import Widget from '../lib/widget';

export default class Modal extends Widget {
  constructor(config) {
    super(config);
    this.closeButton = this.element.querySelector('.Modal__close');
    this.bodyElement = this.element.querySelector('.Modal__body');
  }

  activate() {
    super.activate();
    Modal._lastActiveElement = document.activeElement;
    document.body.style.overflow = 'hidden';
    this._clickHandler = this.deactivate.bind(this);
    this.closeButton.addEventListener('click', this._clickHandler);
    this.element.setAttribute('aria-hidden', !this.active);
    this.bodyElement.setAttribute('tabindex', 0);
    this.element.focus();
    return this;
  }

  deactivate() {
    super.deactivate();
    document.body.style.overflow = 'auto';
    this.closeButton.removeEventListener('click', this._clickHandler);
    this._clickHandler = null;
    this.element.setAttribute('aria-hidden', !this.active);
    this.bodyElement.setAttribute('tabindex', -1);
    Modal._lastActiveElement.focus();
    return this;
  }
}

Modal._lastActiveElement = null;
