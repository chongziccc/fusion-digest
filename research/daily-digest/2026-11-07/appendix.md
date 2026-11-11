# 来源、候选与运行记录（2026-11-07 附录）

## 一、增量文献新发现与精读候选池 TOP 5

本日执行双轨增量检索（arXiv 滚动 7 天与 Slice 2 回填切片）。存量与新进高价值候选如下：

| 排名 | 论文标识 (ID / DOI) | 论文标题 | 评分 | 状态 | 发表层次与状态核验 | 核心亮点与对我们研究的价值 |
|---|---|---|---|---|---|---|
| **1** | `arxiv:2611.01607` | **NatureFusion: Rethinking Infrared and Visible Image Fusion as Natural Complementary Enhancement** | **9/12** | **今日已精读** | Preprint (arXiv cs.CV, 待人工核实) | 彻底打破源保真度执念，提出自然互补增强范式；流匹配蒸馏+解耦任务适配，抗非对齐鲁棒性极高 |
| **2** | `doi:10.1109/tpami.2026.3720312` | Universal Representation for Real-World Misaligned Infrared-Visible Image Fusion | 10/12 | 候选中 (待获取全文) | Published (IEEE TPAMI, CCF-A / 1区TOP) | 聚焦现实复杂非对齐、视差与非刚性形变，建立通用表征机制 |
| **3** | `doi:10.1109/tip.2026.3737049` | RealFusion: Rethinking Infrared and Visible Image Fusion From a Modality-Invariant Perspective | 9/12 | 候选中 (待获取全文) | Published (IEEE TIP, CCF-A / 1区TOP) | 模态不变性视角抑制伪影，极端照明下保持跨谱系鲁棒性 |
| **4** | `arxiv:2611.02877` | ProtoFusion: Protocol-Guided Prompt Refinement for Generative Infrared and Visible Image Fusion | 8/12 | 候选中 (全文就绪) | Preprint (arXiv cs.CV, 待人工核实) | 协议引导提示词微调，用可控生成先验替代传统手工融合算子 |
| **5** | `arxiv:2609.39004` | When Integral Meets Decomposition: A Signal-Level Self-Supervised Feature Learning Framework for IVIF | 8/12 | 候选中 (Slice 2 激活) | Preprint (arXiv cs.CV, 待人工核实) | 信号级自监督特征学习，积分变换与多尺度分解的数学结合 |

> 完整论文事件快照流与历史评分已归档于 [candidate_pool.jsonl](../candidate_pool.jsonl) 与 [read_log.html](../read_log.html)。

---

## 二、投稿机会与发表情报雷达（轻量监测）

依据 [投稿日历](../submission_calendar_180d.html) 对未来 45 天关键截稿项进行官方轻量核查：

