/**
 * @author Adrian C. Miranda <adriancmiranda@gmail.com>
 * @see https://github.com/adriancmiranda/trace
 * @version 1.0.8
 */
(function(global, factory){
  'use strict';

  if(typeof module === 'object' && typeof module.exports === 'object'){
    global.trace = module.exports = factory(global, true).log;
  }else{
    global.trace = factory(global).log;
  }

}(typeof window !== 'undefined'? window : this, function(global, nodeEnv){
  'use strict';

  var href = nodeEnv ? global.url.href : (global.location !== global.parent.location ? document.referrer : document.location.href);
  var debug = /\bdebug\b/i.test(href);
  var slice = Array.prototype.slice;

  function wrap(console, method){
    var output = console[method];
    console[method] = function(){
      if(!console.enabled) return void(0);
      var args = slice.call(arguments);
      if(console.history.length >= console.scrollback){
        console.history.shift();
      }
      console.history.push({ type:method, message:args });
      return output && output.apply && output.apply(console, args);
    };
  }

  function Logger(console){
    var list = [];
    var methods = 'table,assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,timeStamp,profile,profileEnd,time,timeEnd,trace,warn,log'.split(',');
    console.enabled = debug || console.enabled;
    while(methods.length){
      wrap(console, methods.pop());
    }
    console.push = function(){
      list = list.concat(slice.call(arguments));
    };
    console.flush = function(){
      console.log(list.join('\n'));
      list = [];
    };
    return console;
  }

  function getConsole(limit){
    try{
      console.log();
      global.console.history = [];
      global.console.scrollback = limit;
    }catch(error){
      global.console = { history:[], scrollback:limit };
    }
    return global.console;
  }

  return Logger(getConsole(global.console && typeof global.console.scrollback === 'number'?
    global.console.scrollback : 1
  ));
}));