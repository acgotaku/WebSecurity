# Same Origin Policy

浏览器同源策略

---

## 同源策略基本介绍

同源策略（Same Origin Policy）是一种约定，它是浏览器最核心也是最基本的安全功能，如果缺少了同源策略，则浏览器的正常功能可能会受到影响。可以说Web是构建在同源策略的基础之上的，浏览器只是针对同源策略的一种实现。

**浏览器的同源策略，限制了来自不同源的“document”或脚本，对当前“document”读取或设置某些属性。**

例如下图就是Chrome的同源策略限制：

![Same Origin Policy](img/Same-Origin-Policy-1.png)

这一策略是极其重要的，试想如果没有同源策略，可能 a.com 的一段 JavaScript 脚本，在 b.com 未曾加载此脚本时，也可以随意涂改 b.com 的页面（在浏览器的显示中）。为了不让浏览器的页面行为发生混乱，浏览器提出了“Origin”（源）这一概念，来自不同 Origin的对象无法互相干扰。
对于JavaScript来说，以下情况被认为是同源与不同源的：

URL                                     | OutCome              | Reason 
--------------------------------------- | -------------------- | ------------------------
http://test.icehoney.me/test1.html      | Success              |                          
http://test.icehoney.me/dir1/test2.html | Success              |  
https://test.icehoney.me/secure.html    | Failure              | Different protocol                
http://test.icehoney.me:81/secure.html  | Failure              | Different port
http://blog.icehoney.me/secure.html     | Failure              | Different host

由上表可知，影响“源”的因素有：host（域名或IP地址，如果是IP地址则看做一个根域名）、子域名、端口、协议。

需要注意的是，对于当前页面来说，页面内存放JavaScript文件的域并不重要，重要的是加载JavaScript页面所在的域是什么。

例如，在 baidu.com上有以下代码：

		<script src="http://google.com/ga.js"></script>

baidu加载了google的ga.js，但是ga.js是运行在baidu.com页面中的，因此对于当前打开的页面(baidu.com页面)来说，ga.js的Origin就应该是baidu.com而非google.com。

在浏览器中，`<script>、<img>、<iframe>、<link>`等标签都可以跨域加载资源，而不受同源策略的限制。这些带"src"属性的标签每次加载时，实际上是由浏览器发起了一次GET请求。不同于 XMLHttpRequest 的是，通过src属性加载的资源，浏览器限制了JavaScript的权限，使其不能读、写返回的内容。

##AJAX

随着互联网的发展，对用户体验的要求越来越高，AJAX应用也就越发频繁，AJAX的本质就是 XMLHttpRequest。但 XMLHttpRequest 受到同源策略的约束，不能跨域访问资源，在AJAX应用的开发中尤其需要注意这一点。

如果 XMLHttpRequest 能够跨域访问资源，则可能会导致一些敏感数据泄漏，例如CSRF的 token，从而导致发生安全问题。

##跨域解决方案

随着互联网越来越开放，跨越请求的需求也越来越迫切。因此 W3C 委员会指定了 XMLHttpRequest 跨域访问标准。它需要通过目标域返回的HTTP头来授权是否允许跨域访问，因为HTTP头对于JavaScript来说一般是无法控制的，所以认为这个方案是可以实施的。
注意：这个跨域访问方案的安全基础就是信任“JavaScript无法控制该HTTP头”，如果此信任基础被打破，则此方案也将不再安全。

![Cross Origin](img/Same-Origin-Policy-2.png)

由上图可以看出在页面`http://pan.baidu.com/disk/home` 向URL `http://localhost:6800/jsonrpc?tm=1428134320921` 发起了一次POST请求，
这时并没有因为同源策略而遭到限制，因为在 Response Headers里面有一条: `Access-Control-Allow-Origin:*` 这句话声明了目标网址接受来自任何网址
的跨域请求，所以浏览器允许了此次跨域请求。

##总结

对于浏览器来说，除了DOM、Cookie、XMLHttpRequest 会受到同源策略的限制外，浏览器加载的一些第三方插件也有各自的同源策略。最常见的一些插件如 Flash、Java Applet、Silverlight、Google Gears等都有自己的控制策略。

浏览器的同源策略是浏览器安全的基础，同源策略一旦出现漏洞被绕过，也将带来非常严重的后果，很多基于同源策略制定的安全方案都将失去效果。