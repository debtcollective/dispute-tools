/* globals Li, logger */

Li.Engine.before.push(data => {
  logger.info(
    `${'Executing '.yellow +
      (data.spy.targetObject.className ||
        data.spy.targetObject.constructor.className)}.${data.spy.methodName}`,
  );
});

Li.Engine.error.push(data => {
  logger.error('Lithium Detected an error...');
  logger.error('ERROR:', data.error.toString());
});

Li.Engine.after.push(data => {
  logger.info(
    `${'Executed '.green +
      (data.spy.targetObject.className ||
        data.spy.targetObject.constructor.className)}.${
      data.spy.methodName
    } on ${data.time}ms`,
  );
});
