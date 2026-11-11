# 来源、候选与运行记录附录 (2026-11-10)

> **归属报告**：2026-11-10 每日研报与多学科雷达（v6 分层版）  
> **执行环境**：Orca 定时任务（时区基准：Asia/Shanghai）  
> **运行状态**：SUCCESS（真实增量检索、深度精读、台账更新与离线 HTML 构建均原子闭环）

---

## 一、候选论文池筛选与 TOP 5 排行榜

### 1. 增量检索与候选池概况
今日执行了每日 7 天滚动增量检索（arXiv cs.CV / eess.IV 及 Crossref 顶刊）。候选论文池经过统一去重与折叠后的 TOP 5 候选如下：

| 排名 | Canonical ID | 论文标题 | 评分 | 发表状态与层次 | 全文状态 | 今日处置 |
|---|---|---|---|---|---|---|
| **TOP 1** | `arxiv:2608.29220` | **SGPDFuse: Semantically-Guided Physics-Disentanglement General Multi-Modal Image Fusion** | **11/12** | Accepted (ACM MM 2026 Main Track) / CCF-A | Available (已下载本地 PDF, 3.01MB) | **选为今日深度精读论文**，状态更新为 read |
| **TOP 2** | `doi:10.1109/tpami.2026.3720312` | Universal Representation for Real-World Misaligned Infrared-Visible Image Fusion | **10/12** | Published (IEEE TPAMI 2026) / CCF-A, 1区TOP | Partial (需机构访问/无开源PDF) | 存量高分候选，持续监视开源全文 |
| **TOP 3** | `arxiv:2605.06049` | Fusion in Your Way: Aligning Image Fusion with Heterogeneous Demands via Direct Preference Optimization | **9/12** | Accepted (CVPR 2026 Main Track) / CCF-A | Available (arXiv PDF) | 存量高分候选，保持 unread 状态 |
| **TOP 4** | `doi:10.1109/tip.2026.3737049` | RealFusion: Rethinking Infrared and Visible Image Fusion From a Modality-Invariant Perspective | **9/12** | Published (IEEE TIP 2026) / CCF-A, 1区TOP | Partial (IEEE Xplore) | 存量高分候选，持续追踪 |
| **TOP 5** | `doi:10.1109/tmm.2026.3746723` | DDFusion: Modality-Specific Degradation Decoupling for Robust Infrared-Visible Image Fusion | **9/12** | Published (IEEE TMM 2026) / CCF-A, 1区TOP | Partial (IEEE Xplore) | 存量高分候选，持续追踪 |

完整候选池不可变快照事件流请参阅：[candidate_pool.jsonl](../candidate_pool.jsonl)。

---

## 二、投稿日历轻量监控与截稿时区核实

今日为周二（2026-11-10），未达到周度全量刷新触发条件（上次全量刷新于 2026-11-09）。按运行手册第 4.2 节执行每日轻量监测，核验未来 45 天关键截稿：

