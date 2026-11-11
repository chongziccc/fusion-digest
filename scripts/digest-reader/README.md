# 离线研报阅读器

日常打开 `research/daily-digest/index.html`。内容使用 Markdown 保存，统一生成 HTML，无需服务器、联网或 pip 安装。

构建：`powershell -NoProfile -File scripts/build-digest-site.ps1`

只读校验：`powershell -NoProfile -File scripts/build-digest-site.ps1 -CheckDate 2026-11-07`

跨平台：Python 3.10+ 执行 `scripts/build-digest-site.py`；`--check YYYY-MM-DD` 检查文件哈希、分层源文件和首页入口。数据格式与学习要求见运行手册第 10 节。构建只重写派生网页与 reader-build.json，保持研究 Markdown 原稿。

内容先写导读、papers/ 精读、appendix.md 和 digest.json，再执行构建。元数据 schema_version 为 6，paper 可以为 null。`PARTIAL`、`NO_QUALIFIED_PAPER` 也需要生成阅读页。历史无元数据的长日报只生成折叠阅读视图，不视为已完成 v6。

页面支持搜索日期/标题/主题标签、手动已读、深浅色、论文独立阅读、目录、离线公式和本地图片放大。阅读标记在当前浏览器 localStorage 内保存，file:// 下的存储持久性随浏览器而异；它不记录用户掌握程度。Markdown 原稿链接可用于存档、编辑或审查。

## 固定前端资源

- Marked 15.0.12：`https://registry.npmjs.org/marked/-/marked-15.0.12.tgz`，MIT，许可证 `vendor/LICENSE.md`。
- KaTeX 0.16.22：`https://registry.npmjs.org/katex/-/katex-0.16.22.tgz`，MIT，许可证 `vendor/LICENSE`，发行资源和字体在 `vendor/dist/`。

这些是维护时固定下载的展示资源；每日任务不能下载或替换它们。Markdown 原始 HTML 被显示为文本，危险链接协议被移除；TeX 使用 KaTeX trust=false。渲染不等于来源或科学结论已核验；公式解析失败会明确显示“公式待校验”。本地相对 Markdown 链接转换为对应 HTML，PDF 保留原目标。
