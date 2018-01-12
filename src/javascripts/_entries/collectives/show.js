import WebFont from 'webfontloader';
import shareUrl from 'share-url';
import debounce from 'lodash/debounce';
import NodeSupport from '../../lib/widget/NodeSupport';
import Common from '../../components/Common';
import Tabs from '../../components/Tabs';
import CollectiveStickyTabs from '../../components/collectives/StickyTabs';
import Modal from '../../components/Modal';

class ViewCollectivesShow extends NodeSupport {
  constructor(config) {
    super();

    this.appendChild(
      new Common({
        name: 'Common',
        currentUser: config.currentUser,
        currentURL: config.currentURL,
      }),
    );

    this.appendChild(
      new Tabs({
        name: 'Tabs',
        element: document.querySelector('[data-tabs-component]'),
        updateHash: true,
        defaultTab: 'panel-manifest',
      }),
    );

    this.appendChild(
      new CollectiveStickyTabs({
        name: 'HandleStickyHeader',
        element: document.querySelector('[role="tablist"]'),
      }),
    );

    this.disputeIds = config.disputeIds;
    this.collectiveName = config.collectiveName;

    this.tabsOffsetSection = document.querySelector('[data-offset-section]');
    this.tabsOffset = 0;

    WebFont.load({
      google: {
        families: ['Space Mono'],
      },
    });

    this._setup()
      ._generateShareUrls()
      ._bindEvents();

    this.Tabs.run();
  }

  _setup() {
    this.tabsOffset = this.tabsOffsetSection.offsetHeight;

    return this;
  }

  _generateShareUrls() {
    document.querySelector('[data-share-url-twitter]').href = shareUrl.twitter({
      url: location.href,
      text: `Join the ${this.collectiveName}`,
      via: '0debtzone',
    });

    document.querySelector(
      '[data-share-url-facebook]',
    ).href = shareUrl.facebook({
      u: location.href,
    });

    document.querySelector('[data-share-url-email]').href = shareUrl.email({
      to: '',
      subject: 'Check out this at debtcollective.org',
      body: `${this.collectiveName}\n${location.href}`,
    });

    return this;
  }

  _bindEvents() {
    this._resizeHandlerRef = this._resizeHandler.bind(this);
    window.addEventListener('resize', debounce(this._resizeHandlerRef, 200));

    this._tabsChangeHandlerRef = this._tabsChangeHandler.bind(this);
    this.Tabs.bind('change', this._tabsChangeHandlerRef);

    this.modalHandlers = {};
    this.disputeIds.forEach(id => {
      this.appendChild(
        new Modal({
          name: `modal-${id}`,
          element: document.querySelector(
            `[data-component-modal="tool-modal-${id}"]`,
          ),
        }),
      );

      this.modalHandlers[id] = this._aboutClickHandler.bind(
        this,
        this[`modal-${id}`],
      );
      document
        .getElementById(`tool-modal-toggler-${id}`)
        .addEventListener('click', this.modalHandlers[id]);
    });
  }

  _resizeHandler() {
    this._setup();
  }

  /**
   * Checks if the body scroll position needs to be updated after a new Tab has
   * been activated. This is prevents displaying TabPanels on a different `y`
   * position other than its very `top` caused because of the Tab’s `sticky`
   * behaviour.
   * @private
   * @listens {Tabs.change}
   */
  _tabsChangeHandler() {
    if (document.body.scrollTop > this.tabsOffset) {
      document.body.scrollTop = this.tabsOffset;
    }
  }

  _aboutClickHandler(instance) {
    instance.activate();
  }
}

window.ViewCollectivesShow = ViewCollectivesShow;
