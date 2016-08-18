import CustomEvent from './CustomEvent';

export default class CustomEventSupport {
  bind(type, eventHandler) {
    let found;

    if (!this._eventListeners) {
      this._eventListeners = {};
    }

    if (!this._eventListeners[type]) {
      this._eventListeners[type] = [];
    }

    found = false;

    const listeners = this._eventListeners[type];

    for (let i = 0; i < listeners.length; i++) {
      if (listeners[i] === eventHandler) {
        found = true;
        break;
      }
    }

    if (!found) {
      this._eventListeners[type].push(eventHandler);
    }

    return this;
  }

  unbind(type, eventHandler) {
    let i;
    let found;

    found = false;
    i = 0;

    if (!this._eventListeners) {
      this._eventListeners = {};
    }

    if (typeof eventHandler === 'undefined') {
      this._eventListeners[type] = [];
    }

    const listeners = this._eventListeners[type] || [];

    for (i = 0; i < listeners.length; i++) {
      if (listeners[i] === eventHandler) {
        found = true;
        break;
      }
    }

    if (found) {
      this._eventListeners[type].splice(i, 1);
    }

    return this;
  }

  dispatch(type, data) {
    if (!this._eventListeners) {
      this._eventListeners = {};
    }

    if (typeof data === 'undefined') {
      data = {};
    }

    if (Object.prototype.hasOwnProperty.call(data, 'target') === false) {
      data.target = this;
    }

    const event = new CustomEvent(type, data);
    const listeners = this._eventListeners[type] || [];
    const instance = this;

    for (let i = 0; i < listeners.length; i++) {
      listeners[i].call(instance, event);
      if (event.areImmediateHandlersPrevented === true) {
        break;
      }
    }

    return event;
  }
}
