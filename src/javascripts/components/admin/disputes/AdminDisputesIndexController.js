import Widget from '../../../lib/widget';
import AdminDisputesIndexTableControls from './AdminDisputesIndexTableControls';
import AdminDisputesIndexTable from './AdminDisputesIndexTable';
import Modal from '../../Modal';
import AdminDisputesAddStatusForm from './AdminDisputesAddStatusForm';

export default class AdminDisputesIndexController extends Widget {
  constructor(config) {
    super(config);

    this.appendChild(new AdminDisputesIndexTableControls({
      name: 'AdminDisputesIndexTableControls',
      element: document.querySelector('thead'),
    }));

    this.appendChild(new AdminDisputesIndexTable({
      name: 'AdminDisputesIndexTable',
      element: document.querySelector('tbody'),
      disputes: this.disputes,
    }));

    this.appendChild(new Modal({
      name: 'addStatusModal',
      element: document.querySelector('[data-component-modal="add-status"]'),
    }));

    this.appendChild(new AdminDisputesAddStatusForm({
      name: 'AdminDisputesAddStatusForm',
      element: document.querySelector('[data-component-form="dispute-add-status"]'),
    }));

    this.originalQuery = {
      filters: {
        dispute_tool_id: this.AdminDisputesIndexTableControls.toolsSelect.value,
      },
      name: this.AdminDisputesIndexTableControls.searchInput.value,
      status: this.AdminDisputesIndexTableControls.statusSelect.value,
      order: this.AdminDisputesIndexTableControls.orderSelect.value,
    };

    this._query = JSON.parse(JSON.stringify(this.originalQuery));

    this.pagination = document.querySelector('.Pagination ul');

    this._bindEvents();
  }

  _bindEvents() {
    this.AdminDisputesIndexTableControls.bind('searchInput', data => {
      this._query.name = data.value;
      this._enableButtons();
    });

    this.AdminDisputesIndexTableControls.bind('toolsChange', data => {
      this._query.filters.dispute_tool_id = data.value;
      this._enableButtons();
    });

    this.AdminDisputesIndexTableControls.bind('statusChange', data => {
      this._query.status = data.value;
      this._enableButtons();
    });

    this.AdminDisputesIndexTableControls.bind('orderChange', data => {
      this._query.order = data.value;
      this._enableButtons();
    });

    this.AdminDisputesIndexTableControls.bind('applyFilters', () => {
      const search = this._serialize(this._query);
      window.location.replace(`?${search}`);
    });

    this.AdminDisputesIndexTableControls.bind('resetFilters', () => {
      window.location.replace('?page=1');
    });

    this.AdminDisputesIndexTable.bind('addStatus', data => {
      this.AdminDisputesAddStatusForm.updateData(data.dispute);
      this.addStatusModal.activate();
    });

    this._handlePaginationClickRef = this._handlePaginationClick.bind(this);
    this.pagination.addEventListener('click', this._handlePaginationClickRef);
  }

  _handlePaginationClick(ev) {
    const target = ev.target;
    ev.stopPropagation();

    if (target.tagName === 'BUTTON') {
      const search = this._serialize(this.originalQuery);
      window.location.replace(`?page=${target.dataset.page}&${search}`);
    }
  }

  _enableButtons() {
    if (
      (this._query.name !== this.originalQuery.name) ||
      (this._query.status !== this.originalQuery.status) ||
      (this._query.filters.dispute_tool_id !== this.originalQuery.filters.dispute_tool_id) ||
      (this._query.order !== this.originalQuery.order)
    ) {
      return this.AdminDisputesIndexTableControls.enableApplyButton();
    }

    return this.AdminDisputesIndexTableControls.disableApplyButton();
  }

  _serialize(obj, prefix) {
    const str = [];

    Object.keys(obj).forEach((p) => {
      const k = prefix ? `${prefix}[${p}]` : p;
      const v = obj[p];

      if (v) {
        str.push(typeof v === 'object' ? this._serialize(v, k) : `${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
      }
    });

    return str.join('&');
  }
}
