const assert = require('assert');
const { DihuanTool } = require('../src/index.js');

assert.strictEqual(DihuanTool.calculate(5), 11, 'calculate(5) 应为 11');
assert.strictEqual(DihuanTool.calculate(0), 1, 'calculate(0) 应为 1');
assert.strictEqual(DihuanTool.calculate(-3), -5, 'calculate(-3) 应为 -5');
assert.strictEqual(DihuanTool.calculate(2.5), 6, 'calculate(2.5) 应为 6');

console.log('4 个测试全部通过 ✔');
