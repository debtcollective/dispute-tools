/* globals Post, Dispute, Account, Collective */
const sa = require('superagent');
const { expect } = require('chai');
const { createUser, createEvent, signInAs, createPost,
        createDispute } = require('../../../utils/helpers');
const truncate = require('../../../utils/truncate');
const config = require('../../../../config/config');
const User = require('../../../../models/User');

const agent = sa.agent();
const { siteURL } = config.env();
const urls = config.router.helpers;

const _userMailer = global.UserMailer;

describe('Admin/UsersController', () => {
  let _csrf;

  before(() => {
    global.UserMailer = {
      sendActivation() { return Promise.resolve(); },
      sendResetPasswordLink() { return Promise.resolve(); },
    };
  });

  beforeEach(() =>
    createUser('Admin')
    .then(admin => signInAs(admin, agent))
    .then(csrf => {
      _csrf = csrf;
    }));

  after(() => {
    global.UserMailer = _userMailer;
    return truncate(User);
  });

  describe('#destroy', () => {
    let collect;

    after(() => truncate(User));

    const deletionRequest = function httpDel(target) {
      return agent.delete(`${siteURL}${urls.Admin.Users.destroy.url(target.id)}`)
      .set({ 'csrf-token': _csrf })
      .catch((err) => {
        throw new Error(`deletion request failed: ${err.stack}`);
      });
    };

    describe('fails', () => {
      let immortalUser;

      beforeEach(() =>
        createUser('User')
          .then(created => {
            immortalUser = created;
      }));

      it('if the user owns an event', () =>
        createEvent(immortalUser)
        // attempt to delete user
        .then(() => deletionRequest(immortalUser))
        .then(() => User.query().where('id', immortalUser.id))
        .then(([user]) => {
          expect(user).to.be.defined;
        }));

      it('if the user is an Admin', () =>
        // create an admin user
        createUser('Admin')
        .then((admin) => deletionRequest(admin)
          .then(() => User.query().where('id', admin.id))
          .then(([user]) => {
            expect(user).to.be.defined;
          })));
        });

    describe('succeeds', () => {
      let mortalUser;
      let postId;

      beforeEach(() =>
        createUser('User')
        .then((usr) => {
          // the user posts something
          mortalUser = usr;
          return createPost(mortalUser);
        })
        .then((newPost) => {
          postId = newPost.id;
        })
        // the user opens some disputes
        .then(() => createDispute(mortalUser))
        .then(() => createDispute(mortalUser))
        // find and store the user's collective id
        .then(() => User.query().where('id', mortalUser.id).include('debtTypes'))
        .then(([user]) => {
          collect = user.debtTypes[0];
        })
        // delete the user
        .then(() => deletionRequest(mortalUser)));

      after(() => truncate(Post));

      it('no errors, status correct', () =>
        // create a user
        createUser('User')
        .then((delUser) => deletionRequest(delUser))
        .then((res) => {
          // successful deletion
          expect(res.status).to.be.equal(200);
        }));

      it('the user is deleted', () =>
        User.query().where('id', mortalUser.id)
        .then((users) => expect(users).to.be.empty));

      it('the user\'s disputes are deleted', () =>
        Dispute.query().where('user_id', mortalUser.id)
        .then((disputes) => expect(disputes).to.be.empty));

      it('the user\'s account is deleted', () =>
        Account.query().where('user_id', mortalUser.id)
        .then((accounts) => expect(accounts).to.be.empty));

      it('the user\'s posts are not deleted, but their new user_id is null', () =>
         Post.query().where('id', postId)
         .then((posts) => {
           expect(posts.length).to.be.equal(1);
           return Promise.all(posts.map((post) => expect(post.userId).to.be.null));
         }));

      it('decreases the collective member count', () =>
        Collective.query().where('id', collect.id).include('userCount')
        .then(([updated]) => expect(updated.userCount).to.be.equal(collect.userCount - 1)));
    });
  });
});