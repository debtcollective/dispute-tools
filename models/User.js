/* global Krypton, Class */
const config = require('$config/config');

const User = Class('User').inherits(Krypton.Model)({
  tableName: 'Users',
  validations: {},

  attributes: [
    'id',
    'name',
    'email',
    'username',
    'avatarUrl',
    'admin',
    'externalId',
    'createdAt',
    'updatedAt',
  ],

  processors: [users => users.map(u => ({ ...u, safeName: u.name || u.username }))],

  getAdmins() {
    return User.query().where({ admin: true });
  },

  prototype: {
    init(config) {
      Krypton.Model.prototype.init.call(this, config);
    },
    setInfo(info) {
      const hasAdminRole = info.groups.includes(config.discourse.adminRole);
      const isDiscourseAdmin = info.admin === 'true';
      const admin = hasAdminRole || isDiscourseAdmin;
      const externalId = info.external_id || this.externalId;
      const avatarUrl = info.avatar_url || '';

      // Discourse returns + instead of spaces for names
      const name = (info.name || '').replace(/\+/g, ' ');

      Object.assign(this, {
        name,
        email: info.email,
        username: info.username,
        externalId,
        admin,
        avatarUrl,
      });

      return this;
    },
    getProfileUrl() {
      return `${config.discourse.baseUrl}/u/${this.username}`;
    },

    // Discourse returns the url without the port in development
    // Use this method instead of avatarUrl to get around this
    getAvatarUrl() {
      let avatarUrl = this.avatarUrl || '';

      if (config.environment === 'development') {
        avatarUrl = avatarUrl.replace('localhost', 'localhost:3000');
      }

      return avatarUrl;
    },
  },
});

module.exports = User;
