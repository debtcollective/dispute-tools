/* globals CONFIG, User, Account, Collective, DisputeStatus, Dispute */

const expect = require('chai').expect;
const path = require('path');
const { createUser, createDispute } = require('../../utils/helpers');
const puppeteer = require('puppeteer');

const truncate = require(path.join(process.cwd(), 'tests', 'utils', 'truncate'));

describe('DashboardController', () => {
  let browser;
  let page;
  let user;

  before(async function before() {
    this.timeout(10000);
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    page = await browser.newPage();
  });

  before(() =>
    createUser({ role: 'User' }).then(u => {
      user = u;
    }),
  );

  after(() => truncate([User, Account, DisputeStatus, Dispute]));

  after(async () => {
    await browser.close();
  });

  describe('without session', () => {
    it('should see 404', async () => {
      await page.goto('http://localhost:3000/dashboard');

      expect(await page.title()).to.eql('404 — The Debt Collective');
    });
  });

  describe('with session', () => {
    // login user
    before(async function before() {
      this.timeout(100000);

      await page.goto('http://localhost:3000/login');

      await page.type('input[name="email"]', user.email);
      await page.type('input[name="password"]', '12345678');

      return Promise.all([page.click('button[type="submit"]'), page.waitForNavigation()]);
    });

    it('shows collectives', async () => {
      await page.goto('http://localhost:3000/dashboard');

      const collectivesCount = await page.$$eval('.collectives-list-item', items => items.length);

      expect(collectivesCount).to.eq(1);
    });

    describe('with dispute', () => {
      before(() => createDispute(user));

      it('shows dispute status message', async () => {
        await page.goto('http://localhost:3000/dashboard');

        const title = await page.$eval('.dispute-status-title', e => e.innerHTML);

        expect(title).to.match(/You began a Wage Garnishment Dispute on/);
      });
    });
  });
});
