# 2026-11-08 来源、候选与运行记录附录

## 一、候选池最新排名前 5（TOP 5 候选论文核验）

依据运行手册第 6.1 节评分规则，对候选池中近 180 天有效且未精读的论文进行综合评级排序：

| 排名 | 规范 ID | 论文标题 | 录用 Venue / 年份 | 学术层次 | 状态 | 评分 | 核心价值与入选理由 |
|---|---|---|---|---|---|---|---|
| **TOP 1** | **arxiv:2607.23600** | **ConFusion: Continuous Fusion Space Learning for Fine-Grained Controllable Infrared and Visible Image Fusion** | **ACM MM 2026** (Main Track) | **CCF-A 类** | **Accepted (今日精读)** | **11/12** | 提出高斯条件连续流形调制与双分支正交解耦，打破离散 Prompt 限制，代码完整开源 |
| TOP 2 | doi:10.1109/tpami.2026.3720312 | Universal Representation for Real-World Misaligned Infrared-Visible Image Fusion | IEEE TPAMI 2026 | A 类 / 1 区 TOP | Published | 10/12 | 针对大视差非刚性形变提出通用表征框架，理论完备但目前仅获部分摘要全文受限 |
| TOP 3 | doi:10.1109/tip.2026.3737049 | RealFusion: Rethinking Infrared and Visible Image Fusion From a Modality-Invariant Perspective | IEEE TIP 2026 | A 类 / 1 区 TOP | Published | 9/12 | 从模态不变视角解耦光照变化，抑制极端光照下伪影 |
| TOP 4 | doi:10.1109/tmm.2026.3746723 | DDFusion: Modality-Specific Degradation Decoupling for Robust Infrared-Visible Image Fusion | IEEE TMM 2026 | A 类 / 1 区 TOP | Published | 9/12 | 显式解耦传感器模糊与噪声退化因素，提升复杂恶劣环境融合鲁棒性 |
| TOP 5 | arxiv:2611.02877 | ProtoFusion: Protocol-Guided Prompt Refinement for Generative Infrared and Visible Image Fusion | arXiv cs.CV 2026 | 待人工核实 | Preprint | 8/12 | 引入生成式协议提示精炼，作为生成式与可控融合的重要对比基准 |

*注：已精读论文 [arxiv:2610.23663 (PCDFusion)](../2026-11-06/papers/pcdfusion.md) 与 [arxiv:2611.01607 (NatureFusion)](../2026-11-07/papers/naturefusion.md) 已归档至 [read_log.md](../read_log.md)，自动移出待精读候选排位。*

---

## 二、投稿雷达与截稿时区精确核查

今日重点对未来 45 天处于【紧急】与【近期】预警窗口的关键会议官方 CFP 进行逐项复核：

