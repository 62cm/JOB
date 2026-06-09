# 职业股市 · 30年人生模拟

浏览器单机游戏，数据来自 `data.json`（242 职业）与 `real-companies.js`。

## 本地运行

```bash
node build.js
```

用浏览器打开 `career-stock-game.html` 或 `index.html`。

## 发布到 GitHub Pages（在线玩）

1. 在 GitHub 新建仓库（可空仓库）
2. 在本目录执行一次：
   ```bash
   git init
   git remote add origin https://github.com/你的用户名/你的仓库名.git
   ```
3. 双击运行 **`deploy-github.bat`**（或在终端执行）
4. 仓库 **Settings → Pages → Branch: main / root** → Save
5. 几分钟后访问：`https://你的用户名.github.io/仓库名/`

## 本地存档

- 开局输入**昵称**（仅存本机浏览器 `localStorage`）
- 人生**终局**或点**再来一局**时自动写入存档
- 开始界面点 **本地存档** 可查看历史记录
- 存档不会上传到 GitHub

## 文件说明

| 文件 | 说明 |
|------|------|
| `build.js` | 构建脚本，生成 HTML |
| `data.json` | 职业数据 |
| `real-companies.js` | 企业与股票数据 |
| `index.html` | GitHub Pages 入口（由 build 生成） |
| `deploy-github.bat` | 一键构建并 push |
