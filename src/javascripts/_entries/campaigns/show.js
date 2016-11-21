import shareUrl from 'share-url';
import NodeSupport from '../../lib/widget/NodeSupport';
import Common from '../../components/Common';
import Tabs from '../../components/Tabs';
import FixedTabs from '../../components/campaigns/show/FixedTabs';
import CreateNewPost from '../../components/campaigns/show/CreateNewPost';
import ReadMore from '../../components/ReadMore';

class ViewCampaignsShow extends NodeSupport {
  constructor(config) {
    super();

    this.appendChild(new Common({
      name: 'Common',
      currentUser: config.currentUser,
      currentURL: config.currentURL,
    }));

    this.appendChild(new Tabs({
      name: 'Tabs',
      element: document.querySelector('[data-tabs-component]'),
    }));

    this.appendChild(new FixedTabs({
      name: 'FixedTabs',
      element: document.querySelector('[role="tablist"]'),
    }
                                  ));
    document.querySelector('[data-share-url-twitter]').href = shareUrl.twitter({
      url: location.href,
      text: `Join the ${config.campaignTitle}`,
      via: '0debtzone',
    });

    document.querySelector('[data-share-url-facebook]').href = shareUrl.facebook({
      u: location.href,
    });

    const readMoreElement = document.querySelector('.ReadMore');
    if (readMoreElement) {
      this.appendChild(new ReadMore({
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
        element: createNewPostElement,
        campaignId: config.campaignId,
      }));
    }
  }
}

window.ViewCampaignsShow = ViewCampaignsShow;
