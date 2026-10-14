# 封装自己的 npm 依赖并存储到个人 GitHub —— 分步教程

## 目标

封装一个依赖包 `dihuantool`，提供 API：

```js
const { DihuanTool } = require('dihuantool');
DihuanTool.calculate(5); // => 11  （即 number * 2 + 1）
```

**分发方式**：仅存储在个人 GitHub 仓库，使用者通过以下命令安装：

```bash
npm install github:<你的GitHub用户名>/<仓库名>
```

> 不发布到 npmjs.com，因此不需要注册 npm 账号，只需 GitHub 账号。

## 最终目录结构

```
dependenceTest/
├── TUTORIAL.md        # 本教程
├── package.json       # 包描述、入口、版本等
├── src/
│   └── index.js       # 源码：DihuanTool.calculate
├── test/
│   └── test.js        # 本地验证脚本
├── README.md          # 使用文档
├── LICENSE            # 开源协议
└── .gitignore         # 忽略 node_modules 等
```

## 步骤总览

| 步骤 | 内容 | 状态 |
|------|------|------|
| Step 1 | 理解原理 + 环境检查 + 创建目录 | ✅ |
| Step 2 | 初始化项目：编写 `package.json` | ✅ |
| Step 3 | 编写源码：`DihuanTool.calculate` | ✅ |
| Step 4 | 本地测试验证 | ✅ |
| Step 5 | 补充 README / LICENSE / .gitignore | ✅ |
| Step 6 | 初始化 Git 并推送到个人 GitHub | ✅ |
| Step 7 | 从 GitHub 远程安装验证 | ⬜ |

---

## Step 1：理解原理 + 环境检查 + 创建目录

### 1.1 一个 npm 包的本质

一个 npm 包本质上就是一个**带有 `package.json` 的文件夹**。`package.json` 里最重要的字段：

| 字段 | 作用 | 本例的值 |
|------|------|----------|
| `name` | 包名（安装时用的名字） | `dihuantool` |
| `version` | 版本号，每次更新需变化 | `1.0.0` |
| `main` | 入口文件，`require()` 时加载哪个文件 | `src/index.js` |
| `description` | 包的说明 | 描述 calculate 功能 |
| `license` | 开源协议 | `MIT` |

### 1.2 为什么 `main` 很关键

当你写 `require('dihuantool')` 时，Node 会：

1. 找到 `node_modules/dihuantool/` 目录
2. 读取它的 `package.json`
3. 加载 `main` 字段指定的文件（本例 `src/index.js`）
4. 把该文件 `module.exports` 的内容作为 `require` 的返回值

### 1.3 为什么存 GitHub 就能安装

`npm install github:user/repo` 时，npm 会：

1. 从 GitHub 克隆该仓库
2. 读取仓库里的 `package.json`
3. 把仓库内容放进你的 `node_modules`

所以**只要 GitHub 上有 `package.json` 和入口文件，就是一个可安装的 npm 包**，无需发布到 npmjs.com。

### 1.4 操作 1：检查 Node 环境

在项目目录打开命令行（cmd / PowerShell），执行：

```bash
node -v
npm -v
```

- `node -v` 应输出 `v18.x.x` 或更高版本
- `npm -v` 应输出 `9.x.x` 或更高版本

> 如果提示不是内部或外部命令，说明未安装 Node.js，请先到 https://nodejs.org 下载 LTS 版本安装。

### 1.5 操作 2：创建目录结构

在当前项目目录（`dependenceTest`）执行：

```bash
mkdir src
mkdir test
```

创建后目录应为：

```
dependenceTest/
├── src/       # 之后放源码
├── test/      # 之后放测试
└── TUTORIAL.md
```

> 目录为空是正常的，Step 2 起逐步填充文件。

### 1.6 确认理解

- [ ] npm 包 = 文件夹 + `package.json`
- [ ] `main` 字段决定 `require()` 加载哪个文件
- [ ] GitHub 仓库可以直接被 npm 安装，不需要发布 npm
- [ ] `node -v` / `npm -v` 检查通过
- [ ] `src/` 和 `test/` 目录已创建

---

## Step 2：创建 `package.json`

有两种方式：**命令生成**（推荐，快速）或**手动编写**（便于理解）。

### 方式 A：命令生成（`npm init`）

#### 操作 A-1：交互式创建

```bash
npm init
```

命令会逐项询问，按下表回答（直接回车 = 采用默认值 `[]`）：

