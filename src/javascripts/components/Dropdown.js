import Widget from '../lib/widget';

export default class Dropdown extends Widget {
  static _createBackdrop() {
    Dropdown.backdrop = document.createElement('div');
    Dropdown.backdrop.className = 'Dropdown__backdrop';
    Dropdown.backdrop.addEventListener('click', Dropdown._handleBackdropClick);
  }

  static _handleBackdropClick() {
    Dropdown._activeDropdown.deactivate();
  }

  constructor(config) {
    super(config);

    if (!Dropdown.backdrop) Dropdown._createBackdrop();

    this.element.classList.remove('-has-dropdown');
    this.headElement = this.element.querySelector('.Dropdown__head');
    this.bodyElement = this.element.querySelector('.Dropdown__body');

    this.headElement.addEventListener('click', this._handleClick.bind(this));
  }

  _handleClick() {
    if (this.active) return this.deactivate();
    return this.activate();
  }

  activate() {
    super.activate();
    this.bodyElement.setAttribute('aria-hidden', !this.active);
    this.element.appendChild(Dropdown.backdrop);
    Dropdown._scrollableElement.style.overflow = 'hidden';
    Dropdown._activeDropdown = this;
    return null;
  }

  deactivate() {
    super.deactivate();
    this.bodyElement.setAttribute('aria-hidden', !this.active);
    this.element.removeChild(Dropdown.backdrop);
    Dropdown._scrollableElement.style.overflow = 'auto';
    Dropdown._activeDropdown = null;
    return null;
  }
}

Dropdown._backdrop = null;
Dropdown._scrollableElement = document.body;
Dropdown._activeDropdown = null;
