# 自动增删特质

## 介绍

自动根据配置添加或者删除指定特质。种族为软泥时不会生效。

## 文件结构

`evolve_traits_pre.user.js` 是基础脚本文件，新更改都应首先提交至此文件。

`downloader_traits.py` 是爬虫脚本，爬取原游戏地址中部分未公开对象并加入基础脚本文件。在每次更改 `evolve_traits_pre.user.js` 和 `downloader_traits.py` 文件时会被 Github 工作流自动运行。

`evolve_traits.user.js` 是最终输出的脚本文件成品。
