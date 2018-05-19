import includes from 'lodash/includes';
import Widget from '../lib/widget';

export default class Dropdown extends Widget {
  constructor(config) {
    super(config);

    this.element.classList.remove('-has-dropdown');
    this.headElement = this.element.querySelector('.Dropdown__head');
    this.bodyElement = this.element.querySelector('.Dropdown__body');

    this.headElement.addEventListener('click', this._handleClick);
  }

  _handleClick = () => {
    if (this.active) return this.deactivate();
    return this.activate();
  };

  _handleClickOutside = ({ target: { classList } }) => {
    if (includes(classList, 'Dropdown__label') || includes(classList, 'Dropdown__body')) return;
    this.deactivate();
  };

  activate() {
    this.active = true;
    this.bodyElement.setAttribute('aria-hidden', !this.active);
    document.addEventListener('click', this._handleClickOutside);

    return null;
  }

  deactivate() {
    this.active = false;
    this.bodyElement.setAttribute('aria-hidden', !this.active);
    document.removeEventListener('click', this._handleClickOutside);
    return null;
  }
}
