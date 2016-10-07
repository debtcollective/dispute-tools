import Widget from '../../../lib/widget';
import AdminDisputesIndexTableControls from './AdminDisputesIndexTableControls';
import AdminDisputesIndexTable from './AdminDisputesIndexTable';
import Modal from '../../Modal';
import AdminDisputesAddUpdateForm from './AdminDisputesAddUpdateForm';
import AdminDisputesAddStatusForm from './AdminDisputesAddStatusForm';

export default class AdminDisputesIndexController extends Widget {
  constructor(config) {
    super(config);

    this._filterOptions = {
      search: '',
      toolID: '',
      status: '',
    };

    this.INDEXES_ARRAY = [];
    for (let i = 0, len = this.disputes.length; i < len; i++) {
      this.INDEXES_ARRAY.push(i);
    }

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

    this.appendChild(new Modal({
      name: 'addUpdateModal',
      element: document.querySelector('[data-component-modal="add-update"]'),
    }));

    this.appendChild(new AdminDisputesAddUpdateForm({
      name: 'AdminDisputesAddUpdateForm',
      element: document.querySelector('[data-component-form="dispute-add-update"]'),
    }));

    this._bindEvents();
  }

  _bindEvents() {
    this.AdminDisputesIndexTableControls.bind('searchInput', data => {
      this._filterOptions.search = data.value;
      this._filter();
    });

    this.AdminDisputesIndexTableControls.bind('toolsChange', data => {
      this._filterOptions.toolID = data.value;
      this._filter();
    });

    this.AdminDisputesIndexTableControls.bind('statusChange', data => {
      this._filterOptions.status = data.value;
      this._filter();
    });

    this.AdminDisputesIndexTableControls.bind('resetFilters', () => {
      this._filterOptions.search = '';
      this._filterOptions.toolID = '';
      this._filterOptions.status = '';
      this._filter();
    });

    this.AdminDisputesIndexTable.bind('addStatus', data => {
      this.AdminDisputesAddStatusForm.updateData(data.dispute);
      this.addStatusModal.activate();
    });

    this.AdminDisputesIndexTable.bind('addUpdate', data => {
      this.AdminDisputesAddUpdateForm.updateData(data.dispute);
      this.addUpdateModal.activate();
    });
  }

  _filter() {
    const indexesToHide = this._getIndexesToHide();
    const enable = this._getDropdownState(indexesToHide);

    if (indexesToHide.length) {
      this.AdminDisputesIndexTableControls.showResetButton();
    } else {
      this.AdminDisputesIndexTableControls.hideResetButton();
    }

    this.AdminDisputesIndexTable.filterItemsByIndex(indexesToHide);
    this.AdminDisputesIndexTableControls
      .updateToolsDropdownOptionsState(enable.tools)
      .updateStatusDropdownOptionsState(enable.statuses);
  }

  _getIndexesToHide() {
    const data = [];

    for (let i = 0, len = this.disputes.length; i < len; i++) {
      if (this._filterOptions.search) {
        if (this.disputes[i].user.email.toLowerCase().indexOf(this._filterOptions.search) === -1) {
          data.push(i);
        }
      }

      if (this._filterOptions.toolID) {
        if (this.disputes[i].disputeTool.id !== this._filterOptions.toolID) {
          data.push(i);
        }
      }

      if (this._filterOptions.status) {
        if (this.disputes[i].statuses[0].status !== this._filterOptions.status) {
          data.push(i);
        }
      }
    }

    return data;
  }

  _getDropdownState(hide) {
    const data = {
      tools: [],
      statuses: [],
    };
    const displayedIndexes = this.INDEXES_ARRAY.slice();
    let index;

    for (let i = 0, len = hide.length; i < len; i++) {
      index = displayedIndexes.indexOf(hide[i]);
      if (index > -1) {
        displayedIndexes.splice(index, 1);
      }
    }

    for (let i = 0, len = displayedIndexes.length; i < len; i++) {
      data.tools.push(this.disputes[displayedIndexes[i]].disputeTool.id);
      data.statuses.push(this.disputes[displayedIndexes[i]].statuses[0].status);
    }

    return data;
  }
}
