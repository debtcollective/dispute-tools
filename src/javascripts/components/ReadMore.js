import Widget from '../lib/widget';

export default class ReadMore extends Widget {
  static get defaults() {
    return {
      expanded: false,
      openText: 'Read more',
      closeText: 'Hide',
      collapsedHeight: 0,

      _maxHeight: 10000,
      _registerEvents: true,
    };
  }

  constructor(config) {
    super(config);
    Object.assign(this, this.constructor.defaults, config);

    this.contentElement = this.element.querySelector('[data-readmore-content]');
    this.togglerElement = this.element.querySelector('[data-readmore-toggler]');

    this.collapsedHeight = this.element.dataset.collapsedHeight;
    this.openText = this.togglerElement.textContent;

    this._setMaxHeight();

    if (this._registerEvents) {
      this._bindEvents();
    }
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

    const height = this.contentElement.offsetHeight;

    this._maxHeight = `${height * 2 || this._maxHeight}px`;

    if (!this.expanded) {
      this.contentElement.style.maxHeight = this.collapsedHeight;
    }

    if (height <= parseInt(this.collapsedHeight.replace('px', ''), 10)) {
      this._registerEvents = false;
      this.togglerElement.style.display = 'none';
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