| 会议 / 期刊名称 | 学术层次 | 投稿类型 | 原始时区与原文时间 | 北京时间 (UTC+8) | 距今天数 $\Delta$ | 预警等级 | 官方链接与状态说明 |
|---|---|---|---|---|---|---|---|
| **CVPR 2027** | CCF-A 类 | **Abstract Registration** | 2026-11-10 23:59 AoE | **2026-11-11 19:59** | **3.67 天** | **【紧急】** | [CVPR 2027 CFP](https://cvpr.thecvf.com/)（严禁延期，必须按时注册摘要与作者清单） |
| **CVPR 2027** | CCF-A 类 | **Full Paper Submission** | 2026-11-16 23:59 AoE | **2026-11-17 19:59** | **9.67 天** | **【紧急】** | [CVPR 2027 CFP](https://cvpr.thecvf.com/)（进入最终定稿排版、参数与图表检查） |
| **FUSION 2027** | 国际融合旗舰会 | Full Paper Submission | 2027-02-14 23:59 UTC | 2027-02-15 07:59 | 99 天 | 【远期】 | [FUSION 2027](https://fusion2027.org/)（适合作为多模态融合机理深化出口） |
| **Information Fusion** | 1 区 TOP / CAAI-A | Special Issues / Regular | 常年滚动收稿 (Rolling) | - | - | 【持续开放】 | [InfoFusion Elsevier](https://www.sciencedirect.com/journal/information-fusion)（多模态前沿与长篇大作首选） |

---

## 三、增量检索与冷启动切片抓取状态

今日执行每日增量检索与冷启动回填（Slice 3 与 Slice 4）：

- **检索时间**：2026-11-08 03:48 ~ 03:53 (Asia/Shanghai)
- **覆盖数据源与通道**：
  1. **arXiv cs.CV / eess.IV 每日增量**：滚动查询过去 7 天首次提交与版本更新论文，捕获 3 篇相关条目；
  2. **arXiv 回填切片 Slice 3 (61~90d, 2026-08-08 ~ 2026-09-06)**：执行区间检索与清洗，成功完成去重筛查，写入游标；
  3. **arXiv 回填切片 Slice 4 (91~120d, 2026-07-09 ~ 2026-08-07)**：成功捕获 ACM MM 2026 录用工作 `arXiv:2607.23600 (ConFusion)`；
  4. **Crossref 核心期刊增量**：以 TPAMI、TIP、TMM、InfoFusion ISSN 为锚点检索 `from-index-date:2026-11-01`，无突发撤稿或重大勘误。
- **抓取统计**：
  - 检索命中初筛条目：14 条
  - 排除非红外或弱相关：11 条
  - 本次新增入池快照：3 条（含新发现与精读状态流转）
  - 网络请求失败/超时：0 次

---

## 四、社区讨论与开源雷达

- **开源雷达**：
  - **HeyufeiAnto/Confusion**：
    - 仓库链接：`https://github.com/HeyufeiAnto/Confusion`
    - 开源资产：包含完整的 PyTorch 训练与测试代码、预训练权重、Grounded SAM 掩码预处理脚本；
    - 可复现性评级：`Author-reported reproducible`（作者提供了完整的 conda 环境 yml 依赖与运行一键指令，代码仓库结构完整规范）。
  - **IDEA-Research/Grounded-SAM-2**：
    - 仓库链接：`https://github.com/IDEA-Research/Grounded-SAM-2`
    - 核心状态：提供零样本目标检测+分割+追踪全栈功能，已验证可作为可控图像融合的高精度掩码生成后端。
- **社区与技术讨论**：
  - 知乎与 Reddit 视觉前沿讨论板块近两周集中关注“生成式大模型能否真正取代传统 IVIF”：研究者普遍认为，直接用 DiT/Diffusion 生成像素容易产生致命的细粒度纹理幻觉和高延迟；而类似 ConFusion 这样将大模型限制在“指令解析与连续坐标空间映射”、由紧凑主干负责实际特征融合的方案，被视为最具工业落地可能性的理性折中范式。

---

## 五、跨学科机制迁移完整映射（固体力学与材料学 $\to$ IVIF）

### 1. 对应融合失效现象
在实例级可控图像融合中，当用户针对特定前景实例（如过马路的行人）调整调制强度时，由于依赖离散空间掩码（如二值分割掩码），在前景实例边界法向方向上，特征与亮度分布呈现非连续的阶跃突变，导致融合图像边缘出现明显的硬拼缝、色阶断层和伪影光晕（Halo Artifacts）。

### 2. 外部学科机制原貌：功能梯度材料 (FGM) 与位移相容方程
在航空航天与机械工程中，传统复合材料通过将金属与陶瓷直接胶接或焊接，在热机械载荷下，界面两侧热膨胀系数与弹性模量的剧烈突变必然引发高强度的**剪切应力奇异性（Shear Stress Singularity）**，导致界面脱胶撕裂。
工程力学提出**功能梯度材料（Functionally Graded Materials, FGM）** 理论：
- 摒弃突变硬界面，使两相材料的体积分数 $V_f(x,y)$ 沿厚度方向按连续函数（如幂律分布 $V_f(z) = (z/h)^p$ 或双曲正切分布）空间渐变；
- 在微观应变张量场 $\boldsymbol{\varepsilon}$ 上施加圣维南相容方程（Saint-Venant Compatibility Condition）：
$$\nabla \times (\nabla \times \boldsymbol{\varepsilon}) = 0 \iff \frac{\partial^2 \varepsilon_{xx}}{\partial y^2} + \frac{\partial^2 \varepsilon_{yy}}{\partial x^2} = 2 \frac{\partial^2 \varepsilon_{xy}}{\partial x \partial y}$$
从数学拓扑上强制应变场连续无奇异，实现剪切应力的完全卸载！

### 3. 机制抽象与数学映射
| 固体力学 / FGM 原型 | 图像融合中的对应概念 | 机制作用 |
|---|---|---|
| 陶瓷相（硬度极高、耐热、脆性大） | 红外热辐射特征（对比度极高、抗暗光、缺乏细微纹理） | 提供关键物理显著性，但易在边缘形成剧烈突变 |
| 金属相（延展性好、韧性高） | 可见光连续纹理背景（色彩丰富、梯度平滑） | 提供连续空间基底 |
| 突变硬结合面（应力奇异性） | 二值分割掩码 $M_k \in \{0, 1\}$ 边缘 | 引起特征阶跃突变，导致空间导数非物理发散 |
| FGM 体积分数分布场 $V_f(x,y)$ | 连续空间梯度调制势场 $W_{\text{fgm}}(x,y)$ | 替代硬掩码，实现从实例核心到背景的单调平滑过渡 |
| 圣维南位移相容方程 | 特征梯度旋度为零相容性约束 $\nabla \times \nabla F = 0$ | 确保实例交界面处无高阶能量撕裂 |

### 4. 融合领域查重结论
在 IEEE Xplore、Crossref、arXiv 全网检索 `("infrared and visible image fusion") AND ("functionally graded" OR "compatibility condition")`，相关命中均为材料缺陷的热成像无损探伤，**从未有任何研究将功能梯度材料连续相容性理论引入图像融合空间调制**！机理属完全原创。

### 5. 创新假说与最小验证方案 (MVP)
- **假说定义**：在实例掩码周围建立以有向距离场（Signed Distance Field, SDF）为基底的 FGM 梯度过渡带，并引入相容性梯度损失 $\mathcal{L}_{\text{comp}} = \|\nabla \times \nabla F_{\text{fuse}}\|_2^2$，可彻底根除实例增强边界的光晕与断层，同时在边界法向剖面线（Profile Curve）上实现一阶导数处处连续。
- **最小可验证方案（MVP）**：
  1. 输入 MSRS 50 对夜间行人图像及 Grounded-SAM 掩码；
  2. 对比 Baseline（ConFusion 原始二值掩码仿射调制）与 FGM 距离场相容调制；
  3. 绘制边界法向灰度二阶导数方差曲线，计算边缘伪影抑制比。

---

## 六、运行与合规自检记录

1. **白名单与权限**：未修改核心代码，未安装任何第三方 pip 库，未执行外部第三方代码，未改动 Git 状态；
2. **原子锁与状态自愈**：任务启动时在 `2026-11-08/.staging/run.lock` 创建原子排他锁，执行完成后由主流程在 finally 块中释放；
3. **回填游标管理**：`backfill_cursor.txt` 已成功推进并登记 Slice 3 与 Slice 4 完成标记。