| 会议 / 期刊 / 专题 | 学术层次 | 投稿状态 | 官方截稿时间（北京时间） | 原始时区与原文时间 | 预警等级 | 官方 CFP / 状态说明 |
|---|---|---|---|---|---|---|
| **CVPR 2027 (Abstract Registration)** | CCF-A 顶会 | 开放中 | **2026-11-08 19:59** | 2026-11-07 23:59 AoE | **【紧急】(剩余 1 天)** | [CVPR 2027 CFP](https://cvpr.thecvf.com/)，摘要注册即将截止，必须今日完成提交系统锁定 |
| **CVPR 2027 (Full Paper Submission)** | CCF-A 顶会 | 开放中 | **2026-11-15 19:59** | 2026-11-14 23:59 AoE | **【紧急】(剩余 8 天)** | [CVPR 2027 CFP](https://cvpr.thecvf.com/)，正文进入最后终稿润色与附录整理阶段 |
| **Information Fusion (Special Issue)** | 1区 TOP / IF 15.5 | 开放中 | **2026-12-15 23:59** | 2026-12-15 23:59 UTC+8 | **【近期】(剩余 38 天)** | [InfoFusion SI](https://www.sciencedirect.com/journal/information-fusion)，物理启发多模态感知特刊，正常截稿无延期 |
| **IEEE TIP / TCSVT / TMM** | CCF-A/B / 1区TOP | 常年收稿 | 持续开放 (Rolling) | 随时提交 | **【持续开放】** | 官方期刊系统稳定开放，适合作为长线系统性工作的备选出口 |

---

## 三、跨学科创新机制深度拆解：多孔介质渗流力学之“毛细势垒”

本机制灵感来自 NatureFusion 的解耦互补放大设计与传统源保真度“热斑膏药”的矛盾。

### 1. 融合中的失效现象
传统方法直接把红外强度注入可见光，在亮区和暗区一视同仁，导致可见光原本正常的平滑纹理被大面积热辐射斑块覆盖破坏。即便 NatureFusion 采用 9B 大模型在隐层做 CFG 外推，但由于缺乏空间像素级物理约束，微小目标易被平滑，且无法解释能量阻尼机理。

### 2. 外部学科机制原貌（流体动力学 / 多孔介质多相渗流）
在多孔介质渗流力学中，当非润湿相流体（如油或气体）试图穿透含有微细毛细管的润湿相多孔介质层时，由于表面张力作用，存在一个**毛细进入压力阈值（Capillary Entry Pressure Threshold, $P_c^\star$）**。
- 当局部压力差 $\Delta P < P_c^\star$ 时，流体无法进入，该介质层表现为绝对绝缘的“毛细势垒（Capillary Barrier）”；
- 只有当外界压力或介质孔隙破损超过临界阈值时（$\Delta P \ge P_c^\star$），流体才会突破势垒发生定向渗流（Capillary Breakthrough）。

### 3. 机制抽象与映射
- **流体相** $\rightarrow$ 红外热辐射特征流（容易向外扩张、渗透）；
- **多孔介质基底** $\rightarrow$ 可见光图像流形；
- **毛细势垒分布场** $\rightarrow$ 由可见光照度置信度 $C_{vis}$ 与空间梯度模值 $\|\nabla I_{vis}\|$ 构成的阻尼势场：
  $$\Phi_{barrier}(x, y) = \alpha \cdot \text{sigmoid}(I_{vis}(x, y) - \tau_{dark}) + \beta \cdot \|\nabla I_{vis}(x, y)\|$$
- **物理判定**：
  - 在可见光成像良好、结构清晰的区域，$\Phi_{barrier}$ 极高，红外热辐射流被完全阻绝，严格保持 100% 自然可见光纹理；
  - 只有在极度欠曝（黑暗空洞）或严重过曝（信息塌陷）区域，$\Phi_{barrier} \approx 0$，毛细势垒崩溃，红外目标轮廓被允许自适应涌入渗流补全。

### 4. 融合领域查重与结论
在 IEEE Xplore、Crossref 与 arXiv 上检索 `("capillary barrier" OR "percolation threshold") AND "image fusion"`，未发现任何将毛细势垒与渗流相变方程引入 IVIF 的先验文献。该机制具有纯正的物理背景与极高的新颖性。登记编号为 **[IDEA-002](../idea_log.html)**。

### 5. 最小可验证假设（MVP）
在 MSRS 夜间复杂高光与暗部子集（50对图像）上，对比标准注意力融合与毛细势垒渗流门控输出：
- **成功判据**：可见光背景的色彩保真度（PSNR）提升 1.5 dB 以上，且无任何“红外热斑膏药”伪影，同时人员检测 AP 不降低。

---

## 四、工具与技术跟踪详情

登记于 [tool_watch.html](../tool_watch.html) 的最新进展：
- **TOOL-001 (Docling v2.12.0)**：持续作为跨双栏学术论文多模态结构化解析器，成功解析 NatureFusion 的 17 页长文与多行流匹配公式。
- **TOOL-002 (TorchCompile + FP8 Adapter)**：生成式多模态轻量微调工程方案，已列入后续 MVP 原型代码加速测试清单。
- **TOOL-003 (Diffusers FlowMatching Pipeline + LoRA 解耦引擎)**：
  - **来源与版本**：Diffusers v0.32.0 / PyTorch 2.5+
  - **核心增量**：支持多 LoRA 动态差分权重挂载与 4 步快速欧拉 ODE 采样，完美匹配 NatureFusion 的 Stage II/III 架构；
  - **成本与兼容性**：开源免费，支持本地 CUDA 单卡运行；
  - **建议**：值得试用，用于后续构建轻量级流匹配图像融合原型。

---

## 五、各数据来源抓取与运行状态汇总

- **arXiv API**：成功（查询最近 7 天及 Slice 2 切片，累计匹配 IVIF 相关论文 28 篇，去重后增量入池）
- **Crossref API**：成功（对 TPAMI, TIP, TMM, TCSVT, InfoFusion 核心期刊完成元数据扫描）
- **官方 PDF 下载**：成功（已完整抓取 `NatureFusion.pdf` 29.2 MB，本地路径有效）
- **学术会议官方网站 (CVPR 2027)**：成功（核实截稿日期无延期，摘要 11-08 19:59 倒计时 1 天，全文 11-15 19:59 倒计时 8 天）
- **社区与技术讨论**：知乎/GitHub 讨论区关于大模型生成式融合（DiT-based fusion）的主流关注点在于“如何避免将行人衣物脑补出虚假色彩”，与 NatureFusion 论文第 7 节分析之局限完全吻合。
