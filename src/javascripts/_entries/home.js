import Header from '../components/Header';
import NewForm from '../components/users/NewForm';

class HomeView {
  constructor(config) {
    new Header({
      currentUser: config.currentUser,
      element: document.querySelector('[data-component-header]')
    });

    new NewForm({
      element: document.querySelector('[data-component-usernewform]')
    });
  }
}

window.HomeView = HomeView;
