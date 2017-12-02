import autosize from 'autosize';
import Widget from '../../../../../lib/widget';
import { postCreateComment } from '../../../../../lib/api';
import currentUser from '../../../../../lib/currentUser';
import Button from '../../../../../components/Button';

export default class NewComment extends Widget {
  constructor(config) {
    super(config);

    this.textareaElement = this.element.querySelector('textarea');
    this.appendChild(new Button({
      name: 'buttonWidget',
      element: this.element.querySelector('button'),
    }));

    this._bindEvents();
  }

  template() {
    return `
      <div class='p2'>
        <div class='flex'>
          <div>
            <img
              src='${currentUser.getImage('smallRedSquare')}'
              alt='${currentUser.get('account').fullname}'
              class='mr1'
              width='50' height='50'/>
          </div>
          <div class='flex-auto right-align'>
            <textarea
              class='-k-textarea -no-border -transparent block -fw -rn'
              rows='1'
              placeholder='Write a comment...'></textarea>
            <button class='-k-btn btn-primary -xs -fw-500 mt1' disabled>Post comment</button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Automatically adjust textarea height.
   * @override
   */
  activate() {
    autosize(this.textareaElement);
  }

  /**
   * Removes autosize and reverts its changes from a textarea element.
   * @override
   */
  deactivate() {
    autosize.destroy(this.textareaElement);
  }

  _bindEvents() {
    this._handleNewCommentSubmit = this._handleNewCommentSubmit.bind(this);
    this.buttonWidget.element.addEventListener('click', this._handleNewCommentSubmit);

    this._handleInputKeyUp = this._handleInputKeyUp.bind(this);
    this.textareaElement.addEventListener('keyup', this._handleInputKeyUp);
  }

  /**
   * Tries to create a new Comment (API endpoint).
   * @private
   * @emits {newComment} emit event when the server response is returned.
   */
  _handleNewCommentSubmit() {
    const text = this.textareaElement.value;
    const parentId = this.data.id;

    if (!text.length) {
      return;
    }

    this.buttonWidget.disable().updateText();

    postCreateComment({
      campaignId: this.data.campaignId,
      postId: this.data.id,
      body: { text, parentId },
    }, (err, res) => {
      res.body.user = currentUser.get();
      this.textareaElement.value = '';
      this.buttonWidget.restoreText();

      this.dispatch('newComment', { err, res });
    });
  }

  _handleInputKeyUp() {
    const state = this.textareaElement.value.length ? 'enable' : 'disable';
    this.buttonWidget[state]();
  }
}
