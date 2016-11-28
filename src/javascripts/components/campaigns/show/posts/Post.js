import Pisces from 'pisces';
import Widget from '../../../../lib/widget';
import CommentBox from './CommentBox';

export default class Post extends Widget {
  constructor(config) {
    super(config);

    this.feedComments = this.element.querySelector('.Campaign_FeedItemComments');
    this.toggleCommentsBtn = this.element.querySelector('.Post_ToggleCommentsBtn');
    this.expandedComments = false;

    this.piscesComment = new Pisces();

    this.totalCommentsLabel = this.toggleCommentsBtn.querySelector('span');
    this.totalComments = this.data.comments.length;

    this.appendChild(new CommentBox({
      name: 'CommentBox',
      data: this.data,
    })).render(this.feedComments);

    this.__bindEvents();
  }

  __bindEvents() {
    this._handleToogleCommentsRef = this._handleToogleComments.bind(this);
    this.toggleCommentsBtn.addEventListener('click', this._handleToogleCommentsRef);

    this._handleCommentCreatedRef = this._handleCommentCreated.bind(this);
    this.CommentBox.bind('commentCreated', this._handleCommentCreatedRef);

    return this;
  }

  _handleToogleComments() {
    this.expandedComments = !this.expandedComments;

    this.toggleCommentsBtn.setAttribute('aria-expanded', this.expandedComments);
    this.feedComments.setAttribute('aria-expanded', this.expandedComments);

    this.CommentBox[this.expandedComments ? 'activate' : 'deactivate']();
  }

  _handleCommentCreated(ev) {
    this.feedComments.insertAdjacentHTML('afterbegin', this._printComment(ev.res.body));

    let y = this.element.getBoundingClientRect().top;
    y = (y >= 0) ? `+${y}` : y.toString();

    this.piscesComment.scrollToPosition({ y }, {
      onComplete: () => {
        this.totalCommentsLabel.innerHTML = ++this.totalComments;
      },
    });
  }

  _tag(topic) {
    if (!topic) {
      return '';
    }

    return `<span class="Post_Topic -bg-accent -caption -ttu -fw-700">${topic.title}</span>`;
  }

  _printComment(comment) {
    return `
      <div class='Campaign_FeedItemComment -bg-neutral-light p2'>
        <div class='flex'>
          <div>
            ${this._getPostAuthorAvatar(comment.user.account)}
          </div>
          <div class='flex-auto pl2'>
            <p class="-fw-500">${comment.user.account.fullname}</p>
            <p class="pb2 -caption -neutral-dark">${new Date(comment.createdAt).toDateString()}</p>
            <p>${comment.data.text}</p>
          </div>
        </div>
      </div>
    `;
  }

  _getPostAuthorAvatar(account, size = 50) {
    const url = account.image.urls.smallRedSquare || '/images/profile/placeholder-small.png';
    return `<img src="${url}" alt="${account.fullname}" width="${size}" height="${size}"/>`;
  }
}
