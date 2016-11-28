import Widget from '../lib/widget';
import Header from '../components/Header';
import Alert from '../components/Alert';
import currentUser from '../lib/currentUser';

export default class Common extends Widget {
  constructor(config) {
    super(config);

    currentUser.set(config.currentUser);

    this.appendChild(new Header({
      name: 'Header',
      currentUser: this.currentUser,
      currentURL: this.currentURL,
      element: document.querySelector('[data-component-header]'),
      isAdmin: this.isAdmin,
    }));

    const alertElements = [].slice.call(document.querySelectorAll('.Alert'));

    if (alertElements.length) {
      alertElements.forEach((el, index) => {
        this.appendChild(new Alert({
          name: `Alert__${index}`,
          element: el,
        }));
      });
    }
  }
}
