# 来源、候选与运行记录附录 (2026-11-11)

> **归属报告**：2026-11-11 每日研报与多学科雷达（v6 分层版）  
> **执行环境**：Orca 定时任务（时区基准：Asia/Shanghai）  
> **运行状态**：SUCCESS（真实增量检索、深度精读、台账更新与离线 HTML 构建均原子闭环）

---

## 一、候选论文池筛选与 TOP 5 排行榜

### 1. 增量检索与候选池概况
今日执行了每日 7 天滚动增量双轨检索（arXiv cs.CV / eess.IV 提交与版本更新追踪，及 Crossref 顶刊元数据更新）。池中论文经过统一身份归一化与历史快照折叠后的 TOP 5 候选如下：

| 排名 | Canonical ID | 论文标题 | 评分 | 发表状态与层次 | 全文状态 | 今日处置 |
|---|---|---|---|---|---|---|
| **TOP 1** | `arxiv:2605.06049` | **Fusion in Your Way: Aligning Image Fusion with Heterogeneous Demands via Direct Preference Optimization** | **12/12** | Accepted (CVPR 2026 Main Track) / CCF-A | Available (已下载本地 PDF, 6.74MB) | **选为今日深度精读论文**，状态更新为 read |
| **TOP 2** | `doi:10.1109/tpami.2026.3720312` | Universal Representation for Real-World Misaligned Infrared-Visible Image Fusion | **10/12** | Published (IEEE TPAMI 2026) / CCF-A, 1区TOP | Partial (IEEE Xplore / 需机构访问) | 存量高分候选，持续监视开源全文 |
| **TOP 3** | `doi:10.1109/tip.2026.3737049` | RealFusion: Rethinking Infrared and Visible Image Fusion From a Modality-Invariant Perspective | **9/12** | Published (IEEE TIP 2026) / CCF-A, 1区TOP | Partial (IEEE Xplore) | 存量高分候选，持续追踪 |
| **TOP 4** | `doi:10.1109/tmm.2026.3746723` | DDFusion: Modality-Specific Degradation Decoupling for Robust Infrared-Visible Image Fusion | **9/12** | Published (IEEE TMM 2026) / CCF-A, 1区TOP | Partial (IEEE Xplore) | 存量高分候选，持续追踪 |
| **TOP 5** | `arxiv:2611.02877` | ProtoFusion: Protocol-Guided Prompt Refinement for Generative Infrared and Visible Image Fusion | **8/12** | Preprint (arXiv cs.CV, 2026-11-02) / 待核实 | Available (已下载本地 PDF, 27.1MB) | 近期高分预印本，保持 unread 状态 |

完整候选池不可变快照事件流请参阅：[candidate_pool.jsonl](../candidate_pool.jsonl)。

---

## 二、投稿日历轻量监控与截稿时区核实

今日为周三（2026-11-11），未达到周度全量刷新触发条件（上次全量刷新于 2026-11-09）。按运行手册第 4.2 节执行每日轻量监测，核验未来 45 天关键截稿项：

