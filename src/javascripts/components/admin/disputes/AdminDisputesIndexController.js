import Widget from '../../../lib/widget';
import { serialize } from '../../../lib/AdminUtils';
import AdminDisputesIndexTableControls from './AdminDisputesIndexTableControls';
import AdminDisputesIndexTable from './AdminDisputesIndexTable';
import Modal from '../../Modal';
import AdminDisputesAddStatusForm from './AdminDisputesAddStatusForm';
import AdminShowDisputePanel from './AdminShowDisputePanel';
import AssignedToMeButton from './AssignedToMeButton';
import mountManageDisputeAdmins from './ManageDisputeAdmins';

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

    this.appendChild(new Modal({
      name: 'viewDisputeModal',
      element: document.querySelector('[data-component-modal="show-dispute"]'),
    }));

    this.appendChild(new AdminShowDisputePanel({
      name: 'AdminShowDisputePanel',
      element: document.querySelector('[data-component-form="show-dispute"]'),
    }));

    this.appendChild(new AdminDisputesAddStatusForm({
      name: 'AdminDisputesAddStatusForm',
      element: document.querySelector('[data-component-form="dispute-add-status"]'),
    }));

    const searchAdminId = /admin_id\]=([\d\w-]*)/.exec(decodeURIComponent(window.location.search));

    this.originalQuery = {
      filters: {
        dispute_tool_id: this.AdminDisputesIndexTableControls.toolsSelect.value,
        readable_id: this.AdminDisputesIndexTableControls.readableIdInput.value,
        admin_id: searchAdminId !== null ? searchAdminId[1] : undefined,
      },
      name: this.AdminDisputesIndexTableControls.searchInput.value,
      status: this.AdminDisputesIndexTableControls.statusSelect.value,
      order: this.AdminDisputesIndexTableControls.orderSelect.value,
    };

    // Why do we stringify then parse?
    this._query = JSON.parse(JSON.stringify(this.originalQuery));

    // Not sure why this button isn't within the scope of `this.element` but this works anyway
    this.assignedToMeButtonContainer = document.querySelector('#assigned-to-me-button');
    // Has to happen after this._query is populated
    this.assignedToMeButton = new AssignedToMeButton({
      queryReference: this._query,
      adminId: this.assignedToMeButtonContainer.dataset.currentUserId,
      applyFilters: () => this.AdminDisputesIndexTableControls.dispatch('applyFilters'),
    });
    this.assignedToMeButtonContainer.appendChild(this.assignedToMeButton.element);

    this.pagination = document.querySelector('.Pagination ul');

    this._bindEvents();
  }

  _bindEvents() {
    this.AdminDisputesIndexTableControls.bind('searchInput', data => {
      this._query.name = data.value;
      this._enableButtons();
    });

    this.AdminDisputesIndexTableControls.bind('readableIdInput', data => {
      this._query.filters.readable_id = data.value;
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
      const search = serialize(this._query);
      window.location.replace(`?${search}`);
    });

    this.AdminDisputesIndexTableControls.bind('resetFilters', () => {
      window.location.replace('?page=1');
    });

    this.AdminDisputesIndexTable.bind('addStatus', data => {
      this.AdminDisputesAddStatusForm.updateData(data.dispute);
      if (this.manageDisputeAdmins) {
        this.manageDisputeAdmins.setDisputeId(data.dispute.id);
      } else {
        this.manageDisputeAdmins = mountManageDisputeAdmins(data.dispute.id);
      }
      this.addStatusModal.activate();
    });

    this.AdminDisputesIndexTable.bind('show', data => {
      this.AdminShowDisputePanel.updateData(data.dispute);
      this.viewDisputeModal.activate();
    });

    this._handlePaginationClickRef = this._handlePaginationClick.bind(this);
    this.pagination.addEventListener('click', this._handlePaginationClickRef);
  }

  _handlePaginationClick(ev) {
    const target = ev.target;
    ev.stopPropagation();

    if (target.tagName === 'BUTTON') {
      const search = serialize(this.originalQuery);
      window.location.replace(`?page=${target.dataset.page}&${search}`);
    }
  }

  _enableButtons() {
    if (
      (this._query.name !== this.originalQuery.name) ||
      (this._query.status !== this.originalQuery.status) ||
      (this._query.filters.dispute_tool_id !== this.originalQuery.filters.dispute_tool_id) ||
      (this._query.order !== this.originalQuery.order) ||
      (this._query.filters.readable_id !== this.originalQuery.filters.readable_id)
    ) {
      return this.AdminDisputesIndexTableControls.enableApplyButton();
    }

    return this.AdminDisputesIndexTableControls.disableApplyButton();
  }
}
