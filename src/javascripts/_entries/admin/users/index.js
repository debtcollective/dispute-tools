import NodeSupport from '../../../lib/widget/NodeSupport';
import Common from '../../../components/Common';
import Controller from '../../../components/admin/users/index/AdminUsersIndexController';
import { req } from '../../../lib/api';

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

    Array.prototype.slice.call(document.querySelectorAll('[data-method]')).forEach((node) => {
      node.addEventListener('click', (e) => {
        e.preventDefault();

        req({
          url: e.target.href,
          method: e.target.dataset.method,
        }, () => {
          document.location.reload();
        });
      });
    });
  }
}

window.ViewAdminUsersIndex = ViewAdminUsersIndex;

