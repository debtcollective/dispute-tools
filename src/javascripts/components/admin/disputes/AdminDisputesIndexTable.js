/* eslint-disable no-alert */
import Widget from '../../../lib/widget';

export default class AdminDisputesIndexTable extends Widget {
  constructor(config) {
    super(config);
    this._bindEvents();
  }

  _bindEvents() {
    this._handleClickRef = this._handleClick.bind(this);
    this.element.addEventListener('click', this._handleClickRef, false);
  }

  _handleClick(ev) {
    ev.preventDefault();

    const target = ev.target;

    if (target.tagName === 'BUTTON') {
      return this._handleButtonClick(target);
    }

    let parent = target.parentElement;
    while (parent.tagName === 'BUTTON' || parent.tagName === 'TD') {
      parent = parent.parentElement;
    }

    if (parent.parentElement.tagName === 'BUTTON') {
      return this._handleButtonClick(parent.parentElement);
    }

    return null;
  }

  _handleButtonClick(button) {
    let row = button.parentElement;

    while (row.tagName !== 'TR') {
      row = row.parentElement;
    }

    const rowIndex = [].indexOf.call(this.element.children, row);

    if (button.dataset.addStatus !== undefined) {
      return this.dispatch('addStatus', { dispute: this.disputes[rowIndex] });
    }

    if (button.dataset.deleteDispute !== undefined) {
      if (confirm('Are you sure you want to delete this dispute?') === true) {
        button.form.submit();
      }
    }

    return null;
  }

  filterItemsByIndex(indexes) {
    for (let i = 0, len = this.disputes.length; i < len; i++) {
      if (indexes.indexOf(i) > -1) {
        this.element.children[i].style.display = 'none';
      } else {
        this.element.children[i].style.display = '';
      }
    }
    return this;
  }
}
