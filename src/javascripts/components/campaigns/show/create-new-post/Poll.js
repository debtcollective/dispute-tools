import Widget from '../../../../lib/widget';
import PollOption from './PollOption';

export default class Poll extends Widget {
  constructor(config) {
    super(config);

    this._pollOptions = document.getElementsByName('pollOption');

    this._bindEvents();
  }

  getOptionValues() {
    return Array.prototype.slice.call(this._pollOptions)
      .filter(option => option.value)
      .map(option => option.value);
  }

  getFirstOption() {
    return this._pollOptions[0];
  }

  _bindEvents() {
    this._focusInputHandlerRef = this._focusInputHandler.bind(this);
    this.element.addEventListener('focus', this._focusInputHandlerRef, true);

    return this;
  }

  _focusInputHandler(ev) {
    const target = ev.target;
    const lastOption = this._pollOptions[this._pollOptions.length - 1];

    if (target === lastOption) {
      this._appendNewInput();
    }
  }

  _appendNewInput() {
    this.appendChild(new PollOption({
      name: `Option-${this._pollOptions.length + 1}`,
    })).render(this.element);
  }
}
