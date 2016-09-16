import Widget from '../lib/widget';
import ResponsiveMenu from './ResponsiveMenu';
import Modal from './Modal';
import Dropdown from './Dropdown';
import { APP } from '../lib/constants';
import UsersNewForm from './users/NewForm';
import SessionsNewForm from './sessions/NewForm';

const SCROLL_MAX = 200;

function normalize(value, minx, maxx, min, max) {
  const a = (maxx - minx) / (max - min);
  const b = maxx - (a * max);
  return (a * value) + b;
}

export default class Header extends Widget {
  constructor(config) {
    super(config);

    this.bg = this.element.querySelector('.Header__bg');
    this.hamburgerMenuElement = this.element.querySelector('.js-hamburger-menu');

    this.appendChild(new ResponsiveMenu({
      name: 'ResponsiveMenu',
      element: document.querySelector('.ResponsiveMenu'),
    }));

    this._bindEvents();

    const _scrollPosition = APP.SCROLLING_BOX.scrollTop;
    APP.SCROLLING_BOX.scrollTop = (_scrollPosition - 1);

    if (config.currentUser) {
      return this._handleLoggedUser();
    }

    if (['/login', '/signup', '/users'].indexOf(config.currentURL) === -1) {
      return this._handleVisitorUser();
    }

    return this;
  }

  _bindEvents() {
    this._handleScrollRef = this._handleScroll.bind(this);
    window.addEventListener('scroll', this._handleScrollRef);

    this._handleHamburgerMenuClickRef = this._handleHamburgerMenuClick.bind(this);
    this.hamburgerMenuElement.addEventListener('click', this._handleHamburgerMenuClickRef);
  }

  _handleScroll(ev) {
    let p = ev.target.defaultView.scrollY;
    if (p > SCROLL_MAX) p = SCROLL_MAX;
    this.bg.style.opacity = normalize(p, 0, 1, 0, SCROLL_MAX);
  }

  _handleHamburgerMenuClick() {
    this.ResponsiveMenu.activate();
  }

  _handleLoggedUser() {
    [].slice.call(this.element.querySelectorAll('[data-component-dropdown]'), 0).forEach(d => {
      return new Dropdown({ element: d });
    });
  }

  _handleVisitorUser() {
    const signupModalElement = document.querySelector('[data-component-modal="signup"]');
    const loginModalElement = document.querySelector('[data-component-modal="login"]');
    const signupLinks = [].slice.call(document.querySelectorAll('.js-signup-link'));
    const loginLinks = [].slice.call(document.querySelectorAll('.js-login-link'));

    if (signupModalElement && signupLinks.length) {
      this.appendChild(new Modal({
        name: 'signupModal',
        element: signupModalElement,
      })).appendChild(new UsersNewForm({
        name: 'userNewForm',
        element: signupModalElement.querySelector('[data-component-usernewform]'),
      }));

      signupLinks.forEach(link => {
        link.addEventListener('click', this._handleClickHijacking.bind(this, this.signupModal));
      });
    } else {
      throw new Error('Header: signupModalElement || signupLinks not found.');
    }

    if (loginModalElement && loginLinks.length) {
      this.appendChild(new Modal({
        name: 'loginModal',
        element: loginModalElement,
      })).appendChild(new SessionsNewForm({
        name: 'sessionsNewForm',
        element: loginModalElement.querySelector('[data-component-sessionsnewform]'),
      }));

      loginLinks.forEach(link => {
        link.addEventListener('click', this._handleClickHijacking.bind(this, this.loginModal));
      });
    } else {
      throw new Error('Header: loginModalElement || loginLinks not found.');
    }
  }

  _handleClickHijacking(instance, ev) {
    ev.preventDefault();
    instance.activate();
  }
}
