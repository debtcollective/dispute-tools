import Widget from '../../../../lib/widget';
import AdminUsersIndexTableControls from './AdminUsersIndexTableControls';

export default class AdminUsersIndexController extends Widget {
  constructor(config) {
    super(config);

    this.appendChild(new AdminUsersIndexTableControls({
      name: 'AdminUsersIndexTableControls',
      element: document.querySelector('thead'),
    }));

    this.originalQuery = {
      filters: {
        email: this.AdminUsersIndexTableControls.emailInput.value,
        role: this.AdminUsersIndexTableControls.roleSelect.value,
      },
      name: this.AdminUsersIndexTableControls.nameInput.value,
      zip: this.AdminUsersIndexTableControls.zipInput.value,
      state: this.AdminUsersIndexTableControls.stateSelect.value,
      order: this.AdminUsersIndexTableControls.orderSelect.value,
    };

    this._query = JSON.parse(JSON.stringify(this.originalQuery));

    this.pagination = document.querySelector('.Pagination ul');

    this._bindEvents();
  }

  _bindEvents() {
    this.AdminUsersIndexTableControls.bind('nameInput', data => {
      this._query.name = data.value;
      this._updateApplyButton();
    });

    this.AdminUsersIndexTableControls.bind('emailInput', data => {
      this._query.filters.email = data.value;
      this._updateApplyButton();
    });

    this.AdminUsersIndexTableControls.bind('zipInput', data => {
      this._query.zip = data.value;
      this._updateApplyButton();
    });

    this.AdminUsersIndexTableControls.bind('stateChange', data => {
      this._query.state = data.value;
      this._updateApplyButton();
    });

    this.AdminUsersIndexTableControls.bind('roleChange', data => {
      this._query.filters.role = data.value;
      this._updateApplyButton();
    });

    this.AdminUsersIndexTableControls.bind('orderChange', data => {
      this._query.order = data.value;
      this._updateApplyButton();
    });

    this.AdminUsersIndexTableControls.bind('applyFilters', () => {
      const search = this._serialize(this._query);
      window.location.replace(`?${search}`);
    });

    this.AdminUsersIndexTableControls.bind('resetFilters', () => {
      window.location.replace('?page=1');
    });

    this._paginationClickHandlerRef = this._paginationClickHandler.bind(this);
    this.pagination.addEventListener('click', this._paginationClickHandlerRef);
  }

  _updateApplyButton() {
    if (
      (this._query.filters.email !== this.originalQuery.filters.email) ||
      (this._query.filters.role !== this.originalQuery.filters.role) ||
      (this._query.name !== this.originalQuery.name) ||
      (this._query.zip !== this.originalQuery.zip) ||
      (this._query.state !== this.originalQuery.state) ||
      (this._query.order !== this.originalQuery.order)
    ) {
      return this.AdminUsersIndexTableControls.enableApplyButton();
    }

    return this.AdminUsersIndexTableControls.disableApplyButton();
  }

  _serialize(obj, prefix) {
    const str = [];

    Object.keys(obj).forEach((p) => {
      const k = prefix ? `${prefix}[${p}]` : p;
      const v = obj[p];

      if (v) {
        /* eslint-disable max-len */
        str.push(typeof v === 'object' ? this._serialize(v, k) : `${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
      }
    });

    return str.join('&');
  }

  _paginationClickHandler(ev) {
    const target = ev.target;
    ev.stopPropagation();

    if (target.tagName === 'BUTTON') {
      const search = this._serialize(this.originalQuery);
      window.location.replace(`?page=${target.dataset.page}&${search}`);
    }
  }

}
