import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed';
import Widget from '../lib/widget';

export default class ConfirmInline extends Widget {
  static _createBackdrop() {
    ConfirmInline.backdrop = document.createElement('div');
    ConfirmInline.backdrop.className = 'ConfirmInline__backdrop';
  }

  template(data) {
    return `
      <div class="ConfirmInline">
        <div class="ConfirmInline__body p2">
          <p class="-fw-500">${data.text}</p>
          <div class="pt2">
            <button data-btn-cancel class="-k-btn -sm btn-light -fw-700 mr1">
              ${data.cancelButtonText}
            </button>
            <button data-btn-ok class="-k-btn -sm btn-primary -fw-700">
              ${data.okButtonText}
            </button>
          </div>
        </div>
      </div>`;
  }

  constructor(config) {
    super(config);

    if (!ConfirmInline.backdrop) {
      ConfirmInline._createBackdrop();
    }

    this.cancelBtn = this.element.querySelector('[data-btn-cancel]');
    this.okBtn = this.element.querySelector('[data-btn-ok]');

    this._bindEvents();
  }

  _bindEvents() {
    this._handleCancelClickRef = this._handleCancelClick.bind(this);
    this.cancelBtn.addEventListener('click', this._handleCancelClickRef);

    this._handleOkClickRef = this._handleOkClick.bind(this);
    this.okBtn.addEventListener('click', this._handleOkClickRef);
  }

  _handleCancelClick(ev) {
    ev.preventDefault();
    this.dispatch('onCancel');
    this.deactivate();
  }

  _handleOkClick(ev) {
    ev.preventDefault();
    this.dispatch('onOk');
    this.deactivate();
  }

  activate() {
    scrollIntoViewIfNeeded(this.element, false, {
      duration: 150,
    });
    this.active = true;
    this.element.appendChild(ConfirmInline.backdrop);
    ConfirmInline._activeInstance = this;

    requestAnimationFrame(() => {
      ConfirmInline.backdrop.classList.add('active');
    });

    return null;
  }

  deactivate() {
    this.active = false;
    this.element.removeChild(ConfirmInline.backdrop);
    ConfirmInline.backdrop.classList.remove('active');
    ConfirmInline._activeInstance = null;
    this.destroy();
    return null;
  }

  destroy() {
    this.cancelBtn.removeEventListener('click', this._handleCancelClickRef);
    this._handleCancelClickRef = null;

    this.okBtn.removeEventListener('click', this._handleOkClickRef);
    this._handleOkClickRef = null;

    super.destroy();
  }
}

ConfirmInline._backdrop = null;
ConfirmInline._activeInstance = null;
