# 历史数据统计脚本

## 介绍

统计 evolve 游戏中的成就、壮举、CRISPR、特权、历史重置数据和历史尖塔数据；显示不同种族种群的星球名称对照表。

## 文件结构

`evolve_history_pre.user.js` 是基础脚本文件，新更改都应首先提交至此文件。

`downloader_achieve.py` 是爬虫脚本，爬取原游戏地址中部分未公开对象并加入基础脚本文件。在每次更改 `evolve_history_pre.user.js` 和 `downloader_achieve.py` 文件时会被 Github 工作流自动运行。

`evolve_history.user.js` 是最终输出的脚本文件成品。
