const { siteURL, router } = require('$config/config');

const makeDisputeDownloadUrl = dispute =>
  `${siteURL}${router.helpers.Disputes.download.url(dispute.id)}`;

module.exports = ({
  dispute,
}) => `Thank you for disputing your debt! You can download a copy of your dispute here:

${makeDisputeDownloadUrl(dispute)}

If you opted to mail the dispute yourself, it is a good idea to send it certified mail so you can be sure it was received. If you need help mailing it, we will send you the tracking info once it is sent.

Keep in touch with us! It's easy on the platform to send admins a message or photos of responses you receive from your collector(s). And we love to hear, of course, when the debt is discharged or removed from your credit. When you win, we all win.

Love,
TDC

P.S. You can also post any news you receive from the collector on the community pages. The more information we have about how collectors are responding to these disputes the better we can catch those who are breaking the law and organize together for debt relief.`;
