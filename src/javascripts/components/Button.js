import Widget from '../lib/widget';

export default class Button extends Widget {
  constructor(config) {
    super(config);
    this._text = this.element.textContent;
  }

  /**
   * Changes the button text.
   * @public
   * @param {string} [text=Sending...] - Button text
   */
  updateText(text = 'Sending...') {
    this.element.textContent = text;
    return this;
  }

  /**
   * Restores the button text to its initial value.
   * @public
   */
  restoreText() {
    this.element.textContent = this._text;
    return this;
  }

  /**
   * Enables the button.
   * @override
   */
  enable() {
    this.disabled = false;
    this.element.disabled = this.disabled;
    return this;
  }

  /**
   * Disables the button.
   * @override
   */
  disable() {
    this.disabled = true;
    this.element.disabled = this.disabled;
    return this;
  }
}
