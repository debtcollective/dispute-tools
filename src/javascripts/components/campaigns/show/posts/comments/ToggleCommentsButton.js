import Widget from '../../../../../lib/widget';

export default class ToggleCommentsButton extends Widget {
  constructor(config) {
    super(config);
    this.totalCommentsLabel = this.element.querySelector('span');
  }

  template(post) {
    return `
      <button class='Post_ToggleCommentsBtn btn-clear'
        aria-expanded='false'
        aria-controls='comments-${post.id}'
      >
        <svg class='inline-block align-middle' width='20' height='20'>
          <use xlink:href='#svg-comment'></use>
        </svg>
        <span class='inline-block align-middle pl1'>${post.comments.length}</span>
      </button>
    `;
  }

  /**
   * Updates the button label (total comments counter).
   * @public
   * @param {string} label - the text to display on the button
   * @chainable
   */
  updateLabel(label) {
    this.totalCommentsLabel.innerHTML = label;
    return this;
  }
}
