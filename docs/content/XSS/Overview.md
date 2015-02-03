# XSS

Cross-Site Scripting

---

## 跨站脚本介绍

跨站脚本（Cross-Site Scripting，XSS）是一种经常出现在Web应用程序中的计算机安全漏洞，是由于Web应用程序对用户的输入过滤不足而产生的。攻击者利用网站
漏洞把恶意的脚本代码（通常包括HTML代码和客户端JavaScript脚本）注入到网页之中，当其他用户浏览这些网页时，就会执行其中的恶意代码，对受害用户可能采取Cookie资料窃取、会话劫持、钓鱼欺骗等各种攻击。

由于和另一种网页技术——层叠样式表（Cascading Style Sheets，CSS）的缩写一样，为了防止混淆，故把原来的CSS简称为XSS。

##背景和现状

当今Web时代的安全基于一个很重要的浏览器安全策略——同源策略（Same Origin Policy）。根据这个策略，a.com域名下的JavaScript无法跨域操作b.com域名下的对象。比如，baidu.com域名下的页面中包含的JavaScript代码，不能访问google.com域名下的页面内容。

但是网景（NetScape）公司1995年推出JavaScript语言的时候并没有同时设计同源策略。推出JavaScript之后不久，黑客们意识到，当有人浏览她们的网站时，他们可以使用iframe强制加载任何网站（邮箱，银行，交易网站）并且使用JavaScript跨越两个站点进行操作，所以起名为跨站脚本（Cross-Site Scripting，XSS）。
网景公司发现这个问题之后设计了同源策略的限制，使得现在的XSS攻击基本都不是跨站的，但是这个名字被沿用了下来。

