/* eslint no-console: ["error", { allow: ["warn"] }] */

import mix from './Utils';
import CustomEventSupport from './CustomEventSupport';
import NodeSupport from './NodeSupport';

export default class Widget extends mix(NodeSupport, CustomEventSupport) {
  get _defaults() {
    return {
      element: null,
      active: false,
      disabled: false,
      __destroyed: false,
      data: {},
    };
  }

  constructor(config = {}) {
    super();

    Object.assign(this, this._defaults, config);

    if (this.element === null) {
      const element = document.createElement('div');
      element.insertAdjacentHTML('beforeend', this._getTemplate(this.data));
      this.element = element.firstElementChild;
    }
  }

  template() {
    return '<div></div>';
  }

  _getTemplate(data) {
    return this.template(data);
  }

  activate() {
    if (this.__destroyed === true) {
      console.warn('calling on destroyed object');
    }
    this.dispatch('beforeActivate');
    this._activate();
    this.dispatch('activate');
    return this;
  }

  _activate() {
    this.active = true;
    this.element.classList.add('active');
  }

  deactivate() {
    if (this.__destroyed === true) {
      console.warn('calling on destroyed object');
    }
    this.dispatch('beforeDeactivate');
    this._deactivate();
    this.dispatch('deactivate');
    return this;
  }

  _deactivate() {
    this.active = false;
    this.element.classList.remove('active');
  }

  enable() {
    if (this.__destroyed === true) {
      console.warn('calling on destroyed object');
    }
    this.dispatch('beforeEnable');
    this._enable();
    this.dispatch('enable');
    return this;
  }

  _enable() {
    this.disabled = false;
    this.element.classList.remove('disabled');
  }

  disable() {
    if (this.__destroyed === true) {
      console.warn('calling on destroyed object');
    }
    this.dispatch('beforeDisable');
    this._disable();
    this.dispatch('disable');
    return this;
  }

  _disable() {
    this.disabled = true;
    this.element.classList.add('disabled');
  }

  destroy() {
    if (this.__destroyed) {
      console.warn('calling on destroyed object');
    }
    this.dispatch('beforeDestroy');
    this._destroy();
    this.dispatch('destroy');

    this.eventListeners = null;
    this.__destroyed = true;
    return null;
  }

  _destroy() {
    let childrenLength;

    if (this.element) {
      if (this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }
    }

    if (this.children) {
      childrenLength = this.children.length;
      while (childrenLength > 0) {
        this.children[0].destroy();
        if (this.children.length === childrenLength) {
          this.children.shift();
        }
        childrenLength--;
      }
    }

    if (this.parent) {
      this.parent.removeChild(this);
    }

    this.children = null;
    this.element = null;
  }

  render(element, beforeElement) {
    if (this.__destroyed === true) {
      console.warn('calling on destroyed object');
    }
    this.dispatch('beforeRender', { element, beforeElement });
    this._render(element, beforeElement);
    this.dispatch('render');
    return this;
  }

  _render(element, beforeElement) {
    if (beforeElement) {
      element.insertBefore(this.element, beforeElement);
    } else {
      element.appendChild(this.element);
    }
  }
}
