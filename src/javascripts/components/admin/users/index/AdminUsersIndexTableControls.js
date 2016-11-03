import Widget from '../../../../lib/widget';

export default class AdminUsersIndexTableControls extends Widget {
  constructor(config) {
    super(config);

    this.nameInput = this.element.querySelector('[name="usersListValue[name]"]');
    this.emailInput = this.element.querySelector('[name="usersListValue[email]"]');
    this.zipInput = this.element.querySelector('[name="usersListValue[zip]"]');
    this.stateSelect = this.element.querySelector('[name="usersListValue[state]"]');
    this.roleSelect = this.element.querySelector('[name="usersListValue[role]"]');
    this.orderSelect = this.element.querySelector('[name="usersListValue[order]"]');

    this.applyFiltersBtn = this.element.querySelector('[name="usersListValue[applyFilters]"]');
    this.resetFiltersBtn = this.element.querySelector('[name="usersListValue[resetFilters]"]');

    this._bindEvents();
  }

  _bindEvents() {
    this.nameInput.addEventListener('input', ev => {
      this.dispatch('nameInput', {
        value: ev.target.value.toLowerCase(),
      });
    });

    this.emailInput.addEventListener('input', ev => {
      this.dispatch('emailInput', {
        value: ev.target.value.toLowerCase(),
      });
    });

    this.zipInput.addEventListener('input', ev => {
      this.dispatch('zipInput', {
        value: ev.target.value,
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
