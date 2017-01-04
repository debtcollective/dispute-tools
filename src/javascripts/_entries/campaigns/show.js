import WebFont from 'webfontloader';
import shareUrl from 'share-url';
import NodeSupport from '../../lib/widget/NodeSupport';
import Common from '../../components/Common';
import Tabs from '../../components/Tabs';
import FixedTabs from '../../components/campaigns/show/FixedTabs';
import FeedController from '../../components/campaigns/show/FeedController';
import CreateNewPost from '../../components/campaigns/show/create-new-post/Manager';
import SidebarController from '../../components/campaigns/show/sidebar/SidebarController';
import ReadMore from '../../components/ReadMore';

class ViewCampaignsShow extends NodeSupport {
  constructor(config) {
    super();

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
      element: document.querySelector('[data-tabs-component]'),
    }));

    this.appendChild(new FixedTabs({
      name: 'FixedTabs',
      element: document.querySelector('[data-fixed-tabs-component]'),
    }));

    document.querySelector('[data-share-url-twitter]').href = shareUrl.twitter({
      url: location.href,
      text: `Join the ${config.campaignTitle}`,
      via: '0debtzone',
    });

    document.querySelector('[data-share-url-facebook]').href = shareUrl.facebook({
      u: location.href,
    });

    this.appendChild(new FeedController({
      name: 'FeedController',
      campaignId: config.campaignId,
      element: document.querySelector('.Campaign_Feed'),
    }));

    if (config.nextEvents.length) {
      this.appendChild(new SidebarController({
        name: 'SidebarController',
        element: document.querySelector('[data-component="campaign-sidebar"]'),
        nextEvents: config.nextEvents,
        googleMapsKey: config.googleMapsKey,
      }));
    }

    const readMoreElement = document.querySelector('.ReadMore');
    if (readMoreElement) {
      this.appendChild(new ReadMore({
        name: 'ReadMore',
        element: readMoreElement,
        openText: 'Continue reading...',
        closeText: 'Hide',
        expanded: false,
        collapsedHeight: readMoreElement.dataset.collapsedHeight,
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
  }
}

window.ViewCampaignsShow = ViewCampaignsShow;
