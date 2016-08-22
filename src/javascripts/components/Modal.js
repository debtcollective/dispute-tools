import Widget from '../lib/widget';
import { APP, KEYCODES } from '../lib/constants';

export default class Modal extends Widget {
  constructor(config) {
    super(config);
    this.closeButton = this.element.querySelector('.Modal__close');
  }

  _keyupHandler(ev) {
    if (ev.which === KEYCODES.ESC) {
      this.deactivate();
    }
  }

  /**
  * @override
  */
  activate() {
    this.active = true;

    Modal._lastActiveElement = document.activeElement;

    APP.SCROLLING_BOX.style.overflow = 'hidden';
    Modal._mainElement.setAttribute('aria-hidden', this.active);
    this.element.setAttribute('aria-hidden', !this.active);

    this._clickHandler = this.deactivate.bind(this);
    this.closeButton.addEventListener('click', this._clickHandler);

    this._keyupHandlerRef = this._keyupHandler.bind(this);
    document.addEventListener('keyup', this._keyupHandlerRef);

    return this;
  }

  /**
  * @override
  */
  deactivate() {
    this.active = false;

    APP.SCROLLING_BOX.style.overflow = 'auto';
    Modal._mainElement.setAttribute('aria-hidden', this.active);
    this.element.setAttribute('aria-hidden', !this.active);

    this.closeButton.removeEventListener('click', this._clickHandler);
    this._clickHandler = null;

    document.removeEventListener('keyup', this._keyupHandlerRef);
    this._keyupHandlerRef = null;

    requestAnimationFrame(() => {
      Modal._lastActiveElement.focus();
    });

    return this;
  }
}

Modal._mainElement = document.getElementsByTagName('main')[0];
Modal._lastActiveElement = null;
