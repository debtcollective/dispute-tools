import NodeSupport from '../../../lib/widget/NodeSupport';
import Common from '../../../components/Common';

class ViewAdminCollectivesIndex extends NodeSupport {
  constructor(config) {
    super();

    this.appendChild(
      new Common({
        name: 'Common',
        currentUser: config.currentUser,
        currentURL: config.currentURL,
        isAdmin: true,
      }),
    );
  }
}

window.ViewAdminCollectivesIndex = ViewAdminCollectivesIndex;
