import autosize from 'autosize';
import { createCampaignPost } from '../../../../lib/api';
import Widget from '../../../../lib/widget';
import Button from '../../../../components/Button';
import Poll from './Poll';

export default class CreateNewPost extends Widget {
  static get types() {
    return ['Text', 'Image', 'Poll'];
  }

  constructor(config) {
    super(config);

    this.type = 'Text';

    this._closeElement = this.element.querySelector(
      '[data-create-new-post-close]',
    );
    this._backdropdElement = this.element.querySelector(
      '.CreateNewPost_Backdrop',
    );
    this._inputElement = this.element.querySelector('.CreateNewPost_Input');
    this._topicElement = this.element.querySelector(
      '[create-new-post-topic-select]',
    );
    this._imageInputElement = this.element.querySelector(
      '[data-create-new-post-image-input]',
    );
    this._imagePreviewElement = this.element.querySelector(
      '[data-create-new-post-image-preview]',
    );
    this._postTypeIcons = this.element.querySelectorAll(
      '[data-post-type-icon]',
    );
    this._postTypeIcons = Array.prototype.slice.call(this._postTypeIcons);
    this._postTypeContents = this.element.querySelectorAll(
      '[data-post-type-content]',
    );
    this._postTypeContents = Array.prototype.slice.call(this._postTypeContents);
    this._publicElement = this.element.querySelector(
      '[data-create-new-post-public-checkbox]',
    );
    this.appendChild(
      new Button({
        name: 'SubmitButton',
        element: this.element.querySelector('button[type="submit"]'),
      }),
    );

    this.appendChild(
      new Poll({
        name: 'Poll',
        element: this.element.querySelector(
          '[data-post-type-content][data-type="Poll"]',
        ),
      }),
    );

    this.setPostType(this.type)._bindEvents();
  }

  setPostType(type) {
    if (this.constructor.types.includes(type) === false) {
      return this;
    }

    this.type = type;

    this._postTypeIcons.forEach(icon => {
      if (icon.dataset.type === this.type) {
        icon.classList.add('-primary');
      } else {
        icon.classList.remove('-primary');
      }
    });

    this._postTypeContents.forEach(content => {
      if (content.dataset.type === this.type) {
        content.classList.remove('hide');
        content.setAttribute('aria-hidden', false);
      } else {
        content.classList.add('hide');
        content.setAttribute('aria-hidden', true);
      }
    });

    const method = this[`_display${this.type}`];
    if (typeof method === 'function') method.call(this);

    return this;
  }

  _bindEvents() {
    this._handleElementClickRef = this._handleElementClick.bind(this);
    this.element.addEventListener('click', this._handleElementClickRef);

    this._handleCloseClickRef = this._handleCloseClick.bind(this);
    this._closeElement.addEventListener('click', this._handleCloseClickRef);
    this._backdropdElement.addEventListener('click', this._handleCloseClickRef);

    this._handleIconClickRef = this._handleIconClick.bind(this);
    this._postTypeIcons.forEach(icon => {
      icon.addEventListener('click', this._handleIconClickRef);
    });

    this._handleImageInputChangeRef = this._handleImageInputChange.bind(this);
    this._imageInputElement.addEventListener(
      'change',
      this._handleImageInputChangeRef,
    );

    this._handleSubmitRef = this._handleSubmit.bind(this);
    this.SubmitButton.element.addEventListener('click', this._handleSubmitRef);

    return this;
  }

  _handleElementClick() {
    if (this.active) {
      return;
    }

    this.activate();
  }

  _handleCloseClick(ev) {
    ev.stopPropagation();

    const dirty =
      this._inputElement.value.length ||
      (this.type === 'Image' && this._imageInputElement.files.length) ||
      this.type === 'Poll';

    if (dirty) {
      if (confirm('If you leave now, your post won’t be saved.')) {
        this.deactivate();
      }
    } else {
      this.deactivate();
    }
  }

  _handleIconClick(ev) {
    const target = ev.currentTarget;

    if (target.classList.contains('-primary')) {
      return;
    }

    this.setPostType(target.dataset.type);
  }

  _handleImageInputChange() {
    const input = this._imageInputElement;

    if (input.files && input.files[0]) {
      const reader = new FileReader();

      reader.onload = e => {
        this._imagePreviewElement.src = e.target.result;
      };

      reader.readAsDataURL(input.files[0]);
    } else {
      this._imagePreviewElement.src = '';
    }
  }

  _handleSubmit() {
    this.SubmitButton.disable();

    const valid = (() => {
      switch (this.type) {
        case 'Text':
          return this._inputElement.value.length;
        case 'Image':
          return this._imageInputElement.files.length;
        case 'Poll':
          return this.Poll.getOptionValues().length;
        default:
          return false;
      }
    })();

    if (!valid) {
      return this.SubmitButton.enable();
    }

    const data = new FormData();
    data.append('type', this.type);
    data.append('public', this._publicElement.checked);

    if (this._topicElement.value) {
      data.append('topicId', this._topicElement.value);
    }

    switch (this.type) {
      case 'Text':
        data.append('text', this._inputElement.value.trim());
        break;
      case 'Image':
        data.append('text', this._inputElement.value.trim());
        data.append('image', this._imageInputElement.files[0]);
        break;
      case 'Poll':
        data.append('title', this._inputElement.value.trim());
        this.Poll.getOptionValues().forEach(value => {
          data.append('options[]', value);
        });
        break;
      default:
        throw new Error('Invalid post type');
    }

    return createCampaignPost(
      {
        campaignId: this.campaignId,
        body: data,
      },
      () => {
        window.location.reload();
      },
    );
  }

  _displayImage() {
    this._imageInputElement.click();
    this._inputElement.focus();
  }

  _displayPoll() {
    this.Poll.getFirstOption().focus();
  }

  _activate() {
    super._activate();

    this._inputElement.setAttribute('rows', 3);
    autosize(this._inputElement);
    this._inputElement.focus();
    this._closeElement.classList.remove('hide');
    this._closeElement.setAttribute('aria-hidden', !this.active);
    this._backdropdElement.setAttribute('aria-hidden', !this.active);
  }

  _deactivate() {
    super._deactivate();

    this._inputElement.setAttribute('rows', 1);
    autosize.destroy(this._inputElement);
    this._closeElement.classList.add('hide');
    this._closeElement.setAttribute('aria-hidden', !this.active);
    this._backdropdElement.setAttribute('aria-hidden', !this.active);

    this._inputElement.value = '';
    this._imageInputElement.value = '';
    this._imagePreviewElement.src = '';
    this._topicElement.selectedIndex = 0;

    this.setPostType('Text');
  }
}
