import Post from './Post';

export default class PostImage extends Post {
  template(data) {
    return `
      <div class="Campaign_FeedItem mb1">
        <div class='-bg-white p2'>
          <div class="flex relative">
            ${this._tag(data.topic)}
            <div>
              ${this._getPostAuthorAvatar(data.user.account)}
            </div>
            <div class="flex-auto pl2">
              <p class="-fw-500">${data.user.account.fullname}</p>
              <p class="pb2 -caption -neutral-dark">${new Date(data.createdAt).toDateString()}</p>
              <p class="-fw-500">${data.data.text}</p>
              <img src='${data.imageURL}' class='fit' />
              <div class="right-align">
                <button class="Post_ToggleCommentsBtn btn-clear"
                  aria-expanded="false"
                  aria-controls="comments-${data.id}"
                >
                  <svg class="inline-block align-middle" width="20" height="20">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-comment"></use>
                  </svg>
                  <span class="inline-block align-middle pl1">${data.comments.length}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class='Campaign_FeedItemComments -bg-white'
          id='comments-${data.id}'
          aria-expanded="false"
        >
          ${data.comments.map(comment => this._printComment(comment)).join('')}
        </div>
      </div>
    `;
  }
}
