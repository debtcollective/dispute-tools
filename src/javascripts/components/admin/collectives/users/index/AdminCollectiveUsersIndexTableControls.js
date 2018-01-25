import Widget from '../../../../../lib/widget';

export default class AdminCollectiveUsersIndexTableControls extends Widget {
  constructor(config) {
    super(config);

    this.campaignSelect = this.element.querySelector(
      '[name="usersListValue[campaign]"]',
    );
    this.searchInput = this.element.querySelector(
      '[name="usersListValue[search]"]',
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

    this.campaignSelect.addEventListener('change', ev => {
      this.dispatch('campaignChange', {
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
