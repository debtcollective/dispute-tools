/* eslint-disable no-console */
import Widget from '../../../lib/widget';
import API from '../../../lib/api';
import PostText from './PostText';
import PostImage from './PostImage';
import PostPoll from './PostPoll';

export default class FeedController extends Widget {
  constructor(config) {
    super(config);

    API.getCampaignPosts({
      campaignId: this.campaignId,
    }, (err, res) => {
      console.log(err);
      console.log(res);
      res.body.forEach(post => {
        console.log(post);
        let X;

        switch (post.type) {
          case 'Text':
            X = PostText;
            break;
          case 'Image':
            X = PostImage;
            break;
          case 'Poll':
            X = PostPoll;
            break;
          default:
            throw new Error(`${post.type} not valid`);
        }

        this.appendChild(new X({
          name: post.id,
          data: post,
        })).render(this.element);
      });
    });
  }
}
