import Widget from '../lib/widget';
import Modal from './Modal';
import Dropdown from './Dropdown';
import UsersNewForm from './users/NewForm';
import SessionsNewForm from './sessions/NewForm';

export default class Header extends Widget {
  constructor(config) {
    super(config);

    if (config.currentUser) {
      return this._handleLoggedUser();
    }

    if (config.currentURL !== '/login' && config.currentURL !== '/signup') {
      return this._handleVisitorUser();
    }

    return this;
  }

  _handleLoggedUser() {
    [].slice.call(this.element.querySelectorAll('[data-component-dropdown]'), 0).forEach(d => {
      return new Dropdown({ element: d });
    });
  }

  _handleVisitorUser() {
    const signupModalElement = document.querySelector('[data-component-modal="signup"]');
    const loginModalElement = document.querySelector('[data-component-modal="login"]');
    const signupLink = this.element.querySelector('.js-header-signup-link');
    const loginLink = this.element.querySelector('.js-header-login-link');

    if (signupModalElement && signupLink) {
      this.appendChild(new Modal({
        name: 'signupModal',
        element: signupModalElement,
      })).appendChild(new UsersNewForm({
        name: 'userNewForm',
        element: signupModalElement.querySelector('[data-component-usernewform]'),
      }));

      signupLink.addEventListener('click',
        this._handleClickHijacking.bind(this, this.signupModal));
    } else {
      throw new Error('Header: signupModalElement || signupLink not found.');
    }

    if (loginModalElement && loginLink) {
      this.appendChild(new Modal({
        name: 'loginModal',
        element: loginModalElement,
      })).appendChild(new SessionsNewForm({
        name: 'sessionsNewForm',
        element: loginModalElement.querySelector('[data-component-sessionsnewform]'),
      }));

      loginLink.addEventListener('click',
        this._handleClickHijacking.bind(this, this.loginModal));
    } else {
      throw new Error('Header: loginModalElement || loginLink not found.');
    }
  }

  _handleClickHijacking(instance, ev) {
    ev.preventDefault();
    instance.activate();
  }
}
