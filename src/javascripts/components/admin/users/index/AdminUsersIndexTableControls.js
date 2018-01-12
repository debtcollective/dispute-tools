import Widget from '../../../../lib/widget';

export default class AdminUsersIndexTableControls extends Widget {
  constructor(config) {
    super(config);

    this.searchInput = this.element.querySelector(
      '[name="usersListValue[search]"]',
    );
    this.stateSelect = this.element.querySelector(
      '[name="usersListValue[state]"]',
    );
    this.roleSelect = this.element.querySelector(
      '[name="usersListValue[role]"]',
    );
    this.orderSelect = this.element.querySelector(
      '[name="usersListValue[order]"]',
    );

    this.applyFiltersBtn = this.element.querySelector(
      '[name="usersListValue[applyFilters]"]',
    );
    this.resetFiltersBtn = this.element.querySelector(
      '[name="usersListValue[resetFilters]"]',
    );

    this._bindEvents();
  }

  _bindEvents() {
    this.searchInput.addEventListener('input', ev => {
      this.dispatch('searchInput', {
        value: ev.target.value.toLowerCase(),
      });
    });

    this.stateSelect.addEventListener('change', ev => {
      this.dispatch('stateChange', {
        value: ev.target.value,
      });
    });

    this.roleSelect.addEventListener('change', ev => {
      this.dispatch('roleChange', {
        value: ev.target.value,
      });
    });

    this.orderSelect.addEventListener('change', ev => {
      this.dispatch('orderChange', {
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
