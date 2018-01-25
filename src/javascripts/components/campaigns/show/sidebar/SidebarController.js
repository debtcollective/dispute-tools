import Widget from '../../../../lib/widget';
import EventList from './EventList';
import Event from './Event';

export default class SidebarController extends Widget {
  constructor(config) {
    super(config);

    this.index = 0;

    this.carouselItems = Array.prototype.slice.call(
      this.element.querySelectorAll('.CampaignSidebarCarouselItem'),
    );

    this.prevButtons = Array.prototype.slice.call(
      this.element.querySelectorAll('[data-sidebar-prev-btn]'),
    );
    this.nextButtons = Array.prototype.slice.call(
      this.element.querySelectorAll('[data-sidebar-next-btn]'),
    );

    this.appendChild(
      new EventList({
        name: 'EventList',
        element: this.element.querySelector('.CampaignEventList'),
        events: this.nextEvents,
      }),
    );

    this._bindEvents();
  }

  _bindEvents() {
    this._handlePrevBtnClick = this._handlePrevBtnClick.bind(this);
    this._handleNextBtnClick = this._handleNextBtnClick.bind(this);

    this.prevButtons.forEach(btn =>
      btn.addEventListener('click', this._handlePrevBtnClick),
    );
    this.nextButtons.forEach(btn =>
      btn.addEventListener('click', this._handleNextBtnClick),
    );

    this._handleEventListClickHandler = this._handleEventListClickHandler.bind(
      this,
    );
    this.EventList.bind('clicked', this._handleEventListClickHandler);

    return this;
  }

  _handlePrevBtnClick() {
    this.carouselItems[this.index].setAttribute('aria-hidden', true);
    this.index--;
    this.carouselItems[this.index].setAttribute('aria-hidden', false);

    this.element.style.transform = `translate3d(-${this.index *
      (100 / 3)}%, 0, 0)`;
  }

  _handleNextBtnClick() {
    this.carouselItems[this.index].setAttribute('aria-hidden', true);
    this.index++;
    this.carouselItems[this.index].setAttribute('aria-hidden', false);

    this.element.style.transform = `translate3d(-${this.index *
      (100 / 3)}%, 0, 0)`;
  }

  _handleEventListClickHandler(ev) {
    this._handleNextBtnClick();

    if (this.EventList.children) {
      if (this.EventList.children[0].data.id === ev.data.id) {
        return;
      }

      let childrenLength = this.EventList.children.length;
      while (childrenLength > 0) {
        this.EventList.children[0].destroy();
        if (this.EventList.children.length === childrenLength) {
          this.EventList.children.shift();
        }
        childrenLength--;
      }
    }

    this.EventList.appendChild(
      new Event({
        name: 'Event',
        data: ev.data,
        googleMapsKey: this.googleMapsKey,
      }),
    ).render(this.element.querySelector('[data-component-event]'));
  }
}