| 提示 | 本例输入 | 说明 |
|------|---------|------|
| `package name` | `dihuantool` | 包名，只能小写、不能空格 |
| `version` | `1.0.0` | 直接回车 |
| `description` | `DihuanTool.calculate(number) returns number * 2 + 1` | 包说明 |
| `entry point` | `src/index.js` | **入口文件**，默认 `index.js` 需要改 |
| `test command` | 直接回车 | 之后手动改为 `node test/test.js` |
| `git repository` | `https://github.com/<你的用户名>/<仓库名>` | 之后 Step 6 可再改 |
| `keywords` | `dihuan, tool, calculate` | 可回车跳过 |
| `author` | `Dihuan` | 你的名字 |
| `license` | `MIT` | 直接回车默认 ISC，输入 `MIT` 回车 |

最后确认 `Is this OK? (yes)` 输入 `yes` 回车。

#### 操作 A-2：一步生成（跳过询问）

```bash
npm init -y
```

直接按当前文件夹名生成一份默认 `package.json`，之后**手动修改**需要的字段。生成结果示例：

```json
{
  "name": "init-demo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

#### 操作 A-3：生成后必改的 3 处

用编辑器打开 `package.json`，修改：

1. `description`：补上包说明
2. `main`：`"index.js"` → `"src/index.js"`（否则 Step 3 的源码不会被加载）
3. `scripts.test`：`"echo \"Error:...\""` → `"node test/test.js"`

### 方式 B：手动编写（本教程采用）

直接创建 `package.json`，内容如下：

```json
{
  "name": "dihuantool",
  "version": "1.0.0",
  "description": "A tiny tool package: DihuanTool.calculate(number) returns number * 2 + 1",
  "main": "src/index.js",
  "scripts": {
    "test": "node test/test.js"
  },
  "keywords": [
    "dihuan",
    "tool",
    "calculate"
  ],
  "author": "Dihuan",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/<你的GitHub用户名>/<仓库名>.git"
  }
}
```

> 手动写 = 命令生成 + 一次改到位，效果完全相同。

### 2.2 字段逐个解释

| 字段 | 说明 |
|------|------|
| `name` | 包名，必须全小写、不能有空格。因为只存 GitHub 不发 npm，不与 npm 官网重名冲突 |
| `version` | 语义化版本 `主版本.次版本.修订号`，每次改动后 npm 安装缓存需要版本变化才会更新 |
| `main` | **入口文件**。`require('dihuantool')` 实际加载的就是 `src/index.js` |
| `scripts.test` | 定义 `npm test` 命令，等于执行 `node test/test.js` |
| `repository` | 声明源码地址。**Step 6 推送 GitHub 后，把 `<你的GitHub用户名>/<仓库名>` 替换为真实地址** |
| `license` | MIT 协议，允许他人自由使用 |

### 2.3 注意事项

- JSON **不能有注释**，不能有尾逗号
- `main` 指向的 `src/index.js` 这一步还不存在，Step 3 会创建，否则 `require` 会报错
- 不管用 `npm init` 还是手动写，最终文件内容一致即可

### 2.4 操作

```bash
# 查看生成的文件（Windows 用 type，macOS/Linux 用 cat）
type package.json

# 验证 JSON 格式合法（有输出即合法）
node -e "console.log(require('./package.json').name)"
```

预期输出：

```
dihuantool
```

### 2.5 确认理解

- [ ] 知道 `npm init`（交互式）和 `npm init -y`（一步生成）两种命令创建方式
- [ ] 知道命令生成后必改 3 处：`description`、`main`、`scripts.test`
- [ ] `package.json` 是包的"身份证"，`name` + `main` 最重要
- [ ] `main: "src/index.js"` 意味着入口文件在 `src/index.js`
- [ ] `npm test` 会执行 `node test/test.js`
- [ ] `node -e "console.log(require('./package.json').name)"` 输出 `dihuantool`

---

## Step 3：编写源码 `DihuanTool.calculate`

### 3.1 创建 `src/index.js`

`package.json` 的 `main` 指向 `src/index.js`，现在创建它：

```js
const DihuanTool = {
  calculate(number) {
    return number * 2 + 1;
  },
};

module.exports = { DihuanTool };
```

### 3.2 逐行解释

| 代码 | 作用 |
|------|------|
| `const DihuanTool = { ... }` | 定义工具对象，将来 `DihuanTool.calculate` 就是对外 API |
| `calculate(number) { return number * 2 + 1; }` | 核心逻辑：入参 ×2 再 +1 |
| `module.exports = { DihuanTool }` | **对外导出**。不写这行，外面 `require` 拿到的是 `{}` |

### 3.3 CommonJS 模块规则（配合 `"type": "commonjs"`）

- **导出**：`module.exports = { ... }`
- **导入**：`const { DihuanTool } = require('dihuantool')`
- 导入时的解构名 `{ DihuanTool }` 必须和导出的键名一致

### 3.4 操作：验证入口链路

```bash
node -e "const { DihuanTool } = require('./'); console.log('calculate(5) =', DihuanTool.calculate(5))"
```

预期输出：

```
calculate(5) = 11
```

这条命令走通说明三件事：

1. `require('./')` 找到本目录 `package.json`
2. `main: "src/index.js"` 正确指向源码文件
3. `module.exports` 正确导出了 `DihuanTool`

> **排错**：如果报 `Cannot find module`，检查 `main` 是否写错路径；如果 `DihuanTool` 是 `undefined`，检查是否漏了 `module.exports`。

### 3.5 确认理解

- [ ] `src/index.js` 定义 `DihuanTool.calculate(number)` 返回 `number * 2 + 1`
- [ ] `module.exports = { DihuanTool }` 负责对外导出
- [ ] `require('./')` 能输出 `calculate(5) = 11`，证明 `package.json → main → 源码 → 导出` 整条链路通了

---

## Step 4：本地测试验证

### 4.1 创建 `test/test.js`

使用 Node 内置的 `assert` 模块做断言，**零依赖**，无需安装任何测试框架：

```js
const assert = require('assert');
const { DihuanTool } = require('../src/index.js');

