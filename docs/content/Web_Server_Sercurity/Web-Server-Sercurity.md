# Web Server Sercurity
Web服务器安全

---

## Overview

Web服务器是 Web应用的载体，如果这个载体出现安全问题，那么运行在其中的Web应用程序的安全也无法得到保障。因此Web服务器的安全不容忽视。。

##Apache 安全
尽管近年来 Nginx、LightHttpd等Web Server 的市场份额增长得很快，但Apache仍然是这个领域中独一无二的巨头，互联网上大多数的Web应用依然跑在 Apache Httpd 上。我们先从最具有代表性的 Apache开始谈起，其他的Web Server所面临的安全问题也可依此类推。

Web Server的安全我们关注两点：一是 Web Server本身是否安全；而是Web Server是否提供了可使用的安全功能。纵观 Apache 的漏洞史，它曾经出现过许多次高危漏洞。但这些高危漏洞，大部分是由Apache的Module造成的，Apache核心的高危漏洞几乎没有。Apache有很多官方与非官方的 Module，默认启动的Module出现过的高危漏洞非常少，大多数的高危漏洞集中在默认没有安装或enable的Module上。
因此，检查Apache安全的第一件事情，**就是检查Apache的Module安装情况，根据“最小权限原则”，应该尽可能地减少不必要的 Module，对于要使用的 Module，则检查其对应版本是否存在已知的安全漏洞。**

定制好了Apache的安装包后，接下来需要做的，就是指定 Apache 进程以单独的用户身份运行，这通常需要为Apache单独建立一个 user/group。

需要注意的是，**Apache以root身份或者admin身份运行是一个非常糟糕的决定。**这里的admin 身份是指服务器管理员在管理机器时使用的身份。这个身份的权限也是比较高的，因为管理员有操作管理脚本，访问配置文件、读/写日志等需求。

使用高权限身份运行 Apache的结果可能是灾难性的，它会带来两个可怕的后果：

*   当黑客入侵Web成功时，将直接获得一个高权限（比如root或admin）的shell；
*   应用程序本身将具备较高权限，当出现bug时，可能会带来较高风险，比如删除本地重要文件、杀死进程等不可预知的结果。

比较好的做法是使用专门的用户身份运行Apache，这个用户身份不应该具备shell，它唯一的作用就是来运行Web应用。

以身份身份启动进程，在使用其他Web容器时也需要注意这个问题。很多JSP网站的管理员喜欢将Tomcat配置为 root身份运行，导致的后果就是黑客们通过漏洞得到了webshell后，发现这个webshell已经具备root权限了。

不过很多Linux发行版已经在安装Apache的同时新建了一个apache的用户，只用来运行apache，不需用户再操作了。

Apache还提供了一些配置参数，可以用来优化服务器的性能，提高对抗DDOS攻击的能力。例如：

		TimeOut
		KeepAlive
		LimitRequestBody
		LimitRequestFields
		LimitRequestFieldSize
		LimitRequestLine
		LimitXMLRequestBody
		AcceptFilter
		MaxRequestWorkers

在Apache的[官方文档](http://httpd.apache.org/docs/trunk/misc/security_tips.html)中，对如何使用这些参数给出了指导。这些参数能够起到一定的作用，但单台机器的性能毕竟有限，所以对抗DDOS不可依赖于这些参数，但聊胜于无。

最后，要保护好 Apache Log。一般来说，攻击者入侵成功后，要做的第一件事就是清除入侵痕迹，修改、删除日志文件，因此access_log应当妥善保管，比如实时地发送到远程的syslog服务器上。

##Nginx 安全

近年来Nginx发展很快，它的高性能和高并发的处理能力使得用户在Web Server的选择上有了更多的空间，其实Nginx更适合做代理服务器。但从安全的角度来看，Nginx近年来出现的影响默认安装版本的高危漏洞却比Apache要多。在Nginx的官方网站有这些安全问题的[列表](http://nginx.org/en/security_advisories.html)。

例如CVE-2010-2266就是一个Nginx的拒绝服务漏洞，触发条件非常简单：

		http://[ webserver IP][:port]/%c0.%c0./%c0.%c0./%c0.%c0./%c0.%c0./%20
		 
		http://[ webserver IP][:port]/%c0.%c0./%c0.%c0./%c0.%c0./%20
		 
		http://[ webserver IP][:port]/%c0.%c0./%c0.%c0./%20

因此多关注Nginx的漏洞信息，并及时将软件升级到安全的版本，是非常有必要的一件事情。从历史的经验来看，如果一个软件出现的漏洞较多，那么说明代码维护者的安全意识与安全经验有所欠缺，同时由于破窗效应，这个软件未来往往会出现更多的漏洞。

就软件安全本身来看，Nginx与Apache最大的区别在于，检查Apache安全时更多的要关注Module的安全，而Nginx则需要注意软件本身的安全，及时升级软件版本。

与Apache一样，Nginx也应该以单独的身份运行，这是所有 Web Server、容器软件应该共同遵守的原则。