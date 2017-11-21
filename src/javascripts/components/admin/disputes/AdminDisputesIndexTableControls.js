import Widget from '../../../lib/widget';

export default class AdminDisputesIndexTableControls extends Widget {
  constructor(config) {
    super(config);

    this.searchInput = this.element.querySelector('[name="disputesListValue[search]"]');
    this.readableIdInput = this.element.querySelector('[name="disputesListValue[readableId]"]');
    this.toolsSelect = this.element.querySelector('[name="disputesListValue[tools]"]');
    this.statusSelect = this.element.querySelector('[name="disputesListValue[status]"]');
    this.orderSelect = this.element.querySelector('[name="disputesListValue[order]"]');

    this.applyFiltersBtn = this.element.querySelector('[name="disputesListValue[applyFilters]"]');
    this.resetFiltersBtn = this.element.querySelector('[name="disputesListValue[resetFilters]"]');

    this._bindEvents();
  }

  _bindEvents() {
    this.searchInput.addEventListener('input', ev => {
      this.dispatch('searchInput', {
        value: ev.target.value.toLowerCase(),
      });
    });

    this.toolsSelect.addEventListener('change', ev => {
      this.dispatch('toolsChange', {
        value: ev.target.value,
      });
    });

    this.statusSelect.addEventListener('change', ev => {
      this.dispatch('statusChange', {
        value: ev.target.value,
      });
    });

    this.orderSelect.addEventListener('change', ev => {
      this.dispatch('orderChange', {
        value: ev.target.value,
      });
    });

    this.readableIdInput.oninput = ev => {
      this.dispatch('readableIdInput', {
        value: ev.target.value,
      });
    };

    this.applyFiltersBtn.addEventListener('click', () => {
      this.dispatch('applyFilters');
    });

    this.resetFiltersBtn.addEventListener('click', () => {
      this.dispatch('resetFilters');
    });
  }

  enableApplyButton() {
    this.applyFiltersBtn.removeAttribute('disabled');
  }

  disableApplyButton() {
    this.applyFiltersBtn.setAttribute('disabled', true);
  }
}
