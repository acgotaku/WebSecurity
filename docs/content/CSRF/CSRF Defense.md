##CSRF现状

相对于XSS攻击，CSRF一直以来都很陌生，在Wed安全中最容易被忽略的一种攻击方式，互联网上的许多站点都是对此毫无防备，以至于安全业界称CSRF为“沉睡的巨人”。CSRF在某些时候能够产生强大的破坏性，所以对于CSRF防御至关重要。

##CSRF防御

###1、验证码

验证码是对抗CSRF攻击最简洁最有效的防御方法。

每次用户提交时都需要用户在表单中填写一个图片上的随机字符串以验证，才可以完成最终请求。

但是验证码无法存在于网站的所有操作中，所以并不能够完全的防御CSRF攻击，因此验证码只能作为一个防御的辅助手段。

###2、伪随机数

在服务端进行CSRF防御，就是在客户端页面增加伪随机数。
首先构造加密的Cookie信息：
      <?php 
	       $value = "abcdefg";
		   setcookie("cookie",$value,time()+3600);
	  ?> 

然后用户发送请求时，在表单中增加Hash值：
	  
      <?php 
	       $hash = mad5($_COOKIE['cookie']);
	  ?>
	  
最后，在服务器端进行hash值的验证：

	  <?php
	       if(issert($_POST[‘check’]))
		      {
			    $hash = md5($_COOKIE['cookie']);
				if($_POST['check']) ==$hash)
				   {
				      do();
				   }
                else
                   {
				   }
			   }   
           else
               {
			   }
       ?>			   

###3、Referer Check
 
Referer字段存在于HTTP头中，它记录了该HTTP请求的来源地址。当浏览器向web服务器发送请求的时候，一般会带上Referer，告诉服务器我是从哪个页面链接过来的，服务器籍此可以获得一些信息用于处理。所以，进行Referer Check可以检查请求是否来自合法的源。

但是这种方法只能通过检查referer是否合法来判断用户是否被CSRF攻击，并不能起到完全防御的作用。因为referer的值是由浏览器提供的，每个浏览器对于referer的具体实现都有差别，并且服务器并非什么时候都能取得referer，导致无法进行验证。所以，Referer Check无法作为CSRF主要的防御手段，但是可以作为监控CSRF攻击的发生。

###4、使用Token

在URL中原先参数的基础上增加一个参数Token。Token值使用足够安全的随机数生成算法。

 http://localhost/login?username=a&password=a&token=[random(seed)]
