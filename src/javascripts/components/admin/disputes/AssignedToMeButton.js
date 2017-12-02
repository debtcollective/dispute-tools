import Widget from '../../../lib/widget';

export default class AssignedToMeButton extends Widget {
  /**
   * @param {{ queryReference: any, adminId: string, applyFilters: () => void }} config
   */
  constructor(config) {
    super(config);

    this.element.addEventListener('click', e => {
      e.preventDefault();

      if (this.currentlyFiltering) {
        delete this.queryReference.filters.admin_id;
      } else {
        this.queryReference.filters = Object.assign(this.queryReference.filters, {
          admin_id: this.adminId,
        });
      }

      this.applyFilters();
    });
  }

  get currentlyFiltering() {
    return this.queryReference.filters && this.queryReference.filters.admin_id;
  }

  get id() {
    return 'assigned-to-me-button';
  }

  template() {
    return `
      <button id="${this.id}"
        data-current-user-id="${this.adminId}"
        type="button"
        class="-k-btn btn-primary -fw-700">
        ${this.currentlyFiltering ? 'Assigned to any admin' : 'Assigned to me'}
      </button>`;
  }
}
