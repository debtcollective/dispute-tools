export default class CustomEvent {
  constructor (type, data) {
    this.bubbles = true;
    this.cancelable = true;
    this.currentTarget = null;
    this.timeStamp = 0;
    this.target = null;
    this.type = '';
    this.isPropagationStopped = false;
    this.isDefaultPrevented = false;
    this.isImmediatePropagationStopped = false;
    this.areImmediateHandlersPrevented = false;

    this.type = type;
    if (typeof data !== 'undefined') {
      Object.assign(this, data);
    }
  }

  stopPropagation () {
    this.isPropagationStopped = true;
  }

  preventDefault () {
    this.isDefaultPrevented = true;
  }

  stopImmediatePropagation () {
    this.preventImmediateHandlers();
    this.stopPropagation();
  }

  preventImmediateHandlers () {
    this.areImmediateHandlersPrevented = true;
  }
}
