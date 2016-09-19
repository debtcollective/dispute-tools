import Widget from '../lib/widget';
import { APP, KEYCODES } from '../lib/constants';

export default class ResponsiveMenu extends Widget {
  constructor(config) {
    super(config);
    this.closeButton = this.element.querySelector('.js-close-responsive-menu');
    this._bindEvents();
  }

  _bindEvents() {
    this._clickHandler = this.deactivate.bind(this);
    this.closeButton.addEventListener('click', this._clickHandler);
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
    APP.SCROLLING_BOX.style.overflow = 'hidden';
    ResponsiveMenu._mainElement.setAttribute('aria-hidden', this.active);
    this.element.setAttribute('aria-hidden', !this.active);

    this._keyupHandlerRef = this._keyupHandler.bind(this);
    document.addEventListener('keyup', this._keyupHandlerRef);
  }

  /**
   * @override
   */
  deactivate() {
    this.active = false;
    APP.SCROLLING_BOX.style.overflow = 'auto';
    ResponsiveMenu._mainElement.setAttribute('aria-hidden', this.active);
    this.element.setAttribute('aria-hidden', !this.active);

    document.removeEventListener('keyup', this._keyupHandlerRef);
    this._keyupHandlerRef = null;
  }
}

ResponsiveMenu._mainElement = document.getElementsByTagName('main')[0];
