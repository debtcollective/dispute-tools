import Widget from '../lib/widget';

export default class Tabs extends Widget {
  constructor(config) {
    super(config);

    this.panelPrefixRef = new RegExp(/^panel\-/);
    this.tabs = Array.prototype.slice.call(this.element.querySelectorAll('[role="tab"]'));
    this.panels = Array.prototype.slice.call(this.element.querySelectorAll('[role="tabpanel"]'));

    this._setup()._bindEvents();
  }

  _setup() {
    if (this.updateHash) {
      const ids = this.panels.map(p => { return p.id; });
      const hash = `panel-${window.location.hash.replace('#', '')}`;

      if (ids.indexOf(hash) >= 0) {
        return this._activateTab(hash);
      }
    }

    if (this.defaultTab) {
      return this._activateTab(this.defaultTab);
    }

    return this;
  }

  _bindEvents() {
    this._handleTabClickRef = this._handleTabClick.bind(this);
    for (let i = 0, len = this.tabs.length; i < len; i++) {
      this.tabs[i].addEventListener('click', this._handleTabClickRef);
    }
  }

  _handleTabClick(ev) {
    const id = ev.currentTarget.getAttribute('aria-controls');
    this._activateTab(id);
  }

  _activateTab(id) {
    for (let i = 0, len = this.tabs.length; i < len; i++) {
      this.tabs[i].setAttribute('aria-selected', false);
      this.panels[i].setAttribute('aria-hidden', true);

      if (id === this.tabs[i].getAttribute('aria-controls')) {
        this.tabs[i].setAttribute('aria-selected', true);
        this.panels[i].setAttribute('aria-hidden', false);

        if (this.updateHash) {
          window.location.hash = id.replace(this.panelPrefixRef, '');
        }
      }
    }

    return this;
  }
}