assert.strictEqual(DihuanTool.calculate(5), 11, 'calculate(5) 应为 11');
assert.strictEqual(DihuanTool.calculate(0), 1, 'calculate(0) 应为 1');
assert.strictEqual(DihuanTool.calculate(-3), -5, 'calculate(-3) 应为 -5');
assert.strictEqual(DihuanTool.calculate(2.5), 6, 'calculate(2.5) 应为 6');

console.log('4 个测试全部通过 ✔');
```

### 4.2 逐行解释

| 代码 | 作用 |
|------|------|
| `require('assert')` | 加载 Node 自带断言库 |
| `require('../src/index.js')` | 相对路径引入源码。`../` 表示从 `test/` 回到项目根目录再进 `src/` |
| `assert.strictEqual(实际值, 期望值, 提示语)` | 两者**严格相等**（`===`）才通过，否则抛错终止 |
| 用例设计 | 5(常规) / 0(边界) / -3(负数) / 2.5(小数) 四种情况 |

> 为什么不写 `require('dihuan-tool')`？因为此时包还没装到 `node_modules`。**开发期用相对路径引自己的源码**，使用者才会走包名。

### 4.3 操作：执行测试

```bash
npm test
```

> `npm test` 会读取 `package.json` 的 `scripts.test`，即执行 `node test/test.js`。

预期输出：

```
> dihuan-tool@1.0.0 test
> node test/test.js

4 个测试全部通过 ✔
```

如果值算错了，`assert` 会抛出 `AssertionError` 并显示实际值 vs 期望值，方便定位。

### 4.4 确认理解

- [ ] `test/test.js` 用 `require('../src/index.js')` 相对路径引源码
- [ ] `assert.strictEqual` 是严格相等断言，失败会抛错
- [ ] `npm test` 触发的是 `package.json` 里 `scripts.test` 定义的命令
- [ ] 输出「4 个测试全部通过 ✔」

---

## Step 5：补充 README / LICENSE / .gitignore

### 5.1 创建 `README.md`

GitHub 仓库首页会直接渲染 `README.md`，它是别人了解你包的第一入口：

```markdown
# dihuan-tool

A tiny tool package: `DihuanTool.calculate(number)` returns `number * 2 + 1`.

## Installation

```bash
npm install github:<你的GitHub用户名>/<仓库名>
```

## Usage

```js
const { DihuanTool } = require('dihuan-tool');

DihuanTool.calculate(5);   // => 11
DihuanTool.calculate(0);   // => 1
DihuanTool.calculate(-3);  // => -5
DihuanTool.calculate(2.5); // => 6
```

## Test

```bash
npm test
```

## License

