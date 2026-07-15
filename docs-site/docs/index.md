---
hero:
  title: Phoenix Mini LLM
  description: 面向初学者的小型大语言模型学习档案，覆盖从 Python 工程到 tokenizer、Transformer、训练、推理与跨平台落地的完整路径。
  actions:
    - text: 按顺序学习
      link: /knowledge
    - text: 直接复刻项目
      link: /tutorials/reproduce-phoenix-mini-llm
features:
  - title: 从零到可运行
    emoji: 🔧
    description: 不是只讲概念，而是围绕 phoenix-mini-llm 的真实代码、真实配置和真实训练脚本来解释每一步。
  - title: 踩坑按时间记录
    emoji: 🧭
    description: 所有关键问题都按开发顺序留档，包含症状、原因、修复方法和以后如何预防。
  - title: 可直接照做
    emoji: 📚
    description: 教程把知识档案和实操步骤打通，读者可以一边补基础，一边完整复刻同一个项目。
---

## 这份文档站适合谁

- 想从 0 开始理解“小型 LLM 是怎样被做出来的”。
- 想手写一个能在 6GB 显存目标下启动训练流程的 decoder-only Transformer。
- 想在 macOS 上开发，再迁移到 Windows + NVIDIA GPU 上正式训练。

## 推荐阅读顺序

1. 从 [知识档案总览](/knowledge) 开始，依次读完 1 到 9。
2. 然后阅读 [踩坑记录总览](/pitfalls)，理解真实工程中最容易出错的部分。
3. 最后按照 [完整复刻 phoenix-mini-llm](/tutorials/reproduce-phoenix-mini-llm) 执行命令和检查点。

## 项目范围

这套项目和文档聚焦三个目标：

- 做出一个从数据准备到训练、评估、生成都跑得通的小模型项目。
- 用尽量少但足够真实的模块，覆盖 tokenizer、Transformer、checkpoint、采样和跨平台设备处理。
- 保留学习路线，而不是只给出一个已经封装好的黑盒。
