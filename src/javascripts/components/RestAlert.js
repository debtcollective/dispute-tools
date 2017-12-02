import Widget from '../lib/widget';

export default class RestAlert extends Widget {
  /**
   * @typedef {'success'|'warning'|'error'} AlertType
   */

  /**
   *
   * @param {{ containerRef: Element, type: AlertType, message: string, key?: string }} config
   */
  constructor(config) {
    super(config);

    this.closeButton = this.element.querySelector('.Alert__close');

    this._destroyRef = this.destroy.bind(this);
    this.closeButton.addEventListener('click', this._destroyRef);
    this.element.addEventListener('transitionend', this._destroyRef);

    this.containerRef.style.visibility = 'visible';
    this.containerRef.appendChild(this.element).focus();

    this.animate();
  }

  /**
   * @override
   */
  destroy() {
    this.closeButton.removeEventListener('click', this._destroyRef);
    this.element.removeEventListener('transitionend', this._destroyRef);
    this.containerRef.style.visibility = 'hidden';

    delete this._destroyRef;

    super.destroy();
  }

  static get closeButton() {
    return `
      <button class="Alert__close" aria-label="close">
        <svg><use xlink:href="#svg-close"></use></svg>
      </button>
    `;
  }

  template() {
    return `
      <div class="Alert wrapper center -fw-500 -${this.type}">
        ${RestAlert.closeButton}
        <p>${this.message}</p>
      </div>
    `;
  }

  /**
   * Triggers the first frame of the transition animation so that the
   * css animations for .Alert will being to take effect
   */
  animate() {
    window.setTimeout(() => {
      requestAnimationFrame(() => this._frame());
    }, 1500);
  }

  _frame() {
    if (this.element) {
      this.element.style.opacity -= 0.01;
      this.element.style.transform = `scale(${this.element.style.opacity})`;
      // From here the css transition will take effect
    }
  }
}