MIT
```

**必备结构**：包名 → 安装方式 → 用法示例 → API 说明 → 测试 → 协议。

### 5.2 创建 `LICENSE`

开源协议文件，声明别人可以怎样使用你的代码。本教程用 **MIT**（最宽松：可自由使用、修改、分发，只需保留版权声明）。

内容为标准 MIT 模板（全文见项目中 `LICENSE` 文件），注意两处要改：

```
Copyright (c) 2026 Dihuan    ← 改成你的名字
```

> 没有 LICENSE 文件 = 默认"保留所有权利"，别人其实**无权**使用你的代码。所以这一步不能省。

### 5.3 创建 `.gitignore`

告诉 Git 哪些文件**不要提交**：

```gitignore
node_modules/
npm-debug.log*
.DS_Store
```

| 规则 | 忽略原因 |
|------|---------|
| `node_modules/` | 依赖目录，体积大且可由 `package.json` 重新安装 |
| `npm-debug.log*` | npm 报错日志 |
| `.DS_Store` | macOS 系统文件 |

> `.gitignore` 只影响 Git 提交，**不影响 npm 安装**——但从 GitHub 安装时同样不会拿到被忽略的文件，所以千万不要忽略 `src/`、`package.json`。

### 5.4 统一 license 字段

`npm init` 默认生成 `"license": "ISC"`，而我们创建的是 MIT 协议文件，两者要一致。修改 `package.json`：

```diff
- "license": "ISC",
+ "license": "MIT",
```

### 5.5 操作：检查三个文件已就位

```bash
dir /b
```

预期输出（顺序可能不同）：

```
LICENSE
README.md
TUTORIAL.md
package.json
src
test
```

（`.gitignore` 是隐藏文件，用 `dir /a /b` 可见）

### 5.6 确认理解

- [ ] `README.md` 是仓库首页文档，含安装、用法、API、测试四部分
- [ ] `LICENSE` 决定别人能否使用你的代码，MIT 最宽松
- [ ] `.gitignore` 排除 `node_modules/` 等，但不能排除 `src/` 和 `package.json`
- [ ] `package.json` 的 `license` 字段要和 LICENSE 文件一致（MIT）

---

## Step 6：初始化 Git 并推送到个人 GitHub

### 6.1 前置检查

```bash
git --version
git config --global user.name
git config --global user.email
```

- 没装 Git：到 https://git-scm.com/download/win 下载安装
- 没配置身份（命令无输出）：

```bash
git config --global user.name "你的名字"
git config --global user.email "你的GitHub邮箱"
```

### 6.2 操作 1：初始化仓库并提交

在项目根目录依次执行：

```bash
git init                 # 初始化本地仓库（生成隐藏的 .git/ 目录）
git add .                # 暂存所有文件（按 .gitignore 规则跳过忽略项）
git commit -m "feat: dihuan-tool v1.0.0"   # 提交
```

### 6.3 操作 2：检查将要提交的文件

```bash
git status
git ls-files
```

`git ls-files` 预期包含：`.gitignore`、`LICENSE`、`README.md`、`TUTORIAL.md`、`package.json`、`src/index.js`、`test/test.js`

**不应包含** `node_modules/`（被 `.gitignore` 排除）。

### 6.4 操作 3：在 GitHub 网页创建空仓库

1. 打开 https://github.com/new
2. **Repository name**：`dihuan-tool`（与包名一致）
3. 选 **Public**（公开才能被别人 `npm install github:...`）
4. **不要**勾选 "Add a README file"（本地已有文件，勾了会冲突）
5. 点 **Create repository**

创建后 GitHub 会显示一个"快速设置"页面，记下你的仓库地址：

```
https://github.com/<你的用户名>/dihuan-tool.git
```

### 6.5 操作 4：关联远程并推送

```bash
git remote add origin https://github.com/<你的用户名>/dihuan-tool.git
git branch -M main
git push -u origin main
```

- `git remote add origin`：把上面的仓库地址注册为别名 `origin`
- `git branch -M main`：把当前分支重命名为 `main`（GitHub 默认分支名）
- `git push -u origin main`：推送，并建立追踪关系（以后只需 `git push`）

推送时会弹出 GitHub 登录窗口（Git Credential Manager），用浏览器授权一次即可。

### 6.6 操作 5：验证 + 回填 repository 字段

刷新 GitHub 仓库页，能看到 `src/index.js` 等文件即成功。

然后把 `package.json` 里的 `repository` 占位地址改为真实地址：

```json
"repository": {
  "type": "git",
  "url": "https://github.com/<你的用户名>/dihuan-tool.git"
}
```

改完记得再次提交推送：

```bash
git add package.json
git commit -m "chore: update repository url"
git push
```

### 6.7 常见报错

| 报错 | 原因与解决 |
|------|-----------|
| `fatal: not a git repository` | 没先执行 `git init`，或不在项目根目录 |
| `rejected ... non-fast-forward` | 远程仓库有初始化文件，执行 `git pull --rebase origin main` 后再推 |
| `Authentication failed` | 登录凭据过期，去"控制面板 → 凭据管理器"删除 github.com 条目重试 |
| `Failed to connect to github.com port 443` | 网络无法直连 GitHub。若本机有代理（如 7897 端口），当次执行：`set "HTTPS_PROXY=http://127.0.0.1:7897"` 后再 `git push`（仅当前窗口生效） |
| 推送成功但看不到文件 | 检查是否 `.gitignore` 写错排除了 `src/` |

### 6.8 确认理解

- [ ] `git init` → `git add .` → `git commit` 三步完成本地提交
- [ ] GitHub 新建仓库时**不勾选** README 初始化
- [ ] `git remote add origin <地址>` 关联远程，`git push -u origin main` 推送
- [ ] `package.json` 的 `repository` 已改为真实地址并推送
- [ ] 网页上能看到 `src/index.js`、`package.json` 等文件

---

✅ **Step 6 完成。确认理解后告诉我，进入 Step 7（从 GitHub 远程安装验证）。**
