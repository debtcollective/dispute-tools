import Widget from '../lib/widget';

export default class ReadMore extends Widget {
  static get defaults() {
    return {
      expanded: false,
      openText: 'Read more',
      closeText: 'Close',
      collapsedHeight: 0,

      _maxHeight: '10000px',
    };
  }

  constructor(config) {
    super(config);
    Object.assign(this, this.constructor.defaults, config);

    this.contentElement = this.element.querySelector('[data-readmore-content]');
    this.togglerElement = this.element.querySelector('[data-readmore-toggler]');

    this._bindEvents()._setMaxHeight();
  }

  _bindEvents() {
    this._togglerHandlerRef = this._togglerHandler.bind(this);
    this.togglerElement.addEventListener('click', this._togglerHandlerRef);

    return this;
  }

  _unbindEvents() {
    this.togglerElement.removeEventListener('click', this._togglerHandlerRef);
    this._togglerHandlerRef = null;

    return this;
  }

  _setMaxHeight() {
    this.contentElement.style.maxHeight = '';
    this._maxHeight = `${this.contentElement.offsetHeight * 2}px`;

    if (!this.expanded) {
      this.contentElement.style.maxHeight = this.collapsedHeight;
    }

    return this;
  }

  _togglerHandler(ev) {
    ev.preventDefault();
    this.toggle();
  }

  _updateText(text) {
    if (!text) return;

    this.togglerElement.textContent = text;
  }

  toggle() {
    if (this.expanded) {
      this.contentElement.style.maxHeight = this.collapsedHeight;
      this._updateText(this.openText);
    } else {
      this.contentElement.style.maxHeight = this._maxHeight;
      this._updateText(this.closeText);
    }

    this.expanded = !this.expanded;
    this.contentElement.setAttribute('aria-expanded', this.expanded);
  }
}
