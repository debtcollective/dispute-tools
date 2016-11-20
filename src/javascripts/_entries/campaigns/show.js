import NodeSupport from '../../lib/widget/NodeSupport';
import Common from '../../components/Common';
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

    this.appendChild(new FixedTabs({
      name: 'FixedTabs',
      element: document.querySelector('[role="tablist"]'),
    }));

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
