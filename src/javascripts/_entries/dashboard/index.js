import WebFont from 'webfontloader';
import NodeSupport from '../../lib/widget/NodeSupport';
import FeedController from '../../components/dashboard/index/FeedController';
import Common from '../../components/Common';

class ViewDashboardIndex extends NodeSupport {
  constructor(config) {
    super();

    Object.assign(this, config);

    this.appendChild(
      new Common({
        name: 'Common',
        currentUser: config.currentUser,
        currentURL: config.currentURL,
      })
    );

    WebFont.load({
      google: {
        families: ['Space Mono'],
      },
    });

    this.appendChild(
      new FeedController({
        name: 'FeedController',
        campaigns: config.userCampaigns,
        collectives: config.userCollectives,
        currentUser: config.currentUser,
        userBelongsToCampaign: config.userBelongsToCampaign,
        element: document.querySelector('.Campaign_Feed'),
        deletePostActionUrl: config.deletePostActionUrl,
        userIsAdminOrCollectiveManager: config.userIsAdminOrCollectiveManager,
      })
    );
  }
}

window.ViewDashboardIndex = ViewDashboardIndex;
