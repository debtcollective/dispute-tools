const { expect } = require('chai');
const Email = require('../../../services/email/Email');

const CBInfo = Symbol('Callback Info');

describe('Email', () => {
  describe('send', () => {
    let sendMail;
    let render;
    let sent;
    before(() => {
      sendMail = Email.transport.sendMail;
      Email.transport.sendMail = (config, cb) => {
        sent = config;
        cb(null, CBInfo);
      };

      render = Email.prototype.render;
      Email.prototype.render = () => 'Rendered!';
    });
    after(() => {
      Email.transport.sendMail = sendMail;
      Email.prototype.render = render;
    });

    beforeEach(() => {
      sent = null;
    });

    it("should use the instance's from address", async () => {
      const from = 'test from address';
      await new Email('Test Email', { from }).send();
      expect(sent.from).eq(from);
    });

    it("should use the instance's to address", async () => {
      const to = 'test to address';
      await new Email('Test Email', { to }).send();
      expect(sent.to).eq(to);
    });

    it("should use the instance's subject", async () => {
      const subject = 'test subject';
      await new Email('Test Email', { subject }).send();
      expect(sent.subject).eq(subject);
    });

    it('render if no text is passed', async () => {
      await new Email('Test Email', {}).send();
      expect(sent.text).eq('Rendered!');
    });

    it('should resolve with the email info', async () => {
      const info = await new Email('Test Email', {}).send();
      expect(info).eq(CBInfo);
    });

    describe('when not using SES', () => {
      let SES;
      before(() => {
        SES = Email.SES;
        Email.SES = null;
      });
      after(() => {
        Email.SES = SES;
      });

      it('should not send SES tags', async () => {
        await new Email('Test Email', {}).send();
        expect(sent.ses).not.exist;
        expect().same;
      });
    });

    describe('when using SES', () => {
      let SES;
      before(() => {
        SES = Email.SES;
        // Just needs to be not null
        Email.SES = true;
      });
      after(() => {
        Email.SES = SES;
      });

      it('should send the SES tags', async () => {
        const email = new Email('Test Email', {});
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
      const { Tags } = new Email('Test Email', { to, subject }).Tags;

      expect(Array.isArray(Tags), 'Tags was not an array').true;
      expect(Tags).include({ Name: to, Value: subject });
    });

    it('should include the name tag', () => {
      const name = 'Test email name';
      const { Tags } = new Email(name, {}).Tags;

      expect(Array.isArray(Tags), 'Tags was not an array').true;
      expect(Tags).include({ Name: 'name', Value: name });
    });
  });
});
