'use strict';

process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();

describe('vault cli', () => {
  let hook;
  beforeEach(() => { hook = captureStream(process.stdout); });
  afterEach(() => { hook.unhook(); });
  it('should not error', () => {
    const vault = require('../src/index');
    (hook.captured()).should.eql('\nusage:\n  vault-cli PROJECT ENV METHOD [key value]\n\n');
  });
});

function captureStream(stream){
  var oldWrite = stream.write;
  var buf = '';
  stream.write = function(chunk, encoding, callback) {
    buf += chunk.toString();
    oldWrite.apply(stream, arguments);
  };
  return {
    unhook: function unhook(){
     stream.write = oldWrite;
    },
    captured: function(){
      return buf;
    }
  };
}
