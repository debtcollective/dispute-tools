import NodeSupport from '../../../../lib/widget/NodeSupport';
import Common from '../../../../components/Common';
import Method from '../../../../components/Method';
import Controller from '../../../../components/admin/collectives/users/index/AdminCollectiveUsersIndexController';

class ViewAdminCollectiveUsersIndex extends NodeSupport {
  constructor(config) {
    super();

    Method.init();

    this.appendChild(new Common({
      name: 'Common',
      currentUser: config.currentUser,
      currentURL: config.currentURL,
      isAdmin: true,
    }));

    this.appendChild(new Controller({
      name: 'AdminUsersIndexController',
    }));
  }
}

window.ViewAdminCollectiveUsersIndex = ViewAdminCollectiveUsersIndex;

