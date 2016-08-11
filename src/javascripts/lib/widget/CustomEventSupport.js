import CustomEvent from './CustomEvent';

export default class CustomEventSupport {
  bind(type, eventHandler) {
    let found, listeners;

    if (!this._eventListeners) {
      this._eventListeners = {};
    }

    if (!this._eventListeners[type]) {
      this._eventListeners[type] = [];
    }

    found = false;

    listeners = this._eventListeners[type];
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
    let i, found, listeners;

    found = false;
    i = 0;

    if (!this._eventListeners) {
      this._eventListeners = {};
    }

    if (typeof eventHandler == 'undefined') {
      this._eventListeners[type] = [];
    }

    listeners = this._eventListeners[type] || [];
    for (i = 0; i < listeners.length; i++) {
      if(listeners[i] == eventHandler) {
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
    let event, listeners, instance, i;

    if (!this._eventListeners) {
      this._eventListeners = {};
    }

    if (typeof data === 'undefined') {
      data = {};
    }

    if (data.hasOwnProperty('target') === false) {
      data.target = this;
    }

    event = new CustomEvent(type, data);
    listeners = this._eventListeners[type] || [];
    instance = this;

    for (i = 0; i < listeners.length; i = i + 1) {
      listeners[i].call(instance, event);
      if (event.areImmediateHandlersPrevented === true) {
        break;
      }
    }

    return event;
  }
}
