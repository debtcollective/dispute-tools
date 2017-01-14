import WebFont from 'webfontloader';
import shareUrl from 'share-url';
import NodeSupport from '../../lib/widget/NodeSupport';
import Common from '../../components/Common';
import Tabs from '../../components/Tabs';
import FixedTabs from '../../components/campaigns/show/FixedTabs';
import FeedController from '../../components/campaigns/show/FeedController';
import JoinCampaingModal from '../../components/campaigns/show/JoinCampaingModal';
import CreateNewPost from '../../components/campaigns/show/create-new-post/Manager';
import SidebarController from '../../components/campaigns/show/sidebar/SidebarController';
import ReadMore from '../../components/ReadMore';
import { popupCenter } from '../../lib/utils';

class ViewCampaignsShow extends NodeSupport {
  /**
   * @param {object} config
   * @property {string} config.campaignId
   * @property {string} config.campaignTitle
   * @property {array} config.nextEvents
   * @property {string} config.googleMapsKey
   */
  constructor(config) {
    super();

    Object.assign(this, config);

    this.appendChild(new Common({
      name: 'Common',
      currentUser: config.currentUser,
      currentURL: config.currentURL,
    }));

    WebFont.load({
      google: {
        families: ['Space Mono'],
      },
    });

    this.appendChild(new Tabs({
      name: 'Tabs',
      updateHash: true,
      element: document.querySelector('[data-tabs-component]'),
    }));

    this.appendChild(new FixedTabs({
      name: 'FixedTabs',
      element: document.querySelector('[data-fixed-tabs-component]'),
    }));

    this.appendChild(new FeedController({
      name: 'FeedController',
      campaignId: config.campaignId,
      element: document.querySelector('.Campaign_Feed'),
    }));

    const joinCampaingModal = document.querySelector('[data-component-modal="join-to-campaing"]');
    const joinCampaingTriggerElement = document.querySelector('.js-join-campaign-link');
    if (joinCampaingModal && joinCampaingTriggerElement) {
      this.appendChild(new JoinCampaingModal({
        name: 'JoinCampaingModal',
        modal: joinCampaingModal,
        trigger: joinCampaingTriggerElement,
      }));
    }

    Array.prototype.slice.call(document.querySelectorAll('.ReadMore')).forEach((element, i) => {
      this.appendChild(new ReadMore({
        name: `ReadMore-${i}`,
        element,
      }));
    });

    if (config.nextEvents.length) {
      this.appendChild(new SidebarController({
        name: 'SidebarController',
        element: document.querySelector('[data-component="campaign-sidebar"]'),
        nextEvents: config.nextEvents,
        googleMapsKey: config.googleMapsKey,
      }));
    }

    const createNewPostElement = document.querySelector('[data-create-new-post]');
    if (createNewPostElement) {
      this.appendChild(new CreateNewPost({
        name: 'CreateNewPost',
        element: createNewPostElement,
        campaignId: config.campaignId,
      }));
    }

    this._bindShareButtons();

    if (!location.hash) {
      location.hash = 'campaign';
      this.Tabs._activateTab('panel-campaign');
    }
  }

  /**
   * Creates the urls for facebook and twitter share buttons.
   * Binds them to open a new window.
   * @private
   */
  _bindShareButtons() {
    this.twitterButton = document.querySelector('[data-share-url-twitter]');
    this.facebookButton = document.querySelector('[data-share-url-facebook]');

    this.twitterButton.href = shareUrl.twitter({
      url: location.href,
      text: `Join the ${this.campaignTitle}`,
      via: '0debtzone',
    });

    this.facebookButton.href = shareUrl.facebook({
      u: location.href,
    });

    this._handleShareButtonClick = this._handleShareButtonClick.bind(this);
    this.twitterButton.addEventListener('click', this._handleShareButtonClick);
    this.facebookButton.addEventListener('click', this._handleShareButtonClick);
  }

  _handleShareButtonClick(ev) {
    ev.preventDefault();
    popupCenter(ev.currentTarget.href, 'sharerWindow', 520, 350);
  }
}

window.ViewCampaignsShow = ViewCampaignsShow;
