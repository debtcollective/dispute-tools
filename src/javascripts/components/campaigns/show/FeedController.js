import Widget from '../../../lib/widget';
import { getCampaignPosts, csrfToken } from '../../../lib/api';
import PostText from './posts/PostText';
import PostImage from './posts/PostImage';
import PostPoll from './posts/PostPoll';

export default class FeedController extends Widget {
  constructor(config) {
    super(config);

    this._totalCount = 0;
    this._totalPages = 0;
    this._currentPage = 1;

    this._loader = document.querySelector('.Campaign_FeedLoader');
    this._loadMoreBtn = document.querySelector('.Campaign_FeedLoadMore > button');

    if (!this._loadMoreBtn) return;

    this._bindEvents()._loadPosts();
  }

  _bindEvents() {
    this._handlePostLoadResponse = this._handlePostLoadResponse.bind(this);
    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);

    this._loadMoreBtn.addEventListener('click', this._handleLoadMoreButtonClick);
    return this;
  }

  _handleLoadMoreButtonClick() {
    this._loadMoreBtn.classList.add('hide');
    this._loader.classList.remove('hide');
    this._currentPage++;
    this._loadPosts();
  }

  _loadPosts() {
    getCampaignPosts({
      campaignId: this.campaignId,
      page: this._currentPage,
    }, this._handlePostLoadResponse);
  }

  _handlePostLoadResponse(err, res) {
    const fragment = document.createDocumentFragment();
    let PostClass;

    this._totalCount = parseInt(res.headers.get('total_count'), 10);
    this._totalPages = parseInt(res.headers.get('total_pages'), 10);

    res.body.forEach(post => {
      switch (post.type) {
        case 'Text':
          PostClass = PostText;
          break;
        case 'Image':
          PostClass = PostImage;
          break;
        case 'Poll':
          PostClass = PostPoll;
          break;
        default: throw new Error(`${post.type} not valid`);
      }

      this.appendChild(new PostClass({
        name: post.id,
        data: post,
        userIsCollectiveManager: this.userIsAdminOrCollectiveManager,
        userIsPostAuthor: this.currentUser ? this.currentUser.id === post.userId : false,
        userBelongsToCampaign: this.userBelongsToCampaign,
        deletePostActionUrl: this.deletePostActionUrl.replace('{postId}', post.id),
        csrfToken,
      }));

      fragment.appendChild(this[post.id].element);
    });

    this.element.appendChild(fragment);
    this._loader.classList.add('hide');

    if (this._currentPage >= this._totalPages) {
      this._loadMoreBtn.removeEventListener('click', this._handleLoadMoreButtonClick);
      this._loadMoreBtn.parentElement.removeChild(this._loadMoreBtn);
      this._handleLoadMoreButtonClick = null;
    } else {
      this._loadMoreBtn.classList.remove('hide');
    }
  }
}