- **CVPR 2027 (CCF-A 类 / 视觉第一盛会，Main Track)**：
  - **摘要注册截止（今晚特急）**：官方截止时间为 `2026-11-10 23:59:59 AoE`（UTC-12），通过 IANA `Etc/GMT+12` 精确换算至北京时间（UTC+8）为：  
    **2026-11-11 19:59:59**（倒计时剩余仅约 **16 小时**，预警等级：**【紧急】**）；
  - **全文截止**：官方截止时间为 `2026-11-17 23:59:59 AoE` $\rightarrow$ **北京时间 2026-11-18 19:59:59**（倒计时剩余 **7.6 天**，预警等级：**【紧急】**）；
  - 官方 CFP 证据：[https://cvpr.thecvf.com/](https://cvpr.thecvf.com/)，双盲匿名评审，正文严格限 8 页。
- **ICME 2027 (CCF-B 类)**：
  - 全文截止：`2026-12-15 23:59:59 AoE` $\rightarrow$ **北京时间 2026-12-16 19:59:59**（倒计时剩余 **35 天**，预警等级：**【近期】**）；
  - 官方链接：[https://2027.ieeeicme.org/](https://2027.ieeeicme.org/)。
- **Information Fusion 特刊 (中科院 1 区 TOP, IF 15.5)**：
  - 特刊主题：Physics-Informed and Multimodal Sensing for Complex Environments；
  - 截稿时间：`2026-12-31 23:59:59 UTC` $\rightarrow$ **北京时间 2027-01-01 07:59:59**（倒计时剩余 **51 天**，预警等级：**【规划】**）；
  - 官方链接：[ScienceDirect CFP](https://www.sciencedirect.com/journal/information-fusion)。

完整 180 天甘特时序与投递路线请参阅：[submission_calendar_180d.md](../submission_calendar_180d.md)。

---

## 三、多学科机制迁移与创新脑洞详细记录（IDEA-006）

1. **融合中的失效现象**：在实例级偏好微调（如 DPOFusion IDPO）中，当网络针对特定局部目标（如行人、路标）进行偏好强化时，二值掩码 $I_m \in \{0, 1\}$ 强行将图像划分为“偏好更新区”与“基准一致性区”。在二值掩码的外沿交界线上，由于优化损失函数的非平滑跳变，空间一阶与二阶导数出现阶跃奇异性，容易在调控强度较大时产生可辨识的边缘拼缝色阶断层与边界虚影。
2. **外部学科机制原貌**：在材料热力学相变理论与多相流体力学中，经典的 **Cahn-Hilliard 弥散界面模型（Diffuse Interface Model）** 指出：两相界面的过渡并非离散的零厚度数学突变，而是具有有限纳米厚度的能量连续渐变区。体系遵循金兹堡-朗道（Ginzburg-Landau）自由能泛函：
   $$\mathcal{F}[\phi] = \int_{\Omega} \left( f_0(\phi) + \frac{\epsilon^2}{2} |\nabla \phi|^2 \right) d\mathbf{x}$$
   其中序参量 $\phi(\mathbf{x}) \in [0, 1]$ 连续变化，梯度惩罚项 $\frac{\epsilon^2}{2} |\nabla \phi|^2$ 构成了相界面的过剩自由能，吉布斯-托姆森（Gibbs-Thomson）效应物理上强制相界面内外化学势与表面张力处处连续。
3. **机制抽象与映射**：
   - 现象映射：将融合图像中的“偏好调控域”与“背景基准域”类比为热力学中的两个互溶相；
   - 算子设计：抛弃二值掩码 $I_m$，引入连续弥散相场 $\Phi_{diffuse}(x,y) \in [0, 1]$ 作为空间调制场：
     $$\mathcal{L}_{DIP} = \mathbb{E} \left[ -\log \sigma \Big(-\beta_t (P_w - P_l) \odot \Phi_{diffuse}\Big) + \mu (O_w + O_l) \odot (1 - \Phi_{diffuse}) + \gamma \|\nabla \Phi_{diffuse}\|_2^2 \right]$$
     梯度能项自适应阻尼边界截断处的梯度突变，从数值上消除了拼缝奇异性。
4. **融合领域查重**：在 IEEE Xplore、Crossref 与 arXiv 检索关键词 `(image fusion) AND ("direct preference optimization" OR "DPO") AND ("phase-field" OR "diffuse interface")`，目前融合领域仅有 DPOFusion 开始探索 DPO 机制，而引入弥散相场理论平滑偏好对齐界面尚属空白，机制具有独立原创性。
5. **创新假说与最小验证（MVP）**：
   - 数据集：MSRS 数据集夜间包含局部行人的 50 对样本；
   - 对照组：(A) 全局 DPO baseline；(B) 原版硬掩码 IDPO；(C) 弥散界面相场 IDPO；
   - 判据：在目标外沿法向截面上提取灰度二阶导数方差，对比边界光晕指数与人眼感知得分。
6. **证据等级**：［待验证］。

---

## 四、工具资讯与技术跟踪登记（TOOL-007）

- **工具名称**：TRL (Transformer Reinforcement Learning)
- **稳定编号**：`TOOL-007`
- **类别**：Agent Skills、插件与实验工程技术
- **项目链接**：[huggingface/trl](https://github.com/huggingface/trl)
- **版本与核验日期**：v0.12.0（核验日期：2026-11-11）
- **具体用途**：支持直接偏好优化（DPO）、ORPO 及基于扩散模型的偏好对齐（Diffusion-DPO），可直接对多模态潜特征生成模型执行配对偏好微调。
- **相对已有能力的增量**：相较于手工推导并在 PyTorch 中编写复杂的对数似然差损失，TRL 提供了经过工业级检验的隐式奖励计算器、动态参考模型维护以及与 PEFT LoRA 的无缝集成。
- **成本与兼容性**：开源免费 Apache-2.0，兼容 PyTorch 2.0+，单卡 RTX 3090 / A4000 即可运行微调。
- **建议**：值得试用。已登记至 [tool_watch.md](../tool_watch.md)。

---

## 五、运行记录与平台状态

- **运行模式**：Orca 定时无人值守运行（v6 分层阅读版）
- **原子运行锁状态**：`research/daily-digest/2026-11-11/.staging/run.lock` 正常持有并在任务终态释放。
- **外部指令遵循**：检索到的论文 PDF 与元数据中未包含针对 Agent 的提示注入指令。
- **终态判定**：全部必需资产（短导读、独立精读、附录、digest.json、各台账及离线 HTML）落盘校验无误，终态记为 **SUCCESS**。
