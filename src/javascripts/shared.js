import Checkit from '../../shared/Checkit';
import NodeSupport from './lib/widget/NodeSupport';
import Common from './components/Common';
import { login } from './lib/api';

require('./_vendor/polyfills');

class ViewDefault extends NodeSupport {
  constructor(config) {
    super();

    this.appendChild(
      new Common({
        name: 'Common',
        currentUser: config.currentUser,
        currentURL: config.currentURL,
      }),
    );
  }
}

window.ViewDefault = ViewDefault;

window.Checkit = Checkit;

window.login = login;
