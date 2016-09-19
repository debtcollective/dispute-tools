import Widget from '../lib/widget';
import Header from '../components/Header';
import Alert from '../components/Alert';

export default class Common extends Widget {
  constructor(config) {
    super(config);

    this.appendChild(new Header({
      name: 'Header',
      currentUser: this.currentUser,
      currentURL: this.currentURL,
      element: document.querySelector('[data-component-header]'),
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
