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
    const target = ev.target;

    if (target.tagName === 'BUTTON') {
      ev.preventDefault();
      return this._handleButtonClick(target);
    }

    let parent = target.parentElement;
    while (parent.tagName === 'BUTTON' || parent.tagName === 'TD') {
      parent = parent.parentElement;
    }

    if (parent.parentElement.tagName === 'BUTTON') {
      ev.preventDefault();
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

    if (button.dataset.show !== undefined) {
      return this.dispatch('show', { dispute: this.disputes[rowIndex] });
    }

    if (button.dataset.deleteDispute !== undefined) {
      if (confirm('Are you sure you want to delete this dispute?') === true) {
        button.form.submit();
      }
    }

    return null;
  }
}
