import NodeSupport from '../../lib/widget/NodeSupport';
import Common from '../../components/Common';
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

    const readMore = document.querySelector('.ReadMore');
    if (readMore) {
      this.appendChild(new ReadMore({
        element: readMore,
        openText: 'Continue reading...',
        closeText: 'Hide',
        expanded: false,
        collapsedHeight: readMore.dataset.collapsedHeight,
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
