import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import flatten from 'lodash/flatten';
import Widget from '../../../lib/widget';
import { getCampaignPosts, csrfToken } from '../../../lib/api';
import PostText from '../../campaigns/show/posts/PostText';
import PostImage from '../../campaigns/show/posts/PostImage';
import PostPoll from '../../campaigns/show/posts/PostPoll';

export default class FeedController extends Widget {
  constructor(config) {
    super(config);

    this._loader = document.querySelector('.Campaign_FeedLoader');
    this._loadMoreBtn = document.querySelector(
      '.Campaign_FeedLoadMore > button',
    );

    this._loadPosts();
  }

  _renderMessage(template) {
    const element = document.createElement('div');
    element.insertAdjacentHTML('beforeend', template);

    this._loader.classList.add('hide');
    this.element.appendChild(element);
  }

  _loadPosts() {
    const campaignIds = map(this.campaigns, campaign => campaign.id);

    Promise.all(
      map(
        campaignIds,
        campaignId =>
          new Promise((resolve, reject) => {
            getCampaignPosts(
              {
                campaignId,
              },
              (err, results) => {
                if (err) {
                  return reject(err);
                }

                // add campaign to each post
                const posts = results.body.map(post => {
                  post.campaign = this.campaigns.filter(
                    campaign => campaign.id === post.campaignId,
                  )[0];

                  return post;
                });

                resolve(posts);
              },
            );
          }),
      ),
    ).then(posts => {
      let sortedPosts = flatten(posts);

      // sort posts by updatedAt DESC
      sortedPosts = sortBy(sortedPosts, post => -new Date(post.updatedAt));

      this.renderPosts(sortedPosts);
    });
  }

  renderPosts(posts) {
    const fragment = document.createDocumentFragment();
    let PostClass;

    posts.forEach(post => {
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
        default:
          throw new Error(`${post.type} not valid`);
      }

      this.appendChild(
        new PostClass({
          name: post.id,
          data: post,
          userIsCollectiveManager: false,
          userIsPostAuthor: false,
          userBelongsToCampaign: true,
          csrfToken,
        }),
      );

      fragment.appendChild(this[post.id].element);
    });

    this.element.appendChild(fragment);
    this._loader.classList.add('hide');
  }
}
