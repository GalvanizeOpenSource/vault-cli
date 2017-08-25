'use strict';  // eslint-disable-line

process.env.NODE_ENV = 'test';

const chai = require('chai');

chai.should();

function captureStream(stream) {
  const oldWrite = stream.write;
  let buf = '';
  stream.write = function (chunk) { // eslint-disable-line
    buf += chunk.toString();
    oldWrite.apply(stream, arguments);  // eslint-disable-line
  };
  return {
    unhook() {
      stream.write = oldWrite;  // eslint-disable-line
    },
    captured() {
      return buf;
    },
  };
}

describe('vault cli', () => {
  let hook;
  beforeEach(() => { hook = captureStream(process.stdout); });
  afterEach(() => { hook.unhook(); });
  it('should not error', () => {
    require('../src/index');  // eslint-disable-line
    (hook.captured()).should.eql('\nusage:\n  vault-cli PROJECT ENV METHOD [key value]\n\n');
  });
});
