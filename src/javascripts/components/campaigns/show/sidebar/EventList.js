import Widget from '../../../../lib/widget';

export default class EventList extends Widget {
  constructor(config) {
    super(config);

    this.eventElements = Array.prototype.slice.call(
      this.element.querySelectorAll('.CampaignEvent'),
    );

    this._bindEvents();
  }

  _bindEvents() {
    this.eventTitleElements = this.eventElements.map(event =>
      event.querySelector('a'),
    );

    this._handleTitleClick = this._handleTitleClick.bind(this);
    this.eventTitleElements.forEach(event =>
      event.addEventListener('click', this._handleTitleClick),
    );

    return this;
  }

  _handleTitleClick(ev) {
    ev.preventDefault();

    const index = this.eventTitleElements.indexOf(ev.currentTarget);

    this.dispatch('clicked', {
      data: this.events[index],
    });
  }
}
