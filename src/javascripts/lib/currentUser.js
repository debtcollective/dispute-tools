export default {
  _: {},

  set(userData) {
    if (userData) {
      this._ = userData;
    }
  },

  get(propertyName) {
    if (propertyName) {
      return this._[propertyName];
    }

    return this._;
  },

  getImage(version) {
    const account = this.get('account');
    let imagePath = '/images/profile/placeholder-small.png';

    if (account && account.image.urls[version]) {
      imagePath = account.image.urls[version];
    }

    return imagePath;
  },
};
