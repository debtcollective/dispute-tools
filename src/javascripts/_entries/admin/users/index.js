import NodeSupport from '../../../lib/widget/NodeSupport';
import Common from '../../../components/Common';
import Controller from '../../../components/admin/users/index/AdminUsersIndexController';

class ViewAdminUsersIndex extends NodeSupport {
  constructor(config) {
    super();

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

window.ViewAdminUsersIndex = ViewAdminUsersIndex;
