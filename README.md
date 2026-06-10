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

## 本地存档（3 档位）

- 使用浏览器 `localStorage`，**GitHub Pages 在线玩同样有效**（仅限当前浏览器，换设备无存档）
- 开局先选 **档位 1/2/3**：**续档** 或 **新游戏 / 重开新档**
- **每周进入下周时自动存档**；终局、再来一局时也会保存
- 游戏中右下角 **重新投胎** 可返回选档界面
- 存档不会上传到服务器

## 文件说明

| 文件 | 说明 |
|------|------|
| `build.js` | 构建脚本，生成 HTML |
| `data.json` | 职业数据 |
| `real-companies.js` | 企业与股票数据 |
| `index.html` | GitHub Pages 入口（由 build 生成） |
| `deploy-github.bat` | 一键构建并 push |
