import Widget from '../../../../../lib/widget';

export default class CommentList extends Widget {
  constructor(config) {
    super(config);
    this.postsWrapper = this.element.querySelector('[data-posts-wrapper]');
  }

  template(post) {
    return `
      <div class='Campaign_FeedItemComments -bg-white'
        id='comments-${post.id}'
        aria-expanded='false'
      >
        <div data-posts-wrapper>
          ${post.comments
            .map(comment => this._getCommentHTMLString(comment))
            .join('')}
        </div>
      </div>
    `;
  }

  /**
   * Appends a new comment to the list.
   * @public
   * @param {Object} comment - the comment’s data model
   * @property {Object} comment.user.account - data of the user who created the comment.
   * @property {Object} comment.data.text - the actual comment text
   * @chainable
   */
  appendComment(comment) {
    this.postsWrapper.insertAdjacentHTML(
      'beforeend',
      this._getCommentHTMLString(comment),
    );
    return this;
  }

  _getCommentHTMLString(comment) {
    return `
      <div class='Campaign_FeedItemComment -bg-neutral-light p2'>
        <div class='flex'>
          <div>
            ${this._getAvatarHTMLString(comment.user.account)}
          </div>
          <div class='flex-auto pl2'>
            <p class='-fw-500'>${comment.user.account.fullname}</p>
            <p class='pb2 -caption -neutral-dark'>${new Date(
              comment.createdAt,
            ).toDateString()}</p>
            <p>${comment.data.text}</p>
          </div>
        </div>
      </div>
    `;
  }

  _getAvatarHTMLString(account) {
    const url =
      account.image.urls.smallRedSquare ||
      '/images/profile/placeholder-small.png';
    return `<img src='${url}' alt='${
      account.fullname
    }' width='50' height='50'/>`;
  }
}
