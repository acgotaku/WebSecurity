# Click Jacking

点击劫持  一个视觉欺骗手段


---

##Frame Busting  
通常写一段代码禁止JavaScript代码，以禁止iframe嵌套。如可写下列一段代码：  

		if(top.location!=location)  
		top.location=self.location; 
 
常见的Frame Busting有以下形式：  

		if (top != self)  
		if (top.location != self.location)  
		if (top.location != location)  
		if (parent.frames.length > 0)  
		if (window != top)  
		if (window.top !== window.self)  
		if (window.self != window.top)  
		if (parent && parent != window)  
		if (parent && parent.frames && parent.frames.length>0)  
		if((self.parent&&!(self.parent===self))&&(self.parent.frames.length!=0))  
		top.location = self.location  
		top.location.href = document.location.href  
		top.location.href = self.location.href  
		top.location.replace(self.location)  
		top.location.href = window.location.href  
		top.location.replace(document.location)  
		top.location.href = window.location.href  
		top.location.href = "URL"  
		document.write('')  
		top.location = location  
		top.location.replace(document.location)  
		top.location.replace('URL')  
		top.location.href = document.location  
		top.location.replace(window.location.href)  
		top.location.href = location.href  
		self.parent.location = document.location  
		parent.location.href = self.document.location  
		top.location.href = self.location  
		top.location = window.location  
		top.location.replace(window.location.pathname)  
		window.top.location = window.self.location  
		setTimeout(function(){document.body.innerHTML='';},1);  
		window.self.onload = function(evt){document.body.innerHTML='';}  
		var url = window.location.href; top.location.replace(url)  

但是Frame Busting也有很多缺陷，由于它是JavaScript写的，控制能力不是特别强，因此有很多方法绕过它。  

##X-Frame-Options  
X-Frame-Options HTTP 响应头，可以指示浏览器是否应该加载一个iframe中的页面。网站可以通过设置X-Frame-Options阻止站点内的页面被其他页面嵌入从而防止点击劫持。  
###X-FRAME-OPTIONS  
X-Frame-Options共有三个值：  
DENY  
任何页面都不能被嵌入到iframe或者frame中。  
SAMEORIGIN  
页面只能被本站页面嵌入到iframe或者frame中。  
ALLOW-FROM URI  
页面自能被指定的Uri嵌入到iframe或frame中。  

###APACHE配置X-FRAME-OPTIONS  
在站点配置文件httpd.conf中添加如下配置，限制只有站点内的页面才可以嵌入iframe。  
Header always append X-Frame-Options SAMEORIGIN  
配置之后重启apache使其生效。该配置方式对IBM HTTP Server同样适用。  
如果同一apache服务器上有多个站点，只想针对一个站点进行配置，可以修改.htaccess文件，添加如下内容：  
Header append X-FRAME-OPTIONS "SAMEORIGIN"  

###NGINX 配置X-FRAME-OPTIONS  
到 nginx/conf文件夹下，修改nginx.conf ，添加如下内容：  
add_header X-Frame-Options "SAMEORIGIN";  
重启Nginx服务。  

###IIS配置X-FRAME-OPTIONS  
在web站点的web.config中配置：  
  
		<system.webServer>  

		 ...

			<httpProtocol>
			<customHeaders>
			<add name="X-Frame-Options" value="SAMEORIGIN" />  
			</customHeaders>  
			</httpProtocol>  
		... 

		</system.webServer>  
