# dihuan-tool

A tiny tool package: `DihuanTool.calculate(number)` returns `number * 2 + 1`.

## Installation

Install from GitHub (no npm publish needed):

```bash
npm install github:<你的GitHub用户名>/<仓库名>
```

## Usage

```js
const { DihuanTool } = require('dihuan-tool');

DihuanTool.calculate(5);  // => 11
DihuanTool.calculate(0);  // => 1
DihuanTool.calculate(-3); // => -5
DihuanTool.calculate(2.5); // => 6
```

## API

### `DihuanTool.calculate(number)`

| 参数 | 类型 | 说明 |
|------|------|------|
| `number` | number | 任意数字 |

**返回**：`number * 2 + 1`（number）

## Test

```bash
npm test
```

## License

MIT
