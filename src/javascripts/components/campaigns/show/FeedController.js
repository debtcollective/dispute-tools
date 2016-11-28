import Widget from '../../../lib/widget';
import API from '../../../lib/api';
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

    this._bindEvents().loadPosts();
  }

  loadPosts() {
    API.getCampaignPosts({
      campaignId: this.campaignId,
      page: this._currentPage,
    }, this._handlePostLoad);
  }

  _bindEvents() {
    this._loadMoreBtn.addEventListener('click', () => {
      this._loader.classList.remove('hide');
      this._currentPage++;
      this.loadPosts();
    });

    this._handlePostLoad = this._handlePostLoad.bind(this);

    return this;
  }

  _handlePostLoad(err, res) {
    this._totalCount = parseInt(res.headers.total_count, 10);
    this._totalPages = parseInt(res.headers.total_pages, 10);

    const fragment = document.createDocumentFragment();
    res.body.forEach(post => {
      let X;

      switch (post.type) {
        case 'Text': X = PostText; break;
        case 'Image': X = PostImage; break;
        case 'Poll': X = PostPoll; break;
        default: throw new Error(`${post.type} not valid`);
      }

      this.appendChild(new X({
        name: post.id,
        data: post,
      }));

      fragment.appendChild(this[post.id].element);
    });

    this.element.appendChild(fragment);

    this._loader.classList.add('hide');

    if (this._currentPage >= this._totalPages) {
      this._loadMoreBtn.parentElement.removeChild(this._loadMoreBtn);
    } else {
      this._loadMoreBtn.parentElement.classList.remove('hide');
    }
  }
}
