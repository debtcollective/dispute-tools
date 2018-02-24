import Widget from '../lib/widget';
import ResponsiveMenu from './ResponsiveMenu';
import Dropdown from './Dropdown';

export default class Header extends Widget {
  constructor(config) {
    super(config);

    this.bg = this.element.querySelector('.Header__bg');
    this.hamburgerMenuElement = this.element.querySelector('.js-hamburger-menu');

    this.appendChild(
      new ResponsiveMenu({
        name: 'ResponsiveMenu',
        element: document.querySelector('.ResponsiveMenu'),
      }),
    );

    this._bindEvents();

    if (config.currentUser) {
      return this._handleLoggedUser();
    }

    if (['/login', '/signup', '/users'].indexOf(config.currentURL) === -1) {
      return this._handleVisitorUser();
    }

    return this;
  }

  _bindEvents() {
    this._handleHamburgerMenuClickRef = this._handleHamburgerMenuClick.bind(this);
    this.hamburgerMenuElement.addEventListener('click', this._handleHamburgerMenuClickRef);
  }

  _handleHamburgerMenuClick() {
    this.ResponsiveMenu.activate();
  }

  _handleLoggedUser() {
    [].slice
      .call(this.element.querySelectorAll('[data-component-dropdown]'), 0)
      .forEach(d => new Dropdown({ element: d }));
  }

  _handleVisitorUser() {}

  _handleClickHijacking(instance, ev) {
    ev.preventDefault();
    instance.activate();
  }
}
