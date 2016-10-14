import Widget from '../../../lib/widget';

export default class AdminDisputesIndexTableControls extends Widget {
  constructor(config) {
    super(config);

    this.searchInputParent = this.element.querySelector('.js-search-input-parent');
    this.searchInput = this.searchInputParent.querySelector('[name="disputesListValue[search]"]');

    this.toolsSelectParent = this.element.querySelector('.js-tool-select-parent');
    this.toolsSelect = this.toolsSelectParent.querySelector('[name="disputesListValue[tools]"]');
    this.toolsSelectOptions = [].slice.call(this.toolsSelect.options);

    this.statusSelectParent = this.element.querySelector('.js-status-select-parent');
    this.statusSelect = this.statusSelectParent.querySelector('[name="disputesListValue[status]"]');
    this.statusSelectOptions = [].slice.call(this.statusSelect.options);

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
