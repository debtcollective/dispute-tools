import Post from './Post';

export default class PostImage extends Post {
  template(data) {
    return `
      <div class='Campaign_FeedItem'>
        <div data-campaing-post-container class='-bg-white p2'>
          <div class='flex relative'>
            ${this.getTopicHTMLString(data.topic)}
            <div>
              ${this.getAvatarHTMLString(data.user.account)}
            </div>
            <div class='flex-auto pl2'>
              <p class='-fw-500'>${data.user.account.fullname}</p>
              <p class='pb2 -caption -neutral-dark'>${new Date(data.createdAt).toDateString()}</p>
              <p class='-fw-500'>${data.data.text}</p>
              <img src='${data.imageURL}' class='fit' />
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