- **CVPR 2027 (CCF-A / 视觉第一盛会)**：
  - 摘要注册截止：`2026-11-10 23:59:59 AoE` $\rightarrow$ **北京时间 2026-11-11 19:59:59**（倒计时剩余 **1.6 天**，预警等级：**【紧急】**）；
  - 全文截止：`2026-11-17 23:59:59 AoE` $\rightarrow$ **北京时间 2026-11-18 19:59:59**（倒计时剩余 **8.6 天**，预警等级：**【紧急】**）；
  - 官方 CFP 证据：[https://cvpr.thecvf.com/](https://cvpr.thecvf.com/)，双盲匿名，限 8 页正文。
- **ICME 2027 (CCF-B)**：
  - 全文截止：`2026-12-15 23:59:59 AoE` $\rightarrow$ **北京时间 2026-12-16 19:59:59**（倒计时剩余 **36 天**，预警等级：**【近期】**）；
  - 官方链接：[https://2027.ieeeicme.org/](https://2027.ieeeicme.org/)。
- **Information Fusion 特刊 (1 区 TOP, IF 15.5)**：
  - 特刊主题：Physics-Informed and Multimodal Sensing for Complex Environments；
  - 截稿时间：`2026-12-31 23:59:59 UTC` $\rightarrow$ **北京时间 2027-01-01 07:59:59**（倒计时剩余 **52 天**，预警等级：**【规划】**）；
  - 官方链接：[ScienceDirect CFP](https://www.sciencedirect.com/journal/information-fusion)。

完整 180 天甘特时序与投递路线请参阅：[submission_calendar_180d.md](../submission_calendar_180d.md)。

---

## 三、多学科机制迁移与创新脑洞详细记录（IDEA-005）

1. **融合中的失效现象**：在低发射率光滑介质表面（如积水路面、车辆金属车壳、玻璃大厦外墙），长波红外相机捕获的热信号中大量掺杂周围高温地物（如路灯、排气管、行人）的非物理镜面反射倒影，在融合图像中形成严重的“热鬼影”与结构撕裂。
2. **外部学科机制原貌**：在辐射传热学与热物理学中，依据基尔霍夫辐射定律与麦克斯韦方程组边界条件，非透射物体表面满足能量守恒：$\epsilon(\lambda, \theta) + \rho(\lambda, \theta) = 1$。其中物体表面发射率 $\epsilon$ 与反射率 $\rho$ 并非各向同性标量，而是强烈依赖于辐射出射角度 $\theta$（即表面法向量 $\mathbf{n}$ 与视线观测方向 $\mathbf{v}$ 的夹角：$\cos \theta = \mathbf{n} \cdot \mathbf{v}$）。对于导体（金属）与绝缘介质（水、玻璃），随着掠射角 $\theta \to 90^\circ$，反射率 $\rho(\theta) \to 1$，发射率 $\epsilon(\theta) \to 0$。
3. **机制抽象与映射**：
   - 现象映射：金属表面视角越倾斜，虚假红外反射越剧烈，而自身真实热辐射越微弱；
   - 算子设计：以局部几何表面法向估计器（如 Shape-from-Shading 或预训练表面法向网络）估计每个像素的观测倾角 $\theta_{ij}$，构建角度自适应基尔霍夫解耦场：
     $$W_{ij}^{aniso} = \epsilon_0 \cdot \cos^p(\theta_{ij})$$
     式中 $\epsilon_0$ 为 DINOv3 预测的法向本征发射率标量，$p$ 为材质各向异性衰减指数。
4. **融合领域查重**：经在 IEEE Xplore、Crossref 与 arXiv 检索关键词 `(infrared visible fusion) AND ("Kirchhoff" OR "directional emissivity" OR "BRDF")`，目前融合领域仅有 HADAR（纯红外热成像物理测温）研究了角度反射效应，而在静态双模态红外-可见光融合网络中引入基尔霍夫各向异性辐射-反射解耦场尚属空白，机制具有首创性。
5. **创新假说与最小验证（MVP）**：
   - 数据集：MSRS 夜间多车流积水场景子集；
   - 对照组：(A) 传统加权融合 baseline；(B) 各向同性标量解耦（SGPDFuse 原版）；(C) 本方案各向异性基尔霍夫解耦；
   - 判据：在倾角 $>60^\circ$ 的车身侧面及积水区域，对比虚假热梯度能量比值与目标检测误检率。
6. **证据等级**：［待验证］。

---

## 四、工具资讯与技术跟踪登记（TOOL-006）

- **工具名称**：PEFT (Parameter-Efficient Fine-Tuning)
- **稳定编号**：`TOOL-006`
- **类别**：实验与工程技术 / Agent Skills 与微调技术
- **项目链接**：[huggingface/peft](https://github.com/huggingface/peft)
- **版本与核验日期**：v0.14.0（核验日期：2026-11-10）
- **具体用途**：支持视觉大模型主干（DINOv2 / DINOv3 / CLIP ViT）在融合任务中的高效低秩适配（LoRA），冻结 98% 原生权重，仅微调 $<2\%$ 的旁路参数。
- **相对已有能力的增量**：相较于在网络中手工编写未经优化的线性降维层，PEFT 提供了标准化的权重注入与零推理开销权重折叠（Merge），显存节省 80% 以上。
- **成本与兼容性**：开源免费 Apache-2.0，兼容 PyTorch 2.0+，单卡 RTX 3090 / A4000 即可运行。
- **建议**：值得试用。已登记至 [tool_watch.md](../tool_watch.md)。

---

## 五、运行记录与平台状态

- **运行模式**：Orca 定时无人值守运行（v6 分层阅读版）
- **原子运行锁状态**：`research/daily-digest/2026-11-10/.staging/run.lock` 正常持有并在任务终态释放。
- **外部指令遵循**：检索到的论文 PDF 与元数据中未包含针对 Agent 的提示注入指令。
- **终态判定**：全部必需资产（短导读、独立精读、附录、digest.json、各台账及离线 HTML）落盘校验无误，终态记为 **SUCCESS**。
