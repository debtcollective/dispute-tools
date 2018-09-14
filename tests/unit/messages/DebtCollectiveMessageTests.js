const { expect } = require('chai');
const DebtCollectiveMessage = require('$services/messages/DebtCollectiveMessage');

const CBInfo = Symbol('Callback Info');

describe('DebtCollectiveMessage', () => {
  describe('send', () => {
    let sendMail;
    let render;
    let sent;
    before(() => {
      sendMail = DebtCollectiveMessage.transport.sendMail;
      DebtCollectiveMessage.transport.sendMail = (config, cb) => {
        sent = config;
        cb(null, CBInfo);
      };

      render = DebtCollectiveMessage.prototype.render;
      DebtCollectiveMessage.prototype.render = () => 'Rendered!';
    });
    after(() => {
      DebtCollectiveMessage.transport.sendMail = sendMail;
      DebtCollectiveMessage.prototype.render = render;
    });

    beforeEach(() => {
      sent = null;
    });

    it("should use the instance's from address", async () => {
      const from = 'test from address';
      await new DebtCollectiveMessage('Test DebtCollectiveMessage', { from }).send();
      expect(sent.from).eq(from);
    });

    it("should use the instance's to address", async () => {
      const to = 'test to address';
      await new DebtCollectiveMessage('Test DebtCollectiveMessage', { to }).send();
      expect(sent.to).eq(to);
    });

    it("should use the instance's subject", async () => {
      const subject = 'test subject';
      await new DebtCollectiveMessage('Test DebtCollectiveMessage', { subject }).send();
      expect(sent.subject).eq(subject);
    });

    it('render if no text is passed', async () => {
      await new DebtCollectiveMessage('Test DebtCollectiveMessage', {}).send();
      expect(sent.html).eq('Rendered!');
    });

    it('should resolve with the email info', async () => {
      const info = await new DebtCollectiveMessage('Test DebtCollectiveMessage', {}).send();
      expect(info).eq(CBInfo);
    });

    describe('when not using SES', () => {
      let SES;
      before(() => {
        SES = DebtCollectiveMessage.SES;
        DebtCollectiveMessage.SES = null;
      });
      after(() => {
        DebtCollectiveMessage.SES = SES;
      });

      it('should not send SES tags', async () => {
        await new DebtCollectiveMessage('Test DebtCollectiveMessage', {}).send();
        expect(sent.ses).not.exist;
        expect().same;
      });
    });

    describe('when using SES', () => {
      let SES;
      before(() => {
        SES = DebtCollectiveMessage.SES;
        // Just needs to be not null
        DebtCollectiveMessage.SES = true;
      });
      after(() => {
        DebtCollectiveMessage.SES = SES;
      });

      it('should send the SES tags', async () => {
        const email = new DebtCollectiveMessage('Test DebtCollectiveMessage', {});
        await email.send();
        expect(sent.ses).exist;
        expect(sent.ses.Tags).exist;
      });
    });
  });

  describe('Tags', () => {
    it('should include the to -> subject tag', () => {
      const to = 'Test to address';
      const subject = 'Test subject';
      const { Tags } = new DebtCollectiveMessage('Test DebtCollectiveMessage', {
        to,
        subject,
      }).Tags;

      expect(Array.isArray(Tags), 'Tags was not an array').true;
      expect(Tags).include({ Name: to, Value: subject });
    });

    it('should include the name tag', () => {
      const name = 'Test email name';
      const { Tags } = new DebtCollectiveMessage(name, {}).Tags;

      expect(Array.isArray(Tags), 'Tags was not an array').true;
      expect(Tags).include({ Name: 'name', Value: name });
    });
  });
});
