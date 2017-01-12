import Widget from '../../../../../lib/widget';
import { serialize } from '../../../../../lib/AdminUtils';
import AdminCollectiveUsersIndexTableControls from './AdminCollectiveUsersIndexTableControls';

export default class AdminCollectiveUsersIndexController extends Widget {
  constructor(config) {
    super(config);

    this.appendChild(new AdminCollectiveUsersIndexTableControls({
      name: 'AdminCollectiveUsersIndexTableControls',
      element: document.querySelector('thead'),
    }));

    this.originalQuery = {
      campaign: this.AdminCollectiveUsersIndexTableControls.campaignSelect.value,
      search: this.AdminCollectiveUsersIndexTableControls.searchInput.value,
      order: this.AdminCollectiveUsersIndexTableControls.orderSelect.value,
    };

    this._query = JSON.parse(JSON.stringify(this.originalQuery));

    this.pagination = document.querySelector('.Pagination ul');

    this._bindEvents();
  }

  _bindEvents() {
    this.AdminCollectiveUsersIndexTableControls.bind('campaignChange', data => {
      this._query.campaign = data.value;
      this._updateApplyButton();
    });

    this.AdminCollectiveUsersIndexTableControls.bind('searchInput', data => {
      this._query.search = data.value;
      this._updateApplyButton();
    });

    this.AdminCollectiveUsersIndexTableControls.bind('orderChange', data => {
      this._query.order = data.value;
      this._updateApplyButton();
    });

    this.AdminCollectiveUsersIndexTableControls.bind('applyFilters', () => {
      const search = serialize(this._query);
      window.location.replace(`?${search}`);
    });

    this.AdminCollectiveUsersIndexTableControls.bind('resetFilters', () => {
      window.location.replace('?page=1');
    });

    this._paginationClickHandlerRef = this._paginationClickHandler.bind(this);
    this.pagination.addEventListener('click', this._paginationClickHandlerRef);
  }

  _updateApplyButton() {
    if (
      (this._query.campaign !== this.originalQuery.campaign) ||
      (this._query.search !== this.originalQuery.search) ||
      (this._query.order !== this.originalQuery.order)
    ) {
      return this.AdminCollectiveUsersIndexTableControls.enableApplyButton();
    }

    return this.AdminCollectiveUsersIndexTableControls.disableApplyButton();
  }

  _paginationClickHandler(ev) {
    const target = ev.target;
    ev.stopPropagation();

    if (target.tagName === 'BUTTON') {
      const search = serialize(this.originalQuery);
      window.location.replace(`?page=${target.dataset.page}&${search}`);
    }
  }
}
