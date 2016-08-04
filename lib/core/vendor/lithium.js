/**
 * Resolves the global namespace.
 *
 * @returns window if available otherwise it will try to return the
 * global scope.
 *
 */
var globalScope = function globalScope() {
    try {
        return window;
    } catch (error) {
        return global;
    }
};

globalScope().enableLi = true;

globalScope().performance = globalScope().performance || {};
performance.now = (function() {
  return performance.now       ||
         performance.mozNow    ||
         performance.msNow     ||
         performance.oNow      ||
         performance.webkitNow ||
         function() {
            var hrTime = process.hrtime();
            return (hrTime[0] + (hrTime[1] / 1000000));
         };
})();

Li = {
    Engine : {
        before : [],
        error : [],
        after : []
    },
    stack : [],
    events : [],
    network : [],
    previousError : [],
    performance : [],
    nest : 0
};

Class(Li, 'ObjectSpy')({
    prototype : {
        spies : null,
        init : function () {
            this.spies = [];
        },
        spy : function (targetObject, configuration) {
            configuration = configuration || {};
            Object.getOwnPropertyNames(targetObject).forEach(function (property) {
                var spy;
                try {
                    if (typeof targetObject[property] !== "function"){
                        return false;
                    }
                }
                catch (error) {
                    return false;
                }

                if (configuration.except && configuration.except.indexOf(property) > -1) {
                    return;
                }
                spy = new Li.Spy();
                spy.on(targetObject).method(property);
                this.spies.push(spy);
            }, this);
        },
        destroy : function () {
            this.spies.forEach(function (spy) {
                spy.removeSpy();
            });
            this.spies = null;
        }
    }
});

Class(Li, 'Spy')({
    prototype : {
        targetObject : null,
        methodName : null,
        spyMethod : null,
        originalMethod : null,
        objectHasMethod : null,
        called : null,
        init : function (config) {
            config = config || {};

            this.called = [];
            this.targetObject = config.targetObject;
            this.methodName = config.methodName;
        },
        applySpy : function () {
            var spy;

            spy = this;
            if (this.targetObject.hasOwnProperty(this.methodName) === false) {
                this.objectHasMethod = false;
            }
            else {
                this.objectHasMethod = true;
            }

            this.originalMethod = this.targetObject[this.methodName];

            this.targetObject[this.methodName] = function () {
                var args,
                    result,
                    scope,
                    beforeEngines,
                    errorEngines,
                    afterEngines,
                    i,
                    startTime,
                    endTime,
                    totalTime;

                scope = this;
                args = Array.prototype.slice.call(arguments, 0, arguments.length);
                beforeEngines = Li.Engine.before;
                errorEngines = Li.Engine.error;
                afterEngines = Li.Engine.after;

                if (this === spy) {
                    scope = spy.targetObject;
                }

                for (i = 0; i < beforeEngines.length; i++) {
                    beforeEngines[i]({
                        scope : scope,
                        args : args,
                        spy : spy
                    });
                }

                try {
                    startTime = performance.now();
                    result = spy.originalMethod.apply(scope, args);
                    endTime = performance.now();
                } catch (error) {
                    if(errorEngines.length > 0) {
                        for (i = 0; i < errorEngines.length; i++) {
                            errorEngines[i]({
                                scope : scope,
                                args : args,
                                spy : spy,
                                error : error
                            });
                        }
                    } else {
                        throw(error);
                    }
                } finally {
                    if (endTime) {
                        totalTime = endTime - startTime;
                    }
                    for (i = 0; i < afterEngines.length; i++) {
                        afterEngines[i]({
                            scope : scope,
                            args : args,
                            spy : spy,
                            time : totalTime
                        });
                    }

                    return result;
                }
            };

            this.targetObject[this.methodName].__isSpy = true;
            this.targetObject[this.methodName].__spy = this.spy;

            Object.getOwnPropertyNames(this.originalMethod).forEach(function (property) {
                spy.targetObject[spy.methodName][property] = spy.originalMethod[property];
            });

            return this;
        },
        removeSpy : function () {
            if (this.objectHasMethod === true) {
                this.targetObject[this.methodName] = this.originalMethod;
            }
            else {
                delete this.targetObject[this.methodName];
            }
            return this;
        },
        on : function (targetObject) {
            this.targetObject = targetObject;
            return this;
        },
        method : function (methodName) {
            this.methodName = methodName;
            this.applySpy();
            return this;
        }
    }
});
