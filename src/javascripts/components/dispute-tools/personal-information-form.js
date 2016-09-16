import Checkit from 'checkit';
import Widget from '../../lib/widget';
import Button from '../../components/Button';

export default class DisputeToolsPersonalInformationForm extends Widget {
  constructor(config) {
    super(config);

    // console.log(this.dispute);
    this.appendChild(new Button({
      name: 'Button',
      element: this.element.querySelector('button'),
    }));

    const _this = this;
    const data = this.dispute.disputeTool.data.options[this.dispute.data.option];
    const formData = data.steps.filter(step => {
      return step.type === 'form';
    })[0];

    // console.log(data);
    // console.log(formData);

    window.x = formData.fieldSets;

    this.constraints = {};
    this._constraintsAll = {};

    function test(fs) {
      fs.fields.forEach(r => {
        r.forEach(f => {
          if (f.type === 'group') {
            return test(f);
          }

          if (!f.validations) {
            console.warn('skipped', f.name, f.validations);
            return undefined;
          }

          if (!f.validations.includes('required')) {
            f.validations.unshift('required');
          }

          _this.constraints[f.name] = f.validations;
          _this._constraintsAll[f.name] = f.validations;
          return undefined;
        });
      });
    }
    window.x.forEach(test);

    this.ui = {};
    Object.keys(this.constraints).forEach(key => {
      const query = `[name="fieldValues[${key}]"]`;
      this.ui[key] = this.element.querySelector(query);
    });
    this._checkit = new Checkit(this.constraints);
    // console.log(this.ui);


    this.form = this.element.querySelector('form');
    this._handleFormSubmitRef = this._handleFormSubmit.bind(this);
    this.form.addEventListener('submit', this._handleFormSubmitRef);

    this.tooglers = [].slice.call(
      document.querySelectorAll("input[name^='fieldValues[__toggle-radio']")
    );
    this._handleContentToogleRef = this._handleContentToogle.bind(this);
    this.tooglers.forEach(t => {
      t.addEventListener('change', this._handleContentToogleRef);
      if (t.value === 'no' && t.checked) {
        t.checked = false;
        t.click();
      }
    });

    this.toogleRadios = [].slice.call(
      document.querySelectorAll('[data-toogle-radio]')
    );
    this._toogleRadiosRefs = {};
    this._handlePartialTogglerRef = this._handlePartialToggler.bind(this);
    this.toogleRadios.forEach(t => {
      t.addEventListener('change', this._handlePartialTogglerRef);
      if (t.checked) {
        this.initHiddenElements.call(this, t);
        if (t.value !== t.dataset.default) {
          t.checked = false;
          t.click();
        }
      }
    });
  }

  _handleContentToogle(ev) {
    const target = ev.currentTarget;
    const fieldset = target.parentElement.querySelector('fieldset');

    if (fieldset) {
      const whitelist = 'input, select, textarea';
      const names = [].slice.call(fieldset.querySelectorAll(whitelist)).map(i => {
        return i.dataset.name;
      });

      if (target.value === 'no') {
        names.forEach(name => {
          const el = this.ui[name];

          if (el) {
            el.value = '';
            el.disabled = true;
          }

          if (this.constraints[name]) {
            delete this.constraints[name];
          }
        });
      } else {
        names.forEach(name => {
          const el = this.ui[name];
          const vals = this._constraintsAll[name];

          if (el) el.disabled = false;
          if (vals) this.constraints[name] = vals;
        });
      }

      this._checkit = new Checkit(this.constraints);
    }
  }

  initHiddenElements(element) {
    const names = JSON.parse(element.dataset.toogleRadio);

    names.forEach(name => {
      const el = this.ui[name];
      let parent = el.parentElement;

      if (parent.classList.contains('col') === false) {
        parent = parent.parentElement;
      }

      if (el.dataset.hidden === 'true') {
        el.disabled = true;
        parent.classList.add('hide');

        if (this.constraints[name]) {
          delete this.constraints[name];
        }
      }

      this._toogleRadiosRefs[name] = {
        el,
        parent,
      };
    });

    this._checkit = new Checkit(this.constraints);
  }

  _handlePartialToggler(ev) {
    const target = ev.currentTarget;
    const names = JSON.parse(target.dataset.toogleRadio);

    names.forEach(name => {
      const ref = this._toogleRadiosRefs[name];

      if (ref.el.dataset.hidden === 'true') {
        const vals = this._constraintsAll[name];
        if (vals) {
          this.constraints[name] = vals;
        }

        ref.el.dataset.hidden = 'false';
        ref.parent.classList.remove('hide');
        ref.el.disabled = false;

        return;
      }

      ref.el.dataset.hidden = 'true';
      ref.el.disabled = true;
      ref.parent.classList.add('hide');

      if (this.constraints[name]) {
        delete this.constraints[name];
      }

      return;
    });

    this._checkit = new Checkit(this.constraints);
  }

  _handleFormSubmit(ev) {
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
  }

  _displayFieldErrors(errors) {
    // Object.keys(errors).forEach(key => {
    //   this.ui[key].parentNode.classList.add('error');
    // });
    Object.keys(errors).forEach(key => {
      const parent = this.ui[key].parentNode;
      let errorLabel = parent.querySelector('.-on-error');

      parent.classList.add('error');

      if (errorLabel) {
        errorLabel.innerText = `▲ ${errors[key].message}`;
        return;
      }

      errorLabel = parent.nextSibling;
      if (errorLabel && errorLabel.classList.contains('-on-error')) {
        errorLabel.innerText = `▲ ${errors[key].message}`;
      }
    });
  }

  _clearFieldErrors() {
    Object.keys(this.constraints).forEach(key => {
      this.ui[key].parentNode.classList.remove('error');
    });
  }

  _getFieldsData() {
    const data = {};
    Object.keys(this.constraints).forEach(key => {
      data[key] = this.ui[key].value;
    });
    return data;
  }

}
