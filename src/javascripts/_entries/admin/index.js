import NodeSupport from '../../lib/widget/NodeSupport';
import Common from '../../components/Common';

class ViewAdminIndex extends NodeSupport {
  constructor(config) {
    super();

    this.appendChild(new Common({
      name: 'Common',
      currentUser: config.currentUser,
      currentURL: config.currentURL,
      isAdmin: true,
    }));
  }
}

window.ViewAdminIndex = ViewAdminIndex;

