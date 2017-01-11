import WebFont from 'webfontloader';
import NodeSupport from '../../lib/widget/NodeSupport';
import Common from '../../components/Common';
import Button from '../../components/Button';
import Checkit from 'checkit';

class ViewHomeContact extends NodeSupport {
  static get constraints() {
    return {
      email: ['required', 'email'],
      name: ['required'],
      message: ['required'],
    };
  }
  constructor(config) {
    super();
    this.formElement = document.querySelector('form[name="contact"]');
    this.ui = {};

    Object.keys(ViewHomeContact.constraints).forEach(key => {
      const query = `[name="${key}"]`;
      this.ui[key] = this.formElement.querySelector(query);
    });

    this._checkit = new Checkit(ViewHomeContact.constraints);

    this.appendChild(new Button({
      name: 'Button',
      element: this.formElement.querySelector('button'),
    }));

    this.appendChild(new Common({
      name: 'Common',
      currentUser: config.currentUser,
      currentURL: config.currentURL,
    }));

    WebFont.load({
      google: {
        families: ['Space Mono'],
      },
    });

    this.formElement.addEventListener('submit', (ev) => {
      this.Button.disable();
      this._clearFieldErrors();

      const [err] = this._checkit.validateSync(this._getFieldsData());

      if (err) {
        ev.preventDefault();
        this.Button.enable();
        return this._displayFieldErrors(err.errors);
      }

      this.Button.updateText();

      return undefined;
    });
  }
  _displayFieldErrors(errors) {
    Object.keys(errors).forEach(key => {
      this.ui[key].parentNode.classList.add('error');
    });
  }
  _clearFieldErrors() {
    Object.keys(ViewHomeContact.constraints).forEach(key => {
      this.ui[key].parentNode.classList.remove('error');
    });
  }
  _getFieldsData() {
    const data = {};
    Object.keys(ViewHomeContact.constraints).forEach(key => {
      data[key] = this.ui[key].value;
    });
    return data;
  }
}

window.ViewHomeContact = ViewHomeContact;
