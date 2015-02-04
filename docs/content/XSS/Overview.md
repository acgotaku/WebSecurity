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

##XSS的分类

##反射型XSS

反射型跨站脚本（Reflected Cross-site Scripting）也称作非持久型、参数型跨站脚本。这种类型的跨站脚本是最常见，也是使用最广的一种，
主要用于将恶意脚本附件到URL地址的参数中，例如：

		http://myzoo.com/test.php?param=%3Cscript%3Ealert(%22XSS%22)%3C/script%3E

反射型XSS的利用一般是攻击者通过特定手法（比如利用电子邮件），诱使用户去访问一个包含恶意代码的URL，当受害者点击这些专门设计的链接的时候，
恶意JavaScript代码会直接在受害者主机上的浏览器执行。它的特点是只在用户单击时触发，而且只执行一次，非持久化，所以称为反射型跨站式脚本。

典型的反射型XSS案例的截图：
![Reflected Cross-site Scripting](img/Reflected-XSS.png)

##持久型XSS

持久型跨站脚本（Persistent Cross-site Scripting）也等于存储型跨站脚本（Stored Cross-site Scripting）,比反射型跨站脚本更具有威胁性，
并且可能影响到Web服务器自身的安全。
这种类型的XSS不影响用户单击特定的URL就能执行跨站脚本，攻击者事先将恶意JavaScript代码上传或存储到漏洞服务器中，只要受害者浏览包含此恶意JavaScript代码的页面就会执行恶意代码。

持久型XSS案例的截图： 

![Persistent Cross-site Scripting](img/Persistent-XSS.png)

##DOM XSS
传统类型的XSS漏洞（反射型或存储型XSS）一般出现在服务器端代码中，而DOM-Based XSS是基于DOM文档对象模型的一种漏洞，所以，受客户端浏览器的脚本代码所影响。

如前所述，客户端JavaScript可以访问浏览器的DOM文本对象模型，因此能够决定用于加载当前页面的URL。换句话说，客户端的脚本程序可以通过DOM动态地检查和修改页面内容，它不依赖于服务器的数据，而从客户端获得DOM中的数据（如从URL中提取数据）并在本地执行。

另一方面，浏览器用户可以操纵DOM中的一些对象，例如URL、location等。用户在客户端输入的数据如果包含了恶意JavaScript脚本，而这些脚本没有经过适当的过滤和消毒，那么应用程序就可能受到基于DOM的XSS攻击。

下面是一个简单的例子：

		<body>
		早上好
		<script type="text/javascript">
		  document.URL.match(/name=([^&]*)/);
		  document.write(unescape(RegExp.$1));
		</script>
		同学
		</body>

把以上代码保存为Dom-XSS.html中，然后浏览器访问：

		http://127.0.0.1/Dom-XSS.html?name=<script>alert(document.cookie)</script>

就会输出当前页面的Cookie信息，如图所示：

![Dom-XSS](img/Dom-XSS.png)