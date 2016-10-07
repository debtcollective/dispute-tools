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

    this.resetFiltersBtn = this.element.querySelector('[name="disputesListValue[resetFilters]"]');

    this._bindEvents();
  }

  _bindEvents() {
    this.searchInput.addEventListener('input', ev => {
      const v = ev.target.value.toLowerCase();
      this.searchInputParent.classList[v ? 'add' : 'remove']('-bg-accent');
      this.dispatch('searchInput', { value: v });
    });

    this.toolsSelect.addEventListener('change', ev => {
      const v = ev.target.value;
      this.toolsSelectParent.classList[v ? 'add' : 'remove']('-bg-accent');
      this.dispatch('toolsChange', { value: v });
    });

    this.statusSelect.addEventListener('change', ev => {
      const v = ev.target.value;
      this.statusSelectParent.classList[v ? 'add' : 'remove']('-bg-accent');
      this.dispatch('statusChange', { value: v });
    });

    this.resetFiltersBtn.addEventListener('click', () => {
      this.searchInput.value = '';
      this.toolsSelectOptions[0].selected = true;
      this.statusSelectOptions[0].selected = true;

      this.searchInputParent.classList.remove('-bg-accent');
      this.toolsSelectParent.classList.remove('-bg-accent');
      this.statusSelectParent.classList.remove('-bg-accent');

      this.dispatch('resetFilters');
    });
  }

  updateToolsDropdownOptionsState(ids) {
    for (let i = 1, len = this.toolsSelectOptions.length; i < len; i++) {
      if (ids.indexOf(this.toolsSelectOptions[i].value) > -1) {
        this.toolsSelectOptions[i].disabled = false;
      } else {
        this.toolsSelectOptions[i].disabled = true;
      }
    }

    return this;
  }

  updateStatusDropdownOptionsState(ids) {
    for (let i = 1, len = this.statusSelectOptions.length; i < len; i++) {
      if (ids.indexOf(this.statusSelectOptions[i].value) > -1) {
        this.statusSelectOptions[i].disabled = false;
      } else {
        this.statusSelectOptions[i].disabled = true;
      }
    }

    return this;
  }

  showResetButton() {
    this.resetFiltersBtn.setAttribute('aria-hidden', false);
    return this;
  }

  hideResetButton() {
    this.resetFiltersBtn.setAttribute('aria-hidden', true);
    return this;
  }
}
