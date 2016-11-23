import Widget from '../../../lib/widget';
import PostText from './PostText';
import PostImage from './PostImage';
import PostPoll from './PostPoll';

export default class Post extends Widget {
  constructor(config) {
    super(config);
    switch(config.data.type) {
      case 'Text':
        const a = new PostText(config.data);
        break;
    }
    // new Post[config.data.type](config.data);
  }
}
