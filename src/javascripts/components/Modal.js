import Widget from '../lib/widget';

export default class Modal extends Widget {
  constructor(config) {
    super(config);
    this.closeButton = this.element.querySelector('.Modal__close');
  }

  /**
  * @override
  */
  activate() {
    this.active = true;

    Modal._lastActiveElement = document.activeElement;

    Modal._scrollableElement.style.overflow = 'hidden';
    Modal._mainElement.setAttribute('aria-hidden', this.active);
    this.element.setAttribute('aria-hidden', !this.active);

    this._clickHandler = this.deactivate.bind(this);
    this.closeButton.addEventListener('click', this._clickHandler);

    return this;
  }

  /**
  * @override
  */
  deactivate() {
    this.active = false;

    Modal._scrollableElement.style.overflow = 'auto';
    Modal._mainElement.setAttribute('aria-hidden', this.active);
    this.element.setAttribute('aria-hidden', !this.active);

    this.closeButton.removeEventListener('click', this._clickHandler);
    this._clickHandler = null;

    requestAnimationFrame(() => {
      Modal._lastActiveElement.focus();
    });

    return this;
  }
}

Modal._mainElement = document.getElementsByTagName('main')[0];
Modal._scrollableElement = document.body;
Modal._lastActiveElement = null;
