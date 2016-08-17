import Widget from '../lib/widget';
import Modal from '../components/Modal';
import Dropdown from '../components/Dropdown';

export default class Header extends Widget {
  constructor(config) {
    super(config);

    [].slice.call(document.querySelectorAll('[data-component-dropdown]'), 0).forEach(d => {
      return new Dropdown({ element: d });
    });

    if (config.currentUser) return this._handleLoggedUser();
    return this._handleVisitorUser();
  }

  _handleLoggedUser() {
    // register dropdown
    throw new Error('_handleLoggedUser not implemented');
  }

  _handleVisitorUser() {
    this._hijackSignupLink();
  }

  _hijackSignupLink() {
    const signupLink = this.element.querySelector('.js-header-signup-link');
    const signupModalElement = document.querySelector('[data-component-modal="signup"]');

    if (signupModalElement) {
      this.signupModalInstance = new Modal({ element: signupModalElement });
      signupLink.addEventListener('click', this._handleSignupClick.bind(this));
    }
  }

  _handleSignupClick(ev) {
    ev.preventDefault();
    this.signupModalInstance.activate();
  }
}
